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


from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from datetime import date, timedelta
from django.http import FileResponse, Http404, JsonResponse, HttpResponse
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django_ratelimit.core import is_ratelimited
import json
import resend
import requests
import os
import os
resend.api_key = os.environ.get("RESEND_API_KEY")
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


def auth_status_api(request):
    user = api_user(request)
    if user is None:
        return JsonResponse({"authenticated": False}, status=401)

    profile, _ = Profile.objects.get_or_create(user=user)
    return JsonResponse({
        "authenticated": True,
        "username": user.username,
        "email": user.email,
        "profile_pic": profile.profile_pic.url if profile.profile_pic else None,
    })


@csrf_exempt
def logout_api(request):
    logout(request)
    return JsonResponse({"message": "Logout success"})


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


# ── Comprehensive section header patterns ────────────────────────────────────
# People name sections in many ways. Cover all common variants.
SECTION_PATTERNS = {
    "has_summary": [
        "summary", "professional summary", "career summary", "executive summary",
        "objective", "career objective", "professional objective",
        "profile", "professional profile", "about me", "about",
        "overview", "introduction", "personal statement", "career profile",
    ],
    "has_skills": [
        # Generic
        "skills", "skill set", "skillset", "key skills", "core skills", "hard skills",
        "soft skills", "relevant skills", "transferable skills",
        # Technical variants (the most common misses)
        "technical skills", "technical expertise", "technical proficiency",
        "technical knowledge", "technical competencies", "tech skills",
        "tech stack", "technology stack", "technologies", "tools & technologies",
        "tools and technologies", "software skills", "software & tools",
        "software and tools", "programming skills",
        # Competency variants
        "core competencies", "competencies", "areas of expertise", "expertise",
        "specializations", "specialties",
        # Language/framework variants
        "programming languages", "languages", "languages & tools",
        "languages and tools", "frameworks", "frameworks & libraries",
        "frameworks and libraries", "libraries", "platforms",
        # Other common names
        "qualifications", "capabilities", "proficiencies",
    ],
    "has_experience": [
        "experience", "work experience", "professional experience",
        "relevant experience", "industry experience", "career experience",
        "employment", "employment history", "work history", "job history",
        "professional background", "career history", "positions held",
        "work background", "internships", "internship experience",
        "industry background",
    ],
    "has_projects": [
        "projects", "personal projects", "academic projects", "key projects",
        "notable projects", "selected projects", "featured projects",
        "side projects", "project work", "project experience",
        "portfolio", "open source", "github projects", "independent projects",
        "capstone", "final year project",
    ],
    "has_education": [
        "education", "educational background", "academic background",
        "academic qualifications", "academic history",
        "qualifications", "degrees", "degree", "qualification",
        "schooling", "academic credentials",
        "university", "college", "academics",
    ],
    "has_certifications": [
        "certifications", "certification", "certificates", "certificate",
        "professional certifications", "licenses", "license",
        "courses", "online courses", "professional development",
        "credentials", "training", "training & certifications",
        "awards", "honors", "achievements", "accomplishments",
        "badges",
    ],
}


def detect_sections(resume_text):
    """
    Two-pass section detection:
    Pass 1 – Line-by-line: check if a line IS a section header (preserves
              original structure even after compact_text is applied).
    Pass 2 – Full-text word-boundary search as fallback.
    This correctly handles names like 'Technical Skills', 'Tech Stack', etc.
    """
    result = {key: False for key in SECTION_PATTERNS}

    # Pass 1: scan every line; if a stripped line matches a pattern, mark found
    lines = (resume_text or "").splitlines()
    for raw_line in lines:
        clean = raw_line.strip().lower()
        # Remove trailing punctuation/colons that sometimes follow headers
        clean = re.sub(r"[\s:•\-|]+$", "", clean)
        if not clean or len(clean) > 60:   # headers are short
            continue
        for key, patterns in SECTION_PATTERNS.items():
            if result[key]:
                continue
            for p in patterns:
                if clean == p or clean.startswith(p + " ") or clean.endswith(" " + p):
                    result[key] = True
                    break

    # Pass 2: word-boundary search on full normalized text (fallback)
    normalized = normalize_text(resume_text)
    for key, patterns in SECTION_PATTERNS.items():
        if result[key]:
            continue
        for p in patterns:
            if re.search(rf"\b{re.escape(p)}\b", normalized):
                result[key] = True
                break

    return result


# Stop words to filter from keyword lists
KEYWORD_STOP_WORDS = {
    "the", "and", "for", "are", "with", "this", "that", "have", "has", "been",
    "will", "you", "your", "our", "not", "all", "its", "into", "them", "their",
    "they", "from", "use", "using", "used", "can", "may", "also", "but", "or",
    "was", "were", "out", "get", "set", "just", "any", "well", "new", "per",
    "via", "we", "us", "she", "he", "it", "is", "be", "do", "did", "had",
    "both", "some", "such", "each", "than", "more", "most", "own", "other",
    "build", "check", "site", "type", "value", "power", "features", "status",
    "position", "senior", "junior", "candidates", "qualifications", "employment",
    "differences", "discipline", "including", "engineers", "problems", "coding",
}


def ats_analysis(resume_text, jd_text):
    resume_terms = set(important_terms(resume_text, 70))
    jd_terms = important_terms(jd_text, 45)
    matched = [term for term in jd_terms if term in resume_terms or contains_any(resume_text, [term])]
    missing = [term for term in jd_terms if term not in matched]

    jd_skills = extract_skills_from(jd_text)
    resume_skills = extract_skills_from(resume_text)
    matched_skills = [skill for skill in jd_skills if skill in resume_skills]

    # Get sections using the robust new logic
    section_analysis = detect_sections(resume_text)
    section_hits = [k.replace("has_", "") for k, v in section_analysis.items() if v]
    
    action_hits = [verb for verb in ACTION_VERBS if re.search(rf"\b{verb}\b", normalize_text(resume_text))]
    metric_count = len(re.findall(r"\d+%?|\$[0-9]|[0-9]+x\b", resume_text or ""))

    # Compute sub-scores on 50/30/10/10 scale
    kw_score      = round((len(matched) / len(jd_terms)) * 50, 1) if jd_terms else 0
    skill_score   = round((len(matched_skills) / len(jd_skills)) * 30, 1) if jd_skills else 12
    section_score = round(min(len(section_hits), 5) / 5 * 10, 1)
    impact_score  = round(
        min(len(action_hits), 6) / 6 * 5 + min(metric_count, 4) / 4 * 5, 1
    )
    score = round(min(100, kw_score + skill_score + section_score + impact_score), 1)

    suggestions = []
    if missing[:6]:
        suggestions.append(f"Add truthful evidence for these JD priorities: {', '.join(missing[:6])}.")
    if len(section_hits) < 4:
        suggestions.append("Use clear ATS-friendly section headings: Summary, Skills, Experience, Projects, Education.")
    if metric_count < 2:
        suggestions.append("Add measurable outcomes to bullets (percentages, counts, speed, cost, scale).")
    if len(matched_skills) < max(1, len(jd_skills) // 2):
        suggestions.append("Move relevant technical skills into a dedicated Skills section.")
    if not suggestions:
        suggestions.append("Strong alignment. Do a final pass for concise bullets and measurable impact.")

    return {
        "score": score,
        "keyword_match_score": kw_score,
        "skill_match_score":   skill_score,
        "format_score":        section_score,
        "impact_score":        impact_score,
        "matched":             matched[:30],
        "missing":             missing[:30],
        "matched_skills":      matched_skills,
        "missing_skills":      [skill for skill in jd_skills if skill not in matched_skills],
        "matched_keywords":    matched[:30],
        "missing_keywords":    missing[:30],
        "section_hits":        section_hits,
        "section_analysis":    section_analysis,
        "impact_terms":        action_hits[:10],
        "suggestions":         suggestions,
        "experience_match":    "",
        "title_match":         "",
        "ai_powered":          False,
    }


def clean_resume_text(text):
    """
    Normalizes whitespace, removes unicode artifacts and repeated breaks.
    """
    import re as _re
    if not text: return ""
    # Remove weird unicode / non-ascii
    text = text.encode("ascii", "ignore").decode("ascii")
    # Normalize whitespace
    text = _re.sub(r'\s+', ' ', text)
    # Remove repeated line breaks (though already handled by \s+)
    text = _re.sub(r'\n+', '\n', text)
    return text.strip()


def parse_resume_to_json(clean_text, client):
    """
    Extracts structured JSON from raw resume text using Groq.
    """
    import json as _json
    
    extract_system_msg = (
        "You are an advanced resume parsing engine. Extract structured information from resumes accurately. "
        "RULES: - Return ONLY valid JSON. - Do not include explanations. - Do not hallucinate missing data. "
        "- If a field is missing, return an empty string or empty array. - Extract information exactly as written."
    )
    
    extract_user_msg = (
        f"Extract the following information from this resume.\n\n"
        f"RESUME:\n{clean_text[:7000]}\n\n"
        "Return this exact JSON structure:\n"
        "{\n"
        '  "name": "", "email": "", "phone": "", "linkedin": "", "github": "", "portfolio": "",\n'
        '  "location": "", "summary": "", "years_of_experience": "",\n'
        '  "skills": [], "education": [], "certifications": [],\n'
        '  "experience": [{"company": "", "role": "", "duration": "", "description": ""}],\n'
        '  "projects": [{"name": "", "description": "", "technologies": [], "impact": ""}]\n'
        "}\n"
        "Return ONLY valid JSON."
    )

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": extract_system_msg},
                {"role": "user", "content": extract_user_msg}
            ],
            response_format={"type": "json_object"},
            temperature=0.1,
        )
        return _json.loads(completion.choices[0].message.content)
    except Exception as e:
        print(f"DEBUG: Resume Parsing Failed: {e}")
        return {}


def build_cover_letter(resume_text, jd_text, profile=None):
    """
    Production-ready Cover Letter Generation Pipeline.
    """
    from groq import Groq
    from django.conf import settings
    import json as _json

    if not settings.GROQ_API_KEY:
        return {"error": "GROQ_API_KEY not found in settings"}

    client = Groq(api_key=settings.GROQ_API_KEY.strip())

    # STEP 1: Clean Text
    cleaned_resume = clean_resume_text(resume_text)
    
    # STEP 2: Extract Structured JSON
    structured_json = parse_resume_to_json(cleaned_resume, client)
    
    # Fallback/Merge with DB profile if AI extraction missed basic contact info
    if profile:
        structured_json["name"] = structured_json.get("name") or profile.get("name", "")
        structured_json["email"] = structured_json.get("email") or profile.get("email", "")

    # STEP 3: Generate Professional Cover Letter
    from datetime import date
    today_str = date.today().strftime("%B %d, %Y")

    system_msg = (
        "You are a senior executive recruiter and professional business writer. "
        "Write complete professional cover letters using proper real-world cover letter formatting. "
        "The cover letter MUST include: "
        "1. Candidate contact information at the top: - Full name - Email - Phone - LinkedIn (if available) - GitHub or Portfolio (if available) "
        "2. Current date "
        "3. Professional greeting: Examples: - Dear Hiring Manager, - Dear [Company Name] Hiring Team, "
        "4. Professional cover letter body "
        "5. Professional closing: Examples: - Sincerely, - Best regards, "
        "6. Candidate full name at the bottom "
        "IMPORTANT RULES: - Only use information available in the candidate profile. - Do not hallucinate missing contact details. "
        "- If LinkedIn/GitHub/phone is unavailable, omit them naturally. - Keep formatting clean and professional. "
        "- Do not use markdown. - Do not use bullet points. - Avoid robotic AI language. - Avoid repetitive wording. "
        "- Keep tone modern and professional. - Keep paragraphs readable and concise. "
        "The final output should look like a real professionally written cover letter ready for submission."
    )

    user_msg = (
        f"Write a complete professional cover letter.\n\n"
        f"CANDIDATE PROFILE:\n{_json.dumps(structured_json, indent=2)}\n\n"
        f"JOB DESCRIPTION:\n{jd_text[:3500]}\n\n"
        f"TODAY'S DATE: {today_str}\n\n"
        "REQUIREMENTS:\n"
        "- Include candidate contact details at the top using available information only.\n"
        "- Include today's date.\n"
        "- Add a professional greeting.\n"
        "- Write 3–4 professional paragraphs.\n"
        "- Mention the role title naturally.\n"
        "- Connect the candidate's experience and projects to the job requirements.\n"
        "- Reference relevant technologies and achievements naturally.\n"
        "- Keep the writing concise, modern, and recruiter-friendly.\n"
        "- Avoid generic AI-generated phrases.\n"
        "- Avoid excessive enthusiasm.\n"
        "- Keep the letter between 250–400 words.\n"
        "- End with a professional closing and the candidate's full name.\n\n"
        "IMPORTANT:\n"
        "- If some contact fields are missing, skip them gracefully.\n"
        "- Never invent information.\n"
        "- Do not use markdown.\n"
        "- Do not use placeholders.\n"
        "- Make the final output look like a real submission-ready cover letter.\n\n"
        "Return ONLY the final cover letter."
    )

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_msg}
            ],
            temperature=0.5,
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        print(f"DEBUG: Groq Generation Failed: {e}")
        return f"ERROR: {str(e)}"




def home(request):
    return render(request, 'index.html')

@csrf_exempt

def add_job_api(request):
    if request.method == "POST":
        import json
        from datetime import datetime, timedelta

        user = api_user(request)
        auth_error = login_required_json(user)
        if auth_error:
            return auth_error

        data = request.POST if request.content_type and request.content_type.startswith("multipart/form-data") else json.loads(request.body)
        
        date_applied = data.get("dateApplied")
        date_obj = datetime.strptime(date_applied, "%Y-%m-%d").date()
        follow_up_date = date_obj + timedelta(days=7)

        Job.objects.create(
            user=user,
            company=data.get("company"),
            role=data.get("jobTitle"),
            date_applied=date_obj,
            status=data.get("status"),
            job_id=data.get("jobId"),
            platform=data.get("platform"),
            location=data.get("location"),
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
    job = get_object_or_404(Job, id=id, user=request.user)
    job.delete()
    return redirect('job_list')

@login_required
def edit_job(request, id):
    job = get_object_or_404(Job, id=id, user=request.user)

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
    referral = get_object_or_404(Referral, id=id, user=request.user)
    referral.delete()
    return redirect('referral_list')

@login_required
def edit_referral(request, id):
    referral = get_object_or_404(Referral, id=id, user=request.user)

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
    job = get_object_or_404(Job, id=id, user=request.user)

    # toggle
    job.is_starred = not job.is_starred
    job.save()

    return redirect('job_list')

@login_required
def toggle_star_referral(request, id):
    referral = get_object_or_404(Referral, id=id, user=request.user)

    # toggle star
    referral.is_starred = not referral.is_starred
    referral.save()

    return redirect('referral_list')



def send_email_via_brevo(recipient_email, subject, html_content, plain_text=None):
    import os
    import requests
    brevo_url = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "accept": "application/json",
        "api-key": os.environ.get("BREVO_API_KEY", ""),
        "content-type": "application/json"
    }
    payload = {
        "sender": {"name": "HireTrack Support", "email": "support.hiretrack@gmail.com"},
        "to": [{"email": recipient_email}],
        "subject": subject,
        "htmlContent": html_content
    }
    if plain_text:
        payload["textContent"] = plain_text
        
    try:
        response = requests.post(brevo_url, json=payload, headers=headers)
        if response.status_code not in [200, 201, 202]:
            raise Exception(f"Brevo API error (Status {response.status_code}): {response.text}")
    except Exception as e:
        print(f"Brevo send failed: {e}")
        raise e


@csrf_exempt
def signup(request):
    if is_ratelimited(request, group='signup_api', key='ip', rate='3/m', increment=True):
        return JsonResponse({"error": "Too many attempts. Please try again later."}, status=429)
        
    if request.method == 'POST':
        import json
        import random
        try:
            data = json.loads(request.body)
            first_name = data.get('first_name', '').strip()
            last_name = data.get('last_name', '').strip()
            email = data.get('email', '').strip().lower()
            password = data.get('password')
            confirm_password = data.get('confirm_password')

            if not all([first_name, last_name, email, password]):
                return JsonResponse({"error": "All fields are required"}, status=400)

            # 🔐 Password match check
            if password != confirm_password:
                return JsonResponse({"error": "Passwords do not match"}, status=400)

            # 🔐 Email already exists check
            if User.objects.filter(email=email).exists():
                return JsonResponse({"error": "An account with this email already exists"}, status=400)

            # ⚙️ Unique Username Generation
            provided_username = data.get('username')
            if provided_username and not User.objects.filter(username=provided_username).exists():
                username = provided_username
            else:
                base_username = f"{first_name.lower()}_{last_name.lower()}"
                base_username = "".join([c for c in base_username if c.isalnum() or c == "_"])
                username = base_username
                while User.objects.filter(username=username).exists():
                    username = f"{base_username}_{random.randint(100, 9999)}"

            # ✅ Create user
            user = User.objects.create_user(username=username, email=email, password=password)
            user.first_name = first_name
            user.last_name = last_name
            user.is_active = False # OTP Verification required
            user.save()

            # Generate OTP
            from .models import OTPVerification
            otp = str(random.randint(100000, 999999))
            # Delete any existing OTPs for safety
            OTPVerification.objects.filter(user=user).delete()
            OTPVerification.objects.create(user=user, otp=otp)

            # Background Email Send
            referer = request.META.get('HTTP_REFERER', '')
            if referer and referer.startswith('http://localhost:3000'):
                frontend_url = 'http://localhost:3000'
            else:
                frontend_url = 'https://hiretrack.onrender.com'
            
            import threading
            
            def send_welcome_email_task(user_email, username, frontend_url, otp):
                subject = "Your HireTrack Verification Code 🔐"
                
                html_message = f"""
                <div style="font-family: Arial, sans-serif; background-color: #0A0A0A; color: #FFFFFF; padding: 40px 20px; line-height: 1.6;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #121313; border: 1px solid rgba(255,255,255,0.1); padding: 30px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                        <div style="font-size: 32px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 30px; color: #FFFFFF; font-family: 'Inter', Arial, sans-serif;">HIRE<span style="color: #FF6044;">TRACK</span></div>
                        <h1 style="color: #FF6044; font-size: 24px; font-weight: 900; letter-spacing: 1px; margin-bottom: 20px; text-transform: uppercase;">VERIFY YOUR EMAIL</h1>
                        
                        <p style="font-size: 16px;">Hi <strong style="color: #FF6044;">{username}</strong>,</p>
                        
                        <p style="font-size: 16px; color: #D1D5DB;">Thank you for registering with HireTrack. Please use the following One-Time Password (OTP) to verify your email address and activate your account. <strong>This code is valid for 5 minutes.</strong></p>
                        
                        <div style="background-color: #FF6044; color: #121313; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                            <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px;">{otp}</span>
                        </div>
                        
                        <p style="font-size: 14px; color: #9CA3AF;">If you did not request this, you can safely ignore this email.</p>
                    </div>
                </div>
                """
                plain_message = f"Your HireTrack Verification Code is: {otp}"
                try:
                    send_email_via_brevo(user_email, subject, html_message, plain_message)
                except Exception as e:
                    print(f"Error sending welcome email: {e}")
            
            threading.Thread(target=send_welcome_email_task, args=(email, username, frontend_url, otp)).start()

            return JsonResponse({"message": "Signup success. Please verify OTP.", "email": email})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid request payload"}, status=400)

    return JsonResponse({"error": "Method not allowed"}, status=405)


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



from django.middleware.csrf import get_token

@ensure_csrf_cookie
def get_csrf(request):
    return JsonResponse({"message": "CSRF cookie set", "csrfToken": get_token(request)})



@csrf_exempt
def login_api(request):
    if is_ratelimited(request, group='login_api', key='ip', rate='5/m', increment=True):
        return JsonResponse({"error": "Too many attempts. Please try again later."}, status=429)
        
    if request.method == "POST":
        login_identifier = request.POST.get("username")
        password = request.POST.get("password")

        # Support both Email and Username
        actual_username = login_identifier
        if "@" in login_identifier:
            try:
                user_obj = User.objects.get(email=login_identifier)
                actual_username = user_obj.username
            except User.DoesNotExist:
                pass

        user = authenticate(request, username=actual_username, password=password)

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


@csrf_exempt
def forgot_password_api(request):
    if is_ratelimited(request, group='forgot_pwd_api', key='ip', rate='3/m', increment=True):
        return JsonResponse({"error": "Too many attempts. Please try again later."}, status=429)
        
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email", "").strip().lower()
            if not email:
                return JsonResponse({"error": "Email is required"}, status=400)
            
            user = User.objects.filter(email=email).first()
            if user:
                token = default_token_generator.make_token(user)
                uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
                frontend_url = request.headers.get("Origin", request.build_absolute_uri("/")[:-1])
                reset_link = f"{frontend_url}/reset-password/{uidb64}/{token}/"
                
                brevo_url = "https://api.brevo.com/v3/smtp/email"
                headers = {
                    "accept": "application/json",
                    "api-key": os.environ.get("BREVO_API_KEY", ""),
                    "content-type": "application/json"
                }
                html_template = f"""
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {{ background-color: #121313; color: #ffffff; font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 40px 20px; }}
                        .container {{ max-width: 600px; margin: 0 auto; background-color: #1a1b1b; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 40px; text-align: center; }}
                        .logo {{ font-size: 32px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 30px; color: #ffffff; }}
                        .logo-accent {{ color: #FF6044; }}
                        .content {{ font-size: 16px; line-height: 1.6; color: #e5e5e5; text-align: left; }}
                        .button-container {{ margin: 35px 0; text-align: center; }}
                        .btn {{ background-color: #FF6044; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; }}
                        .warning-box {{ background-color: rgba(255, 96, 68, 0.1); border-left: 4px solid #FF6044; padding: 15px; margin: 30px 0; border-radius: 0 8px 8px 0; }}
                        .warning-text {{ color: #FF6044; font-weight: bold; margin: 0; }}
                        .footer {{ margin-top: 40px; font-size: 13px; color: #888888; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 20px; }}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="logo">HIRE<span class="logo-accent">TRACK</span></div>
                        <div class="content">
                            <p>Hello {user.username},</p>
                            <p>We received a request to reset your password for your HireTrack account. If you made this request, please click the button below to securely create a new password:</p>
                            <div class="button-container">
                                <a href="{reset_link}" class="btn">Reset My Password</a>
                            </div>
                            <div class="warning-box">
                                <p class="warning-text">⚠️ SECURITY ALERT: This link is only valid for exactly 15 minutes.</p>
                            </div>
                            <p style="font-size: 14px; color: #a3a3a3;">If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                        </div>
                        <div class="footer">
                            &copy; 2026 HireTrack Inc. All rights reserved.<br>
                            Secure automated message generated by HireTrack Security Systems.
                        </div>
                    </div>
                </body>
                </html>
                """
                payload = {
                    "sender": {"name": "HireTrack Support", "email": "support.hiretrack@gmail.com"},
                    "to": [{"email": user.email}],
                    "subject": "HireTrack Password Reset",
                    "htmlContent": html_template
                }
                
                try:
                    response = requests.post(brevo_url, json=payload, headers=headers)
                    if response.status_code not in [200, 201, 202]:
                        return JsonResponse({"error": f"Brevo API blocked the request. Status: {response.status_code}. Details: {response.text}"}, status=500)
                except Exception as brevo_e:
                    return JsonResponse({"error": f"Brevo Network Error: {str(brevo_e)}"}, status=500)
            # Always return success to prevent email enumeration (security best practice)
            return JsonResponse({"message": "If an account with that email exists, a password reset link has been sent."})
        except Exception as e:
            return JsonResponse({"error": "An unexpected error occurred. Please try again later."}, status=500)
    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def reset_password_api(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            uidb64 = data.get("uidb64")
            token = data.get("token")
            new_password = data.get("password")
            
            if not all([uidb64, token, new_password]):
                return JsonResponse({"error": "Missing parameters"}, status=400)
                
            try:
                uid = force_str(urlsafe_base64_decode(uidb64))
                user = User.objects.get(pk=uid)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                user = None
                
            if user is not None and default_token_generator.check_token(user, token):
                user.set_password(new_password)
                user.save()
                return JsonResponse({"message": "Password has been securely reset. You can now log in."})
            else:
                return JsonResponse({"error": "The reset link is invalid or has expired."}, status=400)
        except Exception as e:
            return JsonResponse({"error": "An unexpected error occurred. Please try again later."}, status=500)
    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def contact_support_api(request):
    if is_ratelimited(request, group='contact_api', key='ip', rate='3/m', increment=True):
        return JsonResponse({"error": "Too many attempts. Please try again later."}, status=429)
        
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            name = data.get("name", "").strip()
            email = data.get("email", "").strip()
            subject = data.get("subject", "").strip()
            message = data.get("message", "").strip()
            
            if not all([name, email, subject, message]):
                return JsonResponse({"error": "All fields are required"}, status=400)
                
            full_subject = f"Help Center Request: {subject}"
            full_message = f"New Support Ticket from HireTrack Help Center:\n\nName: {name}\nEmail: {email}\n\nMessage:\n{message}"
            
            resend.Emails.send({
                "from": "HireTrack Support <onboarding@resend.dev>",
                "to": "support.hiretrack@gmail.com",
                "subject": full_subject,
                "text": full_message
            })
            return JsonResponse({"message": "Your message has been sent successfully. We will get back to you soon!"})
        except Exception as e:
            return JsonResponse({"error": "An unexpected error occurred. Please try again later."}, status=500)
    return JsonResponse({"error": "Method not allowed"}, status=405)



def get_jobs_api(request):
    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    jobs = Job.objects.filter(user=user).order_by('-date_applied', '-id')

    data = []

    for job in jobs:
        data.append({
             
    "id": job.id,
    "jobTitle": job.role,
    "company": job.company,
    "jobId": job.job_id,
    "platform": job.platform,
    "location": job.location,
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

    refs = Referral.objects.filter(user=user).order_by('-date', '-id')

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
    job.location = data.get("location", job.location)
    job.salary_range = data.get("salaryRange", job.salary_range)
    job.date_applied = data.get("dateApplied") or job.date_applied
    job.status = data.get("status", job.status)
    job.job_description = data.get("jd", job.job_description)
    job.notes = data.get("notes", job.notes)
    if request.POST.get("remove_resume") == "true":
        if job.resume_file:
            job.resume_file.delete(save=False)
        job.resume_file = None
    elif request.FILES.get("resume_file"):
        job.resume_file = request.FILES["resume_file"]

    if request.POST.get("remove_cover_letter") == "true":
        if job.cover_letter_file:
            job.cover_letter_file.delete(save=False)
        job.cover_letter_file = None
    elif request.FILES.get("cover_letter_file"):
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
    if is_ratelimited(request, group='change_pwd_api', key='ip', rate='5/m', increment=True):
        return JsonResponse({"error": "Too many attempts. Please try again later."}, status=429)

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

    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    uploaded_text, warnings = read_uploaded_text(request.FILES.get("resume_file"))
    resume_text = request.POST.get("resume", "") + "\n" + uploaded_text
    jd_text = request.POST.get("job_description", "")

    if len(compact_text(resume_text)) < 200:
        warnings.append("Very little resume text detected. Paste your resume text or upload a text-selectable PDF for accurate scoring.")

    # Use AI-powered analysis (real backend, like Jobscan)
    analysis = ai_ats_analysis(resume_text, jd_text)
    analysis["warnings"] = warnings
    analysis["resume_chars"] = len(compact_text(resume_text))
    return JsonResponse(analysis)


def ai_ats_analysis(resume_text, jd_text):
    """
    Pure AI Deep Sectional Analysis Engine.
    No manual lists, no hardcoded keywords. 100% Dynamic Intelligence.
    """
    from groq import Groq
    import json as _json
    import re as _re
    from django.conf import settings

    if not settings.GROQ_API_KEY:
        # Emergency fallback if key is missing
        return ats_analysis(resume_text, jd_text)

    client = Groq(api_key=settings.GROQ_API_KEY.strip())
    
    # 1. Clean Inputs
    clean_resume = _re.sub(r'Envelope\s*', '', resume_text, flags=_re.IGNORECASE)
    
    # 2. The "Elite ATS Evaluator" Prompt
    system_msg = (
        "You are an elite ATS resume evaluator, senior technical recruiter, and hiring strategist. "
        "Your task is to perform a deep ATS-style resume analysis against a provided job description. "
        "You must think like: - an Applicant Tracking System, - a technical recruiter, - and a hiring manager simultaneously. "
        "ANALYSIS GOALS: - Evaluate resume relevance against the JD. - Simulate ATS keyword matching. - Analyze technical skill alignment. "
        "- Evaluate resume quality and recruiter readability. - Detect missing critical requirements. - Assess seniority alignment. "
        "- Assess project impact and business value. - Generate actionable improvements. "
        "SCORING METHODOLOGY: "
        "1. Keyword Match (0-50): Evaluate exact technical keyword matches, role terminology, frameworks, platforms, tooling, domain language, ATS relevance. "
        "2. Skill Alignment (0-30): Evaluate technical stack overlap, backend/frontend/cloud/database alignment, architecture relevance, engineering depth, tooling relevance. "
        "3. Format & Readability (0-10): Evaluate section clarity, organization, ATS readability, formatting consistency, professional structure, clarity of experience descriptions. "
        "4. Impact & Metrics (0-10): Evaluate quantified achievements, measurable outcomes, business impact, scalability mentions, optimization improvements, ownership indicators. "
        "IMPORTANT ANALYSIS RULES: - Never hallucinate resume content. - Never invent missing skills or experience. "
        "- Distinguish between: critical missing requirements, optional missing requirements. - Prioritize skills mentioned multiple times in the JD. "
        "- Prioritize required technologies over preferred technologies. - Evaluate project quality, not just keyword presence. "
        "- Penalize keyword stuffing without contextual usage. - Evaluate whether the candidate demonstrates practical application of skills. "
        "- Consider modern ATS expectations and recruiter standards. "
        "SECTION DISCOVERY: Dynamically detect all logical resume sections using the candidate’s original section names whenever possible. "
        "OUTPUT RULES: - Return ONLY valid raw JSON. - No markdown. - No explanations outside JSON. - No trailing commas. - No comments. "
        "- Ensure all scores are integers. - Ensure arrays are always returned even if empty. "
        "QUALITY STANDARD: The analysis should feel like it came from a premium AI recruiting platform used by serious recruiters and hiring teams."
    )

    user_msg = (
        f"Perform a deep ATS resume audit against the provided job description.\n\n"
        f"JOB DESCRIPTION:\n{jd_text[:5000]}\n\n"
        f"RESUME:\n{clean_resume[:7000]}\n\n"
        "TASKS:\n"
        "1. Analyze ATS keyword compatibility.\n"
        "2. Evaluate technical skill alignment.\n"
        "3. Detect missing critical technologies or qualifications.\n"
        "4. Evaluate recruiter readability and formatting quality.\n"
        "5. Assess project quality and measurable impact.\n"
        "6. Analyze seniority and role alignment.\n"
        "7. Detect weak resume sections.\n"
        "8. Generate realistic ATS scoring.\n"
        "9. Generate actionable improvement recommendations.\n\n"
        "RETURN THIS EXACT JSON STRUCTURE:\n"
        "{\n"
        '  "overall_score": 0,\n'
        '  "score_summary": "Short professional summary of overall ATS strength",\n'
        '  "breakdown": {\n'
        '    "keyword_match": 0,\n'
        '    "skill_alignment": 0,\n'
        '    "format_quality": 0,\n'
        '    "impact_metrics": 0\n'
        '  },\n'
        '  "matched_skills": [],\n'
        '  "missing_skills": [],\n'
        '  "critical_missing_skills": [],\n'
        '  "matched_keywords": [],\n'
        '  "missing_keywords": [],\n'
        '  "experience_analysis": {\n'
        '    "seniority_match": "",\n'
        '    "title_alignment": "",\n'
        '    "industry_relevance": "",\n'
        '    "technical_depth": ""\n'
        '  },\n'
        '  "ats_risk_factors": [\n'
        '    {\n'
        '      "issue": "",\n'
        '      "severity": "high/medium/low",\n'
        '      "explanation": ""\n'
        '    }\n'
        '  ],\n'
        '  "detected_sections": [\n'
        '    {\n'
        '      "name": "",\n'
        '      "type": "",\n'
        '      "status": "strong/average/weak",\n'
        '      "score": 0,\n'
        '      "feedback": ""\n'
        '    }\n'
        '  ],\n'
        '  "project_analysis": {\n'
        '    "strengths": [],\n'
        '    "weaknesses": [],\n'
        '    "impact_assessment": ""\n'
        '  },\n'
        '  "keyword_optimization_tips": [],\n'
        '  "top_strengths": [],\n'
        '  "improvement_plan": [\n'
        '    {\n'
        '      "priority": "high/medium/low",\n'
        '      "problem": "",\n'
        '      "recommendation": "",\n'
        '      "expected_impact": ""\n'
        '    }\n'
        '  ],\n'
        '  "final_recruiter_assessment": ""\n'
        "}\n"
        "Return ONLY valid raw JSON."
    )

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_msg}
            ],
            response_format={"type": "json_object"},
            temperature=0.2,
        )
        ai_data = _json.loads(completion.choices[0].message.content)

        if ai_data:
            safe_l = lambda v: v if isinstance(v, list) else []
            safe_s = lambda v: str(v).strip() if v else ""
            
            return {
                "ai_powered":          True,
                "score":               ai_data.get("overall_score", 0),
                "score_summary":       ai_data.get("score_summary", ""),
                "keyword_match_score": ai_data.get("breakdown", {}).get("keyword_match", 0),
                "skill_match_score":   ai_data.get("breakdown", {}).get("skill_alignment", 0),
                "format_score":        ai_data.get("breakdown", {}).get("format_quality", 0),
                "impact_score":        ai_data.get("breakdown", {}).get("impact_metrics", 0),
                
                "detected_sections":   safe_l(ai_data.get("detected_sections")),
                "ats_risk_factors":    safe_l(ai_data.get("ats_risk_factors")),
                "improvement_plan":    safe_l(ai_data.get("improvement_plan")),
                "project_analysis":    ai_data.get("project_analysis", {}),
                "experience_analysis": ai_data.get("experience_analysis", {}),
                
                "matched_skills":          safe_l(ai_data.get("matched_skills")),
                "missing_skills":          safe_l(ai_data.get("missing_skills")),
                "critical_missing_skills": safe_l(ai_data.get("critical_missing_skills")),
                "matched_keywords":        safe_l(ai_data.get("matched_keywords")),
                "missing_keywords":        safe_l(ai_data.get("missing_keywords")),
                "keyword_optimization":    safe_l(ai_data.get("keyword_optimization_tips")),
                "top_strengths":           safe_l(ai_data.get("top_strengths")),
                
                "final_assessment": safe_s(ai_data.get("final_recruiter_assessment")),
                "suggestions":      [f"{p.get('problem')}: {p.get('recommendation')}" for p in safe_l(ai_data.get("improvement_plan"))],
            }
    except Exception as e:
        print(f"DEBUG: Deep AI Audit failed: {e}")

    # Final fallback to base regex if AI is down
    return ats_analysis(resume_text, jd_text)



@csrf_exempt
def generate_cover_letter_api(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    uploaded_text, warnings = read_uploaded_text(request.FILES.get("resume_file"))
    resume_text = request.POST.get("resume", "") + "\n" + uploaded_text
    jd_text = request.POST.get("job_description", "")
    # Get user profile for frontend preview
    profile_data = {}
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

    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    import json
    try:
        data = json.loads(request.body)
    except:
        data = request.POST

    text = data.get("text", "")
    template_id = data.get("template_id", "1")
    
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

    jobs = Job.objects.filter(user=user).order_by("-date_applied", "-id")

    items = []
    for job in jobs:
        has_resume = bool(job.resume_file and job.resume_file.name)
        has_cover = bool(job.cover_letter_file and job.cover_letter_file.name)

        # Only include jobs that have at least one document uploaded
        if not has_resume and not has_cover:
            continue

        items.append({
            "id": job.id,
            "jobTitle": job.role,
            "company": job.company,
            "dateApplied": str(job.date_applied) if job.date_applied else None,
            "resumeFile": job.resume_file.url if has_resume else None,
            "coverLetterFile": job.cover_letter_file.url if has_cover else None,
            "resumePreview": f"/api/job/document/{job.id}/resume/?inline=true" if has_resume else None,
            "resumeDownload": f"/api/job/document/{job.id}/resume/" if has_resume else None,
            "coverLetterPreview": f"/api/job/document/{job.id}/cover-letter/?inline=true" if has_cover else None,
            "coverLetterDownload": f"/api/job/document/{job.id}/cover-letter/" if has_cover else None,
        })

    return JsonResponse({"items": items})


def serve_db_media(request, path):
    import mimetypes
    from django.conf import settings
    from tracker.models import DatabaseFile
    try:
        normalized_name = path.replace("\\", "/")
        db_file = DatabaseFile.objects.get(name=normalized_name)
        
        content_type, _ = mimetypes.guess_type(normalized_name)
        if not content_type:
            content_type = 'application/pdf' if normalized_name.lower().endswith('.pdf') else 'application/octet-stream'
            
        response = HttpResponse(db_file.content, content_type=content_type)
        response['Content-Length'] = len(db_file.content)
        return response
    except DatabaseFile.DoesNotExist:
        # Fallback to local files if any exist (e.g. for developer convenience)
        local_path = os.path.join(settings.MEDIA_ROOT, path)
        if os.path.exists(local_path):
            with open(local_path, 'rb') as f:
                content_type, _ = mimetypes.guess_type(local_path)
                return HttpResponse(f.read(), content_type=content_type or 'application/octet-stream')
        raise Http404("File not found")


def job_document_download_api(request, id, kind):
    import mimetypes
    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    job = get_object_or_404(Job, id=id, user=user)
    document = job.resume_file if kind == "resume" else job.cover_letter_file
    if not document or not document.name:
        raise Http404("Document not found")

    inline = request.GET.get("inline", "false").lower() == "true"
    filename = document.name.split("/")[-1]

    # Guess correct MIME type to allow direct inline preview in browser
    content_type, _ = mimetypes.guess_type(document.name)
    if not content_type:
        content_type = "application/pdf" if filename.lower().endswith(".pdf") else "application/octet-stream"

    try:
        file_obj = document.open("rb")
    except (FileNotFoundError, OSError):
        raise Http404("The requested file was not found on the server or database.")

    response = FileResponse(file_obj, content_type=content_type)
    if inline:
        # Serve inline so the browser opens it in a new tab
        response["Content-Disposition"] = f'inline; filename="{filename}"'
    else:
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
    return response


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
    if not active_days:
        return 0
    
    # Filter out any None values
    active_days = {d for d in active_days if d is not None}
    if not active_days:
        return 0

    last_active_day = max(active_days)
    days_since_last_activity = (date.today() - last_active_day).days
    
    # Snapchat-style: If user goes more than 24 hours (a full calendar day) without an action, streak resets to 0.
    # Practically, this means if they applied yesterday (1 day ago) or today (0 days ago), the streak is maintained.
    # If they last applied 2 or more days ago, the streak resets.
    if days_since_last_activity > 1:
        return 0
        
    current = last_active_day
    streak = 0
    while current in active_days:
        streak += 1
        current = current - timedelta(days=1)
    return streak


def earned_badges(streak):
    milestones = [25, 50, 100, 150, 200]
    return [day for day in milestones if streak >= day]


def notifications_api(request):
    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    today = date.today()

    # 🔥 JOB → 5 days
    job_alert_date = today - timedelta(days=5)
    jobs = Job.objects.filter(user=user, date_applied__lte=job_alert_date, notification_dismissed=False)

    # 🔥 REFERRAL → 1 day
    ref_alert_date = today - timedelta(days=1)
    refs = Referral.objects.filter(user=user, date__lte=ref_alert_date, notification_dismissed=False)

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

    # Sort notifications by date (newest first) and then by id
    data.sort(key=lambda x: (x["date"], x["id"]), reverse=True)

    return JsonResponse(data, safe=False)


@csrf_exempt
def get_notes_api(request):
    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    from .models import Scribble
    notes = Scribble.objects.filter(user=user).order_by("-updated_at")
    data = []
    for n in notes:
        data.append({
            "id": n.id,
            "title": n.title,
            "content": n.content,
            "color": n.color,
            "font_family": n.font_family,
            "font_size": n.font_size,
            "updated_at": n.updated_at.isoformat() if n.updated_at else "",
        })
    return JsonResponse(data, safe=False)


@csrf_exempt
def add_note_api(request):
    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    from .models import Scribble
    note = Scribble.objects.create(
        user=user,
        title="",
        content="",
        color="#FF6044",
        font_family="Inter",
        font_size="md"
    )
    return JsonResponse({
        "id": note.id,
        "title": note.title,
        "content": note.content,
        "color": note.color,
        "font_family": note.font_family,
        "font_size": note.font_size,
        "updated_at": note.updated_at.isoformat() if note.updated_at else "",
    })


@csrf_exempt
def update_note_api(request, id):
    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    import json as _json
    from .models import Scribble
    note = Scribble.objects.filter(user=user, id=id).first()
    if not note:
        return JsonResponse({"error": "Note not found"}, status=404)

    # CRITICAL: For multipart/form-data (file uploads), we must use request.POST
    # NEVER call request.body before request.POST/FILES on multipart — it consumes the stream
    content_type = request.content_type or ""
    if "multipart/form-data" in content_type:
        body = request.POST
    else:
        try:
            body = _json.loads(request.body)
        except Exception:
            body = request.POST

    note.title = body.get("title", note.title)
    note.content = body.get("content", note.content)
    note.color = body.get("color", note.color)
    note.font_family = body.get("font_family", note.font_family)
    note.font_size = body.get("font_size", note.font_size)
    note.save()

    return JsonResponse({
        "status": "Success",
        "id": note.id,
        "title": note.title,
        "content": note.content,
        "color": note.color,
        "font_family": note.font_family,
        "font_size": note.font_size,
        "updated_at": note.updated_at.isoformat() if note.updated_at else "",
    })


@csrf_exempt
def delete_note_api(request, id):
    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    from .models import Scribble
    note = Scribble.objects.filter(user=user, id=id).first()
    if not note:
        return JsonResponse({"error": "Note not found"}, status=404)

    note.delete()
    return JsonResponse({"status": "Success"})


@csrf_exempt
def delete_notifications_api(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    
    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    try:
        data = json.loads(request.body)
        job_ids = data.get("job_ids", [])
        referral_ids = data.get("referral_ids", [])

        if job_ids:
            Job.objects.filter(user=user, id__in=job_ids).update(notification_dismissed=True)
        if referral_ids:
            Referral.objects.filter(user=user, id__in=referral_ids).update(notification_dismissed=True)

        return JsonResponse({"status": "success"})
    except Exception as e:
        return JsonResponse({"error": "An unexpected error occurred. Please try again later."}, status=500)


@csrf_exempt
def verify_otp_api(request):
    if is_ratelimited(request, group='verify_otp', key='ip', rate='10/m', increment=True):
        return JsonResponse({"error": "Too many attempts. Please try again later."}, status=429)

    if request.method == 'POST':
        import json
        from django.utils import timezone
        from datetime import timedelta
        from django.contrib.auth import login
        from .models import OTPVerification
        try:
            data = json.loads(request.body)
            email = data.get('email', '').strip().lower()
            otp = data.get('otp', '').strip()

            if not email or not otp:
                return JsonResponse({"error": "Email and OTP are required"}, status=400)

            user = User.objects.filter(email=email).first()
            if not user:
                return JsonResponse({"error": "User not found"}, status=404)

            verification = OTPVerification.objects.filter(user=user).first()
            if not verification:
                return JsonResponse({"error": "No pending verification found"}, status=400)

            if verification.otp != otp:
                return JsonResponse({"error": "Invalid OTP"}, status=400)

            if timezone.now() - verification.created_at > timedelta(minutes=5):
                return JsonResponse({"error": "OTP has expired. Please resend."}, status=400)

            # Success
            user.is_active = True
            user.save()
            verification.delete()
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')

            # Send welcome onboarding email via Brevo in background
            import threading
            referer = request.META.get('HTTP_REFERER', '')
            if referer and referer.startswith('http://localhost:3000'):
                frontend_url = 'http://localhost:3000'
            else:
                frontend_url = 'https://hiretrack.onrender.com'

            subject = "Welcome to HireTrack! 🚀"
            
            html_message = f"""
            <div style="font-family: Arial, sans-serif; background-color: #0A0A0A; color: #FFFFFF; padding: 40px 20px; line-height: 1.6;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #121313; border: 1px solid rgba(255,255,255,0.1); padding: 30px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                    <div style="font-size: 32px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 30px; color: #FFFFFF; font-family: 'Inter', Arial, sans-serif;">HIRE<span style="color: #FF6044;">TRACK</span></div>
                    
                    <p style="font-size: 16px;">Hi <strong style="color: #FF6044;">{user.username}</strong>,</p>
                    
                    <p style="font-size: 16px; color: #D1D5DB;">Your email has been verified successfully! Welcome to HireTrack. I believe you are here because you have recently started your job hunt, or you are getting ready to take the next big step in your career. Finding the right job can be a chaotic, exhausting, and overwhelming process. I know exactly how that feels.</p>
                    
                    <p style="font-size: 16px; color: #D1D5DB;">That is exactly why I built this platform. I’m Shinu Cherian, the developer and founder of HireTrack. My goal was to replace messy spreadsheets with a streamlined, intelligent system that gives you an unfair advantage in today's highly competitive job market.</p>
                    
                    <h3 style="color: #FFFFFF; margin-top: 30px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">Here is how HireTrack supercharges your job hunt:</h3>
                    
                    <div style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                        <h4 style="color: #FF6044; margin-top: 0; margin-bottom: 5px; font-size: 16px;">Job Tracking & Document Vault</h4>
                        <p style="margin: 0; color: #9CA3AF; font-size: 14px;">Log your applications and securely store the exact resume, cover letter, and Job Description (JD) you used for each role. Never lose track of what you submitted.</p>
                    </div>

                    <div style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                        <h4 style="color: #FF6044; margin-top: 0; margin-bottom: 5px; font-size: 16px;">Referral Management</h4>
                        <p style="margin: 0; color: #9CA3AF; font-size: 14px;">Keep tabs on your network. Track every referral request—who you asked, the company, and their response status.</p>
                    </div>

                    <div style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                        <h4 style="color: #FF6044; margin-top: 0; margin-bottom: 5px; font-size: 16px;">Career Roadmap</h4>
                        <p style="margin: 0; color: #9CA3AF; font-size: 14px;">Plan your long-term vision. Set milestones, track your upskilling progress, and stay focused on your ultimate career goals.</p>
                    </div>

                    <div style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                        <h4 style="color: #FF6044; margin-top: 0; margin-bottom: 5px; font-size: 16px;">Unified Dashboard</h4>
                        <p style="margin: 0; color: #9CA3AF; font-size: 14px;">Get a crystal-clear, birds-eye view of your entire job hunt progress. Know exactly where you stand.</p>
                    </div>

                    <div style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                        <h4 style="color: #FF6044; margin-top: 0; margin-bottom: 5px; font-size: 16px;">Activity Streaks & Heated Blocks</h4>
                        <p style="margin: 0; color: #9CA3AF; font-size: 14px;">Build momentum! Watch your activity grid heat up with our GitHub-style contribution blocks as you consistently apply to jobs.</p>
                    </div>

                    <div style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                        <h4 style="color: #FF6044; margin-top: 0; margin-bottom: 5px; font-size: 16px;">Scribbles</h4>
                        <p style="margin: 0; color: #9CA3AF; font-size: 14px;">A dedicated, distraction-free space to quickly jot down interview notes, thoughts, and daily tasks without leaving the platform.</p>
                    </div>

                    <div style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                        <h4 style="color: #FF6044; margin-top: 0; margin-bottom: 5px; font-size: 16px;">AI Tools & Chrome Extension</h4>
                        <p style="margin: 0; color: #9CA3AF; font-size: 14px;">Analyze your resumes for ATS, generate smart cover letters in a click, and save jobs directly from LinkedIn without any manual copy-pasting.</p>
                    </div>
                    
                    <p style="font-size: 16px; color: #D1D5DB; margin-bottom: 30px;">Your job hunt doesn't have to be a mess anymore. We've got everything organized for you.</p>
                    
                    <div style="text-align: center; margin-top: 40px; margin-bottom: 40px;">
                        <a href="{frontend_url}" style="background-color: #FF6044; color: #121313; padding: 16px 32px; text-decoration: none; font-weight: 900; font-size: 16px; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">Open HireTrack Dashboard</a>
                    </div>
                    
                    <p style="font-size: 16px; color: #D1D5DB;">Enjoy your job hunt journey with HireTrack! If you have any feedback or ideas, I'd love to hear them.</p>
                    
                    <p style="font-size: 16px; color: #9CA3AF; margin-top: 30px;">
                         Best,<br>
                         <strong style="color: #FFFFFF;">Shinu Cherian</strong><br>
                         Founder, HireTrack
                    </p>
                </div>
            </div>
            """
            plain_message = "Welcome to HireTrack! Your email has been verified successfully. Open the app to view your dashboard."
            
            threading.Thread(
                target=lambda: send_email_via_brevo(email, subject, html_message, plain_message)
            ).start()

            return JsonResponse({"message": "Email verified successfully!"})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid payload"}, status=400)

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def resend_otp_api(request):
    if is_ratelimited(request, group='resend_otp', key='ip', rate='3/m', increment=True):
        return JsonResponse({"error": "Too many attempts. Please try again later."}, status=429)

    if request.method == 'POST':
        import json
        import random
        from django.contrib.auth.models import User
        from .models import OTPVerification
        import threading
        from django.core.mail import send_mail
        from django.conf import settings

        try:
            data = json.loads(request.body)
            email = data.get('email', '').strip().lower()

            if not email:
                return JsonResponse({"error": "Email is required"}, status=400)

            user = User.objects.filter(email=email).first()
            if not user:
                return JsonResponse({"error": "User not found"}, status=404)

            if user.is_active:
                return JsonResponse({"error": "User is already verified"}, status=400)

            otp = str(random.randint(100000, 999999))
            
            # Delete old OTPs and create new one
            OTPVerification.objects.filter(user=user).delete()
            OTPVerification.objects.create(user=user, otp=otp)

            # Background Email Send
            referer = request.META.get('HTTP_REFERER', '')
            if referer and referer.startswith('http://localhost:3000'):
                frontend_url = 'http://localhost:3000'
            else:
                frontend_url = 'https://hiretrack.onrender.com'
            
            def send_otp_email_task(user_email, username, frontend_url, otp_code):
                subject = "Your HireTrack Verification Code 🔐"
                
                html_message = f"""
                <div style="font-family: Arial, sans-serif; background-color: #0A0A0A; color: #FFFFFF; padding: 40px 20px; line-height: 1.6;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #121313; border: 1px solid rgba(255,255,255,0.1); padding: 30px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                        <div style="font-size: 32px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 30px; color: #FFFFFF; font-family: 'Inter', Arial, sans-serif;">HIRE<span style="color: #FF6044;">TRACK</span></div>
                        
                        <p style="font-size: 16px;">Hi <strong style="color: #FF6044;">{username}</strong>,</p>
                        
                        <p style="font-size: 16px; color: #D1D5DB;">Welcome back! Please use the following One-Time Password (OTP) to verify your email address and activate your account. <strong>This code is valid for 5 minutes.</strong></p>
                        
                        <div style="background-color: #FF6044; color: #121313; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                            <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px;">{otp_code}</span>
                        </div>
                        
                        <p style="font-size: 16px; color: #D1D5DB;">Enjoy your job hunt journey with HireTrack!</p>
                    </div>
                </div>
                """
                plain_message = f"Your HireTrack Verification Code is: {otp_code}"
                try:
                    send_email_via_brevo(user_email, subject, html_message, plain_message)
                except Exception as e:
                    print(f"Error sending OTP email: {e}")
            
            threading.Thread(target=send_otp_email_task, args=(email, user.username, frontend_url, otp)).start()

            return JsonResponse({"message": "OTP sent successfully."})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid payload"}, status=400)

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def delete_account_otp_api(request):
    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    if is_ratelimited(request, group='delete_account_otp', key='ip', rate='3/m', increment=True):
        return JsonResponse({"error": "Too many attempts. Please try again later."}, status=429)

    if request.method == 'POST':
        import json
        import random
        from .models import OTPVerification
        import threading
        from django.core.mail import send_mail
        from django.conf import settings

        try:
            data = json.loads(request.body)
            email = data.get('email', '').strip().lower()

            if not email:
                return JsonResponse({"error": "Email is required"}, status=400)
            
            # Security check: Make sure they are trying to delete their OWN account
            db_email = (user.email or "").strip().lower()
            if not db_email:
                # Fallback to profile email if User email is empty
                profile = getattr(user, 'profile', None)
                if profile and profile.email:
                    db_email = profile.email.strip().lower()

            if not db_email:
                return JsonResponse({"error": "No registered email found for this account. Please contact support."}, status=400)

            if email != db_email:
                return JsonResponse({"error": f"Email does not match the logged in account. Your registered email is {db_email}"}, status=400)

            otp = str(random.randint(100000, 999999))
            
            OTPVerification.objects.filter(user=user).delete()
            OTPVerification.objects.create(user=user, otp=otp)

            def send_delete_otp_email_task(user_email, username, otp_code):
                subject = "HireTrack Account Deletion Request ⚠️"
                
                html_message = f"""
                <div style="font-family: Arial, sans-serif; background-color: #0A0A0A; color: #FFFFFF; padding: 40px 20px; line-height: 1.6;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #121313; border: 1px solid rgba(255,255,255,0.1); border-top: 4px solid #ef4444; padding: 30px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                        <div style="font-size: 32px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 30px; color: #FFFFFF; font-family: 'Inter', Arial, sans-serif;">HIRE<span style="color: #FF6044;">TRACK</span></div>
                        <h1 style="color: #ef4444; font-size: 24px; font-weight: 900; letter-spacing: 1px; margin-bottom: 20px; text-transform: uppercase;">ACCOUNT DELETION REQUEST</h1>
                        
                        <p style="font-size: 16px;">Hi <strong style="color: #FF6044;">{username}</strong>,</p>
                        
                        <p style="font-size: 16px; color: #D1D5DB;">We received a request to permanently delete your HireTrack account. If you proceed, <strong>ALL</strong> your data (jobs, referrals, notes, and scribbles) will be wiped instantly and cannot be recovered.</p>
                        
                        <p style="font-size: 16px; color: #D1D5DB;">To confirm deletion, please use this One-Time Password (OTP). <strong>Valid for 5 minutes.</strong></p>
                        
                        <div style="background-color: #ef4444; color: #FFFFFF; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                            <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px;">{otp_code}</span>
                        </div>
                        
                        <p style="font-size: 14px; color: #9CA3AF;">If you did not request this, you can safely ignore this email. Your account is secure.</p>
                    </div>
                </div>
                """
                plain_message = f"Your HireTrack Account Deletion OTP is: {otp_code}"
                try:
                    send_email_via_brevo(user_email, subject, html_message, plain_message)
                except Exception as e:
                    print(f"Error sending deletion OTP email: {e}")
                    raise e
            
            # Run synchronously to catch errors instead of threading
            send_delete_otp_email_task(email, user.username, otp)

            return JsonResponse({"message": "OTP sent to your email."})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid payload"}, status=400)
        except Exception as e:
            return JsonResponse({"error": "An unexpected error occurred. Please try again later."}, status=400)

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def delete_account_confirm_api(request):
    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    if is_ratelimited(request, group='delete_account_confirm', key='ip', rate='5/m', increment=True):
        return JsonResponse({"error": "Too many attempts. Please try again later."}, status=429)

    if request.method == 'POST':
        import json
        from django.utils import timezone
        from datetime import timedelta
        from django.contrib.auth import logout
        from .models import OTPVerification
        try:
            data = json.loads(request.body)
            email = data.get('email', '').strip().lower()
            otp = data.get('otp', '').strip()

            if not email or not otp:
                return JsonResponse({"error": "Email and OTP are required"}, status=400)

            db_email = (user.email or "").strip().lower()
            if not db_email:
                profile = getattr(user, 'profile', None)
                if profile and profile.email:
                    db_email = profile.email.strip().lower()

            if email != db_email:
                return JsonResponse({"error": "Email mismatch"}, status=400)

            verification = OTPVerification.objects.filter(user=user).first()
            if not verification:
                return JsonResponse({"error": "No pending verification found. Request a new OTP."}, status=400)

            if verification.otp != otp:
                return JsonResponse({"error": "Invalid OTP"}, status=400)

            if timezone.now() - verification.created_at > timedelta(minutes=5):
                return JsonResponse({"error": "OTP has expired. Please resend."}, status=400)

            # Verification successful. Delete account.
            user_to_delete = user
            logout(request) # Log them out first
            user_to_delete.delete() # Cascade deletes everything

            return JsonResponse({"message": "Account deleted permanently."})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid payload"}, status=400)
        except Exception as e:
            return JsonResponse({"error": "An unexpected error occurred. Please try again later."}, status=400)

    return JsonResponse({"error": "Method not allowed"}, status=405)
