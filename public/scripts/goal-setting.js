// scripts/goal-setting.js

document.addEventListener('DOMContentLoaded', function () {
    // すべての編集ボタンにクリックイベントを追加
    document.querySelectorAll('.edit-button').forEach(function (button) {
      button.addEventListener('click', function () {
        const cardContent = button.closest('.card-content');
        const goalSteps = cardContent.querySelector('.goal-steps');
        const currentSteps = goalSteps.getAttribute('data-value');

        // 編集用の入力フィールドを作成
        const inputField = document.createElement('input');
        inputField.type = 'number';
        inputField.value = currentSteps;
        inputField.classList.add('edit-input');

        // 元のテキストを入力フィールドに置き換える
        goalSteps.replaceWith(inputField);

        // 入力フィールドにフォーカスを設定
        inputField.focus();

        // フォーカスが外れたときに入力内容を保存する
        inputField.addEventListener('blur', function () {
          const newSteps = inputField.value;
          goalSteps.textContent = newSteps + '歩';
          goalSteps.setAttribute('data-value', newSteps);
          inputField.replaceWith(goalSteps);
        });

        // Enterキーが押されたときに入力内容を保存する
        inputField.addEventListener('keypress', function (e) {
          if (e.key === 'Enter') {
            inputField.blur();
          }
        });
      });
    });
  });
