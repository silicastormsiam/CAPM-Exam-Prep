# CAPM Exam Prep

**Owner:** Andrew John Holland
**Prepared By:** Andrew John Holland
**Purpose:** A comprehensive, CAPM-aligned, offline-capable exam preparation platform designed to realistically simulate the **Certified Associate in Project Management (CAPM)** exam experience.

---

## 📖 Overview

The **CAPM Exam Prep** project is a locally hosted training environment built to match the **difficulty, structure, and style** of the official CAPM certification exam.

It is designed for **serious candidates** who want:

* Realistic, PMI-aligned question formats.
* Modular, expandable question libraries.
* Randomization without compromising answer integrity.
* Performance analytics to identify knowledge gaps.
* Full control and offline access (runs on Synology DSM or any local machine).

---

## 🎯 Objectives

1. **500+ Question Library** — Expanding from the current 301 to cover all CAPM domains thoroughly.
2. **Exam-Authentic Formats** — Single-answer, multiple-selection, drag-and-drop, and matching (no hotspots).
3. **Module-Based Analytics** — Identify weak areas per PMI domain.
4. **Offline-First** — No cloud dependency; fully functional on Synology NAS.
5. **Ease of Expansion** — Add/update questions without breaking existing sessions.
6. **ROE Compliance** — All files follow Andrew’s PMI/CAPM standards.

---

## 📂 Repository Structure

```
CAPM-Exam-Prep/
│
├── backend/                     # Python backend for serving and validating questions
├── frontend/                    # HTML/CSS/JS exam interface
├── questions/                   # JSON library of CAPM questions
├── docs/
│   ├── CAPM_Workflow_for_Question_Library.md
│   └── Additional study/reference docs
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/silicastormsiam/CAPM-Exam-Prep.git
```

### 2. Navigate to the Folder

```bash
cd CAPM-Exam-Prep
```

### 3. Set Up Python Environment

```bash
conda create -n capm_prep python=3.11
conda activate capm_prep
pip install -r requirements.txt
```

### 4. Run Locally

```bash
python backend/app.py
```

Open in browser:

```
http://localhost:5000
```

---

## 📊 Question Library Workflow

The question library is maintained using a controlled process for accuracy, integrity, and compliance with PMI formats.
**Source:** `docs/CAPM_Workflow_for_Question_Library.md`

### Steps:

1. **Formatting**

   * Ensure each question matches CAPM style & structure.
   * Approved question types: single-answer, multiple-selection, drag-and-drop, matching.

2. **Processing**

   * Convert from `.xlsx` or `.docx` source into standardized JSON schema.

3. **Backup**

   * Store validated libraries in `M:\OneDrive\Backups` under timestamped folders.

4. **Deduplication**

   * Compare against existing JSON entries; remove or merge duplicates.

5. **Validation**

   * Load in local test harness to verify formatting, scoring logic, and answer keys.

---

## 📐 JSON Question Structure

Example:

```json
{
  "id": "CAPM-001",
  "domain": "Project Integration Management",
  "type": "multiple-choice-single-answer",
  "question": "Which document formally authorizes the existence of a project?",
  "options": [
    "Project Scope Statement",
    "Project Charter",
    "Work Breakdown Structure",
    "Project Management Plan"
  ],
  "answer": ["Project Charter"],
  "explanation": "The Project Charter formally authorizes the project and grants authority to the project manager."
}
```

---

## 📈 Performance Analytics

At the end of each session:

* **Score Report** — Overall score + per-domain breakdown.
* **Knowledge Gap Report** — Highlights domains below target proficiency.
* **Review Mode** — View missed questions with explanations.

---

## 🖥 Local Hosting on Synology DSM

1. Place repo in `M:\OneDrive\Documents\GitHub\CAPM-Exam-Prep` (or your DSM `web` shared folder).
2. Use DSM’s Python 3 environment or Docker container to run backend.
3. Access via DSM IP + port in local network.

---

## 🔄 Backup Protocol

* **Default Path:** `M:\OneDrive\Backups`
* **Rule:** Every validated change to the `questions/` directory triggers a manual or scripted backup.
* **Format:**

  ```
  CAPM-Exam-Prep_Questions_v<version>_<YYYY-MM-DD>
  ```

---

## 📜 ROE Compliance

This project complies with Andrew’s **Rules of Engagement**, including:

* **File Naming Standard**
  `<ProjectName>_<DocumentType>_v<version>_<YYYY-MM-DD>.<ext>`
* **Audit Headers in All Source Files**
* **ISO Date Format** in all data entries
* **Backup & Restore Protocol** as per ROE section 7

---

## 📌 Roadmap

* [ ] Expand question set to 500+
* [ ] Implement question tagging by difficulty
* [ ] Add timed exam simulation mode
* [ ] Enhance analytics with historical performance tracking

---

## 📜 License

MIT License — see [LICENSE](LICENSE).

---

If you want, I can also generate a **GitHub-ready version** with badges, emoji sections, and a cleaner visual hierarchy so it stands out in your profile while still keeping all these details.

Do you want me to format it that way next? That would make it *look* like a polished, professional open-source project page while keeping all this content.
