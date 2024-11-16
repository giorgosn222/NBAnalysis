const url = '/api/players';

// Get all players from API
async function getAllPlayers() {
  try {
    const response = await fetch(url);
    const result = await response.json();
    activePlayers = result

    console.log('Active players:', activePlayers)
    
    renderPage(activePlayers)
  } catch (error) {
    console.error('Error fetching players data:', error)
  }
}

getAllPlayers()

// Add Event Listeners to radio buttons
let checkedPosition = ""
let checkedTeam = ""

let positionRadio = document.querySelectorAll('input[name="position"]')
positionRadio.forEach(radio => {
  radio.addEventListener('click', function() {
    if (checkedPosition == radio.value) {
      radio.checked = false
      checkedPosition = ""
    } else {
      checkedPosition = radio.value;
    }
    createTable(radio);
  })
})

let teamRadio = document.querySelectorAll('input[name="team"]')
teamRadio.forEach(radio => {
  radio.addEventListener('click', function() {
    if (checkedTeam == radio.value) {
      radio.checked = false
      checkedTeam = ""
    } else {
      checkedTeam = radio.value;
    }
    createTable(radio);
  })
})

function createTable(radio) {
  if (checkedPosition === "" && checkedTeam === "") {
    console.log('No filter');
    tableRows = ""
    activePlayers.forEach(player => {
      if (player.pos && player.team) {
			tableRows += `
			<tr>
				<td><a href="player.html?playerID=${player.playerID}">${player.longName}</a></td>
				<td>${player.pos}</td>
				<td><a href="team.html?teamAbv=${player.team}" class"teams">${getTeamsFullName(player.team)}</a></td>
			</tr>
			`
    }
  })
  tableBody.innerHTML = tableRows
  }
  else if (checkedTeam === "") {
    tableRows = ""
    activePlayers.forEach(player => {
      if (player.pos == checkedPosition)  {
			tableRows += `
			<tr>
				<td><a href="player.html?playerID=${player.playerID}">${player.longName}</a></td>
				<td>${player.pos}</td>
				<td><a href="team.html?teamAbv=${player.team}" class"teams">${getTeamsFullName(player.team)}</a></td>
			</tr>
			`
    }
		})
		tableBody.innerHTML = tableRows
  }
  else if (checkedPosition === "") {
    tableRows = ""
    activePlayers.forEach(player => {
      if (player.team == checkedTeam)  {
			tableRows += `
			<tr>
				<td><a href="player.html?playerID=${player.playerID}">${player.longName}</a></td>
				<td>${player.pos}</td>
				<td><a href="team.html?teamAbv=${player.team}" class"teams">${getTeamsFullName(player.team)}</a></td>
			</tr>
			`
    }
		})
		tableBody.innerHTML = tableRows
  }
  else {
    tableRows = ""
    activePlayers.forEach(player => {
      if (player.team == checkedTeam && player.pos == checkedPosition)  {
			tableRows += `
			<tr>
				<td><a href="player.html?playerID=${player.playerID}">${player.longName}</a></td>
				<td>${player.pos}</td>
				<td><a href="team.html?teamAbv=${player.team}" class"teams">${getTeamsFullName(player.team)}</a></td>
			</tr>
			`
    }
		})
		tableBody.innerHTML = tableRows
  }
}



let tableRows = '';
const tableBody = document.getElementById('players-table-body')
function renderPage(players) {
  // Change page color
  document.querySelector('.container').style.background = "#f3f3f3";
  document.querySelector('body').style.background = "#f3f3f3";
  document.querySelector('.players-container').style.display = "flex";

  // Create active players table
		players.sort((a, b) => {
			return a.longName - b.longName;
		})
		console.log(players)
		players.forEach(player => {
			tableRows += `
			<tr>
				<td><a href="player.html?playerID=${player.playerID}">${player.longName}</a></td>
				<td>${player.pos}</td>
				<td><a href="team.html?teamAbv=${player.team}">${getTeamsFullName(player.team)}</a></td>
			</tr>
			`
		})
		tableBody.innerHTML = tableRows
}

// Get each team's full name
function getTeamsFullName(team) {
  if (team === "ATL") {
    return "ATLANTA HAWKS"
  }
  if (team === "BOS") {
    return "BOSTON CELTICS"
  }
  if (team === "BKN") {
    return "BROOKLYN NETS"
  }
  if (team === "CHA") {
    return "CHARLOTTE HORNETS"
  }
  if (team === "CHI") {
    return "CHICAGO BULLS"
  }
  if (team === "CLE") {
    return "CLEVELAND CAVALIERS"
  }
  if (team === "DAL") {
    return "DALLAS MAVERICKS"
  }
  if (team === "DEN") {
    return "DENVER NUGGETS"
  }
  if (team === "DET") {
    return "DETROIT PISTONS"
  }
  if (team === "GS") {
    return "GOLDEN STATE WARRIORS"
  }
  if (team === "HOU") {
    return "HOUSTON ROCKETS"
  }
  if (team === "IND") {
    return "INDIANA PACERS"
  }
  if (team === "LAC") {
    return "LA CLIPPERS"
  }
  if (team === "LAL") {
    return "LOS ANGELES LAKERS"
  }
  if (team === "MEM") {
    return "MEMPHIS GRIZZLIES"
  }
  if (team === "MIA") {
    return "MIAMI HEAT"
  }
  if (team === "MIL") {
    return "MILWAUKEE BUCKS"
  }
  if (team === "MIN") {
    return "MINNESOTA TIMBERWOLVES"
  }
  if (team === "NO") {
    return "NEW ORLEANS PELICANS"
  }
  if (team === "NY") {
    return "NEW YORK KNICKS"
  }
  if (team === "OKC") {
    return "OKLAHOMA CITY THUNDER"
  }
  if (team === "ORL") {
    return "ORLANDO MAGIC"
  }
  if (team === "PHI") {
    return "PHILADELPHIA 76ERS"
  }
  if (team === "PHO") {
    return "PHOENIX SUNS"
  }
  if (team === "POR") {
    return "PORTLAND TRAIL BLAZERS"
  }
  if (team === "SAC") {
    return "SACRAMENTO KINGS"
  }
  if (team === "SA") {
    return "SAN ANTONIO SPURS"
  }
  if (team === "TOR") {
    return "TORONTO RAPTORS"
  }
  if (team === "UTA") {
    return "UTAH JAZZ"
  }
  if (team === "WAS") {
    return "WASHINGTON WIZARDS"
  }
  if (team === "") {
    return ""
  }
}