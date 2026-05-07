# 🗂️ HireTrack — Career Management Platform

> A full-stack, private workspace to track job applications, referrals, resumes, cover letters, and career progress — built for serious job seekers.

[![Django](https://img.shields.io/badge/Backend-Django%205.2-092E20?style=flat&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38BDF8?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat)](LICENSE)

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Models](#-database-models)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Running the App](#-running-the-app)
- [Browser Extension](#-browser-extension)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [Author](#-author)

---

## 🌟 Overview

**HireTrack** is a production-grade, full-stack web application designed to replace messy spreadsheets and scattered notes with a clean, centralized career management workspace.

Every job application, referral outreach, resume version, cover letter, follow-up deadline, and career milestone lives in one private, authenticated workspace — visible only to the logged-in user.

The platform combines practical job-search tooling with AI-powered features (ATS resume analysis, cover letter generation, career roadmap planning) in a modern "Dark Nebula" SaaS interface.

---

## ✨ Features

### 🔐 Authentication & Privacy
- Session-based authentication with Django's built-in auth system
- Full workspace isolation — each user sees **only their own data**
- Login, Signup, Logout, and password change support
- Profile management with photo upload

### 📋 Job Application Tracker
- Log applications with: company, role, job ID, platform, salary range, status, notes, follow-up date
- Attach resume and cover letter files per application
- Filter, search, and sort applications
- Star/favourite important applications
- Status tracking: `Applied → Pending → Selected → Rejected`
- Inline editing from the list view

### 🤝 Referral Manager
- Track referral outreach with contact name, company, email, LinkedIn URL
- Status tracking: `Pending → Replied → No Response`
- Follow-up date reminders and starred referrals
- Inline editing and deletion

### 📊 Dashboard Analytics
- Visual pipeline overview — applications by status, referral stats
- Streak tracker — consecutive daily activity monitoring
- Follow-up alerts — items due soon surfaced automatically
- Real-time stats across the entire workspace

### 🔔 Notifications System
- Smart notifications for follow-up deadlines, status changes, and milestones
- Unread indicator in the header
- Mark-as-read with localStorage persistence

### ⭐ Starred Items
- Unified starred view across both jobs and referrals
- Quick-access to high-priority opportunities

### 🧠 AI-Powered Tools

#### ATS Resume Analyzer
- Upload a resume (PDF) + paste a job description
- AI extracts keywords from the JD and compares against resume content
- Returns a match score, missing keywords, and actionable suggestions
- Built with `pypdf` for PDF parsing + external LLM API

#### Cover Letter Generator
- Input resume details and job description
- AI generates a structured, professional cover letter
- Option to download as PDF (`xhtml2pdf`)

#### Career Roadmap
- Input your degree, target role, experience level, and country
- AI returns a personalized multi-step career plan
- Roadmap displayed as a visual step-by-step timeline

### 🗄️ Career Vault
- Centralized view of all uploaded documents
- Resume and cover letter files linked to each job application
- Download documents directly from the vault

### 🏆 Streak Tracker
- Tracks consecutive days of job-search activity
- Visual flame indicator in the header
- Motivates daily progress

### 👤 Profile System
- Full profile with education (multiple entries), experience (multiple entries), skills
- Profile photo upload
- Used as context for AI-generated content (cover letters, roadmap)

### 🌐 Browser Extension
- Floating Action Menu (FAM) — installable Chrome extension
- Add job applications and referrals directly from any job portal (LinkedIn, Indeed, etc.)
- Without leaving the job listing page

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Python | 3.11+ | Core language |
| Django | 5.2 | Web framework, ORM, auth |
| Django CORS Headers | 4.9 | Cross-origin request handling |
| Gunicorn | 23.0 | WSGI production server |
| WhiteNoise | 6.9 | Static file serving |
| Pillow | 12.2 | Image/profile photo processing |
| pypdf | 6.10 | PDF resume parsing |
| xhtml2pdf | 0.2 | PDF cover letter generation |
| python-dotenv | 1.0 | Environment variable management |
| dj-database-url | 2.3 | Database URL config for deployment |
| requests | 2.32 | External AI API calls |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI component framework |
| Vite | 6 | Build tool and dev server |
| Tailwind CSS | 3 | Utility-first styling |
| Lucide React | latest | Icon library |
| React Router DOM | 7 | Client-side routing |
| Vanilla CSS | — | Custom animations, Dark Nebula theme |

### Database
| Environment | Database |
|---|---|
| Development | SQLite3 |
| Production | PostgreSQL (via `dj-database-url`) |

---

## 📁 Project Structure

```
hiretrack/
├── manage.py                    # Django entry point
├── requirements.txt             # Python dependencies
├── db.sqlite3                   # Dev database
├── .gitignore
│
├── config/                      # Django project config
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── tracker/                     # Main Django app
│   ├── models.py                # Job, Referral, Profile, Education, Experience
│   ├── views.py                 # All API views (60+ endpoints)
│   ├── urls.py                  # URL routing
│   ├── career_roadmap_view.py   # Career roadmap AI endpoint
│   ├── utils_pdf.py             # PDF generation utilities
│   ├── forms.py                 # Django forms
│   ├── admin.py                 # Django admin registration
│   └── tests.py                 # Unit tests
│
├── media/                       # Uploaded files (resumes, profile pics)
├── resumes/                     # Resume file storage
├── profiles/                    # Profile image storage
│
├── hiretrack-extension/         # Chrome browser extension
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   └── content.js
│
└── frontend/                    # React frontend (Vite)
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── package.json
    └── src/
        ├── main.jsx             # React entry point
        ├── App.jsx              # Router + route definitions
        ├── api.js               # API base URL helper
        ├── index.css            # Global styles + Dark Nebula theme
        │
        ├── Home.jsx             # Landing page
        ├── Header.jsx           # Sticky navigation header
        ├── Sidebar.jsx          # Slide-out user sidebar
        │
        ├── Login.jsx            # Login page
        ├── Signup.jsx           # Registration page
        │
        ├── Dashboard.jsx        # Analytics dashboard
        ├── AddJobPage.jsx       # Add job form
        ├── JobsPage.jsx         # Job list with search/filter/edit
        ├── AddReferralPage.jsx  # Add referral form
        ├── ViewReferrals.jsx    # Referral list
        ├── StarredPage.jsx      # Starred jobs + referrals
        ├── NotificationsPage.jsx # Notification center
        │
        ├── ProfilePage.jsx      # View profile
        ├── EditProfilePage.jsx  # Edit profile, education, experience
        ├── SettingsPage.jsx     # Password change, preferences
        │
        ├── ResumeAnalyzerPage.jsx  # ATS analyzer UI
        ├── CoverLetterPage.jsx     # Cover letter generator UI
        ├── CareerRoadmapPage.jsx   # Career roadmap UI
        ├── CareerVault.jsx         # Document vault
        ├── StreakPage.jsx          # Streak tracker
        ├── ExtensionFormPage.jsx   # Extension form handler
        │
        └── components/
            ├── Avatar.jsx       # Profile avatar component
            ├── ReferralForm.jsx # Reusable referral form
            └── ...
```

---

## 🗃️ Database Models

### `Job`
| Field | Type | Description |
|---|---|---|
| `user` | ForeignKey(User) | Owner — workspace isolation |
| `company` | CharField | Company name |
| `role` | CharField | Job title/role |
| `job_id` | CharField | Job posting ID |
| `platform` | CharField | LinkedIn, Indeed, etc. |
| `salary_range` | CharField | Expected salary |
| `job_description` | TextField | Full JD text |
| `resume_file` | FileField | Attached resume |
| `cover_letter_file` | FileField | Attached cover letter |
| `status` | CharField | applied / pending / selected / rejected |
| `notes` | TextField | Personal notes |
| `follow_up_date` | DateField | Reminder date |
| `is_starred` | BooleanField | Starred flag |
| `date_applied` | DateField | Application date |

### `Referral`
| Field | Type | Description |
|---|---|---|
| `user` | ForeignKey(User) | Owner |
| `person_name` | CharField | Contact person name |
| `company` | CharField | Target company |
| `email` | EmailField | Contact email |
| `linkedin` | URLField | LinkedIn profile |
| `status` | CharField | pending / replied / no_response |
| `notes` | TextField | Notes |
| `follow_up_date` | DateField | Follow-up reminder |
| `is_starred` | BooleanField | Starred flag |
| `date` | DateField | Date of outreach |

### `Profile`
Stores user bio, contact info, single education/experience entry, skills, resume file, and profile photo. Linked 1-to-1 with Django `User`.

### `Education`
Multiple education entries per user — college, course, start/end year.

### `Experience`
Multiple work experience entries per user — company, role, start/end date, description.

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/auth/status/` | Check login status + user info |
| POST | `/api/auth/logout/` | Log out current user |

### Jobs
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/add-job/` | Create a new job application |
| GET | `/api/jobs/` | List all jobs for current user |
| PATCH | `/api/job/update/<id>/` | Update job fields |
| DELETE | `/api/job/delete/<id>/` | Delete a job |
| POST | `/api/job/star/<id>/` | Toggle star on a job |
| GET | `/api/job/document/<id>/<kind>/` | Download resume or cover letter |

### Referrals
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/add-referral/` | Create a new referral |
| GET | `/api/referrals/` | List all referrals |
| PATCH | `/api/referral/update/<id>/` | Update referral fields |
| DELETE | `/api/referral/delete/<id>/` | Delete a referral |
| POST | `/api/referral/star/<id>/` | Toggle star on a referral |

### Dashboard & Misc
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/` | Aggregated stats for dashboard |
| GET | `/api/starred/` | All starred jobs and referrals |
| GET | `/api/notifications/` | All notifications for user |
| GET | `/api/streaks/` | Streak data |

### Profile
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/profile/` | Get current user profile |
| POST | `/api/profile/update/` | Update profile fields |
| POST | `/api/change-password/` | Change account password |

### AI Tools
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/resume-analyze/` | ATS resume analysis |
| POST | `/api/generate-cover-letter/` | AI cover letter generation |
| POST | `/api/generate-cover-letter-pdf/` | Download cover letter as PDF |
| POST | `/api/career-roadmap/` | AI career roadmap generation |
| GET | `/api/career-vault/` | List all uploaded documents |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/hiretrack.git
cd hiretrack
```

### 2. Backend Setup

```bash
# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3

# AI API key (for resume analyzer, cover letter, career roadmap)
GEMINI_API_KEY=your-api-key-here

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### 4. Run Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create a Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 6. Frontend Setup

```bash
cd frontend
npm install
```

---

## ▶️ Running the App

### Start Backend (Django)

```bash
# From project root
python manage.py runserver
# Runs at http://127.0.0.1:8000
```

### Start Frontend (React + Vite)

```bash
# From /frontend directory
npm run dev
# Runs at http://localhost:5173
```

> Both servers need to run simultaneously during development.

### Build Frontend for Production

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/` — serve them with WhiteNoise or a CDN.

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `SECRET_KEY` | ✅ | Django secret key |
| `DEBUG` | ✅ | `True` for dev, `False` for prod |
| `ALLOWED_HOSTS` | ✅ | Comma-separated allowed hosts |
| `DATABASE_URL` | ✅ | Database connection string |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key for AI features |
| `CORS_ALLOWED_ORIGINS` | ✅ | Frontend URL for CORS |

---

## 🧩 Browser Extension

The `hiretrack-extension/` folder contains a Chrome-compatible browser extension.

### Install Locally
1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer Mode** (top right)
3. Click **Load unpacked**
4. Select the `hiretrack-extension/` folder

### Features
- Floating Action Menu on any job portal page
- Click to open a quick-add form for jobs or referrals
- Data syncs directly to your HireTrack workspace

---

## 🌍 Deployment

### Recommended Stack
- **Backend**: Render / Railway / Heroku (with Gunicorn)
- **Frontend**: Vercel / Netlify (static build)
- **Database**: PostgreSQL (Render DB / Supabase)
- **Media Files**: Cloudinary or AWS S3

### Production Checklist
- [ ] Set `DEBUG=False`
- [ ] Set a strong `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS` with your domain
- [ ] Set `DATABASE_URL` to PostgreSQL connection string
- [ ] Set `GEMINI_API_KEY`
- [ ] Run `python manage.py collectstatic`
- [ ] Build frontend with `npm run build`
- [ ] Configure CORS to allow your frontend domain

### Example `Procfile` (for Render/Heroku)

```
web: gunicorn config.wsgi:application
```

---

## 🧪 Running Tests

```bash
# From project root, with venv activated
python manage.py test tracker
```

---

## 📊 Project Stats

| Metric | Value |
|---|---|
| Backend API Endpoints | 30+ |
| Integrated Feature Modules | 8 |
| Database Models | 5 (Job, Referral, Profile, Education, Experience) |
| Frontend Pages/Components | 25+ |
| AI-Powered Features | 3 (ATS Analyzer, Cover Letter, Career Roadmap) |
| Lines of Code | 5,000+ |

---

## 🤝 Contributing

This is a personal project. Feel free to fork it and build your own version.

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author

**Shinu Cherian**
- GitHub: [@Shinu-Cherian](https://github.com/Shinu-Cherian)
- Project: [HireTrack](https://github.com/Shinu-Cherian/hiretrack)

---

<div align="center">
  <sub>Built with ❤️ for serious job seekers. Track smarter. Apply faster. Get hired.</sub>
</div>
