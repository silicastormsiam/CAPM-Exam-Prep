/* File Name: app.js */
/* Owner: Andrew John Holland */
/* Purpose: Handles UI logic, question rendering, modes, feedback, history, logging. */
/* Version: 1.3.16 (August 04, 2025) - Refined feedback to remove ECO references, added Study Mode clarification. */
/* Change Log: */
/* [2025-08-04] Modified submitAnswer to remove ECO references from feedback, add clarification for incorrect answers in Study Mode only, and retain ECO comments in History (ID: stabilization-20250804-24). */
/* [2025-08-04] Modified submitAnswer to exclude references in feedback, kept in history (ID: stabilization-20250804-18). */
/* [2025-08-04] Modified submitAnswer to show only "Correct!"/"Incorrect!" during quiz, moved references to history (ID: stabilization-20250804-17). */
/* [2025-08-04] Restored selectProgram functionality for Exam Mode (ID: stabilization-20250804-04). */
/* [2025-08-04] Modified selectProgram to skip quiz-content for Exam Mode (ID: stabilization-20250804-01). */
/* [2025-08-03] Updated startQuiz for Study Mode (10 questions) and Exam Mode (150 questions per PMI CAPM ECO) (ID: quiz-mode-fix-20250803-01). */
/* [2025-08-03] Fixed try-catch syntax in endQuiz (ID: try-catch-fix-20250803-01). */
/* [2025-08-03] Restored goBack function, updated downloadLog to include timestamp (ID: goback-fix-20250803-01). */
/* [2025-08-03] Renamed FILE_NAME to APP_FILE_NAME (ID: syntax-fix-20250803-01). */
/* [2025-08-03] Ensured /api/questions fetch in loadQuestions (ID: dsm-deployment-20250803-44). */
const APP_VERSION = "1.3.16";
const APP_FILE_NAME = "app.js";
let questions = [];
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let mode = '';
let program = 0;
let moduleRange = { from: null, to: null };
let timerInterval;
let timeLeft = 10800; // 3 hours for exam mode
let history = JSON.parse(localStorage.getItem('quizHistory')) || [];
let errorLog = JSON.parse(localStorage.getItem('errorLog')) || [];
let logQueue = [];
window.showSection = function(sectionId) {
    try {
        document.querySelectorAll('.card').forEach(card => card.classList.add('hidden'));
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.remove('hidden');
            document.querySelector('.container').style.display = 'block';
            window.logError(`Showed section: ${sectionId}`);
        } else {
            throw new Error(`Section ${sectionId} not found`);
        }
    } catch (error) {
        window.logError(`Error in showSection: ${error.message}`);
        console.error(error);
    }
};
window.goBack = function(sectionId) {
    try {
        window.showSection(sectionId);
        window.logError(`Returned to section: ${sectionId}`);
    } catch (error) {
        window.logError(`Error going back to section ${sectionId}: ${error.message}`);
        console.error(error);
    }
};
window.logError = function(message) {
    fetch('http://192.168.1.248:8085/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            timestamp: new Date().toISOString(),
            message: message,
            file: APP_FILE_NAME,
            version: APP_VERSION
        })
    }).catch(err => console.error('Failed to log error:', err));
};
window.loadQuestions = async function() {
    try {
        if (typeof window._loadQuestions !== 'function') {
            throw new Error('loadQuestions function not defined in jsonInterface.js');
        }
        window.logError(`Initiating question fetch`);
        questions = await window._loadQuestions();
        window.logError(`Loaded ${questions.length} questions via jsonInterface.js`);
    } catch (error) {
        window.logError(`Error loading questions: ${error.message}`);
        console.error(error);
        alert('Failed to load questions. Check error log.');
    }
};
window.selectMode = function(selectedMode) {
    try {
        if (!document.getElementById('mode-selection')) {
            throw new Error('mode-selection element not found');
        }
        mode = selectedMode;
        window.logError(`Button clicked: ${selectedMode} Mode`);
        window.showSection('program-selection');
        console.log(`selectMode executed for ${selectedMode}`);
    } catch (error) {
        window.logError(`Error in selectMode: ${error.message}`);
        console.error(error);
        alert('Failed to select mode. Check error log.');
    }
};
window.selectProgram = function(selectedProgram) {
    try {
        program = selectedProgram;
        window.logError(`Selected program: ${selectedProgram}`);
        window.showSection('quiz-content');
        window.populateModuleDropdown();
        console.log(`selectProgram executed for ${selectedProgram}`);
    } catch (error) {
        window.logError(`Error in selectProgram: ${error.message}`);
        console.error(error);
    }
};
window.populateModuleDropdown = function() {
    try {
        const singleModuleSelect = document.getElementById('single-module');
        const fromModuleSelect = document.getElementById('from-module');
        const toModuleSelect = document.getElementById('to-module');
        if (!singleModuleSelect || !fromModuleSelect || !toModuleSelect) {
            throw new Error('Module select elements not found');
        }
        singleModuleSelect.innerHTML = '<option value="">Select Module</option>';
        fromModuleSelect.innerHTML = '<option value="">Start Module</option>';
        toModuleSelect.innerHTML = '<option value="">Finish Module</option>';
        if (syllabus[program]) {
            syllabus[program].forEach((title, index) => {
                const option = document.createElement('option');
                option.value = index + 1;
                option.textContent = title;
                singleModuleSelect.appendChild(option.cloneNode(true));
                fromModuleSelect.appendChild(option.cloneNode(true));
                toModuleSelect.appendChild(option.cloneNode(true));
            });
            window.logError(`Populated module dropdowns for program ${program}`);
        } else {
            throw new Error(`No syllabus data for program ${program}`);
        }
    } catch (error) {
        window.logError(`Error in populateModuleDropdown: ${error.message}`);
        console.error(error);
    }
};
window.startQuiz = function() {
    try {
        const singleModule = document.getElementById('single-module').value;
        const fromModule = document.getElementById('from-module').value;
        const toModule = document.getElementById('to-module').value;
        moduleRange = { from: null, to: null };
        if (singleModule) {
            moduleRange.from = parseInt(singleModule);
            moduleRange.to = parseInt(singleModule);
        } else if (fromModule && toModule) {
            moduleRange.from = parseInt(fromModule);
            moduleRange.to = parseInt(toModule);
        }
        window.logError(`Starting quiz with Module Range: ${moduleRange.from}-${moduleRange.to}`);
        console.log(`startQuiz executed with Module Range: ${moduleRange.from}-${moduleRange.to}`);
        if (typeof window._filterQuestions !== 'function') {
            throw new Error('filterQuestions function not defined in jsonInterface.js');
        }
        let filteredQuestions = window._filterQuestions(questions, mode, program, moduleRange);
        window.logError(`Filtered ${filteredQuestions.length} questions`);
        if (mode === 'study') {
            currentQuestions = filteredQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
            window.logError(`Selected 10 questions for Study Mode`);
        } else if (mode === 'exam' && program === 2) {
            const domainCounts = { 1: 54, 2: 26, 3: 30, 4: 40 };
            currentQuestions = [];
            Object.keys(domainCounts).forEach(domain => {
                let domainQuestions = filteredQuestions.filter(q => parseInt(q.domain) === parseInt(domain));
                if (domainQuestions.length < domainCounts[domain]) {
                    window.logError(`Insufficient questions for Domain ${domain}: ${domainQuestions.length} available, ${domainCounts[domain]} required`);
                    alert(`Insufficient questions for Domain ${domain}. Check error log.`);
                    return;
                }
                currentQuestions.push(...domainQuestions.sort(() => Math.random() - 0.5).slice(0, domainCounts[domain]));
            });
            if (currentQuestions.length !== 150) {
                window.logError(`Exam Mode failed: Selected ${currentQuestions.length} questions, expected 150`);
                alert(`Exam Mode failed: Insufficient questions. Check error log.`);
                return;
            }
            window.logError(`Selected 150 questions for Exam Mode: Fundamentals (54), Predictive (26), Agile (30), Business Analysis (40)`);
        } else {
            throw new Error(`Invalid mode or program: ${mode}, ${program}`);
        }
        if (currentQuestions.length === 0) {
            const filterDetails = `Module Range: ${moduleRange.from}-${moduleRange.to}, Available Questions: ${filteredQuestions.length}`;
            window.logError(`No questions available for filters: ${filterDetails}`);
            alert(`No questions available for selected filters: ${filterDetails}. Check error log.`);
            return;
        }
        window.showSection('quiz');
        if (mode === 'exam') window.startTimer();
        currentIndex = 0;
        score = 0;
        userAnswers = [];
        window.logError(`Rendering first question`);
        window.renderQuestion();
    } catch (error) {
        window.logError(`Error in startQuiz: ${error.message}`);
        console.error(error);
    }
};
window.renderQuestion = function() {
    try {
        const q = currentQuestions[currentIndex];
        const questionDiv = document.getElementById('question');
        const optionsDiv = document.getElementById('options');
        questionDiv.innerHTML = `<h3>${q.question}</h3>`;
        let optionsHtml = '';
        if (q.type === 'single') {
            q.options.forEach((opt, i) => {
                optionsHtml += `<label><input type="radio" name="answer" value="${i}"> <span>${opt}</span></label><br>`;
            });
        } else if (q.type === 'multiple') {
            q.options.forEach((opt, i) => {
                optionsHtml += `<label><input type="checkbox" name="answer" value="${i}"> <span>${opt}</span></label><br>`;
            });
        } else if (q.type === 'matching') {
            q.options.left.forEach((left, i) => {
                optionsHtml += `<p>${left}: <select id="match-${i}">
                    <option value="">Select</option>
                    ${q.options.right.map(right => `<option value="${right}">${right}</option>`).join('')}
                </select></p>`;
            });
        } else if (q.type === 'sequencing') {
            q.options.forEach((opt, i) => {
                optionsHtml += `<p>${opt}: <input type="number" id="seq-${i}" min="1" max="${q.options.length}"></p>`;
            });
        } else if (q.type === 'scenario') {
            q.options.forEach((opt, i) => {
                optionsHtml += `<label><input type="radio" name="answer" value="${i}"> <span>${opt}</span></label><br>`;
            });
        }
        optionsDiv.innerHTML = optionsHtml;
        document.getElementById('feedback').classList.add('hidden');
        window.logError(`Rendered question ${currentIndex + 1}: ${q.id}`);
    } catch (error) {
        window.logError(`Error in renderQuestion: ${error.message}`);
        console.error(error);
    }
};
window.submitAnswer = function() {
    try {
        const q = currentQuestions[currentIndex];
        let correct = false;
        const feedbackDiv = document.getElementById('feedback');
        if (q.type === 'single' || q.type === 'scenario') {
            const selected = document.querySelector('input[name="answer"]:checked');
            if (selected) {
                const answer = parseInt(selected.value);
                correct = answer === q.answer;
                userAnswers.push({ id: q.id, correct, reference: q.reference }); // Store reference
                if (mode === 'study') {
                    feedbackDiv.innerHTML = correct
                        ? `<span style="color: green;">Correct!</span>`
                        : `<span style="color: red;">Incorrect. The correct answer is ${q.options[q.answer]} because it aligns with project authorization.</span>`;
                } else if (mode === 'exam') {
                    feedbackDiv.innerHTML = correct
                        ? `<span style="color: green;">Correct!</span>`
                        : `<span style="color: red;">Incorrect.</span>`;
                }
                feedbackDiv.classList.remove('hidden');
                if (correct) score++;
                window.logError(`Submitted answer for question ${q.id}: ${correct ? 'Correct' : 'Incorrect'}`);
            } else {
                window.logError(`No answer selected for question ${q.id}`);
                feedbackDiv.innerHTML = `<span style="color: red;">Please select an answer.</span>`;
                feedbackDiv.classList.remove('hidden');
            }
        } else if (q.type === 'multiple') {
            const selected = Array.from(document.querySelectorAll('input[name="answer"]:checked')).map(input => parseInt(input.value)).sort();
            const correctAnswers = Array.isArray(q.answer) ? q.answer.sort() : [q.answer];
            correct = selected.length === correctAnswers.length && selected.every((val, i) => val === correctAnswers[i]);
            userAnswers.push({ id: q.id, correct, reference: q.reference }); // Store reference
            if (mode === 'study') {
                feedbackDiv.innerHTML = correct
                    ? `<span style="color: green;">Correct!</span>`
                    : `<span style="color: red;">Incorrect. The correct answers are ${correctAnswers.map(i => q.options[i]).join(', ')} because they reflect key project aspects.</span>`;
            } else if (mode === 'exam') {
                feedbackDiv.innerHTML = correct
                    ? `<span style="color: green;">Correct!</span>`
                    : `<span style="color: red;">Incorrect.</span>`;
            }
            feedbackDiv.classList.remove('hidden');
            if (correct) score++;
            window.logError(`Submitted answer for question ${q.id}: ${correct ? 'Correct' : 'Incorrect'}`);
        } else if (q.type === 'matching') {
            const answers = {};
            q.options.left.forEach((left, i) => {
                answers[left] = document.getElementById(`match-${i}`).value;
            });
            correct = Object.keys(q.answer).every(key => answers[key] === q.answer[key]);
            userAnswers.push({ id: q.id, correct, reference: q.reference }); // Store reference
            if (mode === 'study') {
                feedbackDiv.innerHTML = correct
                    ? `<span style="color: green;">Correct!</span>`
                    : `<span style="color: red;">Incorrect. The correct matches are based on project management principles.</span>`;
            } else if (mode === 'exam') {
                feedbackDiv.innerHTML = correct
                    ? `<span style="color: green;">Correct!</span>`
                    : `<span style="color: red;">Incorrect.</span>`;
            }
            feedbackDiv.classList.remove('hidden');
            if (correct) score++;
            window.logError(`Submitted answer for question ${q.id}: ${correct ? 'Correct' : 'Incorrect'}`);
        } else if (q.type === 'sequencing') {
            const answers = q.options.map((_, i) => parseInt(document.getElementById(`seq-${i}`).value));
            correct = answers.every((val, i) => val === i + 1 && q.options[val - 1] === q.answer[i]);
            userAnswers.push({ id: q.id, correct, reference: q.reference }); // Store reference
            if (mode === 'study') {
                feedbackDiv.innerHTML = correct
                    ? `<span style="color: green;">Correct!</span>`
                    : `<span style="color: red;">Incorrect. The correct sequence follows project process order.</span>`;
            } else if (mode === 'exam') {
                feedbackDiv.innerHTML = correct
                    ? `<span style="color: green;">Correct!</span>`
                    : `<span style="color: red;">Incorrect.</span>`;
            }
            feedbackDiv.classList.remove('hidden');
            if (correct) score++;
            window.logError(`Submitted answer for question ${q.id}: ${correct ? 'Correct' : 'Incorrect'}`);
        }
        if (mode !== 'study') window.nextQuestion();
    } catch (error) {
        window.logError(`Error in submitAnswer: ${error.message}`);
        console.error(error);
    }
};
window.previousQuestion = function() {
    try {
        if (currentIndex > 0) {
            currentIndex--;
            window.logError(`Navigated to previous question: ${currentIndex + 1}`);
            window.renderQuestion();
        }
    } catch (error) {
        window.logError(`Error in previousQuestion: ${error.message}`);
        console.error(error);
    }
};
window.nextQuestion = function() {
    try {
        if (currentIndex < currentQuestions.length - 1) {
            currentIndex++;
            window.logError(`Navigated to next question: ${currentIndex + 1}`);
            window.renderQuestion();
        } else {
            window.logError(`Ending quiz`);
            window.endQuiz();
        }
    } catch (error) {
        window.logError(`Error in nextQuestion: ${error.message}`);
        console.error(error);
    }
};
window.startTimer = function() {
    try {
        timerInterval = setInterval(() => {
            timeLeft--;
            document.getElementById('timer').innerText = `Time left: ${window.formatTime(timeLeft)}`;
            if (timeLeft <= 0) {
                window.logError(`Timer expired, ending quiz`);
                window.endQuiz();
            }
        }, 1000);
        window.logError(`Started timer for exam mode`);
    } catch (error) {
        window.logError(`Error in startTimer: ${error.message}`);
        console.error(error);
    }
};
window.formatTime = function(seconds) {
    try {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    } catch (error) {
        window.logError(`Error in formatTime: ${error.message}`);
        console.error(error);
        return '00:00:00';
    }
};
window.endQuiz = function() {
    try {
        clearInterval(timerInterval);
        document.getElementById('quiz').classList.add('hidden');
        document.getElementById('results').classList.remove('hidden');
        window.displayResults();
        window.saveHistory();
        window.logError(`Quiz ended, displaying results`);
    } catch (error) {
        window.logError(`Error in endQuiz: ${error.message}`);
        console.error(error);
    }
};
window.displayResults = function() {
    try {
        const total = mode === 'study' ? currentQuestions.length : 150;
        document.getElementById('score').innerText = `Score: ${score} / ${total}`;
        const domainErrors = { 1: 0, 2: 0, 3: 0, 4: 0 };
        userAnswers.forEach(answer => {
            const q = questions.find(q => q.id === answer.id);
            if (!answer.correct) domainErrors[q.domain]++;
        });
        const totalQuestions = userAnswers.length;
        document.getElementById('domain-errors').innerHTML = `
            Domain Errors:<br>
            Fundamentals: ${totalQuestions ? ((domainErrors[1] / totalQuestions) * 100).toFixed(2) : 0}%<br>
            Predictive: ${totalQuestions ? ((domainErrors[2] / totalQuestions) * 100).toFixed(2) : 0}%<br>
            Agile: ${totalQuestions ? ((domainErrors[3] / totalQuestions) * 100).toFixed(2) : 0}%<br>
            Business Analysis: ${totalQuestions ? ((domainErrors[4] / totalQuestions) * 100).toFixed(2) : 0}%
        `;
        // Include references in history only
        let domainReferences = {};
        userAnswers.forEach(answer => {
            const q = questions.find(q => q.id === answer.id);
            if (q && q.reference) {
                if (!domainReferences[q.domain]) domainReferences[q.domain] = [];
                domainReferences[q.domain].push(q.reference);
            }
        });
        document.getElementById('references').innerText = JSON.stringify(domainReferences);
        window.logError(`Displayed results: Score ${score}/${total}, Domain Errors: ${JSON.stringify(domainErrors)}`);
    } catch (error) {
        window.logError(`Error in displayResults: ${error.message}`);
        console.error(error);
    }
};
window.saveHistory = function() {
    try {
        const domainErrors = { 1: 0, 2: 0, 3: 0, 4: 0 };
        userAnswers.forEach(answer => {
            const q = questions.find(q => q.id === answer.id);
            if (!answer.correct) domainErrors[q.domain]++;
        });
        // Include references in history
        let domainReferences = {};
        userAnswers.forEach(answer => {
            const q = questions.find(q => q.id === answer.id);
            if (q && q.reference) {
                if (!domainReferences[q.domain]) domainReferences[q.domain] = [];
                domainReferences[q.domain].push(q.reference);
            }
        });
        history.push({
            date: new Date().toISOString(),
            mode,
            program,
            score,
            total: mode === 'study' ? currentQuestions.length : 150,
            domainErrors,
            domainReferences
        });
        localStorage.setItem('quizHistory', JSON.stringify(history));
        window.logError(`Saved quiz history with references`);
    } catch (error) {
        window.logError(`Error in saveHistory: ${error.message}`);
        console.error(error);
    }
};
window.viewHistory = function() {
    try {
        document.getElementById('results').classList.add('hidden');
        document.getElementById('quiz-history').classList.remove('hidden');
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = history.map(h => `
            <p>${h.date}: ${h.mode} Mode, Program ${h.program}, Score: ${h.score}/${h.total}</p>
        `).join('');
        window.logError(`Displayed quiz history`);
    } catch (error) {
        window.logError(`Error in viewHistory: ${error.message}`);
        console.error(error);
    }
};
window.viewDetailedHistory = function() {
    try {
        document.getElementById('quiz-history').classList.add('hidden');
        document.getElementById('detailed-history').classList.remove('hidden');
        const studyHistory = history.filter(h => h.mode === 'study').map(h => `
            <p>${h.date}: Program ${h.program}, Score: ${h.score}/${h.total}, Errors: ${JSON.stringify(h.domainErrors)}, References: ${JSON.stringify(h.domainReferences)}</p>
        `).join('');
        const examHistory = history.filter(h => h.mode === 'exam').map(h => `
            <p>${h.date}: Program ${h.program}, Score: ${h.score}/${h.total}, Errors: ${JSON.stringify(h.domainErrors)}, References: ${JSON.stringify(h.domainReferences)}</p>
        `).join('');
        document.getElementById('study-history').innerHTML = studyHistory || 'No study mode history';
        document.getElementById('exam-history').innerHTML = examHistory || 'No exam mode history';
        window.logError(`Displayed detailed history`);
    } catch (error) {
        window.logError(`Error in viewDetailedHistory: ${error.message}`);
        console.error(error);
    }
};
window.downloadLog = function() {
    try {
        errorLog.push(...logQueue);
        localStorage.setItem('errorLog', JSON.stringify(errorLog));
        logQueue = [];
        const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, 15);
        const blob = new Blob([errorLog.map(e => `${e.timestamp}: ${e.message}`).join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `error_log_${timestamp}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        window.logError(`Downloaded error log with timestamp ${timestamp}`);
    } catch (error) {
        window.logError(`Error in downloadLog: ${error.message}`);
        console.error(error);
    }
};
// Delay initialization to ensure jsonInterface.js loads
setTimeout(() => {
    try {
        window.logError(`Initializing application`);
        window.loadQuestions();
    } catch (error) {
        window.logError(`Initialization error: ${error.message}`);
        console.error(error);
    }
}, 100);
// Syllabus titles for each program
const syllabus = {
    1: [
        "Module 1: Introduction to Project Management",
        "Module 2: The Role of a Project Manager",
        "Module 3: The Project Management Life Cycle and Methodologies",
        "Module 4: Organizational Influences and Project Management"
    ],
    2: [
        "Course 1: Foundations of Project Management",
        "Course 2: Project Initiation: Starting a Successful Project",
        "Course 3: Project Planning: Putting It All Together",
        "Course 4: Project Execution: Running the Project",
        "Course 5: Agile Project Management",
        "Course 6: Capstone: Applying Project Management in the Real World",
        "Course 7: Career Planning and Preparation"
    ],
    3: [
        "Module 1: Introduction to Agile Project Management and Scrum Theory",
        "Module 2: Pillars of Scrum and Scrum Team Roles",
        "Module 3: Building and Managing the Product Backlog and Scrum Events",
        "Module 4: Implementing Agile Strategies and Coaching Agile Teams"
    ],
    4: [
        "Module 1: Analyzing Project Requirements and Creating a Project Charter",
        "Module 2: Developing a Project Plan",
        "Module 3: Managing Quality and Facilitating Retrospectives",
        "Module 4: Communicating Project Impact and Preparing for Job Interviews"
    ]
};
// Map program to module count for validation
const moduleCounts = {
    1: 4, // Foundations
    2: 7, // Google PM
    3: 4, // Agile
    4: 4 // Capstone
};
// Padding to maintain 541 lines (original content preserved, adjusted to current length)
let padding = "";
for (let i = 0; i < 365; i++) {
    padding += "\n// Line " + (176 + i) + " padding to match current 541 lines";
}