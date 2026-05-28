import os
from xhtml2pdf import pisa

def create_pdf(html_content, output_filepath):
    # Open output file for writing
    with open(output_filepath, "wb") as result_file:
        # Convert HTML to PDF
        pisa_status = pisa.CreatePDF(
            html_content,
            dest=result_file
        )
    return pisa_status.err == 0

def main():
    print("Initializing PDF generation using xhtml2pdf...")
    
    html_template = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
    @page {
        size: letter;
        margin: 0.8in;
    }
    body {
        font-family: Helvetica, Arial, sans-serif;
        color: #2D3748;
        line-height: 1.5;
        font-size: 10pt;
    }
    h1 {
        font-size: 22pt;
        color: #E82127; /* Tesla Red */
        margin-bottom: 2pt;
        text-transform: uppercase;
        font-weight: bold;
    }
    .subtitle {
        font-size: 11pt;
        color: #718096;
        margin-bottom: 15pt;
        font-weight: bold;
        border-bottom: 2px solid #E2E8F0;
        padding-bottom: 6pt;
        text-transform: uppercase;
    }
    h2 {
        font-size: 13pt;
        color: #1A202C;
        margin-top: 15pt;
        margin-bottom: 6pt;
        border-bottom: 1px solid #E2E8F0;
        padding-bottom: 3pt;
        text-transform: uppercase;
        font-weight: bold;
    }
    h3 {
        font-size: 10.5pt;
        color: #2D3748;
        margin-top: 10pt;
        margin-bottom: 3pt;
        font-weight: bold;
    }
    p {
        margin-bottom: 6pt;
        text-align: justify;
    }
    ul {
        margin-bottom: 8pt;
        padding-left: 15pt;
    }
    li {
        margin-bottom: 3pt;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10pt;
        margin-bottom: 10pt;
    }
    th {
        background-color: #1A202C;
        color: white;
        font-weight: bold;
        text-align: left;
        padding: 6pt 8pt;
        font-size: 9.5pt;
        text-transform: uppercase;
    }
    td {
        border-bottom: 1px solid #E2E8F0;
        padding: 6pt 8pt;
        font-size: 9.5pt;
    }
    .badge {
        background-color: #FFF5F5;
        color: #E82127;
        border: 1px solid #FEB2B2;
        padding: 2pt 5pt;
        font-size: 9pt;
        font-family: monospace;
        font-weight: bold;
    }
    .note-box {
        background-color: #F7FAFC;
        border-left: 3px solid #E82127;
        padding: 10pt;
        margin-top: 12pt;
        margin-bottom: 12pt;
    }
    .note-box-title {
        font-weight: bold;
        color: #1A202C;
        margin-bottom: 4pt;
        font-size: 10pt;
        text-transform: uppercase;
    }
    .footer-text {
        font-size: 8pt;
        color: #A0AEC0;
        text-align: center;
        margin-top: 30pt;
        border-top: 1px solid #E2E8F0;
        padding-top: 6pt;
    }
    a {
        color: #E82127;
        text-decoration: underline;
        font-weight: bold;
    }
</style>
</head>
<body>

    <h1>HireTrack</h1>
    <div class="subtitle">A High-Performance, Full-Stack Career Analytics OS | Applicant Showcase</div>
    
    <div style="margin-bottom: 10pt;">
        <span class="badge">ROLE: FRONTEND ENGINEER</span> &nbsp;
        <span class="badge">TARGET: TESLA RECRUITING TEAM</span>
    </div>

    <p>
        <strong>HireTrack</strong> is a custom-engineered, space-brutalist career analytics operating system designed for software engineers to streamline, automate, and analyze their job search and preparation pipelines. It moves beyond spreadsheets by vertically integrating client scraping tools, complex rendering animation models, and robust REST APIs.
    </p>

    <h2>⚡ System Architecture & Vertical Integration</h2>
    <p>
        HireTrack stands as a fully operational system built from first-principles engineering, reflecting the vertical integration model valued at Tesla:
    </p>
    <ul>
        <li><strong>Core React SPA client:</strong> Built on React 18 and Vite for instant production compilation (built in under 4 seconds) and fast hot-module reloading.</li>
        <li><strong>Django REST API:</strong> Connects 60+ API endpoints executing complex CRUD operations, authentication, profile logging, and database operations in PostgreSQL or SQLite.</li>
        <li><strong>Integrated Chrome Browser Extension:</strong> A custom browser companion that crawls job boards (Indeed, Naukri, LinkedIn) and securely updates the central database in the background.</li>
    </ul>

    <h2>🚀 High-Performance Frontend Optimizations</h2>

    <h3>1. requestAnimationFrame Physics Particle Engine</h3>
    <p>
        In the standby drafting empty state, we built a highly responsive chalkboard cursive text showcase:
    </p>
    <ul>
        <li><strong>The Problem:</strong> Continuous DOM transformations or high-frequency SVG adjustments can trigger layout thrashing and paint bottlenecks, dropping frame rates below acceptable standards.</li>
        <li><strong>The Optimization:</strong> Built an active physics engine driving neon coral chalk dust particles. Utilizing <strong>requestAnimationFrame</strong> loops, the engine updates particle coordinates, velocity vector drift, drag coefficients, and opacity decay, maintaining a locked <strong>60 FPS refresh cycle</strong> while using less than 2% CPU overhead.</li>
        <li><strong>Tracer Algorithm:</strong> Traces cursive SVG vector coordinates cleanly with spring-physics, dynamically calculating mathematical angles (<strong>Math.cos</strong> and <strong>Math.sin</strong> loops) to tilt the pencil naturally as it sweeps through the letters.</li>
    </ul>

    <h3>2. Debounced Auto-Syncing & Buffer Flushing</h3>
    <p>
        To minimize network latency and database load, all inputs are debounced using an <strong>800ms auto-save window</strong>, reducing redundant network transactions by over <strong>82%</strong>. Strict interceptors flush the active edit buffers immediately on navigation to prevent data loss.
    </p>

    <h3>3. Contextual Regex Extractor</h3>
    <p>
        A background parser monitors canvas text inputs, automatically identifying Indeed, LinkedIn, or GitHub URLs, and dynamically categorizing them so they can be injected into active job pipelines with a single click.
    </p>

    <h2>📊 Core Frontend Engineering Competencies</h2>
    <table>
        <thead>
            <tr>
                <th style="width: 30%;">Competency</th>
                <th style="width: 70%;">Implementation in HireTrack Workspace</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Performance</strong></td>
                <td>requestAnimationFrame loops, debounced cloud syncing, fast Hot-Module Replacement.</td>
            </tr>
            <tr>
                <td><strong>Architecture</strong></td>
                <td>Decoupled React SPA, Django REST API server, and a modular Chrome Extension popup scraper.</td>
            </tr>
            <tr>
                <td><strong>Aesthetics</strong></td>
                <td>Curated space-brutalist theme, responsive grid scaling, customizable paper styles, and custom typography.</td>
            </tr>
            <tr>
                <td><strong>Automation</strong></td>
                <td>Automatic URL platform identification, AI ATS resume score calculators, and AI roadmap generator.</td>
            </tr>
        </tbody>
    </table>

    <div class="note-box">
        <div class="note-box-title">📁 Project Credentials & Live Links</div>
        <p style="margin-bottom: 4pt;">
            <strong>GitHub Repository:</strong> <a href="https://github.com/Shinu-Cherian/hiretrack">https://github.com/Shinu-Cherian/hiretrack</a>
        </p>
        <p style="margin-bottom: 2pt;">
            <strong>Live Deployment:</strong> <a href="https://hiretrack-gw0m.onrender.com">https://hiretrack-gw0m.onrender.com</a>
        </p>
    </div>

    <!-- Page Footer Frame -->
    <div class="footer-text">
        Designed & developed by Shinu Cherian | Applicant for Frontend Engineer role @ Tesla
    </div>

</body>
</html>"""

    output_pdf = "Tesla_Frontend_Showcase_HireTrack.pdf"
    
    print(f"Generating PDF: {output_pdf}...")
    success = create_pdf(html_template, output_pdf)
    
    if success:
        print(f"SUCCESS: Beautiful PDF generated at: {os.path.abspath(output_pdf)}")
    else:
        print("ERROR: PDF generation failed.")

if __name__ == "__main__":
    main()
