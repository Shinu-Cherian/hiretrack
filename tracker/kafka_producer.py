import json
import logging
import os
from django.conf import settings

# Gracefully handle Kafka import in case of missing dependencies
try:
    from kafka import KafkaProducer
    KAFKA_AVAILABLE = True
except ImportError:
    KAFKA_AVAILABLE = False

logger = logging.getLogger(__name__)

_producer_instance = None

def get_producer():
    """Singleton pattern to reuse the Kafka Producer instance."""
    global _producer_instance
    if _producer_instance is not None:
        return _producer_instance

    if not KAFKA_AVAILABLE:
        logger.warning("Kafka is not installed or available.")
        return None

    try:
        host = os.getenv('KAFKA_HOST')
        username = os.getenv('KAFKA_USERNAME')
        password = os.getenv('KAFKA_PASSWORD')

        if not all([host, username, password]):
            logger.warning("Kafka credentials missing in .env. Falling back to synchronous mode.")
            return None

        ca_cert_path = os.path.join(settings.BASE_DIR, 'ca.pem')
        
        if not os.path.exists(ca_cert_path):
            print(f"DEBUG: CA certificate not found at {ca_cert_path}. Falling back to synchronous mode.")
            return None

        print("DEBUG: Initializing Kafka Producer...")
        _producer_instance = KafkaProducer(
            bootstrap_servers=host,
            security_protocol="SASL_SSL",
            sasl_mechanism="PLAIN",
            sasl_plain_username=username,
            sasl_plain_password=password,
            ssl_cafile=ca_cert_path,
            value_serializer=lambda v: json.dumps(v).encode('utf-8'),
            retries=3,
            request_timeout_ms=15000,
            api_version_auto_timeout_ms=15000,
            max_block_ms=5000
        )
        print("DEBUG: Successfully connected to Aiven Kafka.")
        return _producer_instance
    except Exception as e:
        print(f"DEBUG: Failed to initialize Kafka Producer: {e}")
        return None

def publish_event(topic, payload):
    """
    Publish an event to Kafka. 
    Returns True if successfully sent to the broker, False otherwise.
    """
    producer = get_producer()
    if not producer:
        return False
        
    try:
        # Send the message asynchronously
        print(f"DEBUG: Sending message to topic {topic}...")
        future = producer.send(topic, payload)
        # We wait briefly just to ensure the network request is sent
        print("DEBUG: Waiting for message delivery confirmation...")
        future.get(timeout=5)
        print("DEBUG: Message successfully delivered to Kafka.")
        return True
    except Exception as e:
        print(f"DEBUG: Error publishing to Kafka topic {topic}: {e}")
        return False
