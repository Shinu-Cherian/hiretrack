from django.shortcuts import render,redirect
from .models import Job

def home(request):
    return render(request, 'home.html')

def add_job(request):
    if request.method == 'POST':
        company = request.POST.get('company')
        role = request.POST.get('role')
        date_applied = request.POST.get('date')
        status = request.POST.get('status') 
        job_id = request.POST.get('job_id')   # 👈 add
        job_description = request.POST.get('job_description')   # 👈 add
        notes = request.POST.get('notes')   # 👈 add

        Job.objects.create(
            company=company,
            role=role,
            date_applied=date_applied,
            status=status,
            job_id=job_id,   # 👈 add
            job_description=job_description,   # 👈 add
            notes=notes 
        )

        print("Job saved!")
        return redirect('home')

    return render(request, 'add_job.html')


def job_list(request):
    jobs = Job.objects.all()
    return render(request, 'job_list.html', {'jobs': jobs})