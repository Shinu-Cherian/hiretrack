from django.apps import AppConfig


class TrackerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tracker'

    def ready(self):
        import sys
        import threading
        # Only start the consumer if we are running the server, not during migrations/tests
        if 'runserver' in sys.argv or 'gunicorn' in sys.argv or 'daphne' in sys.argv:
            from tracker.kafka_consumer import start_kafka_consumer
            consumer_thread = threading.Thread(target=start_kafka_consumer, daemon=True)
            consumer_thread.start()
            print("Kafka background consumer started.")
