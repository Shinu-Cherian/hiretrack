from django.shortcuts import render,redirect, get_object_or_404
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
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt

from django.contrib.auth import authenticate, login, update_session_auth_hash
from datetime import date, timedelta
from django.http import JsonResponse


def api_user(request):
    if request.user.is_authenticated:
        return request.user
    return None


def login_required_json(user):
    if user is None:
        return JsonResponse({"error": "Login required"}, status=401)
    return None




def home(request):
    return render(request, 'home.html')

@csrf_exempt

def add_job_api(request):
    if request.method == "POST":
        import json
        from datetime import datetime, timedelta

        data = json.loads(request.body)
        
        date_applied = data.get("dateApplied")
        date_obj = datetime.strptime(date_applied, "%Y-%m-%d").date()
        follow_up_date = date_obj + timedelta(days=7)
        user = api_user(request)
        auth_error = login_required_json(user)
        if auth_error:
            return auth_error

        Job.objects.create(
            user=user,
            company=data.get("company"),
            role=data.get("jobTitle"),
            date_applied=date_obj,
            status=data.get("status"),
            job_id=data.get("jobId"),
            platform=data.get("platform"),
            salary_range=data.get("salaryRange"),
            job_description=data.get("jd"),
            notes=data.get("notes"),
            follow_up_date=follow_up_date
        )

        return JsonResponse({"message": "Job added"})




@csrf_exempt
def add_referral_api(request):
    if request.method == "POST":
        import json
        from django.contrib.auth.models import User

        user = api_user(request)
        auth_error = login_required_json(user)
        if auth_error:
            return auth_error

        data = json.loads(request.body)

        Referral.objects.create(
            user=user,
            person_name=data.get("person_name"),
            company=data.get("company"),
            email=data.get("email"),
            linkedin=data.get("linkedin"),
            date=data.get("date"),
            status=data.get("status"),
            notes=data.get("notes"),
        )

        return JsonResponse({"message": "Referral added"})





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


from django.contrib.auth.decorators import login_required


def profile_api(request):
    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    profile, created = Profile.objects.get_or_create(user=user)

    educations = Education.objects.filter(user=user)
    experiences = Experience.objects.filter(user=user)

    return JsonResponse({
        "username": user.username,
        "email": user.email,
        "phone": profile.phone,
        "age": profile.age,
        "gender": profile.gender,
        "skills": profile.skills,
        "profile_pic": profile.profile_pic.url if profile.profile_pic else None,
        "resume": profile.resume.url if profile.resume else None,

        "educations": [
            {
                "course": e.course,
                "college": e.college,
                "start_year": e.start_year,
                "end_year": e.end_year
            } for e in educations
        ],

        "experiences": [
            {
                "role": e.role,
                "company": e.company,
                "start_date": e.start_date,
                "end_date": e.end_date,
                "description": e.description
            } for e in experiences
        ]
    })


@csrf_exempt
def update_profile_api(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    profile, created = Profile.objects.get_or_create(user=user)

    username = request.POST.get("username", "").strip()
    if username and username != user.username:
        if User.objects.filter(username=username).exclude(id=user.id).exists():
            return JsonResponse({"error": "Username already taken"}, status=400)
        user.username = username

    user.email = request.POST.get("email", user.email)
    user.save()

    profile.phone = request.POST.get("phone", "")
    profile.age = request.POST.get("age") or None
    profile.gender = request.POST.get("gender", "")
    profile.skills = request.POST.get("skills", "")

    if request.POST.get("remove_profile_pic") == "true":
        if profile.profile_pic:
            profile.profile_pic.delete(save=False)
        profile.profile_pic = None

    if request.FILES.get("profile_pic"):
        profile.profile_pic = request.FILES["profile_pic"]

    if request.FILES.get("resume"):
        profile.resume = request.FILES["resume"]

    profile.save()

    colleges = request.POST.getlist("education_college")
    courses = request.POST.getlist("education_course")
    starts = request.POST.getlist("education_start")
    ends = request.POST.getlist("education_end")

    Education.objects.filter(user=user).delete()
    for i in range(len(colleges)):
        college = colleges[i].strip() if i < len(colleges) else ""
        course = courses[i].strip() if i < len(courses) else ""
        if college or course:
            Education.objects.create(
                user=user,
                college=college,
                course=course,
                start_year=starts[i] if i < len(starts) else "",
                end_year=ends[i] if i < len(ends) else ""
            )

    companies = request.POST.getlist("experience_company")
    roles = request.POST.getlist("experience_role")
    exp_starts = request.POST.getlist("experience_start")
    exp_ends = request.POST.getlist("experience_end")
    descriptions = request.POST.getlist("experience_desc")

    Experience.objects.filter(user=user).delete()
    for i in range(len(companies)):
        company = companies[i].strip() if i < len(companies) else ""
        role = roles[i].strip() if i < len(roles) else ""
        if company or role:
            Experience.objects.create(
                user=user,
                company=company,
                role=role,
                start_date=exp_starts[i] if i < len(exp_starts) else "",
                end_date=exp_ends[i] if i < len(exp_ends) else "",
                description=descriptions[i] if i < len(descriptions) else ""
            )

    return JsonResponse({"message": "Profile updated"})

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



@csrf_exempt
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
        return JsonResponse({"message": "Signup success"})

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






def dashboard_api(request):
    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    jobs = Job.objects.filter(user=user)
    referrals = Referral.objects.filter(user=user)
    status_counts = {item["status"]: item["count"] for item in jobs.values("status").annotate(count=Count("status"))}
    referral_status_counts = {item["status"]: item["count"] for item in referrals.values("status").annotate(count=Count("status"))}

    date_counts = {}
    for job in jobs.order_by("date_applied"):
        key = str(job.date_applied)
        date_counts[key] = date_counts.get(key, 0) + 1

    total_jobs = jobs.count()
    selected_jobs = jobs.filter(status='selected').count()
    total_referrals = referrals.count()
    replied_referrals = referrals.filter(status='replied').count()

    data = {
        "total_jobs": total_jobs,
        "pending_jobs": jobs.filter(status='pending').count(),
        "rejected_jobs": jobs.filter(status='rejected').count(),
        "selected_jobs": selected_jobs,

        "total_referrals": total_referrals,
        "pending_referrals": referrals.filter(status='pending').count(),
        "replied_referrals": replied_referrals,
        "no_response_referrals": referrals.filter(status='no_response').count(),
        "success_rate": round((selected_jobs / total_jobs) * 100, 1) if total_jobs else 0,
        "reply_rate": round((replied_referrals / total_referrals) * 100, 1) if total_referrals else 0,
        "job_status": {
            "applied": status_counts.get("applied", 0),
            "pending": status_counts.get("pending", 0),
            "rejected": status_counts.get("rejected", 0),
            "selected": status_counts.get("selected", 0),
        },
        "referral_status": {
            "pending": referral_status_counts.get("pending", 0),
            "replied": referral_status_counts.get("replied", 0),
            "no_response": referral_status_counts.get("no_response", 0),
        },
        "applications_over_time": [
            {"date": key, "count": value} for key, value in date_counts.items()
        ],
    }

    return JsonResponse(data)



@ensure_csrf_cookie
def get_csrf(request):
    return JsonResponse({"message": "CSRF cookie set"})



@csrf_exempt
def login_api(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            profile, created = Profile.objects.get_or_create(user=user)
            return JsonResponse({
                "message": "Login success",
                "username": user.username,
                "profile_pic": profile.profile_pic.url if profile.profile_pic else None,
            })
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=400)



def get_jobs_api(request):
    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    jobs = Job.objects.filter(user=user)

    data = []

    for job in jobs:
        data.append({
             
    "id": job.id,
    "jobTitle": job.role,
    "company": job.company,
    "jobId": job.job_id,
    "platform": job.platform,
    "salaryRange": job.salary_range,
    "dateApplied": job.date_applied,
    "status": job.status,
    "jd": job.job_description,
    "notes": job.notes,
    "is_starred": job.is_starred,

        })

    return JsonResponse(data, safe=False)


def get_referrals_api(request):
    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    refs = Referral.objects.filter(user=user)

    data = []

    for r in refs:
        data.append({
            "id": r.id,
            "person_name": r.person_name,
            "company": r.company,
            "email": r.email,
            "linkedin": r.linkedin,
            "date": r.date,
            "status": r.status,
            "notes": r.notes,
            "is_starred": r.is_starred,
        })

    return JsonResponse(data, safe=False)


@csrf_exempt
def toggle_star_job_api(request, id):
    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error
    job = get_object_or_404(Job, id=id, user=user)
    job.is_starred = not job.is_starred
    job.save()
    return JsonResponse({"success": True})


@csrf_exempt
def delete_job_api(request, id):
    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error
    job = get_object_or_404(Job, id=id, user=user)
    job.delete()
    return JsonResponse({"success": True})


@csrf_exempt
def update_job_api(request, id):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    import json
    data = json.loads(request.body)
    job = get_object_or_404(Job, id=id, user=user)

    job.role = data.get("jobTitle", job.role)
    job.company = data.get("company", job.company)
    job.job_id = data.get("jobId", job.job_id)
    job.platform = data.get("platform", job.platform)
    job.salary_range = data.get("salaryRange", job.salary_range)
    job.date_applied = data.get("dateApplied") or job.date_applied
    job.status = data.get("status", job.status)
    job.job_description = data.get("jd", job.job_description)
    job.notes = data.get("notes", job.notes)
    job.save()

    return JsonResponse({"success": True})


@csrf_exempt
def toggle_star_referral_api(request, id):
    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error
    ref = get_object_or_404(Referral, id=id, user=user)
    ref.is_starred = not ref.is_starred
    ref.save()
    return JsonResponse({"success": True})


@csrf_exempt
def delete_referral_api(request, id):
    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error
    ref = get_object_or_404(Referral, id=id, user=user)
    ref.delete()
    return JsonResponse({"success": True})


@csrf_exempt
def update_referral_api(request, id):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    import json
    data = json.loads(request.body)
    ref = get_object_or_404(Referral, id=id, user=user)

    ref.person_name = data.get("person_name", ref.person_name)
    ref.company = data.get("company", ref.company)
    ref.email = data.get("email", ref.email)
    ref.linkedin = data.get("linkedin", ref.linkedin)
    ref.date = data.get("date") or ref.date
    ref.status = data.get("status", ref.status)
    ref.notes = data.get("notes", ref.notes)
    ref.save()

    return JsonResponse({"success": True})


@csrf_exempt
def change_password_api(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    import json
    data = json.loads(request.body)
    current_password = data.get("current_password", "")
    new_password = data.get("new_password", "")
    confirm_password = data.get("confirm_password", "")

    if not user.check_password(current_password):
        return JsonResponse({"error": "Current password is incorrect"}, status=400)

    if len(new_password) < 8:
        return JsonResponse({"error": "New password must be at least 8 characters"}, status=400)

    if new_password != confirm_password:
        return JsonResponse({"error": "New passwords do not match"}, status=400)

    user.set_password(new_password)
    user.save()
    update_session_auth_hash(request, user)

    return JsonResponse({"message": "Password changed"})


def starred_api(request):
    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    jobs = Job.objects.filter(user=user, is_starred=True)
    refs = Referral.objects.filter(user=user, is_starred=True)

    job_data = []
    for j in jobs:
        job_data.append({
            "id": j.id,
            "type": "job",
            "jobTitle": j.role,
            "company": j.company,
            "jobId": j.job_id,
            "platform": j.platform,
            "salaryRange": j.salary_range,
            "dateApplied": j.date_applied,
            "status": j.status,
            "notes": j.notes,
        })

    ref_data = []
    for r in refs:
        ref_data.append({
            "id": r.id,
            "type": "referral",
            "person_name": r.person_name,
            "company": r.company,
            "linkedin": r.linkedin,
            "date": r.date,
            "status": r.status,
            "notes": r.notes,
            "email": r.email,
        })

    return JsonResponse({
        "jobs": job_data,
        "referrals": ref_data
    })


def notifications_api(request):
    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    today = date.today()

    # 🔥 JOB → 5 days
    job_alert_date = today - timedelta(days=5)
    jobs = Job.objects.filter(user=user, date_applied__lte=job_alert_date)

    # 🔥 REFERRAL → 1 day
    ref_alert_date = today - timedelta(days=1)
    refs = Referral.objects.filter(user=user, date__lte=ref_alert_date)

    data = []

    for j in jobs:
        data.append({
            "type": "job",
            "message": f"Follow up: {j.role} at {j.company}",
            "date": j.date_applied
        })

    for r in refs:
        data.append({
            "type": "referral",
            "message": f"Check referral: {r.person_name} at {r.company}",
            "date": r.date
        })

    return JsonResponse(data, safe=False)


