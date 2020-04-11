const questionText = document.querySelector('.question-text');
const optionBox = document.querySelector('.option-box');
const currentQuestionNum = document.querySelector('.current-question-num');
const answerDescription = document.querySelector('.answer-description');
const nextQuestionBtn = document.querySelector('.next-question-btn');
const correctAnswers = document.querySelector('.correct-answers');
const seeResultsBtn = document.querySelector('.see-result-btn');
const remainingTime = document.querySelector('.remaining-time');
const timeUpText = document.querySelector('.time-up-text');
const quizBox = document.querySelector('.quiz-box');
const quizOverBox = document.querySelector('.quiz-over-box');
const quizHomeBox = document.querySelector('.quiz-home-box');
const startAgainQuizBtn = document.querySelector('.start-again-quiz-btn');
const goHomeBtn = document.querySelector('.go-to-home-btn');
const startQuizBtn = document.querySelector('.start-quiz-btn');

let attempt = 0;
let myArray = [];
let questionIndex = 0;
let score = 0;
let number = 0;
let interval;

let myApp = [];

window.onload = () => {
    fetch("https://nil1729.github.io/QuizApp/quizdata.json")
        .then(function(resp) {
            return resp.json();
        })
        .then(function(data) {
            for (let i = 0; i < data.length; i++) {
                // console.log(data[i]);
                myApp.push({ question: data[i].question, options: data[i].options, answer: data[i].answer, description: data[i].description });
            }
        });
    setTimeout(() => {
        document.querySelector(".loader").style.display = "none";
        document.querySelector(".loader").remove();
        quizHomeBox.classList.add('show');
    }, 4500);
};

function generateRandomQuestion() {
    const randomNumber = Math.floor(Math.random() * myApp.length);
    let hitDuplicate = 0;
    if (myArray.length == 0) {
        questionIndex = randomNumber;
    } else {
        for (let i = 0; i < myArray.length; i++) {
            if (randomNumber == myArray[i]) {
                hitDuplicate = 1;
            }
        }
        if (hitDuplicate == 1) {
            generateRandomQuestion();
            return;
        } else {
            questionIndex = randomNumber;
        }
    }
    myArray.push(randomNumber);
    load();
}


function resetQuiz() {
    attempt = 0;
    myArray = [];
    score = 0;
    number = 0;
}

function timeIsUp() {
    showTimeUpText();
    for (let i = 0; i < optionBox.children.length; i++) {
        if (optionBox.children[i].id == myApp[questionIndex].answer) {
            optionBox.children[i].classList.add("show-correct");
        }
    }
    disableOptions();
    showAnswerDescription();
    showNextQuestionBtn();
}

function startTimer() {
    let timeLimit = 15;
    remainingTime.innerHTML = timeLimit;
    remainingTime.classList.remove('less-time');
    interval = setInterval(() => {

        if (timeLimit < 6) {
            remainingTime.classList.add('less-time');
        }
        if (timeLimit < 10) {
            timeLimit = "0" + timeLimit;
        }
        remainingTime.innerHTML = timeLimit;
        if (timeLimit == 0) {
            clearInterval(interval);
            timeIsUp();
        }
        timeLimit--;
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);
}

function quizOver() {
    nextQuestionBtn.classList.remove("show");
    seeResultsBtn.classList.add("show");
}

function scoreBoard() {
    correctAnswers.innerHTML = score;
}

function showTimeUpText() {
    timeUpText.classList.add('show');
}

function hideTimeUpText() {
    timeUpText.classList.remove('show');
}

function showNextQuestionBtn() {
    nextQuestionBtn.classList.add('show');
}

function hideNextQuestionBtn() {
    nextQuestionBtn.classList.remove('show');
}

function showAnswerDescription() {
    if (typeof myApp[questionIndex].description !== 'undefined') {
        answerDescription.classList.add("show");
        answerDescription.innerHTML = myApp[questionIndex].description;
    }
}

function hideAnswerDescription() {

    answerDescription.classList.remove("show");
    answerDescription.innerHTML = "";
}



function disableOptions() {
    for (let i = 0; i < optionBox.children.length; i++) {
        optionBox.children[i].removeAttribute("onclick");
        optionBox.children[i].classList.add("already-answered");
    }
}

function check(element) {
    const id = element.id;
    if (id == myApp[questionIndex].answer) {
        element.classList.add("correct");
        score++;
        scoreBoard();
    } else {
        element.classList.add("wrong");
        for (let i = 0; i < optionBox.children.length; i++) {
            if (optionBox.children[i].id == myApp[questionIndex].answer) {
                optionBox.children[i].classList.add("show-correct");
            }
        }
    }

    attempt++;
    disableOptions();
    showAnswerDescription();
    showNextQuestionBtn();
    stopTimer();
    if (number == myApp.length) {
        quizOver();
    }
}

function createOptions() {
    optionBox.innerHTML = "";
    let animationDelay = 0.2;
    for (let i = 0; i < myApp[questionIndex].options.length; i++) {
        const option = document.createElement('div');
        option.innerHTML = myApp[questionIndex].options[i];
        option.classList.add("option");
        option.id = i;
        option.style.animationDelay = animationDelay + "s";
        animationDelay = animationDelay + 0.2;
        option.setAttribute("onclick", "check(this)");
        optionBox.appendChild(option);
    }
}

function load() {
    number++;
    scoreBoard();
    questionText.innerHTML = myApp[questionIndex].question;
    createOptions();
    currentQuestionNum.innerHTML = number + '/' + myApp.length;
}

function nextQuestion() {
    startTimer();
    generateRandomQuestion()
    hideNextQuestionBtn();
    hideAnswerDescription();
    hideTimeUpText()

}

function quizResult() {
    document.querySelector('.total-questions').innerHTML = myApp.length;
    document.querySelector('.total-attempt').innerHTML = attempt;
    document.querySelector('.total-correct').innerHTML = score;
    document.querySelector('.total-wrong').innerHTML = attempt - score;
    const percentage = (score / myApp.length) * 100;
    document.querySelector('.percentage').innerHTML = percentage.toFixed(2) + "%";
}
seeResultsBtn.addEventListener('click', () => {
    quizBox.classList.remove('show');
    seeResultsBtn.classList.remove('show');
    quizOverBox.classList.add('show');
    quizResult();
})
nextQuestionBtn.addEventListener("click", nextQuestion);

startAgainQuizBtn.addEventListener('click', () => {
    location.replace("./end.html")
})

goHomeBtn.addEventListener('click', () => {
    quizOverBox.classList.remove('show');
    quizHomeBox.classList.add('show');
    resetQuiz();
})

startQuizBtn.addEventListener('click', () => {
    quizHomeBox.classList.remove('show');
    quizBox.classList.add('show');
    nextQuestion();
})