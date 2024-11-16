const exploreButton = document.querySelector('.content .btn');
const content = document.querySelector('.content');
const awardList = document.querySelector('.award-list');
const content2 = document.querySelector('.content2');
const content2Image = document.querySelector('.content2 img')
const championsButton = document.getElementById('champions');
const finalsButton = document.getElementById('finals_mvp');
const mvpButton = document.getElementById('season_mvp');
const buttonsList = document.querySelectorAll('button')

function getSeasonAwards() {
  content.style.transform = "translateX(-750px)"
  awardList.style.transform = "translateY(-150px)"
  content2.style.display = "block"
  championsButton.classList.toggle("active")
}

exploreButton.addEventListener('click', () => {
  getSeasonAwards();
});


championsButton.addEventListener('click', () => {
  if (championsButton.classList.contains('active')) {
    return;
  }
  content2Image.src = "images/3 feats/champions.webp"
  championsButton.classList.add('active')
  finalsButton.classList.remove('active')
  mvpButton.classList.remove('active')
});

finalsButton.addEventListener('click', () => {
  if (finalsButton.classList.contains('active')) {
    return;
  }
  content2Image.src = "images/3 feats/finals_mvp.webp"
  championsButton.classList.remove('active')
  finalsButton.classList.add('active')
  mvpButton.classList.remove('active')
});

mvpButton.addEventListener('click', () => {
  if (mvpButton.classList.contains('active')) {
    return;
  }
  content2Image.src = "images/3 feats/season_mvp.webp"
  championsButton.classList.remove('active')
  finalsButton.classList.remove('active')
  mvpButton.classList.add('active')
});