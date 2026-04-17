from django.shortcuts import render,redirect
from .models import Job,Referral,Profile,Education,Experience
from django.db.models import Q,Count
from datetime import datetime, timedelta
from datetime import date
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from .forms import ProfileForm
from django.db.models.functions import TruncDate
from django.http import JsonResponse
from .models import Job, Referral




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
            date_applied=date_obj,
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
    highlight_id = request.GET.get('highlight')

    # 🔥 normal user jobs
    jobs = Job.objects.filter(user=request.user)

    # 🔥 IMPORTANT FIX → ensure highlighted job always included
    if highlight_id:
        jobs = jobs.filter(
            Q(id=highlight_id) | Q(user=request.user)
        )

    return render(request, 'job_list.html', {
        'jobs': jobs,
        'highlight_id': highlight_id
    })


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
            user=request.user,
            person_name=person_name,
            company=company,
            email=email,
            date=date_obj,   # ✅ correct
            status=status,
            notes=notes,
            follow_up_date=follow_up_date
        )

        return redirect('referral_list')   # 🔥 better than home

    return render(request, 'add_referral.html')

@login_required
def referral_list(request):
    referrals = Referral.objects.filter(user=request.user)
    return render(request, 'referral_list.html', {'referrals': referrals})



@login_required
def dashboard(request):

    # 🔥 ONLY CURRENT USER DATA
    jobs = Job.objects.filter(user=request.user)
    referrals = Referral.objects.filter(user=request.user)

    # 📊 COUNTS
    total_jobs = jobs.count()
    pending_jobs = jobs.filter(status='pending').count()
    rejected_jobs = jobs.filter(status='rejected').count()
    selected_jobs = jobs.filter(status='selected').count()

    total_referrals = referrals.count()

    # 📊 SUCCESS RATE
    if total_jobs > 0:
        success_rate = (selected_jobs / total_jobs) * 100
    else:
        success_rate = 0


    # 💡 INSIGHTS SYSTEM
    insights = []

# 🔴 High rejection
    if total_jobs > 0:
        rejection_rate = (rejected_jobs / total_jobs) * 100
        if rejection_rate > 50:
            insights.append("Your rejection rate is high. Try improving your resume.")

# 🟡 Too many pending
    if pending_jobs > 5:
        insights.append("You have many pending applications. Consider following up.")

# 🟢 Good performance
    if success_rate > 30:
        insights.append("Great job! Your success rate is strong.")

# 🔵 Low activity
    if total_jobs < 5:
        insights.append("You have applied to very few jobs. Try applying more.")



   





    # 🔔 NOTIFICATIONS
    today = date.today()
    job_reminders = jobs.filter(follow_up_date=today)
    referral_reminders = referrals.filter(follow_up_date=today)

    total_notifications = job_reminders.count() + referral_reminders.count()

    # 📊 GRAPH DATA (NEW ADD)
    status_counts = jobs.values('status').annotate(count=Count('status'))
    # 📊 GRAPH DATA (NEW ADD)
    status_counts = jobs.values('status').annotate(count=Count('status'))

    # 📊 REFERRAL STATUS DATA
    referral_status_counts = referrals.values('status').annotate(count=Count('status'))

    referral_status_data = {
        'pending': 0,
        'replied': 0,
        'no_response': 0,
    }

    for item in referral_status_counts:
        referral_status_data[item['status']] = item['count']

     # 💡 REFERRAL INSIGHTS

        # 🔴 Low reply rate
    if total_referrals > 0:
        reply_rate = (referral_status_data['replied'] / total_referrals) * 100

    if reply_rate < 20:
        insights.append("You are not getting many replies. Try improving your referral message.")

    # 🟡 Too many no response
    if referral_status_data['no_response'] > 5:
        insights.append("Many referrals have no response. Consider following up.")

    # 🟢 Good performance
    if total_referrals > 0 and reply_rate > 40:
        insights.append("Great! You are getting good referral responses.")

    

    status_data = {
        'applied': 0,
        'pending': 0,
        'rejected': 0,
        'selected': 0
    }

    for item in status_counts:
        status_data[item['status']] = item['count']

   

    applications_over_time = []

    for job in jobs:
        if job.date_applied:
           applications_over_time.append(job)

     # group manually
    date_count = {}

    for job in applications_over_time:
        date_str = str(job.date_applied)

        if date_str in date_count:
            date_count[date_str] += 1
        else:
            date_count[date_str] = 1

    dates = list(date_count.keys())
    counts = list(date_count.values())


    # 📦 CONTEXT
    context = {
        'total_jobs': total_jobs,
        'pending_jobs': pending_jobs,
        'rejected_jobs': rejected_jobs,
        'selected_jobs': selected_jobs,
        'total_referrals': total_referrals,
        'notifications': total_notifications,
        'job_reminders': job_reminders,
        'referral_reminders': referral_reminders,
        'dates':dates,
        'counts':counts,
        'success_rate': round(success_rate, 2),
        'insights': insights,

        # 🔥 SEND GRAPH DATA
        'status_data': status_data,
        'referral_status_data': referral_status_data,
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
    jobs = Job.objects.filter(user=request.user)
    highlight_id = request.GET.get('highlight')

    for job in jobs:
        if highlight_id and str(job.id) == str(highlight_id):
            job.highlight = True
        else:
            job.highlight = False

    return render(request, 'job_list.html', {
        'jobs': jobs
    })

@login_required
def referral_list(request):
    query = request.GET.get('q')
    filter_value = request.GET.get('filter')
    highlight_id = request.GET.get('highlight')   # 🔥 ADD THIS

    referrals = Referral.objects.filter(user=request.user)

    if highlight_id:
        referrals = Referral.objects.filter(
            Q(user=request.user) | Q(id=highlight_id)
        )

    # 🔍 SEARCH
    if query:
        referrals = referrals.filter(
            Q(person_name__icontains=query) |
            Q(company__icontains=query)
        )

    # 🎯 FILTER
    if filter_value:
        if filter_value == 'starred':
            referrals = referrals.filter(is_starred=True)
        else:
            referrals = referrals.filter(status=filter_value)

    # 🔥 HIGHLIGHT LOGIC (ADD THIS BLOCK)
    for ref in referrals:
        if highlight_id and str(ref.id) == str(highlight_id):
            ref.highlight = True
        else:
            ref.highlight = False

    return render(request, 'referral_list.html', {
        'referrals': referrals
    })

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

@login_required
def view_profile(request):
    profile = Profile.objects.get(user=request.user)

    educations = Education.objects.filter(user=request.user)
    experiences = Experience.objects.filter(user=request.user)

    return render(request, 'profile.html', {
        'profile': profile,
        'educations': educations,
        'experiences': experiences
    })




@login_required
def edit_profile(request):
    profile, created = Profile.objects.get_or_create(user=request.user)

    if request.method == 'POST':

        # 🗑 REMOVE PROFILE PIC
        if request.POST.get('remove_profile_pic') == "true":
            if profile.profile_pic:
                profile.profile_pic.delete(save=False)
            profile.profile_pic = None
            profile.save()
            return redirect('profile')

        form = ProfileForm(request.POST, request.FILES, instance=profile)

        if form.is_valid():
            profile = form.save(commit=False)

            # 📧 EMAIL UPDATE
            profile.user.email = request.POST.get('email')
            profile.user.save()

            # 🎓 MULTIPLE EDUCATION SAVE

            colleges = request.POST.getlist('education_college')
            courses = request.POST.getlist('education_course')
            starts = request.POST.getlist('education_start')
            ends = request.POST.getlist('education_end')

            # 🔥 old education delete
            Education.objects.filter(user=request.user).delete()

            # 🔥 new education save
            for i in range(len(colleges)):
                if colleges[i]:  # skip empty
                    Education.objects.create(
                        user=request.user,
                        college=colleges[i],
                        course=courses[i],
                        start_year=starts[i],
                        end_year=ends[i]
                    )
            # 💼 MULTIPLE EXPERIENCE SAVE

            companies = request.POST.getlist('experience_company')
            roles = request.POST.getlist('experience_role')
            starts = request.POST.getlist('experience_start')
            ends = request.POST.getlist('experience_end')
            descs = request.POST.getlist('experience_desc')

                # old experience delete
            Experience.objects.filter(user=request.user).delete()

                # save new
            for i in range(len(companies)):
                if companies[i]:
                    Experience.objects.create(
                        user=request.user,
                        company=companies[i],
                        role=roles[i],
                        start_date=starts[i],
                        end_date=ends[i],
                        description=descs[i]
                    )
            profile.save()
            return redirect('profile')

    else:
        # 🔥 THIS LINE FIXES YOUR ERROR
        form = ProfileForm(instance=profile)


    # 🔥 THIS MUST BE OUTSIDE IF
    educations = Education.objects.filter(user=request.user)
    experiences = Experience.objects.filter(user=request.user)


    return render(request, 'edit_profile.html', {
    'form': form,
    'educations': educations,
    'experiences': experiences
})

@login_required
def settings_view(request):
    return render(request, 'settings.html')





@login_required
def dashboard_api(request):
    user = request.user  # now guaranteed logged in

    jobs = Job.objects.filter(user=user)
    referrals = Referral.objects.filter(user=user)

    data = {
        "total_jobs": jobs.count(),
        "pending_jobs": jobs.filter(status='pending').count(),
        "rejected_jobs": jobs.filter(status='rejected').count(),
        "selected_jobs": jobs.filter(status='selected').count(),

        "total_referrals": referrals.count(),
        "pending_referrals": referrals.filter(status='pending').count(),
        "replied_referrals": referrals.filter(status='replied').count(),
        "no_response_referrals": referrals.filter(status='no_response').count(),
    }

    return JsonResponse(data)

