from django.shortcuts import render,redirect
from .models import Job,Referral

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


def add_referral(request):
    if request.method == 'POST':
        person_name = request.POST.get('person_name')
        company = request.POST.get('company')
        email = request.POST.get('email')
        date = request.POST.get('date')
        status = request.POST.get('status')
        notes = request.POST.get('notes')
         

        Referral.objects.create(
            person_name=person_name,
            company=company,
            email=email,
            date=date,
            status=status,
            notes=notes,
            
        )

        return redirect('home')

    return render(request, 'add_referral.html')

def referral_list(request):
    referrals = Referral.objects.all()
    return render(request, 'referral_list.html', {'referrals': referrals})


def dashboard(request):
    total_jobs = Job.objects.count()
    pending_jobs = Job.objects.filter(status='pending').count()
    rejected_jobs = Job.objects.filter(status='rejected').count()
    selected_jobs = Job.objects.filter(status='selected').count()

    total_referrals = Referral.objects.count()

    context = {
        'total_jobs': total_jobs,
        'pending_jobs': pending_jobs,
        'rejected_jobs': rejected_jobs,
        'selected_jobs': selected_jobs,
        'total_referrals': total_referrals
    }

    return render(request, 'dashboard.html', context)


def delete_job(request, id):
    job = Job.objects.get(id=id)
    job.delete()
    return redirect('job_list')

def edit_job(request, id):
    job = Job.objects.get(id=id)

    if request.method == 'POST':
        job.company = request.POST.get('company')
        job.role = request.POST.get('role')
        job.date_applied = request.POST.get('date')
        job.status = request.POST.get('status')
        job.job_id = request.POST.get('job_id')
        job.job_description = request.POST.get('job_description')
        job.notes = request.POST.get('notes')

        job.save()
        return redirect('job_list')

    return render(request, 'edit_job.html', {'job': job})