# 📘 CAPM Exam Prep

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/version-1.0.0-brightgreen)
![Mode](https://img.shields.io/badge/mode-Local_&_Offline-critical)
![Questions](https://img.shields.io/badge/questions-301-blue)

---

## 🧭 Overview

**CAPM Exam Prep** is a self-hosted, browser-based application designed for aspiring Certified Associate in Project Management (CAPM) candidates. This lightweight tool mirrors the Pearson VUE exam experience and aligns closely with the PMI 2023–2025 Exam Content Outline (ECO).

Deployed locally via static HTML/CSS/JS, it offers exam simulation, real-time feedback, and deep visibility into personal knowledge gaps—without relying on external AI tools or third-party cloud platforms.

---

## 🎯 Project Highlights

* **📌 Project Manager**: Andrew — 30 years of airline industry experience now leveraged toward agile digital platforms and PM education
* **📚 Exam Coverage**: Fully aligned with PMI’s latest ECO and Google PM Certificate structure
* **🔒 Offline-first**: No internet required; can run via local NAS, Synology DSM, or through Tailscale remotely
* **⚙️ Modular**: Built to grow — designed with JSON question libraries and Python/CLI tooling for easy scalability

---

## 🧱 Core Features

| Feature           | Description                                                                  |
| ----------------- | ---------------------------------------------------------------------------- |
| Study Mode        | View correct answers immediately; learn with every question                  |
| Exam Mode         | Simulate real exam conditions with no hints or feedback until submission     |
| Question Import   | Supports Excel-to-JSON pipeline for clean question ingestion                 |
| Modular Structure | Sort by ECO domain, Google PM module, or question type (single/multi-choice) |
| Debug Log Viewer  | Real-time view of scoring breakdown and question traceability                |

---

## 🔍 Project Structure

```
CAPM-Exam-Prep/
├── index.html                # Entry point UI
├── style.css                # Interface styling
├── main.js                  # App logic (mode switch, scoring, feedback)
├── questions.json           # Current live question bank (301+)
├── data/
│   └── archived_questions/  # Backups and deprecated question sets
├── tools/
│   └── excel_to_json/       # Conversion tools and scripts
└── README.md                # You're here ✅
```

---

## 🛠️ Question Library Pipeline

1. **Source** questions (manual research or Grok-prompted from PM courses)
2. **Dump** raw questions in `drop_the_format_questions.txt`
3. **Format** using structured Grok prompts → returns question blocks
4. **Paste** formatted blocks into Excel template (11-field structure)
5. **Run CLI script** to convert Excel to JSON and merge into live library

---

## 🚀 Deployment Instructions

1. Clone the repo
2. Open `index.html` in any browser — it just works™
3. Optional: host via Synology NAS + Tailscale for secure remote access

---

## 📈 Roadmap

* [ ] Expand library to 500+ CAPM-aligned questions
* [ ] Add matching/drag-and-drop support
* [ ] Module-based scoring analytics
* [ ] Export results summary to CSV

---

## 🙌 Credits

* **Project Lead**: Andrew Holland — tireless researcher, question curator, and QA savant
* **Formatting Wizardry**: Grok (when not chasing butterflies 🦋)
* **Architecture**: GPT/CLI hybrid tooling for consistency and control

---

## 📄 License

MIT License. See `LICENSE` file for details.

> "Not just an exam simulator — this is your tactical command center for certification."
