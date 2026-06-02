import os
import resend

resend.api_key = os.environ.get("RESEND_API_KEY")

try:
    resend.Emails.send({
        "from": "HireTrack <onboarding@resend.dev>",
        "to": "cherianshinu368@gmail.com",
        "subject": "Test Resend API",
        "text": "This is a test to see if Resend API allows sending to this address."
    })
    print("Success!")
except Exception as e:
    import traceback
    traceback.print_exc()
