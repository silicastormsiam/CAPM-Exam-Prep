/* File Name: jsonInterface.js */
/* Owner: Grok as Lead Technical Specialist */
/* Purpose: Interface for loading, parsing, and filtering JSON data (questions.json). */
/* Version: 1.0.8 (August 03, 2025) - Enhanced filtering logic. */
/* Change Log: */
/* [2025-08-03] Enhanced _filterQuestions to parse string modules and programs (ID: filter-fix-20250803-02). */
/* [2025-08-03] Added parseInt to q.module to handle string modules (ID: filter-fix-20250803-01). */
/* [2025-08-03] Renamed FILE_NAME to JSON_FILE_NAME (ID: syntax-fix-20250803-02). */
/* [2025-08-03] Replaced localStorage logging with POST to /api/log (ID: logging-enhancement-20250803-03). */
/* [2025-08-03] Added error logging for JSON fetching and filtering (ID: dsm-deployment-20250803-37). */
const JSON_VERSION = "1.0.8";
const JSON_FILE_NAME = "jsonInterface.js";

window._loadQuestions = async function() {
    try {
        const response = await fetch('http://192.168.1.248:8085/api/questions');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const questions = await response.json();
        window._logError(`Loaded ${questions.length} questions from questions.json`);
        return questions;
    } catch (err) {
        window._logError(`Error loading questions: ${err.message}`);
        return [];
    }
};

window._filterQuestions = function(questions, mode, program, moduleRange) {
    try {
        let filtered = questions.filter(q => parseInt(q.program) === program || !q.program);
        if (moduleRange.from && moduleRange.to) {
            filtered = filtered.filter(q => {
                const moduleNum = parseInt(q.module);
                return moduleNum >= moduleRange.from && moduleNum <= moduleRange.to;
            });
        }
        window._logError(`Filtered ${filtered.length} questions for program ${program}, module range ${moduleRange.from}-${moduleRange.to}`);
        return filtered;
    } catch (err) {
        window._logError(`Error filtering questions: ${err.message}`);
        return [];
    }
};

window._logError = function(message) {
    fetch('http://192.168.1.248:8085/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            timestamp: new Date().toISOString(),
            message: message,
            file: JSON_FILE_NAME,
            version: JSON_VERSION
        })
    }).catch(err => console.error('Failed to log error:', err));
};