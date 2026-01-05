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

    // Missions
    const missions = [
        {id: 'read_basics', title: 'Read Beginner Basics', completed: false},
        {id: 'take_quiz', title: 'Take Your First Quiz', completed: false},
        {id: 'learn_equipment', title: 'Learn About Equipment', completed: false},
        {id: 'practice_serve', title: 'Practice Serve', completed: false},
        {id: 'play_game', title: 'Play a Game', completed: false}
    ];

    // Load missions from localStorage
    const savedMissions = JSON.parse(localStorage.getItem('missions')) || {};
    missions.forEach(mission => {
        mission.completed = savedMissions[mission.id] || false;
    });

    // Display missions
    const missionList = document.getElementById('mission-list');
    missions.forEach(mission => {
        const li = document.createElement('li');
        li.textContent = mission.title;
        if (mission.completed) {
            li.classList.add('completed');
        }
        missionList.appendChild(li);
    });

    // Function to complete mission
    function completeMission(id) {
        const mission = missions.find(m => m.id === id);
        if (mission && !mission.completed) {
            mission.completed = true;
            savedMissions[id] = true;
            localStorage.setItem('missions', JSON.stringify(savedMissions));
            // Update UI
            const lis = missionList.querySelectorAll('li');
            lis.forEach((li, index) => {
                if (missions[index].id === id) {
                    li.classList.add('completed');
                }
            });
            alert(`Great job! Mission "${mission.title}" completed. Keep it up!`);
        }
    }

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
                // Mark mission based on plan
                const plan = btn.closest('.card').getAttribute('data-plan');
                if (plan === 'Beginner Basics') {
                    completeMission('read_basics');
                } else if (plan === 'Serve Starter') {
                    completeMission('practice_serve');
                } else if (plan === 'First Skills') {
                    completeMission('learn_equipment');
                } else if (plan === 'Game Ready') {
                    completeMission('play_game');
                }
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

    // Quiz
    const quizQuestions = [
        {
            question: "What is badminton?",
            options: ["A sport with a ball", "A racket sport with shuttlecock", "A swimming game", "A running race"],
            answer: 1
        },
        {
            question: "What equipment do you need for badminton?",
            options: ["Racket and shuttlecock", "Ball and net", "Bike and helmet", "Gloves and bat"],
            answer: 0
        },
        {
            question: "How do you serve in badminton?",
            options: ["With your hand", "Below waist height", "Above your head", "With your foot"],
            answer: 1
        },
        {
            question: "What is a rally in badminton?",
            options: ["A type of shot", "The sequence of shots", "The court size", "The score"],
            answer: 1
        },
        {
            question: "What is the net height in badminton?",
            options: ["1 meter", "1.5 meters", "2 meters", "2.5 meters"],
            answer: 1
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;

    const startQuizBtn = document.getElementById('start-quiz');
    const quizContainer = document.getElementById('quiz-container');
    const questionEl = document.getElementById('question');
    const optionsEl = document.getElementById('options');
    const nextBtn = document.getElementById('next-question');
    const quizResult = document.getElementById('quiz-result');
    const scoreEl = document.getElementById('score');
    const feedbackEl = document.getElementById('feedback');

    startQuizBtn.addEventListener('click', function() {
        currentQuestionIndex = 0;
        score = 0;
        quizContainer.style.display = 'block';
        quizResult.style.display = 'none';
        startQuizBtn.style.display = 'none';
        showQuestion();
    });

    function showQuestion() {
        const q = quizQuestions[currentQuestionIndex];
        questionEl.textContent = q.question;
        optionsEl.innerHTML = '';
        q.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.textContent = option;
            btn.addEventListener('click', () => selectOption(index));
            optionsEl.appendChild(btn);
        });
        nextBtn.style.display = 'none';
    }

    function selectOption(index) {
        const buttons = optionsEl.querySelectorAll('button');
        buttons.forEach(btn => btn.classList.remove('selected'));
        buttons[index].classList.add('selected');
        if (index === quizQuestions[currentQuestionIndex].answer) {
            score++;
        }
        nextBtn.style.display = 'block';
    }

    nextBtn.addEventListener('click', function() {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizQuestions.length) {
            showQuestion();
        } else {
            showResult();
        }
    });

    function showResult() {
        quizContainer.style.display = 'none';
        quizResult.style.display = 'block';
        const percentage = Math.round((score / quizQuestions.length) * 100);
        scoreEl.textContent = `You scored ${score} out of ${quizQuestions.length} (${percentage}%)`;
        if (percentage >= 60) {
            feedbackEl.textContent = "Awesome! You're getting the hang of badminton. Mission completed!";
            completeMission('take_quiz');
        } else {
            feedbackEl.textContent = "Good try! Review the basics and try again.";
        }
        startQuizBtn.style.display = 'block';
        startQuizBtn.textContent = 'Take Quiz Again';
    }

    // On load, scroll to last viewed if exists
    const lastViewed = localStorage.getItem('lastViewed');
    if (lastViewed) {
        const element = document.getElementById(lastViewed);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
});