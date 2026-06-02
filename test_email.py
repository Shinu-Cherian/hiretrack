import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.core.mail import send_mail
from django.conf import settings

print("DEFAULT_FROM_EMAIL:", settings.DEFAULT_FROM_EMAIL)
print("EMAIL_HOST_USER:", settings.EMAIL_HOST_USER)
print("EMAIL_HOST_PASSWORD length:", len(settings.EMAIL_HOST_PASSWORD) if settings.EMAIL_HOST_PASSWORD else 0)

try:
    send_mail(
        "Test Subject",
        "Test Message",
        settings.DEFAULT_FROM_EMAIL,
        ["cherianshinu368@gmail.com"],
        fail_silently=False
    )
    print("Success!")
except Exception as e:
    import traceback
    traceback.print_exc()
