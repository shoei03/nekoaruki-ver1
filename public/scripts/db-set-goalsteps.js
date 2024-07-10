import { db } from "./firebase-config.js";
import { doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

// 目標を保存する関数
async function saveGoal(firstGoal, secondGoal) {
    console.log('Attempting to save goals');
    try {
        await setDoc(doc(db, 'goals', 'userGoals'), {
            firstGoal: firstGoal,
            secondGoal: secondGoal
        });
        console.log('目標が正常に保存されました');
    } catch (error) {
        console.error('目標の保存中にエラーが発生しました:', error);
        throw error;
    }
}

// 既存の目標歩数を読み込む関数
async function loadExistingGoalSteps() {
    try {
        const docSnap = await getDoc(doc(db, 'goals', 'userGoals'));
        if (docSnap.exists()) {
            const goals = docSnap.data();
            document.querySelectorAll('.goal-steps').forEach((element, index) => {
                if (index === 0) {
                    element.textContent = goals.firstGoal + '歩';
                    element.dataset.value = goals.firstGoal;
                } else if (index === 1) {
                    element.textContent = goals.secondGoal + '歩';
                    element.dataset.value = goals.secondGoal;
                }
            });
        } else {
            console.log('目標データが存在しません');
        }
    } catch (error) {
        console.error('目標歩数の取得中にエラーが発生しました:', error);
    }
}

// 目標歩数を編集可能にする関数
function makeEditable(element) {
    const currentValue = element.dataset.value;
    element.innerHTML = `<input type="number" value="${currentValue}" min="0" step="100">`;
    const input = element.querySelector('input');
    input.focus();

    input.addEventListener('blur', async () => {
        const newValue = input.value;
        element.textContent = newValue + '歩';
        element.dataset.value = newValue;

        // データベースを更新
        const goals = {
            firstGoal: parseInt(document.querySelectorAll('.goal-steps')[0].dataset.value),
            secondGoal: parseInt(document.querySelectorAll('.goal-steps')[1].dataset.value)
        };
        await saveGoal(goals.firstGoal, goals.secondGoal);
    });
}

// DOMの読み込みが完了したら実行
document.addEventListener('DOMContentLoaded', function() {
    loadExistingGoalSteps();

    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach((editButton, index) => {
        editButton.addEventListener('click', () => {
            const goalStepsElement = document.querySelectorAll('.goal-steps')[index];
            makeEditable(goalStepsElement);
        });
    });
});