import json
import logging
import os
import time
from django.conf import settings
from tracker.views import send_email_via_brevo
import uuid

# Gracefully handle Kafka import in case of missing dependencies
try:
    from kafka import KafkaConsumer
    KAFKA_AVAILABLE = True
except ImportError:
    KAFKA_AVAILABLE = False

logger = logging.getLogger(__name__)

def process_email_event(message_value):
    """Process incoming email events from Kafka."""
    try:
        event_type = message_value.get('type')
        if event_type == 'welcome_email':
            email = message_value.get('email')
            username = message_value.get('username')
            # frontend_url = message_value.get('frontend_url')
            otp = message_value.get('otp')
            
            if not all([email, username, otp]):
                logger.error("Missing fields in welcome_email event payload.")
                return

            ref_id = f"HT-{uuid.uuid4().hex[:6].upper()}"
            subject = f"Your HireTrack Verification Code [Ref: {ref_id}]"
            
            html_message = f"""
            <div style="font-family: Arial, sans-serif; background-color: #0A0A0A; color: #FFFFFF; padding: 40px 20px; line-height: 1.6;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #121313; border: 1px solid rgba(255,255,255,0.1); padding: 30px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                    <div style="font-size: 32px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 30px; color: #FFFFFF; font-family: 'Inter', Arial, sans-serif;">HIRE<span style="color: #FF6044;">TRACK</span></div>
                    <h1 style="color: #FF6044; font-size: 24px; font-weight: 900; letter-spacing: 1px; margin-bottom: 20px; text-transform: uppercase;">VERIFY YOUR EMAIL</h1>
                    
                    <p style="font-size: 16px;">Hi <strong style="color: #FF6044;">{username}</strong>,</p>
                    
                    <p style="font-size: 16px; color: #D1D5DB;">Thank you for registering with HireTrack. Please use the following One-Time Password (OTP) to verify your email address and activate your account. <strong>This code is valid for 5 minutes.</strong></p>
                    
                    <div style="background-color: #FF6044; color: #121313; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                        <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px;">{otp}</span>
                    </div>
                    
                    <p style="font-size: 14px; color: #9CA3AF;">If you did not request this, you can safely ignore this email.</p>
                    
                    <p style="font-size: 10px; color: #4B5563; margin-top: 30px; text-align: left; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px;">
                        Reference ID: {ref_id}
                    </p>
                </div>
            </div>
            """
            plain_message = f"Your HireTrack Verification Code is: {otp} [Ref: {ref_id}]"
            
            logger.info(f"Kafka Consumer: Sending welcome email to {email}")
            send_email_via_brevo(email, subject, html_message, plain_message)
        else:
            logger.warning(f"Unknown event type received: {event_type}")
    except Exception as e:
        logger.error(f"Error processing email event: {e}")

def start_kafka_consumer():
    """Starts the Kafka consumer loop. Designed to run in a background thread."""
    if not KAFKA_AVAILABLE:
        logger.warning("Kafka not available. Consumer will not start.")
        return

    host = os.getenv('KAFKA_HOST')
    username = os.getenv('KAFKA_USERNAME')
    password = os.getenv('KAFKA_PASSWORD')

    if not all([host, username, password]):
        logger.warning("Kafka credentials missing. Consumer will not start.")
        return

    ca_cert_path = os.path.join(settings.BASE_DIR, 'ca.pem')
    
    if not os.path.exists(ca_cert_path):
        logger.warning("CA certificate missing. Consumer will not start.")
        return

    print("DEBUG: Initializing Kafka Consumer...")
    
    # Try connecting with retries
    consumer = None
    for attempt in range(5):
        try:
            consumer = KafkaConsumer(
                'email_events',
                bootstrap_servers=host,
                security_protocol="SASL_SSL",
                sasl_mechanism="PLAIN",
                sasl_plain_username=username,
                sasl_plain_password=password,
                ssl_cafile=ca_cert_path,
                group_id='hiretrack_email_group',
                value_deserializer=lambda m: json.loads(m.decode('utf-8')),
                auto_offset_reset='latest',
                request_timeout_ms=15000,
                api_version_auto_timeout_ms=15000
            )
            print("DEBUG: Kafka Consumer successfully connected and listening to 'email_events'.")
            break
        except Exception as e:
            print(f"DEBUG: Kafka connection attempt {attempt + 1} failed: {e}")
            time.sleep(5)

    if not consumer:
        print("DEBUG: Failed to connect Kafka consumer after 5 attempts.")
        return

    # Infinite polling loop
    try:
        for message in consumer:
            print(f"DEBUG: Received message on topic {message.topic}")
            process_email_event(message.value)
    except Exception as e:
        print(f"DEBUG: Kafka consumer crashed: {e}")
    finally:
        consumer.close()
