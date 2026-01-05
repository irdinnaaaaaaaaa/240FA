// Dynamite Sports Learner - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Tip of the day
    const tips = [
        "Start with learning basic grip and clear shots before advanced techniques.",
        "Practice low serves close to the net and focus on consistency.",
        "Improve footwork and positioning before increasing power.",
        "Take short breaks and focus on controlled rallies.",
        "Play 1 to 2 times per week and practice basic drills.",
        "Focus on keeping the shuttle in play rather than winning points."
    ];

    const dailyTipElement = document.getElementById('daily-tip');
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    dailyTipElement.textContent = randomTip;

    // Expandable cards
    const expandBtns = document.querySelectorAll('.expand-btn');
    expandBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const content = this.nextElementSibling;
            if (content.style.display === 'block') {
                content.style.display = 'none';
                this.textContent = 'Learn More';
            } else {
                content.style.display = 'block';
                this.textContent = 'Show Less';
            }
        });
    });

    // FAQ expandable
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
            } else {
                answer.style.display = 'block';
            }
        });
    });

    // Progress tracking
    const plans = ['Beginner Basics', 'Serve Starter', 'First Skills', 'Court Awareness', 'Game Ready'];
    let currentPlanIndex = parseInt(localStorage.getItem('currentPlanIndex')) || 0;
    const nextPlanElement = document.getElementById('next-plan');
    nextPlanElement.textContent = plans[currentPlanIndex];

    const markCompleteBtn = document.getElementById('mark-complete');
    markCompleteBtn.addEventListener('click', function() {
        if (currentPlanIndex < plans.length - 1) {
            currentPlanIndex++;
            localStorage.setItem('currentPlanIndex', currentPlanIndex);
            nextPlanElement.textContent = plans[currentPlanIndex];
        } else {
            nextPlanElement.textContent = 'You\'re all set! Keep practicing!';
            markCompleteBtn.disabled = true;
        }
    });

    // Store last viewed topic
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.addEventListener('click', function() {
            localStorage.setItem('lastViewed', this.id);
        });
    });

    // On load, scroll to last viewed if exists
    const lastViewed = localStorage.getItem('lastViewed');
    if (lastViewed) {
        const element = document.getElementById(lastViewed);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
});