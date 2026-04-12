from django.db import models

class Job(models.Model):
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('pending', 'Pending'),
        ('rejected', 'Rejected'),
        ('selected', 'Selected'),
    ]

    date_applied = models.DateField()
    company = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    job_id = models.CharField(max_length=100, blank=True, null=True)
    job_description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='applied')
    notes = models.TextField(blank=True, null=True)
    follow_up_date = models.DateField(null=True, blank=True)
    is_starred = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.company} - {self.role}"


class Referral(models.Model):   # 👈 outside Job class
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('replied', 'Replied'),
        ('no_response', 'No Response'),
    ]

    date = models.DateField()
    person_name = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    follow_up_date = models.DateField(null=True, blank=True)
    is_starred = models.BooleanField(default=False)
    

    def __str__(self):
        return f"{self.person_name} - {self.company}"