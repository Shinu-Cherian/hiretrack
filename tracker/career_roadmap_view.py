from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Profile, Education, Experience
import requests as _req
import json as _json
import re as _re

@csrf_exempt
def career_roadmap_api(request):
    """
    Advanced AI Career Intelligence Engine with Zero-Hallucination Policy.
    """
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    if not request.user.is_authenticated:
        return JsonResponse({"error": "Login required"}, status=401)

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

    # 3. THE "PERFECT IN-DEPTH" PROMPT
    system_msg = (
        "You are a Senior Career Strategy Auditor. Your goal is to provide a BRUTALLY HONEST "
        "readiness assessment and roadmap. \n\n"
        "STRICT CONSTRAINTS:\n"
        "1. ZERO HALLUCINATION: Do NOT mention any projects, certifications, or roles the user hasn't listed.\n"
        "2. GAP IDENTIFICATION: If the user lacks experience or projects, EXPLICITLY state this as a weakness.\n"
        "3. REAL-WORLD DATA: Use current 2026 job market trends for the target country.\n"
        "4. FORMAT: Return ONLY a raw JSON object. No markdown. No conversational text."
    )

    user_msg = (
        f"### CANDIDATE PROFILE (The Truth Source):\n"
        f"- Target Role: {target_role} in {country}\n"
        f"- Academic Background: {degree} in {field} (CGPA: {cgpa})\n"
        f"- Declared Skills: {user_skills}\n"
        f"- Real Education History: {', '.join(user_edu) if user_edu else 'NONE PROVIDED'}\n"
        f"- Real Experience/Projects: {'; '.join(user_exp) if user_exp else 'NONE PROVIDED'}\n\n"
        f"### THE TASK:\n"
        f"Perform a deep gap analysis between the Candidate Profile and the requirements for a {target_role} in {country}. "
        f"Generate a 3-month roadmap to bridge this gap. If they have no experience, the roadmap MUST focus on building foundational projects.\n\n"
        f"### REQUIRED JSON STRUCTURE:\n"
        "{\n"
        '  "readiness_score": (int 0-100),\n'
        '  "readiness_reason": "Be specific. Mention their actual skills vs what the role needs. Mention missing projects if none listed.",\n'
        '  "market_demand": "High/Medium/Low",\n'
        '  "market_demand_reason": "Current market state for this role in this country.",\n'
        '  "demand_indicators": [\n'
        '    {"label": "Remote Availability", "value": (0-100)},\n'
        '    {"label": "Salary Growth", "value": (0-100)},\n'
        '    {"label": "Entry-Level Saturation", "value": (0-100)}\n'
        '  ],\n'
        '  "salary_reality": {\n'
        '    "user_expectation": "...",\n'
        '    "market_fresher_avg": "...",\n'
        '    "verdict": "Realistic/Ambitious/Unrealistic",\n'
        '    "tip": "Negotiation tip specific to this country."\n'
        '  },\n'
        '  "skill_priorities": [\n'
        '    {"skill": "...", "priority": "High/Med", "why": "Why this specific skill is needed for this role"}\n'
        '  ],\n'
        '  "certifications": ["Real, specific industry certifications for this path"],\n'
        '  "three_month_roadmap": [\n'
        '    {"month": 1, "focus": "Theme", "tasks": ["Specific learning task 1", "task 2", "task 3"]},\n'
        '    {"month": 2, "focus": "Theme", "tasks": ["Specific building task 1", "task 2"]},\n'
        '    {"month": 3, "focus": "Theme", "tasks": ["Application/Networking task 1", "task 2"]}\n'
        '  ],\n'
        '  "interview_tips": ["...", "...", "..."],\n'
        '  "ai_insights": [\n'
        '    {"headline": "Critical Gap", "detail": "Explain a major missing piece in their profile"},\n'
        '    {"headline": "Market Advantage", "detail": "One thing they have that is good"},\n'
        '    {"headline": "Strategy", "detail": "One key action to take now"}\n'
        '  ],\n'
        '  "google_searches": [\n'
        '    {"label": "Top Companies Hiring...", "query": "..."},\n'
        '    {"label": "Latest Interview Questions for...", "query": "..."}\n'
        '  ]\n'
        "}"
    )

    # 4. Multi-Model Resilience Logic
    ai_data = None
    last_err = ""
    for model in ["mistral-large", "openai", "searchgpt"]:
        try:
            r = _req.post("https://text.pollinations.ai/", json={
                "messages": [{"role":"system","content":system_msg}, {"role":"user","content":user_msg}],
                "model": model, "seed": 42, "jsonMode": True
            }, timeout=70)
            if r.status_code == 200:
                m = _re.search(r'\{[\s\S]+\}', r.text)
                if m:
                    ai_data = _json.loads(m.group(0))
                    if ai_data: break
            else: last_err = f"{model} status {r.status_code}"
        except Exception as e: last_err = str(e)

    if not ai_data:
        return JsonResponse({"error": f"AI Engine Busy ({last_err}). Please try again."}, status=502)

    # 5. Result Sanitization
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
