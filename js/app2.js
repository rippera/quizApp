window.addEventListener('DOMContentLoaded', () => {
  const mainAPI = 'https://opentdb.com/api.php?amount=10';
  const allCategories = 'https://opentdb.com/api_category.php';
  const difficulty = 'https://opentdb.com/api.php?amount=10&difficulty=easy';
  const startQuiz = document.querySelector('.start_');
  let q_cat = document.querySelector('#q_cat');
  let q_diff = document.querySelector('#q_diff');
  let responseArray = [];
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
    // fetch(mainAPI + '&category=0')
    //   .then((res) => res.json())
    //   .then((db) => console.log(db));
  }
  loadCategories();
  function renderQuizAnswer(output, item) {
    let answerActions = '';
    if (item.type === 'multiple') {
      item.incorrect_answers.forEach((incAns) => {
        answerActions += `
              <label for="${incAns}">
                  <input type="radio" class="ans_input_" value="${incAns}" name="answ" id="${incAns}"/>
                  ${incAns}
              </label>
          `;
      });
    } else {
      item.incorrect_answers.forEach((incAns) => {
        answerActions += `
                  <label for="${incAns}">
                      <input type="radio" class="ans_input_" value="${incAns}" name="answ" id="${incAns}"/>
                      ${incAns}
                  </label>
              `;
      });
    }
    answerActions += `
          <label for="${item.correct_answer}">
              <input type="radio" class="ans_input_" value="${item.correct_answer}" name="answ" id="${item.correct_answer}"/>
              ${item.correct_answer}
          </label>
      `;
    output.innerHTML = '';
    output.innerHTML = `
          <div class="q_answer_box">
              <div class="q_strings">Category: ${item.category}</div>
              <div class="q_strings">Difficulity: ${item.difficulty}</div>
              <div class="q_strings">Question: ${item.question}</div>
              ${answerActions}
          </div>
        `;
  }
  startQuiz.addEventListener('click', () => {
    let category = q_cat.value;
    let difficult = q_diff.value;
    let quizAPI = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficult}`;
    fetch(quizAPI)
      .then((res) => res.json())
      .then((db) => {
        const { response_code, results } = db;
        console.log(results);
        let qBody = document.querySelector('.quiz_body');
        let qFooter = document.querySelector('.quiz_footer');
        if (response_code == 0) {
          let questionIndex = 1;
          qFooter.innerHTML = '';
          let nextButton = document.createElement('button');
          nextButton.innerText = 'Next';
          nextButton.className = 'q_buttons next_';
          nextButton.setAttribute('quesIndex', questionIndex);
          qFooter.appendChild(nextButton);
          renderQuizAnswer(qBody, results[0]);
          nextButton.addEventListener('click', () => {
            let index = Number(nextButton.getAttribute('quesindex'));
            questionIndex++;
            nextButton.setAttribute('quesIndex', questionIndex);
            results.forEach((item, ind) => {
              if (ind == index) {
                document
                  .querySelectorAll('.ans_input_')
                  .forEach((radioButton) => {
                    console.log(radioButton.value);
                    console.log(item.correct_answer);
                    // if (radioButton.checked == true) {
                    if (
                      item.correct_answer.toLowerCase() ==
                      radioButton.value.toLowerCase()
                    ) {
                      correctAnswers.push(radioButton.value);
                      console.log(radioButton.value);
                    }
                    // }
                  });
                renderQuizAnswer(qBody, item);
              }
              if (index == results.length - 1) {
                qFooter.innerHTML = '';
                let finishButton = document.createElement('button');
                finishButton.innerText = 'Finish';
                finishButton.className = 'q_buttons finish_';
                qFooter.appendChild(finishButton);
                finishButton.addEventListener('click', () => {
                  console.log(correctAnswers);
                });
              }
            });
          });
        } else {
          alert('something went wrong please try again');
        }
      });
  });
});
