from django.db import models
from django.contrib.auth.models import User

class Job(models.Model):
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('pending', 'Pending'),
        ('rejected', 'Rejected'),
        ('selected', 'Selected'),
    ]

    date_applied = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE) 
    company = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    job_id = models.CharField(max_length=100, blank=True, null=True)
    platform = models.CharField(max_length=100, blank=True, null=True)
    salary_range = models.CharField(max_length=100, blank=True, null=True)
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
    user = models.ForeignKey(User, on_delete=models.CASCADE) 
    person_name = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    follow_up_date = models.DateField(null=True, blank=True)
    is_starred = models.BooleanField(default=False)
    

    def __str__(self):
        return f"{self.person_name} - {self.company}"
    


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=10, blank=True)

    phone = models.CharField(max_length=15, blank=True)
    email = models.EmailField(blank=True)

    education = models.TextField(blank=True)
    education_college = models.CharField(max_length=255, blank=True)
    education_course = models.CharField(max_length=255, blank=True)
    education_start = models.CharField(max_length=20, blank=True)
    education_end = models.CharField(max_length=20, blank=True)

    experience = models.TextField(blank=True)
    experience_company = models.CharField(max_length=255, blank=True)
    experience_role = models.CharField(max_length=255, blank=True)
    experience_start = models.CharField(max_length=20, blank=True)
    experience_end = models.CharField(max_length=20, blank=True)
    experience_desc = models.TextField(blank=True)

    skills = models.TextField(blank=True)


    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    profile_pic = models.ImageField(upload_to='profiles/', null=True, blank=True)

    def __str__(self):
        return self.user.username
    


    # 🎓 MULTIPLE EDUCATION
class Education(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    college = models.CharField(max_length=255)
    course = models.CharField(max_length=255)
    start_year = models.CharField(max_length=20)
    end_year = models.CharField(max_length=20)

    def __str__(self):
        return self.college


# 💼 MULTIPLE EXPERIENCE
class Experience(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    company = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    start_date = models.CharField(max_length=20)
    end_date = models.CharField(max_length=20)
    description = models.TextField()

    def __str__(self):
        return self.company
