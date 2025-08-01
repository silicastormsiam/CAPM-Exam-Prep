CAPM Mock Exam Platform ReadMe
Purpose
The CAPM Mock Exam Platform is a self-hosted web application designed for personal preparation for the Certified Associate in Project Management (CAPM) certification, emulating the Pearson VUE exam experience based on the 2023–2025 CAPM Exam Content Outline (ECO). It supports the user's progress in the Google Project Management Certificate (Courses 1–2 up to Module 2 completed, samples for Courses 3–4, detailed for Courses 5–6). The platform provides two modes: Study Mode (immediate feedback with explanations, module/range selection) and Timed Exam Mode (3-hour timer, navigation, flagging, review of unanswered/flagged questions, domain-based review intelligence). It is hosted on a Synology NAS using DSM Container Manager and is designed for expansion to a 300+ question library for comprehensive practice.
Structure

Files:
index.html (~2 KB): Frontend with three-phase interface (program selection: Foundations, Google PM Cert, Agile, Capstone; Study/Timed Mode; single/multiple module selection).
styles.css (~1 KB): Local CSS for styling, replacing Tailwind CDN.
questions.json (~37 KB): JSON database with 150 questions (54 Domain 1, 26 Domain 2, 30 Domain 3, 40 Domain 4).
ReadMe.md (~7 KB): This comprehensive documentation.
docker-compose.yml (~1 KB): Nginx Docker configuration for deployment.
handover_report.md (~6 KB): Consolidated handover details.
question_library_instructions.md (~3 KB): Question library sources and structure.


Question Library: 150 questions aligned with CAPM ECO:
Domain 1: Fundamentals & Core Concepts (36%, 54 questions).
Domain 2: Predictive Plan-Based Methodologies (17%, 26 questions).
Domain 3: Agile Frameworks/Methodologies (20%, 30 questions).
Domain 4: Business Analysis Frameworks (27%, 40 questions).


Question Types:
Single-answer multiple choice (60 questions).
Multiple-selection (30 questions).
Matching (22 questions, drag-and-drop).
Sequencing (22 questions, drag-and-drop).
Scenario-based (16 questions, situational).


Design: Cyberpunk Monk palette (dark blue #0F172A background, gray #D1D5DB cards, blue #3B82F6 buttons, pink #F472B6 hover), consistent with https://www.andrewholland.com/.
Features:
Program selection: Foundations (Course 1), Google PM Cert (Course 2), Agile (Course 5), Capstone (Course 6).
Study/Timed Modes with navigation (Previous/Next), flagging, review of unanswered/flagged questions.
Domain review intelligence: Error counts/rates (e.g., "Domain 1: 5 errors (33.33% error rate)").
Quiz History: Tracks results (e.g., "31/07/2025, 11:44:55: 5/5 (100.00%) [Timed]").



Setup and Hosting

Prerequisites:

Synology NAS (192.168.1.248) with DSM Container Manager and File Station.
Shared folder /volume1/Exam_Prep/html with Read/Write permissions for admin, silicastorm, gituser; ReadOnly for Guest.
Local directory: M:\OneDrive\Documents\GitHub\CAPM_Mock_Exam_Platform.
Docker installed on NAS.


File Preparation:

Create files (index.html, styles.css, questions.json, ReadMe.md, docker-compose.yml, handover_report.md, question_library_instructions.md) in M:\OneDrive\Documents\GitHub\CAPM_Mock_Exam_Platform using Notepad.
Verify locally:cd M:\OneDrive\Documents\GitHub\CAPM_Mock_Exam_Platform
dir




Upload Files:

Log in to DSM: http://192.168.1.248:5000
Open File Station > Navigate to volume1/Exam_Prep/html.
Delete outdated files.
Upload all files from M:\OneDrive\Documents\GitHub\CAPM_Mock_Exam_Platform.
Verify in File Station.


Verify on NAS:
ssh admin@192.168.1.248
ls /volume1/Exam_Prep/html
cat /volume1/Exam_Prep/html/questions.json | wc -l
exit


Check: ls shows all files; wc -l shows ~1500 lines for questions.json.


Deploy Docker:

In DSM > Container Manager > Project > Create > Manual Input.
Use docker-compose.yml content (port 8081).
Name: capm-quiz, apply.
Stop qBittorrent: DSM > Container Manager > Container > Stop qbittorrent.


Test:

Open: http://192.168.1.248:8081/index.html
Expected: Program selection (Foundations, Google PM Cert, Agile, Capstone), Study/Timed Mode, module selection (Study Mode), no runtime errors.



Usage

Program Selection:
Choose from Foundations, Google PM Cert, Agile, Capstone to filter modules.


Modes:
Study Mode: Immediate feedback, select single module (e.g., Course 1 Module 1) or range (e.g., Course 1 Module 1 to Course 2 Module 4).
Timed Exam Mode: 150 questions (135 scored, 15 unscored), 3 hours, navigation, flagging, review, no feedback until end.


Review Intelligence: Results show domain error counts/rates to guide study.
Quiz History: Tracks performance with mode indication.

Development Notes

Version: 1.4.0 (RAM-optimized, questions.json separated).
Alignment: Questions map to Google PM Certificate (Courses 1–2 for Domain 1, Course 2 Modules 3–4 for Domain 2, Courses 5–6 for Domains 3–4, samples for Courses 3–4).
CAPM Emulation: 150 questions, 3 hours, ECO domains, no hot spot questions.
Quality Assurance: Questions align with PMI standards, verified against ECO tasks.
GitHub: gituser has Read/Write access to /volume1/Exam_Prep for sync.
Future: Expand to 300+ questions, add analytics.
Owner: Andrew John Holland.

Change Log

[2025-07-31] Initial version, 20 questions (ID: 3675a440-f713-4627-87b8-636af0448b4f).
[2025-07-31] Added palette (ID: 3675a440-f713-4627-87b8-636af0448b4f).
[2025-07-31] Fixed runtime error, 60 questions (ID: 0f0c857c-0ac7-4ef1-b9d9-e477faab987a).
[2025-07-31] 150 questions, Exam_Prep folder (ID: 5f6a7b8c-c9d0-4e1a-a2b3-f4a5b6c7d8e9).
[2025-08-01] Added program selection, fixed Tailwind/JSON errors (ID: 7a8b9c0d-e1f2-4a3b-b4c5-d6e7f8a9b0c1).

Troubleshooting

Crashes: Use Notepad, File Station to avoid RAM spikes.
Upload Failures: scp errors resolved with File Station.
Runtime Errors: Fixed Tailwind CDN with styles.css; JSON error fixed with valid questions.json.
Port Conflicts: qBittorrent on 8080—use 8081 or scan with nmap 192.168.1.248 -p 8081-8090 (on request).
Permissions: ssh admin@192.168.1.248, sudo chmod 755 /volume1/Exam_Prep/html.
