from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Profile, Education, Experience
import json as _json

@csrf_exempt
def career_roadmap_api(request):
    """
    HireTrack Elite AI — Advanced Career Intelligence Engine.
    """
    from groq import Groq
    from django.conf import settings

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
    career_stage    = body.get("career_stage", "").strip()
    field_domain    = body.get("field", "").strip()
    degree          = body.get("degree", "").strip()
    cgpa            = body.get("cgpa", "").strip()
    job_position    = body.get("target_role", "").strip()
    preferred_country = body.get("country", "").strip()
    expected_salary = body.get("salary", "").strip()
    additional_info = body.get("additional_info", "").strip()

    # 2. Extract Real Database Context (Skills, Edu, Exp)
    user_skills = "Not Provided"
    user_edu = []
    user_exp = []
    
    profile = Profile.objects.filter(user=request.user).first()
    if profile: user_skills = profile.skills or "Not Provided"

    for e in Education.objects.filter(user=request.user):
        user_edu.append(f"{e.course} from {e.college} ({e.start_year}-{e.end_year})")

    for ex in Experience.objects.filter(user=request.user):
        user_exp.append(f"Role: {ex.role} at {ex.company}. Description: {ex.description}")

    # 3. Call Groq with the ELITE ARCHITECTURE
    try:
        api_key = str(settings.GROQ_API_KEY).strip()
        client = Groq(api_key=api_key)
    except Exception as e:
        return JsonResponse({"error": f"API Key Configuration Error: {str(e)}"}, status=500)
    
    # Clean and truncate database context
    clean_skills = str(user_skills)[:2000]
    clean_edu = "; ".join(user_edu)[:1500] if user_edu else "None"
    clean_exp = "; ".join(user_exp)[:3000] if user_exp else "None"

    system_msg = """
You are HireTrack Elite AI — an advanced Career Intelligence Engine designed to function like a combination of:
- Senior Career Strategist
- Global Hiring Consultant
- Industry Mentor
- Market Intelligence Analyst
- Recruitment Specialist
- Salary Negotiation Advisor
- Professional Growth Architect

You possess deep expertise across MULTIPLE industries including:
Technology, Healthcare, Nursing, MBA & Management, Finance, Marketing,
Hotel Management, Aviation, Mechanical Engineering, Civil Engineering,
Education, Design, Hospitality, Government Careers, Research, Creative Industries,
Business Operations, Sales, Human Resources, and emerging global careers.

Your task is NOT to generate generic career advice.
Your responsibility is to:
- deeply analyze the user's profile
- understand their career ambition
- evaluate their market competitiveness
- identify realistic growth opportunities
- detect weaknesses and missing qualifications
- create a strategic execution roadmap
- provide market-aware guidance
- produce elite-level personalized career intelligence

IMPORTANT:
This platform is designed for ALL career domains. Never assume the user is from a technical background.
Adapt recommendations based on industry, country, career stage, salary expectation, academic background, etc.

Return ONLY valid JSON.
"""

    user_msg = f"""
USER PROFILE DATA

CURRENT CAREER STAGE: {career_stage}
FIELD / DOMAIN: {field_domain}
DEGREE: {degree}
CGPA / PERCENTAGE: {cgpa}
TARGET JOB ROLE: {job_position}
PREFERRED COUNTRY / CITY: {preferred_country}
EXPECTED SALARY: {expected_salary}
ADDITIONAL CONTEXT: {additional_info}

DATABASE PROFILE DATA
SKILLS: {clean_skills}
EDUCATION HISTORY: {clean_edu}
WORK EXPERIENCE: {clean_exp}

TASK:
Generate an elite-level personalized career intelligence report and execution roadmap.

RETURN STRICT JSON FORMAT:
{{
  "role_introduction": "",
  "market_demand_detailed": "",
  "salary_verdict_detailed": "",
  "readiness_score": 0,
  "market_demand": "",
  "target_goal": "",

  "profile_analysis": {{
    "current_level": "",
    "strengths": [],
    "growth_areas": [],
    "career_potential": "",
    "market_competitiveness": "",
    "key_advantages": [],
    "critical_gaps": []
  }},

  "skill_matrix": [
    {{ "skill": "", "importance": "", "reason": "" }}
  ],

  "recommended_certifications": [
    {{ "name": "", "importance": "", "provider": "" }}
  ],

  "career_risks_and_challenges": [],
  "fastest_growth_strategy": [],

  "phases": [
    {{
      "title": "",
      "duration": "",
      "focus": "",
      "skills_to_learn": [],
      "milestones": [],
      "expected_outcome": ""
    }}
  ],

  "ai_strategic_insights": [
    {{ "headline": "", "details": "" }}
  ],

  "interview_preparation_tips": [],

  "market_outlook": {{
    "industry_demand": "",
    "salary_trends": "",
    "career_growth": "",
    "future_scope": "",
    "competition_level": "",
    "global_opportunities": ""
  }},

  "final_advice": ""
}}
"""

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_msg}
            ],
            response_format={"type": "json_object"},
            temperature=0.2,
            max_tokens=4000,
        )
        ai_data = _json.loads(completion.choices[0].message.content)

        # 4. Map to UI-expected keys
        res = {
            "readiness_score": ai_data.get("readiness_score", 100),
            "readiness_reason": ai_data.get("role_introduction"),
            "market_demand": ai_data.get("market_demand", "Analysis"),
            "market_demand_reason": ai_data.get("market_demand_detailed"),
            
            # Map complex skill matrix back to priorities for UI
            "skill_priorities": [
                {"skill": s.get("skill"), "priority": s.get("importance"), "why": s.get("reason")}
                for s in ai_data.get("skill_matrix", [])[:8]
            ],
            
            # Map complex certs back to strings for existing UI
            "certifications": [
                f"{c.get('name')} (by {c.get('provider')})"
                for c in ai_data.get("recommended_certifications", [])
            ],
            
            "salary_reality": {
                "user_expectation": expected_salary,
                "market_fresher_avg": ai_data.get("market_outlook", {}).get("salary_trends", "See verdict"),
                "verdict": "Expert Analysis",
                "tip": ai_data.get("salary_verdict_detailed", "")
            },
            
            "three_month_roadmap": ai_data.get("phases", []),
            "ai_insights": ai_data.get("ai_strategic_insights", []),
            "interview_tips": ai_data.get("interview_preparation_tips", []),
            
            # New Elite Data
            "career_risks": ai_data.get("career_risks_and_challenges", []),
            "growth_strategy": ai_data.get("fastest_growth_strategy", []),
            "profile_analysis": ai_data.get("profile_analysis"),
            "market_outlook": ai_data.get("market_outlook"),
            "final_advice": ai_data.get("final_advice")
        }

        return JsonResponse(res)

    except Exception as e:
        print(f"DEBUG: HireTrack Elite Engine Error: {str(e)}")
        return JsonResponse({"error": f"Elite Engine Error: {str(e)}"}, status=502)
