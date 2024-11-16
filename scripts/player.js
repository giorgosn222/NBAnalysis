// Get the playerID from the previous page
function getPlayerIdFromURL () {
  const params = new URLSearchParams(window.location.search)
  return params.get('playerID')
}

function loadPlayer() {
  const playerID = getPlayerIdFromURL()
  return playerID
}

const playerID = loadPlayer();
console.log(playerID)

let playerData;
let playersTeam;
let playersGames = [];
let playerNewsUnique = [];

async function getPlayer() {
  // Fetching target Player's data from the API
  const response = await fetch(`/api/playerData?playerID=${playerID}`);
  const result = await response.json();
  playerData = result.body


  // When player has no stats, make it 0
  playerData.stats.pts = playerData.stats.pts || "0";
  playerData.stats.reb = playerData.stats.reb || "0";
  playerData.stats.ast = playerData.stats.ast || "0";
  playerData.stats.mins = playerData.stats.mins || "0";
  console.log(playerData)

  // Fetching the Team's and Games' data from the API
  await getTeam(playerData.team)
  await getGames()
  await getPlayerNews(playerID);

  if (playerID) renderPage();
}

// Fetching the Team's data from the API
async function getTeam(targetTeam) {
  const response = await fetch(`/api/team?teamAbv=${targetTeam}`);
  const result = await response.json();

  if (response.ok) {
    playersTeam = result;
  } else {
    console.error('Failed to fetch team data:', result.error)
  }
  console.log(playersTeam)
}

// Fetching last 5 games' data from the API
async function getGames() {
  const response = await fetch(`/api/games?playerID=${playerID}`);
  const result = await response.json();

  if (response.ok) {
    playersGames = result
  } else {
    console.error('Failed to fetch game data:', result.error)
  }
  console.log(playersGames)

}

getPlayer();


// Get full name position from Abraviation
function getPositionFullName(pos) {
  if (pos === "PG") {
    return "Point Guard"
  }
  else if (pos === "SG") {
    return "Shooting Guard"
  }
  else if (pos === "SF") {
    return "Small Forward"
  }
  else if (pos === "PF") {
    return "Power Forward"
  }
  else if (pos === "C") {
    return "Center"
  }
}

function splitName(fullName) {
  const nameParts = fullName.split(' ')
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1, nameParts.length).join(' ');
  return { firstName, lastName };
}

function heightConverter(feet, inches) {
  let cm = feet*(30.48);
  cm += inches*(2.54);
  return (cm/100).toFixed(2)
}

function ageCalculator(date) {
  const today = new Date();
  const [month, day, year] = date.split('/').map(Number);
  let age = today.getFullYear() - year;
  if (today.getMonth() + 1 < month || (today.getMonth() + 1 === month) && today.getDate() < day) {
    age--
  }
  return age
}

function formatDate(date) {
  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];
  const dateParts = date.split('/');
  const month = months[(dateParts[0]) - 1];
  const day = dateParts[1];
  const year = dateParts[2];
  return `${month} ${day}, ${year}`
}

function formatGameDate(date) {
  console.log(date)
  const year = date.slice(0, 4);
  const month = date.slice(5, 2);
  const day = date.slice(7, 2);
  return `${month} ${day}, ${year}`
}

// Get and format date from gameID
function getGameDate(gameID) {
  const dateString = gameID.slice(0, 8);
  const year = dateString.slice(0, 4);
  const month = dateString.slice(4, 6) -1;
  const day = dateString.slice(6, 8);
  
  const date = new Date(year, month, day);

  const options = { year: 'numeric', month: 'short', day: 'numeric'}

  return date.toLocaleDateString('en-US', options).toUpperCase()
}

// Get the teams from gameID
function getGameTeams(gameID) {
  const parts = gameID.split('@');
  const awayTeam = parts[0].split('_')[1];
  const homeTeam = parts[1];
  return `${awayTeam} @ ${homeTeam}`
}

// Return Rookie for rookies instead of Years of experience
function getExperience(exp) {
  if (exp === "R") {
    return "Rookie"
  }
  return exp + " Years"
}


// Fetching player's news from the API
async function getPlayerNews(playerID) {
  const response = await fetch(`/api/player-news?playerID=${playerID}`);
  const result = await response.json();
  const playerNews = result;
  console.log(playerNews)

  if (response.ok && result && result.length > 0) {
    console.log('Player News:', result)
    
    //Checking for duplicates
    playerNewsUnique.push(playerNews[0])
    for (let i = 1; i < playerNews.length; i++) {
      let titleCheck = playerNews[i].title;
      let isDuplicate = playerNewsUnique.some(news => news.title === titleCheck)
      
      if (!isDuplicate) {
        playerNewsUnique.push(playerNews[i])
      }
    }
  } else {
    console.error('No player news available or error in response:', result.error || result)
  }

  console.log(playerNews)
  console.log(playerNewsUnique)
}


function renderPage() {
  // Render player header container
  document.querySelector('.player-container').style.display = "flex";
  document.querySelector('.player-container').style.setProperty('--team-color', `var(--${playersTeam.teamAbv})`);
  document.querySelector('.team-logo-container img').src = `images/teams/${playersTeam.teamAbv}.svg`;
  document.querySelector('.player-main-container-inner-left img').src = `${playerData.nbaComHeadshot}`;
  document.querySelector('.player-main-info').innerHTML = `${playersTeam.teamCity} ${playersTeam.teamName} | #${playerData.jerseyNum} | ${getPositionFullName(playerData.pos)}`;
  document.getElementById('firstName').innerHTML = splitName(playerData.nbaComName).firstName;
  document.getElementById('lastName').innerHTML = splitName(playerData.nbaComName).lastName;
  document.querySelector('.team-logo-container2 img').src = `images/teams/${playersTeam.teamAbv}.svg`;
  document.getElementById('points').innerHTML = playerData.stats.pts;
  document.getElementById('rebounds').innerHTML = playerData.stats.reb;
  document.getElementById('assists').innerHTML = playerData.stats.ast;
  document.getElementById('minutes').innerHTML = playerData.stats.mins;
  document.getElementById('height').innerHTML = `${playerData.height} (${heightConverter(playerData.height[0], playerData.height.split('-')[1])}m)`;
  document.getElementById('weight').innerHTML = `${playerData.weight}lb (${Math.round(playerData.weight*0.454)}kg)`;
  document.getElementById('college').innerHTML = `${playerData.college}`;
  document.getElementById('age').innerHTML = `${ageCalculator(playerData.bDay)} years`;
  document.getElementById('birthdate').innerHTML = formatDate(playerData.bDay);
  document.getElementById('exp').innerHTML = getExperience(playerData.exp);

  document.querySelector('.player-profile').style.display = "flex"
  document.querySelector('.container').style.background = "#f3f3f3";
  document.querySelector('body').style.background = "#f3f3f3"


  // Render player profile

  // Render player status when injured
  if (playerData.injury.designation) {
    document.getElementById('injury-container').style.display = "block";
    document.getElementById('injury-icon').src = `images/icons/${playerData.injury.designation}-injury-icon.svg`;
    document.querySelector('.injury-designation p').innerHTML = playerData.injury.designation;
    document.querySelector('.estimated-return-date').innerHTML = `${playerData.injury.injReturnDate.slice(6, 8)}/${playerData.injury.injReturnDate.slice(4, 6)}/${playerData.injury.injReturnDate.slice(0, 4)}`;
    document.querySelector('.injury-date').innerHTML = playerData.injury.description.split(':')[0];
    document.querySelector('.injury-description').innerHTML = playerData.injury.description.split(':')[1];
    document.querySelector('.injury-description').style.setProperty('--designation-color', `var(--${playerData.injury.designation})`)
  }



  // Render player's last 5 games table
  console.log(playersGames)
  const tableBody = document.getElementById('roster-table-body')
  let tableRows = '';

  for (const gameID in playersGames) {
    const game = playersGames[gameID];
    tableRows += `
    <tr>
      <td><a href="#">${getGameDate(game.gameID)}</a></td>
      <td>${getGameTeams(game.gameID)}</td>
      <td>${game.mins}</td>
      <td>${game.pts}</td>
      <td>${game.fgm}</td>
      <td>${game.fga}</td>
      <td>${game.fgp}</td>
      <td>${game.tptfgm}</td>
      <td>${game.tptfga}</td>
      <td>${game.tptfgp}</td>
      <td>${game.ftm}</td>
      <td>${game.fta}</td>
      <td>${game.ftp}</td>
      <td>${game.OffReb}</td>
      <td>${game.DefReb}</td>
      <td>${game.reb}</td>
      <td>${game.ast}</td>
      <td>${game.stl}</td>
      <td>${game.blk}</td>
      <td>${game.TOV}</td>
      <td>${game.PF}</td>
      <td>${game.plusMinus}</td>
      <td>${Number(game.fantasyPoints).toFixed(2)}</td>
		</tr>
    `
  }
  tableBody.innerHTML = tableRows;

  // Rendering News section
  const playerNewsContainer = document.getElementById('player-news-container');
  let newsHTML = '';

  if (playerNewsUnique.length > 0) {
    for (let i = 0; i < 5; i++) {
      newsHTML += `
      <a href="${playerNewsUnique[i].link}" id="news-link">
        <div class="news-container">
          <div class="news-article">
            <div class="news-image-container"><img id="news-image" src="${playerNewsUnique[i].image}" /></div>
            <div class="news-title" id="news-title">${playerNewsUnique[i].title}</div>
          </div>
        </div>
      </a>
      `
    }
    playerNewsContainer.innerHTML = newsHTML;
  } else {
    console.log('No news to display')
    playerNewsContainer.innerHTML = '<p>No news available.</p>'
  }

  document.querySelector('.team-logo-container2 img').addEventListener('click', () => {
    window.location.href = `team.html?teamAbv=${playerData.team}`
  })
}