window.addEventListener('DOMContentLoaded', () => {
  const mainAPI = 'https://opentdb.com/api.php?amount=10';
  const allCategories = 'https://opentdb.com/api_category.php';
  const difficulty = 'https://opentdb.com/api.php?amount=10&difficulty=easy';
  const startQuiz = document.querySelector('.start_');
  let q_cat = document.querySelector('#q_cat');
  let q_diff = document.querySelector('#q_diff');

  let qBody = document.querySelector('.quiz_body');
  let qFooter = document.querySelector('.quiz_footer');
  let correctAnswers = [];

  function loadCategories() {
    fetch(allCategories)
      .then((res) => res.json())
      .then((db) => {
        let option = document.createElement('option');
        option.innerText = 'Any Category';
        option.value = '0';
        q_cat.appendChild(option);
        db.trivia_categories.forEach((item) => {
          let option = document.createElement('option');
          option.innerText = item.name;
          option.value = item.id;
          q_cat.appendChild(option);
        });
      });
  }
  loadCategories();
  function renderQuizAnswer(output, db, ind) {
    let answerActions = '';
    document.querySelector('.q_indicator').innerText = `${ind} / ${db.length}`;
    db.forEach((item, index) => {
      document.querySelectorAll('.ans_input_').forEach((radioButton) => {
        if (radioButton.checked == true) {
          if (item.correct_answer == radioButton.value) {
            correctAnswers.push(radioButton.value);
          }
        }
      });
      if (Number(ind) - 1 == Number(index)) {
        if (item.type === 'multiple') {
          item.incorrect_answers.forEach((incAns) => {
            answerActions += `
            <li>
                <label for="${incAns}">
                    <input type="radio" class="ans_input_" value="${incAns}" name="answ" id="${incAns}"/>
                    ${incAns}
                </label>
            </li>
        `;
          });
        } else {
          item.incorrect_answers.forEach((incAns) => {
            answerActions += `
                <li>
                    <label for="${incAns}">
                        <input type="radio" class="ans_input_" value="${incAns}" name="answ" id="${incAns}"/>
                        ${incAns}
                    </label>
                </li>
            `;
          });
        }
        answerActions += `
            <li>
                <label for="${item.correct_answer}">
                    <input type="radio" class="ans_input_" value="${item.correct_answer}" name="answ" id="${item.correct_answer}"/>
                    ${item.correct_answer}
                </label>
            </li>
    `;
        output.innerHTML = '';
        output.innerHTML = `
        <div class="q_answer_box">
            <div class="q_strings">Category: ${item.category}</div>
            <div class="q_strings">Difficulity: ${item.difficulty}</div>
            <div class="q_strings">Question: ${item.question}</div>
            <ul class="answer_list">${answerActions}</ul>
        </div>
      `;
      }
    });
  }
  startQuiz.addEventListener('click', () => {
    let index = startQuiz.getAttribute('quesindex');
    let category = q_cat.value;
    let difficult = q_diff.value;
    let quizAPI = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficult}`;
    fetch(quizAPI)
      .then((res) => res.json())
      .then((db) => {
        const { response_code, results } = db;
        if (response_code == 0) {
          let questionIndex = 2;
          qFooter.innerHTML = '';
          let nextButton = document.createElement('button');
          nextButton.innerText = 'Next';
          nextButton.className = 'q_buttons next_';
          nextButton.setAttribute('quesIndex', questionIndex);
          qFooter.appendChild(nextButton);

          renderQuizAnswer(qBody, results, index);
          nextButton.addEventListener('click', () => {
            let index = Number(nextButton.getAttribute('quesindex'));
            questionIndex++;
            nextButton.setAttribute('quesIndex', questionIndex);
            renderQuizAnswer(qBody, results, index);
            if (results.length == index - 1) {
              qBody.innerHTML = `You scored: ${correctAnswers.length} Out Of: ${results.length}`;
              document.querySelector('.q_indicator').innerText = ``;
              qFooter.innerHTML = '';
              let tryAgainBtn = document.createElement('button');
              tryAgainBtn.innerText = 'Try Again';
              tryAgainBtn.className = 'q_buttons again';
              qFooter.appendChild(tryAgainBtn);
              tryAgainBtn.addEventListener('click', () => {
                window.location.reload();
              });
            }
          });
        } else {
          alert('something went wrong please try again');
        }
      });
  });
});
