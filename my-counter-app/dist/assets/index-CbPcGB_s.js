(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})(),document.querySelector(`#app`).innerHTML=`
<main id="center">
  <h1>カウンター</h1>
  <p id="count">0</p>
  <div class="button-group">
    <button id="increaseBtn" class="btn">増やす</button>
    <button id ="resetBtn" class="btn btn-reset">リセット</button>
    <button id ="decreaseBtn" class="btn">減らす</button>
  </div>
</main>
`;var e=document.querySelector(`#count`),t=document.querySelector(`#increaseBtn`),n=document.querySelector(`#decreaseBtn`),r=document.querySelector(`#resetBtn`),i=0;t.addEventListener(`click`,()=>{i+=1,e.textContent=i}),n.addEventListener(`click`,()=>{--i,e.textContent=i}),r.addEventListener(`click`,()=>{i=0,e.textContent=i});