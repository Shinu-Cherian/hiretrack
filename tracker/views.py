from django.shortcuts import render,redirect, get_object_or_404
from .models import Job,Referral,Profile,Education,Experience
from django.db.models import Q,Count
from datetime import datetime, timedelta
from datetime import date
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from .forms import ProfileForm
from django.http import JsonResponse
from .models import Job, Referral
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt
from .utils_pdf import render_to_pdf


from django.contrib.auth import authenticate, login, update_session_auth_hash
from datetime import date, timedelta
from django.http import FileResponse, Http404, JsonResponse, HttpResponse
import re
from io import BytesIO
from collections import Counter
from html import unescape
from zipfile import ZipFile
from xml.etree import ElementTree


def api_user(request):
    if request.user.is_authenticated:
        return request.user
    return None


def login_required_json(user):
    if user is None:
        return JsonResponse({"error": "Login required"}, status=401)
    return None


STOP_WORDS = {
    "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has",
    "have", "in", "is", "it", "of", "on", "or", "our", "that", "the", "this",
    "to", "we", "with", "you", "your", "will", "work", "role", "job", "team",
    "experience", "candidate", "responsibilities", "requirements", "hiring",
    "developer", "engineer", "preferred", "required", "looking"
}

SKILL_ALIASES = {
    "javascript": ["javascript", "js", "ecmascript"],
    "typescript": ["typescript", "ts"],
    "react": ["react", "react.js", "reactjs"],
    "frontend": ["frontend", "front-end", "front end"],
    "django": ["django", "django rest framework", "drf"],
    "python": ["python"],
    "sql": ["sql", "postgresql", "mysql", "sqlite"],
    "api": ["api", "apis", "rest", "restful"],
    "aws": ["aws", "amazon web services"],
    "docker": ["docker", "container"],
    "kubernetes": ["kubernetes", "k8s"],
    "git": ["git", "github", "gitlab"],
    "testing": ["testing", "unit test", "integration test", "pytest", "jest"],
    "tailwind": ["tailwind", "tailwind css"],
    "node": ["node", "node.js", "express"],
    "java": ["java", "spring"],
    "communication": ["communication", "stakeholder", "collaboration"],
    "analytics": ["analytics", "dashboard", "dashboards", "reporting", "metrics"],
    "machine learning": ["machine learning", "ml", "model"],
    "data analysis": ["data analysis", "pandas", "numpy", "excel"],
}

SECTION_HEADERS = ["summary", "experience", "projects", "skills", "education", "certifications"]
ACTION_VERBS = [
    "built", "developed", "created", "designed", "implemented", "optimized",
    "improved", "managed", "led", "delivered", "automated", "integrated"
]


def normalize_text(text):
    return re.sub(r"[^a-z0-9+#.\s-]", " ", (text or "").lower())


def compact_text(text):
    return re.sub(r"\s+", " ", (text or "")).strip()


def extract_keywords(text, limit=45):
    words = re.findall(r"[a-z][a-z0-9+#.-]{2,}", normalize_text(text))
    filtered = [word.strip(".-") for word in words if word not in STOP_WORDS and len(word.strip(".-")) > 2]
    counts = Counter(filtered)
    return [word for word, _ in counts.most_common(limit)]


def read_uploaded_text(uploaded_file):
    if not uploaded_file:
        return "", []
    filename = uploaded_file.name.lower()
    raw = uploaded_file.read()
    warnings = []

    if filename.endswith(".docx"):
        try:
            with ZipFile(BytesIO(raw)) as docx:
                xml = docx.read("word/document.xml")
            root = ElementTree.fromstring(xml)
            texts = [node.text for node in root.iter() if node.tag.endswith("}t") and node.text]
            return compact_text(unescape(" ".join(texts))), warnings
        except Exception:
            warnings.append("Could not read DOCX file. Paste resume text if the score looks low.")
            return "", warnings

    if filename.endswith(".pdf"):
        try:
            from pypdf import PdfReader
            uploaded_file.seek(0)
            reader = PdfReader(uploaded_file)
            text = "\n".join(page.extract_text() or "" for page in reader.pages)
            return compact_text(text), warnings
        except Exception:
            warnings.append("PDF text extraction needs the pypdf package or a text-selectable PDF. Paste resume text for best accuracy.")
            return "", warnings

    for encoding in ("utf-8", "latin-1"):
        try:
            return raw.decode(encoding), warnings
        except UnicodeDecodeError:
            continue
    warnings.append("Could not read uploaded file. Paste resume text for analysis.")
    return "", warnings


def contains_any(text, aliases):
    normalized = normalize_text(text)
    for alias in aliases:
        escaped = re.escape(alias)
        plural = "s?" if alias.isalpha() and len(alias) > 3 else ""
        if re.search(rf"(?<![a-z0-9]){escaped}{plural}(?![a-z0-9])", normalized):
            return True
    return False


def extract_skills_from(text):
    return sorted([skill for skill, aliases in SKILL_ALIASES.items() if contains_any(text, aliases)])


def extract_title(text):
    patterns = [
        r"(?:job title|role|position)\s*[:\-]\s*([a-zA-Z /+-]{3,60})",
        r"we are hiring\s+(?:a|an)?\s*([a-zA-Z /+-]{3,60})",
        r"apply for\s+(?:the)?\s*([a-zA-Z /+-]{3,60})",
    ]
    for pattern in patterns:
        match = re.search(pattern, text or "", re.IGNORECASE)
        if match:
            return compact_text(match.group(1)).title()
    keywords = extract_keywords(text, 6)
    return " ".join(keywords[:3]).title() if keywords else "the role"


def extract_company(text):
    match = re.search(r"(?:company|at)\s*[:\-]\s*([a-zA-Z0-9 &.-]{2,50})", text or "", re.IGNORECASE)
    return compact_text(match.group(1)).title() if match else "your company"


def important_terms(text, limit=35):
    skills = extract_skills_from(text)
    keywords = extract_keywords(text, 80)
    terms = []
    for item in [*skills, *keywords]:
        if item not in terms and len(item) > 2:
            terms.append(item)
    return terms[:limit]


def sentence_evidence(resume_text, matched_terms, limit=3):
    sentences = re.split(r"(?<=[.!?])\s+|\n+", resume_text or "")
    scored = []
    for sentence in sentences:
        normalized = normalize_text(sentence)
        hits = sum(1 for term in matched_terms if term in normalized)
        has_action = any(verb in normalized for verb in ACTION_VERBS)
        has_metric = bool(re.search(r"\d+%?|\$|x\b", sentence))
        score = hits + (1 if has_action else 0) + (1 if has_metric else 0)
        if score > 0 and len(sentence.strip()) > 25:
            scored.append((score, compact_text(sentence)))
    scored.sort(reverse=True, key=lambda item: item[0])
    return [sentence for _, sentence in scored[:limit]]


def ats_analysis(resume_text, jd_text):
    resume_terms = set(important_terms(resume_text, 70))
    jd_terms = important_terms(jd_text, 45)
    matched = [term for term in jd_terms if term in resume_terms or contains_any(resume_text, [term])]
    missing = [term for term in jd_terms if term not in matched]

    jd_skills = extract_skills_from(jd_text)
    resume_skills = extract_skills_from(resume_text)
    matched_skills = [skill for skill in jd_skills if skill in resume_skills]

    section_hits = [section for section in SECTION_HEADERS if re.search(rf"\b{section}\b", normalize_text(resume_text))]
    action_hits = [verb for verb in ACTION_VERBS if re.search(rf"\b{verb}\b", normalize_text(resume_text))]
    metric_count = len(re.findall(r"\d+%?|\$[0-9]|[0-9]+x\b", resume_text or ""))

    keyword_score = (len(matched) / len(jd_terms)) * 45 if jd_terms else 0
    skill_score = (len(matched_skills) / len(jd_skills)) * 25 if jd_skills else 15
    section_score = min(len(section_hits), 5) / 5 * 15
    impact_score = min(len(action_hits), 6) / 6 * 8 + min(metric_count, 4) / 4 * 7
    score = round(min(100, keyword_score + skill_score + section_score + impact_score), 1)

    suggestions = []
    if missing[:6]:
        suggestions.append(f"Add truthful evidence for these JD priorities: {', '.join(missing[:6])}.")
    if len(section_hits) < 4:
        suggestions.append("Use clear ATS-friendly section headings such as Summary, Skills, Experience, Projects, and Education.")
    if metric_count < 2:
        suggestions.append("Add measurable outcomes to bullets, such as percentages, counts, speed, cost, or scale.")
    if len(matched_skills) < max(1, len(jd_skills) // 2):
        suggestions.append("Move the most relevant technical skills into a visible Skills section and repeat them naturally in project bullets.")
    if not suggestions:
        suggestions.append("Strong alignment. Do a final pass for concise bullets, consistent formatting, and measurable impact.")

    return {
        "score": score,
        "matched": matched[:30],
        "missing": missing[:30],
        "matched_skills": matched_skills,
        "missing_skills": [skill for skill in jd_skills if skill not in matched_skills],
        "section_hits": section_hits,
        "impact_terms": action_hits[:10],
        "suggestions": suggestions,
    }


def build_cover_letter(resume_text, jd_text, profile=None):
    import requests, json as _json

    if profile is None:
        profile = {}
    candidate_name     = profile.get("name", "")
    candidate_email    = profile.get("email", "")
    candidate_phone    = profile.get("phone", "")
    candidate_linkedin = profile.get("linkedin", "")
    candidate_location = profile.get("location", "")

    # --- Build header block (reference format) ---
    # Line 1: Name
    # Line 2: email | phone
    # Line 3: linkedin | location
    header_line2_parts = [p for p in [candidate_email, candidate_phone] if p]
    header_line3_parts = [p for p in [candidate_linkedin, candidate_location] if p]
    header_block = candidate_name
    if header_line2_parts:
        header_block += "\n" + " | ".join(header_line2_parts)
    if header_line3_parts:
        header_block += "\n" + " | ".join(header_line3_parts)

    # --- Sanitize resume_text: remove 'Envelope' prefix from email ---
    import re as _re
    clean_resume = _re.sub(r'Envelope\s*', '', resume_text, flags=_re.IGNORECASE)

    system_msg = (
        "You are a professional cover letter writer. "
        "Output ONLY the cover letter text — no reasoning, no commentary, no JSON, no markdown. "
        "Plain text only."
    )

    user_msg = (
        "Write a complete, professional cover letter using this EXACT structure.\n\n"
        "--- HEADER (copy exactly) ---\n"
        + header_block + "\n\n"
        "Hiring Manager\n"
        "[Company Name from JD] \u2014 [Team or Division from JD]\n\n"
        "Re: [Exact Job Title from JD] \u2014 [Company Name from JD]\n\n"
        "Dear Hiring Manager,\n\n"
        "[Para 1: State the role, your degree, and 3 matching technical skills from your resume. "
        "End with one sentence on the domain intersection this role sits at.]\n\n"
        "[Para 2: What specifically draws you to THIS company and role. "
        "Reference something concrete from the JD (mission, framing, technical challenge). "
        "Link it to a real architectural decision or discipline from one of your projects.]\n\n"
        "[Para 3: Weave 2 real projects from the resume into natural flowing prose. "
        "For each project: name it, state the technical problem, what you built, and the result. "
        "Do NOT use bold headers or labels.]\n\n"
        "[Para 4: Express genuine domain curiosity. "
        "State that you understand the depth required for this role. "
        "End with one sentence on your location and availability.]\n\n"
        "Yours sincerely,\n"
        + candidate_name + "\n\n"
        "RULES:\n"
        "- Candidate email is " + candidate_email + " \u2014 use EXACTLY this, ignore what appears in the resume.\n"
        "- Plain text only. No bold, no asterisks, no markdown.\n"
        "- No labels like 'CAR', 'Context', 'Action', 'Result', 'Recipient Block'.\n"
        "- Use REAL project names from the resume.\n"
        "- Use REAL percentages/numbers from the resume.\n"
        "- Complete all 4 paragraphs. Under 350 words.\n\n"
        "JD:\n" + jd_text[:1200] + "\n\n"
        "RESUME:\n" + clean_resume[:2000]
    )

    try:
        data = {
            "messages": [
                {"role": "system", "content": system_msg},
                {"role": "user",   "content": user_msg}
            ],
            "model": "openai"
        }
        res = requests.post("https://text.pollinations.ai/", json=data, timeout=60)
        if res.status_code == 200:
            raw = res.text.strip()

            # --- Fix: API sometimes returns JSON with reasoning instead of plain text ---
            # Try parsing as JSON and extracting the actual letter content
            if raw.startswith("{") or raw.startswith("["):
                try:
                    parsed = _json.loads(raw)
                    # OpenAI-compatible: choices[0].message.content
                    if isinstance(parsed, dict):
                        content = (
                            parsed.get("choices", [{}])[0].get("message", {}).get("content")
                            or parsed.get("content")
                            or parsed.get("message")
                            or parsed.get("text")
                        )
                        if content and len(content) > 100:
                            return content.strip()
                    # If we couldn't extract content from JSON, fall through
                except _json.JSONDecodeError:
                    pass
            else:
                # Plain text response — use directly
                if len(raw) > 100:
                    return raw
    except Exception as e:
        print(f"DEBUG: AI Call Failed: {e}")

    return "ERROR: The AI took too long or encountered a network error. Please check your internet and try again."




def home(request):
    return render(request, 'home.html')

@csrf_exempt

def add_job_api(request):
    if request.method == "POST":
        import json
        from datetime import datetime, timedelta

        data = request.POST if request.content_type and request.content_type.startswith("multipart/form-data") else json.loads(request.body)
        
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
            follow_up_date=follow_up_date,
            resume_file=request.FILES.get("resume_file"),
            cover_letter_file=request.FILES.get("cover_letter_file")
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
    since = date.today() - timedelta(days=29)
    week_since = date.today() - timedelta(days=6)

    job_status_counts = {
        item["status"]: item["count"]
        for item in jobs.values("status").annotate(count=Count("id"))
    }
    referral_status_counts = {
        item["status"]: item["count"]
        for item in referrals.values("status").annotate(count=Count("id"))
    }

    total_jobs = jobs.count()
    applied_jobs = job_status_counts.get("applied", 0)
    pending_jobs = job_status_counts.get("pending", 0)
    rejected_jobs = job_status_counts.get("rejected", 0)
    selected_jobs = job_status_counts.get("selected", 0)

    total_referrals = referrals.count()
    pending_referrals = referral_status_counts.get("pending", 0)
    replied_referrals = referral_status_counts.get("replied", 0)
    no_response_referrals = referral_status_counts.get("no_response", 0)

    job_timeline = [
        {"date": str(item["date_applied"]), "count": item["count"]}
        for item in (
            jobs.filter(date_applied__gte=since)
            .values("date_applied")
            .annotate(count=Count("id"))
            .order_by("date_applied")
        )
    ]

    referral_timeline = [
        {"date": str(item["date"]), "count": item["count"]}
        for item in (
            referrals.filter(date__gte=since)
            .values("date")
            .annotate(count=Count("id"))
            .order_by("date")
        )
    ]

    job_companies = [
        {"name": item["company"] or "Unknown", "count": item["count"]}
        for item in (
            jobs.values("company")
            .annotate(count=Count("id"))
            .order_by("-count", "company")[:8]
        )
    ]

    referral_companies = [
        {"name": item["company"] or "Unknown", "count": item["count"]}
        for item in (
            referrals.values("company")
            .annotate(count=Count("id"))
            .order_by("-count", "company")[:8]
        )
    ]

    job_platforms = [
        {"name": item["platform"] or "Not specified", "count": item["count"]}
        for item in (
            jobs.values("platform")
            .annotate(count=Count("id"))
            .order_by("-count", "platform")[:8]
        )
    ]

    acceptance_rate = round((selected_jobs / total_jobs) * 100, 1) if total_jobs else 0
    rejection_rate = round((rejected_jobs / total_jobs) * 100, 1) if total_jobs else 0
    response_rate = round((replied_referrals / total_referrals) * 100, 1) if total_referrals else 0

    data = {
        "job_analytics": {
            "stats": {
                "total": total_jobs,
                "applied": applied_jobs,
                "pending": pending_jobs,
                "rejected": rejected_jobs,
                "selected": selected_jobs,
                "acceptance_rate": acceptance_rate,
                "rejection_rate": rejection_rate,
                "status_counts": {
                    "applied": applied_jobs,
                    "pending": pending_jobs,
                    "rejected": rejected_jobs,
                    "selected": selected_jobs,
                },
            },
            "timeline": job_timeline,
            "companies": job_companies,
            "platforms": job_platforms,
        },
        "referral_analytics": {
            "stats": {
                "total": total_referrals,
                "pending": pending_referrals,
                "replied": replied_referrals,
                "no_response": no_response_referrals,
                "response_rate": response_rate,
                "status_counts": {
                    "pending": pending_referrals,
                    "replied": replied_referrals,
                    "no_response": no_response_referrals,
                },
            },
            "timeline": referral_timeline,
            "companies": referral_companies,
        },
        "weekly": {
            "applications": jobs.filter(date_applied__gte=week_since).count(),
            "referrals": referrals.filter(date__gte=week_since).count(),
        },

        # Legacy keys kept for older frontend surfaces during the React migration.
        "total_jobs": total_jobs,
        "pending_jobs": pending_jobs,
        "rejected_jobs": rejected_jobs,
        "selected_jobs": selected_jobs,
        "total_referrals": total_referrals,
        "pending_referrals": pending_referrals,
        "replied_referrals": replied_referrals,
        "no_response_referrals": no_response_referrals,
        "success_rate": acceptance_rate,
        "reply_rate": response_rate,
        "job_status": {
            "applied": applied_jobs,
            "pending": pending_jobs,
            "rejected": rejected_jobs,
            "selected": selected_jobs,
        },
        "referral_status": {
            "pending": pending_referrals,
            "replied": replied_referrals,
            "no_response": no_response_referrals,
        },
        "applications_over_time": job_timeline,
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
    "resumeFile": job.resume_file.url if job.resume_file else None,
    "coverLetterFile": job.cover_letter_file.url if job.cover_letter_file else None,

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
    data = request.POST if request.content_type and request.content_type.startswith("multipart/form-data") else json.loads(request.body)
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
    if request.FILES.get("resume_file"):
        job.resume_file = request.FILES["resume_file"]
    if request.FILES.get("cover_letter_file"):
        job.cover_letter_file = request.FILES["cover_letter_file"]
    job.save()

    return JsonResponse({
        "success": True,
        "resumeFile": job.resume_file.url if job.resume_file else None,
        "coverLetterFile": job.cover_letter_file.url if job.cover_letter_file else None,
    })


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


@csrf_exempt
def resume_analyze_api(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    uploaded_text, warnings = read_uploaded_text(request.FILES.get("resume_file"))
    resume_text = request.POST.get("resume", "") + "\n" + uploaded_text
    jd_text = request.POST.get("job_description", "")
    if len(compact_text(resume_text)) < 200:
        warnings.append("Very little resume text was detected. Paste the resume text or upload a text-selectable document for a reliable score.")

    analysis = ats_analysis(resume_text, jd_text)
    analysis["warnings"] = warnings
    analysis["resume_chars"] = len(compact_text(resume_text))
    return JsonResponse(analysis)


@csrf_exempt
def generate_cover_letter_api(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    uploaded_text, warnings = read_uploaded_text(request.FILES.get("resume_file"))
    resume_text = request.POST.get("resume", "") + "\n" + uploaded_text
    jd_text = request.POST.get("job_description", "")
    # Get user profile for frontend preview
    user = api_user(request)
    profile_data = {}
    if user:
        p, _ = Profile.objects.get_or_create(user=user)
        profile_data = {
            "name": user.username,
            "email": user.email,
            "phone": p.phone or "",
            "address": "",
            "linkedin": "",
            "github": ""
        }
        # --- Name extraction from resume ---
        name_from_resume = ""
        for line in resume_text.strip().split("\n"):
            line = line.strip()
            if line and len(line) < 50 and "@" not in line and ".com" not in line and not any(c.isdigit() for c in line[:5]):
                name_from_resume = line
                break
        if name_from_resume:
            profile_data["name"] = name_from_resume.strip().title()

        # --- Email: PREFER user.email from DB (already clean), only fallback to PDF if missing ---
        if not profile_data["email"]:
            e_match = re.search(r"\b[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}\b", resume_text)
            if e_match:
                profile_data["email"] = e_match.group(0).strip()

        # --- Phone: from profile first, then PDF ---
        if not profile_data["phone"]:
            p_match = re.search(r"\+?\d[\d\s\-().]{7,15}\d", resume_text)
            if p_match:
                profile_data["phone"] = p_match.group(0).strip()

        # --- LinkedIn and GitHub ---
        l_match = re.search(r"linkedin\.com/in/[a-zA-Z0-9_-]+", resume_text, re.IGNORECASE)
        g_match = re.search(r"github\.com/[a-zA-Z0-9_-]+", resume_text, re.IGNORECASE)
        if l_match:
            profile_data["linkedin"] = l_match.group(0)
        if g_match:
            profile_data["github"] = g_match.group(0)

        # --- Location from resume (City, State, Country pattern) ---
        loc_match = re.search(
            r"[A-Z][a-z]+(?:[\s,]+[A-Z][a-z]+){1,3},?\s*India",
            resume_text
        )
        if loc_match:
            profile_data["location"] = loc_match.group(0).strip()

    return JsonResponse({
        "cover_letter": build_cover_letter(resume_text, jd_text, profile=profile_data),
        "warnings": warnings,
        "resume_chars": len(compact_text(resume_text)),
        "profile": profile_data
    })


@csrf_exempt
def generate_cover_letter_pdf_api(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    import json
    try:
        data = json.loads(request.body)
    except:
        data = request.POST

    text = data.get("text", "")
    template_id = data.get("template_id", "1")
    
    user = api_user(request)
    user_name = "[Your Name]"
    user_email = ""
    user_phone = ""
    user_linkedin = ""
    user_github = ""

    # Deep extraction from resume text if possible
    linkedin_match = re.search(r"linkedin\.com/in/[a-zA-Z0-9_-]+", text + "\n" + (user.profile.resume.name if user and hasattr(user, 'profile') and user.profile.resume else ""), re.IGNORECASE)
    github_match = re.search(r"github\.com/[a-zA-Z0-9_-]+", text, re.IGNORECASE)
    
    if user:
        user_name = user.username
        profile, _ = Profile.objects.get_or_create(user=user)
        user_email = user.email
        user_phone = profile.phone or ""
        
    if linkedin_match: user_linkedin = linkedin_match.group(0)
    if github_match: user_github = github_match.group(0)

    # Convert newlines to HTML breaks for xhtml2pdf
    formatted_text = text.replace("\n", "<br />")

    context = {
        "cover_letter_text": formatted_text,
        "user_name": user_name,
        "user_email": user_email,
        "user_phone": user_phone,
        "user_linkedin": user_linkedin,
        "user_github": user_github,
        "current_date": date.today().strftime("%B %d, %Y"),
    }

    pdf = render_to_pdf(f"pdf_templates/template_{template_id}.html", context)
    if pdf:
        response = HttpResponse(pdf, content_type="application/pdf")
        filename = f"Cover_Letter_Style_{template_id}.pdf"
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        return response
    
    return JsonResponse({"error": "PDF generation failed"}, status=500)


def career_vault_api(request):
    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    jobs = Job.objects.filter(user=user).filter(
        Q(resume_file__isnull=False) | Q(cover_letter_file__isnull=False)
    ).order_by("-date_applied", "-id")
    return JsonResponse({
        "items": [
            {
                "id": job.id,
                "jobTitle": job.role,
                "company": job.company,
                "dateApplied": job.date_applied,
                "resumeFile": job.resume_file.url if job.resume_file else None,
                "coverLetterFile": job.cover_letter_file.url if job.cover_letter_file else None,
                "resumeDownload": f"/api/job/document/{job.id}/resume/" if job.resume_file else None,
                "coverLetterDownload": f"/api/job/document/{job.id}/cover-letter/" if job.cover_letter_file else None,
            }
            for job in jobs
        ]
    })


def job_document_download_api(request, id, kind):
    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    job = get_object_or_404(Job, id=id, user=user)
    document = job.resume_file if kind == "resume" else job.cover_letter_file
    if not document:
        raise Http404("Document not found")
    return FileResponse(document.open("rb"), as_attachment=True, filename=document.name.split("/")[-1])


def streak_api(request):
    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    job_activity = list(
        Job.objects.filter(user=user)
        .values("date_applied")
        .annotate(count=Count("id"))
        .order_by("date_applied")
    )
    referral_activity = list(
        Referral.objects.filter(user=user)
        .values("date")
        .annotate(count=Count("id"))
        .order_by("date")
    )

    job_days = {item["date_applied"]: item["count"] for item in job_activity}
    referral_days = {item["date"]: item["count"] for item in referral_activity}
    job_streak = calculate_streak(set(job_days.keys()))
    referral_streak = calculate_streak(set(referral_days.keys()))

    return JsonResponse({
        "jobs": {
            "heatmap": [{"date": str(day), "count": count} for day, count in job_days.items()],
            "streak": job_streak,
            "badges": earned_badges(job_streak),
        },
        "referrals": {
            "heatmap": [{"date": str(day), "count": count} for day, count in referral_days.items()],
            "streak": referral_streak,
            "badges": earned_badges(referral_streak),
        },
    })


def calculate_streak(active_days):
    current = date.today()
    streak = 0
    while current in active_days:
        streak += 1
        current = current - timedelta(days=1)
    return streak


def earned_badges(streak):
    milestones = [30, 50]
    milestones.extend(range(100, max(streak, 100) + 1, 50))
    return [day for day in milestones if streak >= day]


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
            "id": j.id,
            "type": "job",
            "message": f"Follow up: {j.role} at {j.company}",
            "date": j.date_applied
        })

    for r in refs:
        data.append({
            "id": r.id,
            "type": "referral",
            "message": f"Check referral: {r.person_name} at {r.company}",
            "date": r.date
        })

    return JsonResponse(data, safe=False)


