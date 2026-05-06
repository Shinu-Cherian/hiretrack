import json
from datetime import date

from django.contrib.auth.models import User
from django.test import TestCase

from .models import Job, Referral


class AuthIsolationApiTests(TestCase):
    def setUp(self):
        self.user_a = User.objects.create_user(username="user_a", password="pass12345")
        self.user_b = User.objects.create_user(username="user_b", password="pass12345")
        Job.objects.create(
            user=self.user_a,
            company="Alpha",
            role="Frontend Engineer",
            date_applied=date(2026, 5, 1),
            status="applied",
        )
        Job.objects.create(
            user=self.user_b,
            company="Beta",
            role="Backend Engineer",
            date_applied=date(2026, 5, 2),
            status="pending",
        )
        Referral.objects.create(
            user=self.user_a,
            person_name="Ada",
            company="Alpha",
            date=date(2026, 5, 3),
            status="pending",
        )
        Referral.objects.create(
            user=self.user_b,
            person_name="Ben",
            company="Beta",
            date=date(2026, 5, 4),
            status="replied",
        )

    def test_logged_out_private_apis_return_401(self):
        private_urls = [
            "/api/auth/status/",
            "/api/dashboard/",
            "/api/jobs/",
            "/api/referrals/",
            "/api/starred/",
            "/api/notifications/",
        ]

        for url in private_urls:
            with self.subTest(url=url):
                self.assertEqual(self.client.get(url).status_code, 401)

        job_response = self.client.post("/api/add-job/", data={
            "company": "Gamma",
            "jobTitle": "Designer",
            "dateApplied": "2026-05-05",
            "status": "applied",
        })
        self.assertEqual(job_response.status_code, 401)

        referral_response = self.client.post(
            "/api/add-referral/",
            data=json.dumps({
                "person_name": "Cara",
                "company": "Gamma",
                "date": "2026-05-05",
                "status": "pending",
            }),
            content_type="application/json",
        )
        self.assertEqual(referral_response.status_code, 401)

    def test_logged_in_users_only_see_their_own_jobs_and_referrals(self):
        self.client.login(username="user_a", password="pass12345")

        jobs = self.client.get("/api/jobs/").json()
        referrals = self.client.get("/api/referrals/").json()
        dashboard = self.client.get("/api/dashboard/").json()

        self.assertEqual([job["company"] for job in jobs], ["Alpha"])
        self.assertEqual([ref["company"] for ref in referrals], ["Alpha"])
        self.assertEqual(dashboard["total_jobs"], 1)
        self.assertEqual(dashboard["total_referrals"], 1)
