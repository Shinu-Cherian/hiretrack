from django.shortcuts import render,redirect
from .models import Job,Referral
from django.db.models import Q
from datetime import datetime, timedelta
from datetime import date
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages


def home(request):
    return render(request, 'home.html')

@login_required
def add_job(request):
    if request.method == 'POST':
        company = request.POST.get('company')
        role = request.POST.get('role')
        date_applied = request.POST.get('date')
        date_obj = datetime.strptime(date_applied, "%Y-%m-%d").date()
        follow_up_date = date_obj + timedelta(days=7)
        status = request.POST.get('status') 
        job_id = request.POST.get('job_id')   # 👈 add
        job_description = request.POST.get('job_description')   # 👈 add
        notes = request.POST.get('notes')   # 👈 add

        Job.objects.create(
            user=request.user,         #multi user access
            company=company,
            role=role,
            date_applied=date_applied,
            status=status,
            job_id=job_id,   # 👈 add
            job_description=job_description,   # 👈 add
            notes=notes,
            follow_up_date=follow_up_date 

        )

        print("Job saved!")
        return redirect('home')

    return render(request, 'add_job.html')

@login_required
def job_list(request):
    jobs = Job.objects.filter(user=request.user)
    return render(request, 'job_list.html', {'jobs': jobs})

@login_required
def add_referral(request):
    if request.method == 'POST':
        person_name = request.POST.get('person_name')
        company = request.POST.get('company')
        email = request.POST.get('email')
        date = request.POST.get('date')
        date_obj = datetime.strptime(date, "%Y-%m-%d").date()
        follow_up_date = date_obj + timedelta(days=3)
        status = request.POST.get('status')
        notes = request.POST.get('notes')
         

        Referral.objects.create(
            user=request.user,             #multi user access
            person_name=person_name,
            company=company,
            email=email,
            date=date,
            status=status,
            notes=notes,
            follow_up_date=follow_up_date
            
        )

        return redirect('home')

    return render(request, 'add_referral.html')

@login_required
def referral_list(request):
    referrals = Referral.objects.filter(user=request.user)
    return render(request, 'referral_list.html', {'referrals': referrals})

@login_required
def dashboard(request):
    total_jobs = Job.objects.count()
    pending_jobs = Job.objects.filter(status='pending').count()
    rejected_jobs = Job.objects.filter(status='rejected').count()
    selected_jobs = Job.objects.filter(status='selected').count()

    total_referrals = Referral.objects.count()
    today = date.today()

    job_reminders = Job.objects.filter(follow_up_date=today)
    referral_reminders = Referral.objects.filter(follow_up_date=today)

    total_notifications = job_reminders.count() + referral_reminders.count()

    context = {
        'total_jobs': total_jobs,
        'pending_jobs': pending_jobs,
        'rejected_jobs': rejected_jobs,
        'selected_jobs': selected_jobs,
        'total_referrals': total_referrals,
        'notifications': total_notifications,
        'job_reminders': job_reminders,
        'referral_reminders': referral_reminders,
    }

    return render(request, 'dashboard.html', context)

@login_required
def delete_job(request, id):
    job = Job.objects.get(id=id)
    job.delete()
    return redirect('job_list')

@login_required
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

@login_required
def delete_referral(request, id):
    referral = Referral.objects.get(id=id)
    referral.delete()
    return redirect('referral_list')

@login_required
def edit_referral(request, id):
    referral = Referral.objects.get(id=id)

    if request.method == 'POST':
        referral.person_name = request.POST.get('person_name')
        referral.company = request.POST.get('company')
        referral.email = request.POST.get('email')
        referral.date = request.POST.get('date')
        referral.status = request.POST.get('status')
        referral.notes = request.POST.get('notes')

        referral.save()
        return redirect('referral_list')

    return render(request, 'edit_referral.html', {'referral': referral})

@login_required
def job_list(request):
    query = request.GET.get('q')
    status_filter = request.GET.get('status')
    jobs = Job.objects.all()
    filter_value = request.GET.get('filter')

    if query:
        jobs = Job.objects.filter(
            Q(company__icontains=query) |
            Q(role__icontains=query) |
            Q(job_id__icontains=query)
        )
    if filter_value:
        if filter_value == 'starred':
            jobs = jobs.filter(is_starred=True)
        else:
            jobs = jobs.filter(status=filter_value)
    
        

    return render(request, 'job_list.html', {'jobs': jobs})

@login_required
def referral_list(request):
    query = request.GET.get('q')
    filter_value = request.GET.get('filter')

    referrals = Referral.objects.all()

    # 🔍 SEARCH (CHAIN FIX)
    if query:
        referrals = referrals.filter(
            Q(person_name__icontains=query) |
            Q(company__icontains=query)
        )

    # 🎯 FILTER (FIXED LOGIC)
    if filter_value:
        if filter_value == 'starred':
            referrals = referrals.filter(is_starred=True)
        else:
            referrals = referrals.filter(status=filter_value)

    return render(request, 'referral_list.html', {'referrals': referrals})


@login_required
def notifications_page(request):
    from datetime import date
    today = date.today()

    job_reminders = Job.objects.filter(follow_up_date=today)
    referral_reminders = Referral.objects.filter(follow_up_date=today)
    total_today = job_reminders.count() + referral_reminders.count()

    return render(request, 'notifications.html', {
        'job_reminders': job_reminders,
        'referral_reminders': referral_reminders,
        'total_today': total_today
    })

@login_required
def toggle_star_job(request, id):
    job = Job.objects.get(id=id)

    # toggle
    job.is_starred = not job.is_starred
    job.save()

    return redirect('job_list')

@login_required
def toggle_star_referral(request, id):
    referral = Referral.objects.get(id=id)

    # toggle star
    referral.is_starred = not referral.is_starred
    referral.save()

    return redirect('referral_list')




def signup(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')

        # 🔐 Password match check
        if password != confirm_password:
            messages.error(request, "Passwords do not match")
            return redirect('signup')

        # 🔐 Username already exists check
        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already taken")
            return redirect('signup')

        # ✅ Create user
        User.objects.create_user(username=username, password=password)

        messages.success(request, "Account created successfully! Please login.")
        return redirect('login')

    return render(request, 'signup.html')


@login_required
def starred_list(request):
    jobs = Job.objects.filter(user=request.user, is_starred=True)
    referrals = Referral.objects.filter(user=request.user, is_starred=True)

    return render(request, 'starred.html', {
        'jobs': jobs,
        'referrals': referrals
    })