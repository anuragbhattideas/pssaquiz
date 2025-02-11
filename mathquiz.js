let quizData = [];
let currentQuestionIndex = 0;
let score = 0;
const sheetURLs = {
    "grade3": "Grade3.csv",
    "grade4": "Grade4.csv",
    "grade5": "5Questions.csv",
    "grade6": "Grade6.csv"
};

function showPage(page) {
    document.getElementById("home").classList.add("hidden");
    document.getElementById("quiz").classList.add("hidden");
    document.getElementById("about").classList.add("hidden");
    document.getElementById(page).classList.remove("hidden");

    if (page === "quiz") checkSavedGrade();
}

function closeMenu() {
    let navbarToggler = document.querySelector(".navbar-toggler");
    let navbarCollapse = document.querySelector(".navbar-collapse");
    if (navbarCollapse.classList.contains("show")) {
        navbarToggler.click();
    }
}

function saveGrade() {
    let grade = document.getElementById("grade-select").value;
    if (grade) {
        document.cookie = `selectedGrade=${grade};path=/`;
        loadQuiz(grade);
    }
}

function checkSavedGrade() {
    let cookies = document.cookie.split("; ");
    let selectedGrade = cookies.find(row => row.startsWith("selectedGrade="))?.split("=")[1];
    if (selectedGrade) {
        document.getElementById("grade-select").value = selectedGrade;
        loadQuiz(selectedGrade);
    }
}

async function loadQuiz(grade) {
    const response = await fetch(sheetURLs[grade]);
    const text = await response.text();
    const rows = text.split("\n").slice(1);
    quizData = rows.map(row => {
        const columns = row.split(",");
        return {
            question: columns[0],
            options: [columns[1], columns[2], columns[3], columns[4]],
            answer: columns[5],
            hint: columns[6]
        };
    });

    document.getElementById("quiz-container").classList.remove("hidden");
    document.querySelectorAll(".nav-link").forEach(tab => tab.classList.remove("active"));
    document.getElementById(`tab-${grade}`).classList.add("active");
    document.getElementById("score-container").classList.remove("hidden");

    score = 0;
    updateScoreDisplay();
    currentQuestionIndex = 0;
    loadQuestion();
}

function loadQuestion() {
    let q = quizData[currentQuestionIndex];
    document.getElementById("question").innerText = q.question;
    document.getElementById("options").innerHTML = q.options.map(option =>
        `<button class="btn btn-primary btn-option" onclick="checkAnswer('${option}')">${option}</button>`
    ).join('');
    document.getElementById("hint").classList.add("hidden");
    document.getElementById("answer").classList.add("hidden");
}

function checkAnswer(selected) {
    const correctAnswer = quizData[currentQuestionIndex].answer.trim();
    if (selected === correctAnswer) {
        alert("✅ Correct!");
        score++;
        updateScoreDisplay();
    } else {
        alert("❌ Wrong! Try again.");
    }
}

function updateScoreDisplay() {
    document.getElementById("score").textContent = score;
}

function showHint() {
    document.getElementById("hint").innerText = quizData[currentQuestionIndex].hint;
    document.getElementById("hint").classList.remove("hidden");
}

function showAnswer() {
    document.getElementById("answer").innerText = "Answer: " + quizData[currentQuestionIndex].answer;
    document.getElementById("answer").classList.remove("hidden");
}

function nextQuestion() {
    currentQuestionIndex = (currentQuestionIndex + 1) % quizData.length;
    loadQuestion();
}