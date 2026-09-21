import './style.css';

document.querySelector('#app').innerHTML = `
<main id="center">
  <h1>カウンター</h1>
  <p id="count">0</p>
  <div class="button-group">
    <button id="increaseBtn" class="btn">増やす</button>
    <button id ="resetBtn" class="btn btn-reset">リセット</button>
    <button id ="decreaseBtn" class="btn">減らす</button>
  </div>
</main>
`;

const countEl = document.querySelector('#count');
const incBtn = document.querySelector('#increaseBtn');
const decBtn = document.querySelector('#decreaseBtn');
const resBtn = document.querySelector('#resetBtn');
let count = 0;

incBtn.addEventListener('click', () => {
  count += 1;
  countEl.textContent = count;
});

decBtn.addEventListener('click', () => {
  count -= 1;
  countEl.textContent = count;
});

resBtn.addEventListener('click', () => {
  count = 0;
  countEl.textContent = count;
});

