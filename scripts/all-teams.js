const team = document.querySelectorAll('.teams img')
for (let i = 0; i < team.length; i++) {
  team[i].addEventListener('click', () => {
    console.log(team[i].id)
    window.location.href = `team.html?teamAbv=${team[i].id}`
  })
}

