document.addEventListener('DOMContentLoaded', () => {
    // Definimos la fecha objetivo (8 de julio de 2025)
    const targetDate = new Date("Jul 7, 2025 14:34:00").getTime();

    // --- General Utility Functions ---
    function mostrarSeccion(id) {
        document.querySelectorAll('section').forEach(s => {
            if (s.id !== 'particles') {
                s.style.display = 'none';
                s.classList.remove('loading');
            }
        });
        const section = document.getElementById(id);
        if (section) {
            section.style.display = 'flex';
            section.classList.add('loading');
        }
    }

    function volverMenu() {
        mostrarSeccion('main-surprise-menu');
        resetConstellation();
        resetTrivia();
    }

    // --- Background Particles ---
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer.hasChildNodes()) {
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
                particlesContainer.appendChild(particle);
            }
        }
    }

    // --- Countdown Logic ---
    function setupCountdown(target) {
        const days = document.getElementById('days');
        const hours = document.getElementById('hours');
        const minutes = document.getElementById('minutes');
        const seconds = document.getElementById('seconds');
        const countdownSection = document.getElementById('countdown-section');
        const unlockMenuButton = document.getElementById('unlock-menu-button');

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = target - now;

            if (distance <= 0) {
                clearInterval(timer);

                if (countdownSection.style.display !== 'none') {
                    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                    setTimeout(() => confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } }), 300);
                    setTimeout(() => confetti({ particleCount: 80, spread: 90, origin: { y: 0.4 } }), 600);
                }

                mostrarSeccion('anniversary-message');
                unlockMenuButton.onclick = () => {
                    mostrarSeccion('main-surprise-menu');
                };
                return;
            }

            const d = Math.floor(distance / (1000 * 60 * 60 * 24));
            const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((distance % (1000 * 60)) / 1000);

            days.innerText = String(d).padStart(2, '0');
            hours.innerText = String(h).padStart(2, '0');
            minutes.innerText = String(m).padStart(2, '0');
            seconds.innerText = String(s).padStart(2, '0');
        }

        const timer = setInterval(updateCountdown, 1000);
        updateCountdown();
    }

    // --- Constellation Logic ---
    const constellationSection = document.getElementById('constellation-section');
    const stars = document.querySelectorAll('.star');
    const starPopup = document.getElementById('star-popup');
    const popupContent = starPopup.querySelector('.popup-content');
    const popupCloseBtn = starPopup.querySelector('.popup-close');
    const constellationCanvas = document.getElementById('constellation-canvas');
    const ctx = constellationCanvas.getContext('2d');
    const constellationContainer = document.querySelector('.constellation-container');

    const starContents = {
        '1': "Gracias por amarme, por hacerme feliz",
        '2': "Gracias por ser mi primera vez de muchas cosas",
        '3': "Gracias por por hacerme muy afortunado",
        '4': "Gracias por ser tan buena, tan increíble, tan especial conmigo",
        '5': "Gracias por por estos 3 años tan increíbles",
        '6': "Gracias por ser mi novia, mi mejor amiga y mi todo",
    };

    let connectionOrder = [];
    const heartOrder = [0, 1, 2, 5, 3, 4, 0];

    window.resizeCanvas = () => {
        if (constellationCanvas && constellationContainer) {
            constellationCanvas.width = constellationContainer.offsetWidth;
            constellationCanvas.height = constellationContainer.offsetHeight;
            drawConnections();
        }
    };
    window.addEventListener('resize', resizeCanvas);

    function drawConnections() {
        if (!ctx) return;
        ctx.clearRect(0, 0, constellationCanvas.width, constellationCanvas.height);
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffd700';
        ctx.lineCap = 'round';

        if (connectionOrder.length < 2) return;

        ctx.beginPath();
        const starsToDraw = connectionOrder.length === heartOrder.length ? heartOrder : connectionOrder;

        const sortedStars = Array.from(stars).sort((a, b) => parseInt(a.dataset.index) - parseInt(b.dataset.index));

        let firstStarEl = sortedStars.find(s => parseInt(s.dataset.index) === starsToDraw[0]);
        if (!firstStarEl) return;
        let firstStarRect = firstStarEl.getBoundingClientRect();
        let containerRect = constellationContainer.getBoundingClientRect();
        let startX = (firstStarRect.left + firstStarRect.width / 2) - containerRect.left;
        let startY = (firstStarRect.top + firstStarRect.height / 2) - containerRect.top;
        ctx.moveTo(startX, startY);

        for (let i = 1; i < starsToDraw.length; i++) {
            let currentStarEl = sortedStars.find(s => parseInt(s.dataset.index) === starsToDraw[i]);
            if (!currentStarEl) continue;
            let currentStarRect = currentStarEl.getBoundingClientRect();
            let endX = (currentStarRect.left + currentStarRect.width / 2) - containerRect.left;
            let endY = (currentStarRect.top + currentStarRect.height / 2) - containerRect.top;
            ctx.lineTo(endX, endY);
        }
        ctx.stroke();
    }

    let currentHeartStep = 0;

    stars.forEach(star => {
        star.addEventListener('click', () => {
            if (star.classList.contains('visited')) return;

            const starId = star.dataset.id;
            const starIndex = parseInt(star.dataset.index);
            const content = starContents?.[starId];

            if (starIndex === heartOrder?.[currentHeartStep]) {
                star.classList.add('visited');
                connectionOrder.push(starIndex);

                if (content) {
                    popupContent.innerHTML = `<strong>${content}</strong>`;
                    starPopup.style.display = 'flex';
                }

                currentHeartStep++;
                drawConnections();

                if (currentHeartStep === heartOrder.length - 1) {
                    connectionOrder.push(heartOrder[0]);
                    drawConnections();

                    setTimeout(() => {
                        const finalMessage = document.createElement('p');
                        finalMessage.classList.add('constellation-complete-message');
                        constellationSection.insertBefore(finalMessage, constellationSection.querySelector('.back-to-menu'));
                    }, 800);
                }

            } else {
                alert("Sigue el orden correcto");
            }
        });
    });

    popupCloseBtn.addEventListener('click', () => {
        starPopup.style.display = 'none';
    });

    function resetConstellation() {
        stars.forEach(star => star.classList.remove('visited'));
        connectionOrder = [];
        currentHeartStep = 0;
        if (ctx) ctx.clearRect(0, 0, constellationCanvas.width, constellationCanvas.height);
        const finalMessage = constellationSection.querySelector('.constellation-complete-message');
        if (finalMessage) finalMessage.remove();
    }

    // --- Trivia Game Logic ---
    const triviaQuestions = [
        { question: "¿Qué hace que nuestra relación sea única?", options: ["No saludarnos", "Decirnos buenos días", "Decirnos buenas noches"], answer: "No saludarnos" },
        { question: "¿Cuándo fue nuestro primer beso?", options: ["09/09", "10/09", "11/09", "12/09"], answer: "12/09" },
        { question: "¿Cuántos días llevamos de relación?", options: ["1090", "1093", "1097", "1100"], answer: "1097" }
    ];
    let currentQuestionIndex = 0;
    let score = 0;

    const quizQuestionEl = document.getElementById('quiz-question');
    const quizOptionsEl = document.getElementById('quiz-options');
    const quizFeedbackEl = document.getElementById('quiz-feedback');

    window.initGame = () => {
        currentQuestionIndex = 0;
        score = 0;
        quizFeedbackEl.innerText = '';
        displayQuestion();
    };

    function displayQuestion() {
        if (currentQuestionIndex < triviaQuestions.length) {
            const q = triviaQuestions?.[currentQuestionIndex];
            quizQuestionEl.innerText = q.question;
            quizOptionsEl.innerHTML = '';
            q.options.forEach(option => {
                const button = document.createElement('button');
                button.innerText = option;
                button.onclick = () => checkAnswer(option, q.answer);
                quizOptionsEl.appendChild(button);
            });
        } else {
            mostrarSeccion('prize');
        }
    }

    function checkAnswer(selectedOption, correctAnswer) {
        if (selectedOption === correctAnswer) {
            quizFeedbackEl.innerText = '¡Correcto!';
            score++;
        } else {
            quizFeedbackEl.innerText = `Incorrecto. La respuesta era: ${correctAnswer}`;
        }
        Array.from(quizOptionsEl.children).forEach(button => button.disabled = true);
        setTimeout(() => {
            currentQuestionIndex++;
            quizFeedbackEl.innerText = '';
            displayQuestion();
        }, 1500);
    }

    function resetTrivia() {
        currentQuestionIndex = 0;
        score = 0;
        quizFeedbackEl.innerText = '';
        quizQuestionEl.innerText = '';
        quizOptionsEl.innerHTML = '';
    }

    // --- Main Initialization Logic & Event Listeners ---
    createParticles();

    const now = new Date().getTime();
    const unlockMenuButton = document.getElementById('unlock-menu-button');

    if (now >= targetDate) {
        mostrarSeccion('anniversary-message');
        unlockMenuButton.onclick = () => {
            mostrarSeccion('main-surprise-menu');
        };
    } else {
        setupCountdown(targetDate);
        mostrarSeccion('countdown-section');
    }

    const triviaButton = document.getElementById('trivia-button');
    const constellationButton = document.getElementById('constellation-button');

    if (triviaButton) {
        triviaButton.addEventListener('click', () => {
            mostrarSeccion('quiz');
            initGame();
        });
    }

    if (constellationButton) {
        constellationButton.addEventListener('click', () => {
            mostrarSeccion('constellation-section');
            resizeCanvas();
            resetConstellation();
        });
    }

    document.querySelectorAll('.back-to-menu').forEach(button => {
        button.addEventListener('click', volverMenu);
    });
});