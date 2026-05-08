from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Profile, Education, Experience
import requests as _req
import json as _json
import re as _re

@csrf_exempt
def career_roadmap_api(request):
    """
    Advanced AI Career Intelligence Engine powered by Groq.
    """
    from groq import Groq
    from django.conf import settings
    import json as _json
    import re as _re

    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    if not request.user.is_authenticated:
        return JsonResponse({"error": "Login required"}, status=401)

    if not settings.GROQ_API_KEY:
        return JsonResponse({"error": "GROQ_API_KEY is not configured."}, status=500)

    try:
        body = _json.loads(request.body)
    except Exception:
        return JsonResponse({"error": "Invalid JSON body"}, status=400)

    # 1. Capture User Context
    field       = body.get("field", "").strip()
    degree      = body.get("degree", "").strip()
    cgpa        = body.get("cgpa", "").strip()
    target_role = body.get("target_role", "").strip()
    country     = body.get("country", "").strip()
    salary      = body.get("salary", "").strip()

    if not all([field, degree, cgpa, target_role, country, salary]):
        return JsonResponse({"error": "All fields are required."}, status=400)

    # 2. Extract Real Database Context
    user_skills = "Not Provided"
    user_edu = []
    user_exp = []
    
    profile = Profile.objects.filter(user=request.user).first()
    if profile: user_skills = profile.skills or "Not Provided"

    for e in Education.objects.filter(user=request.user):
        user_edu.append(f"{e.course} from {e.college} ({e.start_year}-{e.end_year})")

    for ex in Experience.objects.filter(user=request.user):
        user_exp.append(f"Role: {ex.role} at {ex.company}. Description: {ex.description}")

    # 3. Call Groq
    client = Groq(api_key=settings.GROQ_API_KEY)
    
    system_msg = (
        "You are a Senior Career Strategy Auditor. Return ONLY a raw JSON object. "
        "STRICT: ZERO HALLUCINATION. Only use provided skills/projects."
    )

    user_msg = (
        f"Analyze Career Path for {target_role} in {country}.\n"
        f"Profile: {degree} in {field}, CGPA: {cgpa}. Skills: {user_skills}. "
        f"Experience: {'; '.join(user_exp) if user_exp else 'None'}.\n\n"
        "Return exactly this JSON:\n"
        "{\n"
        '  "readiness_score": (int),\n'
        '  "readiness_reason": "...",\n'
        '  "market_demand": "High/Medium/Low",\n'
        '  "market_demand_reason": "...",\n'
        '  "demand_indicators": [{"label": "...", "value": (int)}],\n'
        '  "salary_reality": {"user_expectation": "...", "market_fresher_avg": "...", "verdict": "...", "tip": "..."},\n'
        '  "skill_priorities": [{"skill": "...", "priority": "High/Med", "why": "..."}],\n'
        '  "certifications": ["..."],\n'
        '  "three_month_roadmap": [{"month": (int), "focus": "...", "tasks": ["..."]}],\n'
        '  "interview_tips": ["..."],\n'
        '  "ai_insights": [{"headline": "...", "detail": "..."}],\n'
        '  "google_searches": [{"label": "...", "query": "..."}]\n'
        "}"
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

        # 4. Result Sanitization
        safe_l = lambda v: v if isinstance(v, list) else []
        safe_s = lambda v: str(v).strip() if v else ""
        safe_i = lambda v, d=60: int(v) if str(v).isdigit() else d

        res = {
            "readiness_score": safe_i(ai_data.get("readiness_score")),
            "readiness_reason": safe_s(ai_data.get("readiness_reason")),
            "market_demand": safe_s(ai_data.get("market_demand")) or "Medium",
            "market_demand_reason": safe_s(ai_data.get("market_demand_reason")),
            "demand_indicators": safe_l(ai_data.get("demand_indicators")),
            "salary_reality": ai_data.get("salary_reality") or {},
            "skill_priorities": safe_l(ai_data.get("skill_priorities")),
            "recommended_skills": [s.get("skill", s) if isinstance(s, dict) else s for s in safe_l(ai_data.get("skill_priorities"))],
            "certifications": safe_l(ai_data.get("certifications")),
            "three_month_roadmap": safe_l(ai_data.get("three_month_roadmap")),
            "interview_tips": safe_l(ai_data.get("interview_tips")),
            "ai_insights": safe_l(ai_data.get("ai_insights")),
            "google_searches": safe_l(ai_data.get("google_searches")),
        }
        return JsonResponse(res)

    except Exception as e:
        print(f"DEBUG: Groq Roadmap call failed: {e}")
        return JsonResponse({"error": "AI Engine Busy. Please try again."}, status=502)
