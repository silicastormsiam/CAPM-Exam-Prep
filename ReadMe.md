# 📘 CAPM Mock Exam Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/version-1.4.0-success)
![Questions](https://img.shields.io/badge/questions-150-blue)
![Mode](https://img.shields.io/badge/modes-Study_&_Timed-critical)

---

## 🧭 Purpose

**The CAPM Mock Exam Platform** is a self-hosted web application created by **Andrew John Holland** as a personal learning and demonstration tool for the *Certified Associate in Project Management (CAPM)* exam. It replicates the Pearson VUE testing experience aligned to the **2023–2025 CAPM Exam Content Outline (ECO)**.

This project also showcases Andrew's competencies as an aspiring **IT Deployment Project Manager**, applying the five process groups: *Initiating, Planning, Executing, Monitoring & Controlling, and Closing*. The content supports Andrew's active study in the **Grow with Google: Google Project Management Professional Certificate** on Coursera (Courses 1–2 completed through Module 2, sample mapping for Courses 3–4, detailed alignment with Courses 5–6).

---

## 🗂️ File Structure

| File                                        | Description                                                            |
| ------------------------------------------- | ---------------------------------------------------------------------- |
| `index.html` (\~2 KB)                       | Frontend interface for mode and module selection                       |
| `styles.css` (\~1 KB)                       | Local CSS (replacing Tailwind CDN), themed with Cyberpunk Monk palette |
| `questions.json` (\~37 KB)                  | JSON database with 150 questions across 4 ECO domains                  |
| `ReadMe.md` (\~7 KB)                        | This comprehensive documentation                                       |
| `docker-compose.yml` (\~1 KB)               | Docker config for Nginx deployment                                     |
| `handover_report.md` (\~6 KB)               | Handover notes and deployment details                                  |
| `question_library_instructions.md` (\~3 KB) | Guidelines for question sourcing/structure                             |

---

## 🧠 Question Library Overview

**Total Questions: 150**, mapped to ECO domains:

* **Domain 1: Fundamentals & Core Concepts** (36% — 54 questions)
* **Domain 2: Predictive Plan-Based Methodologies** (17% — 26 questions)
* **Domain 3: Agile Frameworks/Methodologies** (20% — 30 questions)
* **Domain 4: Business Analysis Frameworks** (27% — 40 questions)

**Question Types:**

* 60 Single-answer multiple choice
* 30 Multiple-selection
* 22 Matching (drag-and-drop)
* 22 Sequencing (drag-and-drop)
* 16 Scenario-based (situational)

---

## 🎨 Design & UI

**Color Palette: Cyberpunk Monk** (harmonized with [https://www.andrewholland.com/](https://www.andrewholland.com/))

* Background: `#0F172A` (Dark Blue)
* Cards: `#D1D5DB` (Gray)
* Buttons: `#3B82F6` (Blue)
* Hover: `#F472B6` (Pink)

---

## 🚀 Platform Features

* 🔀 **Program Selection**: Foundations (Course 1), Google PM Cert (Course 2), Agile (Course 5), Capstone (Course 6)
* 🎯 **Modes**:

  * **Study Mode**: Immediate feedback, select module(s)
  * **Timed Exam Mode**: 150 questions (135 scored + 15 unscored), 3-hour limit, navigation, flagging
* 📊 **Review Intelligence**: Tracks error counts and percentages by domain
* 📁 **Quiz History Logging**: Logs date/time, score, and mode (e.g., `31/07/2025, 11:44:55: 5/5 (100.00%) [Timed]`)

---

## 🔧 Setup & Hosting Instructions

### 🔑 Prerequisites

* Synology NAS at `192.168.1.248`
* DSM Container Manager + File Station
* Shared Folder: `/volume1/Exam_Prep/html`
* Local Dev Dir: `M:\OneDrive\Documents\GitHub\CAPM_Mock_Exam_Platform`
* Users: `admin`, `silicastorm`, `gituser` (RW); `Guest` (RO)
* Docker installed on NAS

### 📝 File Preparation

* Create all files in `M:\OneDrive\Documents\GitHub\CAPM_Mock_Exam_Platform`
* Verify locally via CMD:

```bash
cd M:\OneDrive\Documents\GitHub\CAPM_Mock_Exam_Platform
dir
```

### 📤 Upload Files to NAS

* Log in to DSM: `http://192.168.1.248:5000`
* Open **File Station** > navigate to `/volume1/Exam_Prep/html`
* Delete old files > Upload new files from local directory
* Confirm upload success

### 🔍 Verify via SSH

```bash
ssh admin@192.168.1.248
ls /volume1/Exam_Prep/html
cat /volume1/Exam_Prep/html/questions.json | wc -l
exit
```

### 🐳 Docker Deployment

* DSM > Container Manager > Project > **Create (Manual Input)**
* Use `docker-compose.yml`, expose port `8081`
* Name project: `capm-quiz`
* Stop `qBittorrent` (uses 8080)

### 🧪 Testing

* Open in browser: `http://192.168.1.248:8081/index.html`
* Expected: Program selection screen → Study/Timed Mode → Module selector (Study Mode)

---

## 📚 Usage Instructions

### 🧩 Program Selection

Choose from:

* Foundations (Course 1)
* Google PM Cert (Course 2)
* Agile (Course 5)
* Capstone (Course 6)

### 🕹️ Modes

* **Study Mode**: Immediate feedback, module/range selection (e.g., C1M1–C2M4)
* **Timed Exam Mode**: Full 150-question exam, navigation, no feedback until end

### 📈 Review Intelligence

* Displays results like: `Domain 1: 5 errors (33.33% error rate)`

### 📆 Quiz History

* Tracks attempt details, scores, and timestamped logs

---

## 🛠️ Development Notes

* **Version**: 1.4.0
* **Optimized**: RAM usage lowered, Tailwind CDN removed
* **Mappings**:

  * Domains 1–2 → Courses 1–2
  * Domain 2 → Course 2 Modules 3–4
  * Domains 3–4 → Courses 5–6
  * Courses 3–4: Partial/sample support
* **Standards**: ECO-compliant, no hotspot-style questions
* **QA**: Manually validated for domain alignment
* **GitHub Access**: `gituser` can sync to `/volume1/Exam_Prep`
* **Future Goals**: 300+ questions, analytics dashboard

---

## 📅 Change Log

| Date       | Update                                                              |
| ---------- | ------------------------------------------------------------------- |
| 2025-07-31 | Initial version, 20 questions                                       |
| 2025-07-31 | Added palette                                                       |
| 2025-07-31 | Fixed runtime error, 60 questions total                             |
| 2025-07-31 | Expanded to 150 questions, moved to Exam\_Prep folder               |
| 2025-08-01 | Added program selection, fixed Tailwind/JSON-related runtime issues |

---

## 🧯 Troubleshooting

* ❗ **RAM Crashes**: Use Notepad and File Station, not high-RAM editors like VSCode
* 🔐 **Upload Errors**: Use File Station; SCP/SSH can fail due to permission issues
* 🛑 **Runtime Errors**: Replaced Tailwind CDN with `styles.css`; fixed invalid JSON
* 🔌 **Port Conflicts**: qBittorrent uses 8080 → switch to 8081 or scan with:

```bash
nmap 192.168.1.248 -p 8081-8090
```

* 🔧 **Permissions**:

```bash
ssh admin@192.168.1.248
sudo chmod 755 /volume1/Exam_Prep/html
```

---

*This ReadMe documents a project built by Andrew John Holland to aid in his pursuit of CAPM certification and to exhibit his project planning, technical deployment, and content mapping skills.*
