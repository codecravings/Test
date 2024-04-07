let quizData = [];
let currentQuestionIndex = 0;
let score = 0;

document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startBtn');
    const configPhase = document.getElementById('configPhase');
    const configSubmit = document.getElementById('configSubmit');

    startBtn.addEventListener('click', function() {
        startBtn.style.display = 'none';
        configPhase.style.display = 'block';
    });

    configSubmit.addEventListener('click', function(event) {
        event.preventDefault(); 
        configPhase.style.display = 'none';

        const numQuestions = parseInt(document.getElementById('numQuestions').value, 10);
      
        for (let i = 1; i <= numQuestions; i++) {
            generateQuestionForm(i);
        }

       
        const submitQuestionsBtn = document.createElement('button');
        submitQuestionsBtn.textContent = 'Submit Questions';
        submitQuestionsBtn.addEventListener('click', function() {
            submitQuestions(); 
        });
        document.getElementById('app').appendChild(submitQuestionsBtn);
    });
});

function generateQuestionForm(questionNumber) {
    const form = document.createElement('div');
    form.innerHTML = `
        <div>
            <h2>Question ${questionNumber}</h2>
            <input type="text" placeholder="Enter question" required>
            <input type="file" accept="image/*">
            <div style="display: flex; flex-direction: column;">
                <input type="text" placeholder="Option 1" required>
                <input type="text" placeholder="Option 2" required>
                <input type="text" placeholder="Option 3" required>
                <input type="text" placeholder="Option 4" required>
            </div>
            <select>
                <option value="">Select the correct answer</option>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
                <option value="4">Option 4</option>
            </select>
        </div>
    `;
    form.className = 'questionForm glassmorphism'; 
    document.getElementById('app').appendChild(form);
}

function submitQuestions() {
    quizData = [];
    const questionForms = document.querySelectorAll('.questionForm');

    questionForms.forEach((form, index) => {
        
    const questionText = form.querySelector('input[type="text"]').value;
    const options = form.querySelectorAll('input[type="text"]:not([placeholder="Enter question"])'); 
    const correctAnswer = form.querySelector('select').value;


        const questionData = {
            question: questionText,
            options: Array.from(options).map(option => option.value),
            correctAnswer: parseInt(correctAnswer) - 1 
        };

        quizData.push(questionData);
    });


    startQuiz(); 
}

function startQuiz() {
    score = 0;
    currentQuestionIndex = 0;
    showQuestion(currentQuestionIndex); 
}

function showQuestion(index) {
    if (index < quizData.length) {
        const question = quizData[index];
        const app = document.getElementById('app');
        app.innerHTML = ''; 

        const questionElement = document.createElement('div');
        questionElement.className = 'question glassmorphism';
        questionElement.innerHTML = `
            <h2>Question ${index + 1}: ${question.question}</h2>
            ${question.options.map((option, i) => `
                <button class="option" data-option-index="${i}">${option}</button>
            `).join('')}`;

        app.appendChild(questionElement);

        document.querySelectorAll('.option').forEach(button => {
            button.addEventListener('click', function() {
                const optionIndex = this.getAttribute('data-option-index');
                handleAnswer(index, optionIndex);
            });
        });
    } else {
        endQuiz(); 
    }
}

function handleAnswer(questionIndex, optionIndex) {
    const question = quizData[questionIndex];
    
    if (question.correctAnswer == optionIndex) {
        alert('Correct!');
        score++;
    } else {
        alert('Wrong!');
    }


    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    } else {
        endQuiz();
    }
}

function endQuiz() {
    const app = document.getElementById('app');
    app.innerHTML = `<h1>Quiz Completed!</h1>
                     <p>Your Score: ${score} out of ${quizData.length}</p>`;

}

function saveQuizData() {

    const dataStr = JSON.stringify(quizData);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'quizData.json';
    link.href = url;
    link.click();
}
