import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";

const getCurrentUserId = () => new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            console.log('ユーザーがログインしていません。');
            resolve(null);
        } else {
            resolve(user.uid);
        }
    });
});

const saveGoal = async (...goals) => {
    const userId = await getCurrentUserId();

    try {
        await setDoc(doc(db, 'users', userId), { firstGoal: goals[0], secondGoal: goals[1] });
        console.log('目標が正常に保存されました');
    } catch (error) {
        console.error('目標の保存中にエラーが発生しました:', error);
    }
};

const loadExistingGoalSteps = async () => {
    const userId = await getCurrentUserId();

    try {
        const docSnap = await getDoc(doc(db, 'users', userId));
        if (!docSnap.exists()) return console.log('目標データが存在しません');

        const { firstGoal, secondGoal } = docSnap.data();
        document.querySelectorAll('.goal-steps').forEach((element, index) => {
            element.textContent = `${[firstGoal, secondGoal][index]}歩`;
            element.dataset.value = [firstGoal, secondGoal][index];
        });
    } catch (error) {
        console.error('目標歩数の取得中にエラーが発生しました:', error);
    }
};

const makeEditable = (element) => {
    const currentValue = element.dataset.value;
    element.innerHTML = `<input type="number" value="${currentValue}" class="form-control form-control-lg" min="0" step="100">`;
    const input = element.querySelector('input');
    input.focus();
    input.addEventListener('blur', async () => updateGoal(element, input.value));
};

const updateGoal = async (element, newValue) => {
    element.textContent = `${newValue}歩`;
    element.dataset.value = newValue;
    const goals = Array.from(document.querySelectorAll('.goal-steps'), el => parseInt(el.dataset.value));
    await saveGoal(...goals);
};

document.addEventListener('DOMContentLoaded', () => {
    loadExistingGoalSteps();
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-button')) {
            const index = Array.from(document.querySelectorAll('.edit-button')).indexOf(event.target);
            makeEditable(document.querySelectorAll('.goal-steps')[index]);
        }
    });
});