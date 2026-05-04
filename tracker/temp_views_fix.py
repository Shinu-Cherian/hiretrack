def build_cover_letter(resume_text, jd_text):
    import requests
    
    prompt = f"You are a World-Class Technical Career Consultant.\nYour mission is to write a high-fidelity cover letter that mirrors the 'Gold Standard' format.\n\nGOLD STANDARD STRUCTURE (REQUIRED):\n1. RECIPIENT BLOCK:\n   Hiring Manager\n   [Company Name] - [Department/Team Name if found in JD]\n\n2. SUBJECT LINE:\n   Re: [Job Title] - [Team/Department Name]\n\n3. SALUTATION:\n   Dear Hiring Manager,\n\n4. BODY:\n   - PARAGRAPH 1: Specific mention of the role and company. Connect your specific background to the role's intersection (e.g., finance and engineering).\n   - PARAGRAPH 2 (THE 'WHY'): Identify the framing of the role. What is the company looking for? Explain why this level of responsibility excites you.\n   - PARAGRAPH 3 (THE EVIDENCE): Deep-dive into 1-2 major projects. Mention microservices, distributed systems, specific cloud tools (AWS), and the impact of your decisions.\n   - PARAGRAPH 4 (AVAILABILITY): State your location and immediate availability.\n\n5. SIGN-OFF:\n   Yours sincerely,\n   [Candidate Name]\n   [Phone Number]\n\nCONSTRAINTS:\n- ABSOLUTELY NO generic adjectives.\n- Use technical, high-authority language.\n- DO NOT INCLUDE A HEADER (Name/Email) - the template handles that.\n- TOTAL WORD COUNT: Under 300 words.\n\nJD:\n{jd_text}\n\nRESUME:\n{resume_text}"
    
    try:
        data = {
            "messages": [{"role": "user", "content": prompt}],
            "model": "openai"
        }
        res = requests.post("https://text.pollinations.ai/", json=data, timeout=30)
        if res.status_code == 200:
            content = res.text.strip()
            if len(content) > 100:
                return content
    except Exception as e:
        print(f"Error calling AI API: {e}")
        pass

    return "Dear Hiring Manager,\n\nI am writing to apply for the position described. My background in software engineering and project leadership makes me a strong fit for your team.\n\nSincerely,\n[Your Name]"
