/**
 * Assessment Carousel Component
 * Reusable step-by-step form carousel with progress tracking
 * Uses Forest Canopy theme colours
 */

class AssessmentCarousel {
    constructor(config) {
        this.steps = config.steps || [];
        this.currentStep = 0;
        this.answers = {};
        this.onComplete = config.onComplete || null;
        this.autoSave = config.autoSave !== false;
        this.storageKey = config.storageKey || 'assessment-carousel-data';

        // DOM elements
        this.container = document.getElementById(config.containerId || 'carouselContainer');
        this.cardContent = null;
        this.prevButton = null;
        this.nextButton = null;
        this.actionButton = null;
        this.progressDotsContainer = null;
        this.progressText = null;

        this.init();
    }

    init() {
        if (!this.container) {
            console.error('Carousel container not found');
            return;
        }

        // Load saved progress if auto-save enabled
        if (this.autoSave) {
            this.loadProgress();
        }

        // Build carousel UI
        this.buildUI();

        // Initial render
        this.updateUI();
    }

    buildUI() {
        this.container.innerHTML = `
            <!-- Progress Text -->
            <div class="text-center mb-4">
                <span id="progressText" class="text-lg font-semibold" style="color: #2d4a2b;">
                    Step <span id="currentStepNum">1</span> of <span id="totalSteps">${this.steps.length}</span>
                </span>
            </div>

            <!-- Main Card Container -->
            <div class="position-relative">
                <!-- Card Content Area -->
                <div id="cardContent" class="carousel-card rounded-3 p-4 p-md-5 shadow-sm bg-white" style="min-height: 400px; transition: opacity 0.3s;">
                    <!-- Content injected by JavaScript -->
                </div>
            </div>

            <!-- Navigation Controls: Previous Button | Progress Dots | Next Button -->
            <div class="d-flex justify-content-between align-items-center mt-4 gap-3">
                <button
                    id="prevButton"
                    class="btn-modern-secondary d-flex align-items-center gap-2"
                    aria-label="Previous Step">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Previous</span>
                </button>

                <!-- Progress Dots -->
                <div id="progressDots" class="d-flex justify-content-center gap-3 flex-grow-1">
                    <!-- Dots injected by JavaScript -->
                </div>

                <button
                    id="nextButton"
                    class="btn-modern-primary d-flex align-items-center gap-2"
                    aria-label="Next Step">
                    <span>Next</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        `;

        // Cache DOM references
        this.cardContent = document.getElementById('cardContent');
        this.prevButton = document.getElementById('prevButton');
        this.nextButton = document.getElementById('nextButton');
        this.progressDotsContainer = document.getElementById('progressDots');
        this.progressText = document.getElementById('progressText');

        // Event listeners
        this.prevButton.addEventListener('click', () => this.navigate(-1));
        this.nextButton.addEventListener('click', () => this.navigate(1));

        // Initialize progress dots
        this.initProgressDots();
    }

    initProgressDots() {
        this.progressDotsContainer.innerHTML = '';
        this.steps.forEach((step, index) => {
            const dot = document.createElement('div');
            dot.className = 'carousel-progress-dot';
            dot.style.cssText = `
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: #d1d5db;
                cursor: pointer;
                transition: all 0.3s;
            `;
            dot.dataset.step = index;
            dot.title = step.title || `Step ${index + 1}`;

            dot.addEventListener('click', () => {
                this.currentStep = index;
                this.updateUI();
            });

            this.progressDotsContainer.appendChild(dot);
        });
    }

    updateProgressDots() {
        const dots = this.progressDotsContainer.querySelectorAll('.carousel-progress-dot');
        dots.forEach((dot, index) => {
            const isActive = index === this.currentStep;
            const isAnswered = this.isStepAnswered(index);

            if (isActive) {
                dot.style.backgroundColor = '#2d4a2b'; // Forest Green
                dot.style.transform = 'scale(1.3)';
            } else if (isAnswered) {
                dot.style.backgroundColor = '#7d8471'; // Sage (answered)
                dot.style.transform = 'scale(1)';
            } else {
                dot.style.backgroundColor = '#d1d5db'; // Gray (unanswered)
                dot.style.transform = 'scale(1)';
            }
        });
    }

    isStepAnswered(stepIndex) {
        const step = this.steps[stepIndex];
        if (!step || !step.questions) return false;

        return step.questions.every(q => {
            const answer = this.answers[q.id];
            if (!q.required) return true;

            if (q.type === 'checkbox') {
                return Array.isArray(answer) && answer.length > 0;
            } else if (q.type === 'textarea') {
                return answer && answer.trim().length > 0;
            } else {
                return answer !== null && answer !== undefined && answer !== '';
            }
        });
    }

    updateUI() {
        // Update step counter
        document.getElementById('currentStepNum').textContent = this.currentStep + 1;

        // Render current step or completion screen
        if (this.currentStep >= this.steps.length) {
            this.renderCompletionScreen();
        } else {
            this.renderStep();
        }

        // Update navigation buttons
        this.prevButton.disabled = this.currentStep === 0;

        // Next button: disabled if on last step OR if current step not answered
        if (this.currentStep >= this.steps.length - 1) {
            // On last step: next button triggers completion
            this.nextButton.disabled = !this.isStepAnswered(this.currentStep);
            this.nextButton.querySelector('span').textContent = 'Complete';
        } else {
            // Not on last step: next button goes to next step
            this.nextButton.disabled = !this.isStepAnswered(this.currentStep);
            this.nextButton.querySelector('span').textContent = 'Next';
        }

        // Update progress dots
        this.updateProgressDots();

        // Auto-save progress
        if (this.autoSave) {
            this.saveProgress();
        }
    }

    renderStep() {
        const step = this.steps[this.currentStep];

        let html = `
            <div class="mb-4">
                <h2 class="h3 mb-3" style="color: #2d4a2b;">${step.title}</h2>
                ${step.description ? `<p class="text-muted mb-4">${step.description}</p>` : ''}
            </div>
        `;

        if (step.questions) {
            step.questions.forEach((q, qIndex) => {
                html += this.renderQuestion(q, qIndex);
            });
        }

        this.cardContent.innerHTML = html;

        // Attach event listeners
        this.attachEventListeners();
    }

    renderQuestion(q, index) {
        const answer = this.answers[q.id];
        let html = `
            <div class="question-group mb-4 ${index > 0 ? 'mt-4 pt-4 border-top' : ''}">
                <label class="form-label fw-semibold mb-3" style="color: #2d4a2b;">
                    ${q.label}
                    ${q.required ? '<span class="text-danger">*</span>' : ''}
                </label>
        `;

        if (q.type === 'radio') {
            html += '<div class="d-flex flex-column gap-2">';
            q.options.forEach(option => {
                const isChecked = answer === option.value;
                html += `
                    <label class="carousel-option-label p-3 border rounded-2 cursor-pointer hover-forest-light">
                        <input
                            type="radio"
                            name="${q.id}"
                            value="${option.value}"
                            ${isChecked ? 'checked' : ''}
                            class="form-check-input me-2"
                            data-question-id="${q.id}">
                        <span>${option.label}</span>
                    </label>
                `;
            });
            html += '</div>';
        } else if (q.type === 'checkbox') {
            html += '<div class="d-flex flex-column gap-2">';
            q.options.forEach(option => {
                const isChecked = Array.isArray(answer) && answer.includes(option.value);
                html += `
                    <label class="carousel-option-label p-3 border rounded-2 cursor-pointer hover-forest-light">
                        <input
                            type="checkbox"
                            name="${q.id}"
                            value="${option.value}"
                            ${isChecked ? 'checked' : ''}
                            class="form-check-input me-2"
                            data-question-id="${q.id}">
                        <span>${option.label}</span>
                    </label>
                `;
            });
            html += '</div>';
        } else if (q.type === 'select') {
            html += `
                <select
                    id="${q.id}"
                    class="form-select"
                    data-question-id="${q.id}"
                    ${q.required ? 'required' : ''}>
                    <option value="">Select an option...</option>
            `;
            q.options.forEach(option => {
                const isSelected = answer === option.value;
                html += `<option value="${option.value}" ${isSelected ? 'selected' : ''}>${option.label}</option>`;
            });
            html += '</select>';
        } else if (q.type === 'textarea') {
            html += `
                <textarea
                    id="${q.id}"
                    class="form-control"
                    rows="${q.rows || 4}"
                    placeholder="${q.placeholder || ''}"
                    data-question-id="${q.id}"
                    ${q.required ? 'required' : ''}>${answer || ''}</textarea>
            `;
        } else if (q.type === 'number') {
            html += `
                <input
                    type="number"
                    id="${q.id}"
                    class="form-control"
                    value="${answer || ''}"
                    placeholder="${q.placeholder || ''}"
                    ${q.min !== undefined ? `min="${q.min}"` : ''}
                    ${q.max !== undefined ? `max="${q.max}"` : ''}
                    data-question-id="${q.id}"
                    ${q.required ? 'required' : ''}>
            `;
        } else if (q.type === 'text' || q.type === 'date') {
            html += `
                <input
                    type="${q.type}"
                    id="${q.id}"
                    class="form-control"
                    value="${answer || ''}"
                    placeholder="${q.placeholder || ''}"
                    data-question-id="${q.id}"
                    ${q.required ? 'required' : ''}>
            `;
        }

        html += '</div>';
        return html;
    }

    attachEventListeners() {
        // Radio buttons
        this.cardContent.querySelectorAll('input[type="radio"]').forEach(input => {
            input.addEventListener('change', (e) => {
                const questionId = e.target.dataset.questionId;
                this.answers[questionId] = e.target.value;
                this.updateUI();
            });
        });

        // Checkboxes
        this.cardContent.querySelectorAll('input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', (e) => {
                const questionId = e.target.dataset.questionId;
                if (!this.answers[questionId]) {
                    this.answers[questionId] = [];
                }

                if (e.target.checked) {
                    if (!this.answers[questionId].includes(e.target.value)) {
                        this.answers[questionId].push(e.target.value);
                    }
                } else {
                    this.answers[questionId] = this.answers[questionId].filter(v => v !== e.target.value);
                }

                this.updateUI();
            });
        });

        // Text inputs, textareas, selects, numbers, dates
        this.cardContent.querySelectorAll('input, textarea, select').forEach(input => {
            if (input.type === 'radio' || input.type === 'checkbox') return;

            input.addEventListener('input', (e) => {
                const questionId = e.target.dataset.questionId || e.target.id;
                this.answers[questionId] = e.target.value;
                this.updateUI();
            });
        });
    }

    renderCompletionScreen() {
        // Hide navigation buttons
        this.prevButton.classList.add('d-none');
        this.nextButton.classList.add('d-none');

        this.cardContent.innerHTML = `
            <div class="text-center py-5">
                <div class="mb-4">
                    <svg class="mx-auto" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="#2d4a2b" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 class="h3 mb-3" style="color: #2d4a2b;">Assessment Complete!</h2>
                <p class="text-muted mb-4">Thank you for completing this assessment. Your responses have been saved.</p>
                ${this.onComplete ? '<button id="viewResultsBtn" class="btn btn-modern-accent me-2">View Results</button>' : ''}
                <button id="restartBtn" class="btn btn-modern-secondary">Restart Assessment</button>
            </div>
        `;

        // Attach completion screen event listeners
        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.restart());
        }

        const viewResultsBtn = document.getElementById('viewResultsBtn');
        if (viewResultsBtn && this.onComplete) {
            viewResultsBtn.addEventListener('click', () => this.onComplete(this.answers));
        }
    }

    navigate(direction) {
        // If clicking Next on last step, show completion
        if (direction === 1 && this.currentStep === this.steps.length - 1) {
            this.currentStep = this.steps.length;
            this.updateUI();
            this.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }

        const newStep = this.currentStep + direction;
        if (newStep >= 0 && newStep < this.steps.length) {
            this.currentStep = newStep;
            this.updateUI();

            // Show buttons again if navigating away from completion
            this.prevButton.classList.remove('d-none');
            this.nextButton.classList.remove('d-none');

            // Scroll to top of card
            this.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    restart() {
        this.currentStep = 0;
        this.answers = {};
        if (this.autoSave) {
            localStorage.removeItem(this.storageKey);
        }
        this.prevButton.classList.remove('d-none');
        this.nextButton.classList.remove('d-none');
        this.updateUI();
    }

    saveProgress() {
        localStorage.setItem(this.storageKey, JSON.stringify({
            currentStep: this.currentStep,
            answers: this.answers
        }));
    }

    loadProgress() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.currentStep = data.currentStep || 0;
                this.answers = data.answers || {};
            } catch (e) {
                console.error('Failed to load saved progress:', e);
            }
        }
    }

    getAnswers() {
        return { ...this.answers };
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AssessmentCarousel;
}
