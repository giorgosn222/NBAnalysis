import {teamsBackgroundArray} from '../data/teams-background.js'
import {months} from '../data/miscellaneous.js'

// Get team Abraviation from previous page
function getTeamIdFromURL() {
	const params = new URLSearchParams(window.location.search)
	return params.get('teamAbv')
}

function loadTeam() {
	const teamAbv = getTeamIdFromURL();
	return teamAbv
}

let teamAbrv = loadTeam();

let teamNewsUnique = [];

let teamsData = [];

let teamInjuries = [];

async function getTeams() {
	// Fetching the TEAMS data from the API
	const response = await fetch('/api/teams');
	const result = await response.json();
	teamsData = result;

	// Fetching the NEWS data from the API
	await getNews()

	// Finding the team's index
	let arrayNum = getTeam(teamAbrv);
	let targetTeam = teamsData[arrayNum]

	// Adding win percentage for each team
	teamsData.forEach(team => {
		team.winPercentage = team.wins / (Number(team.wins) + Number(team.loss))
	});

	// Arrays to seperate each conference and sort the teams from highest win rate to lowest
	let eastTeams = teamsData.filter(team => team.conferenceAbv === "East").sort((a, b) => b.winPercentage - a.winPercentage);
	let westTeams = teamsData.filter(team => team.conferenceAbv === "West").sort((a, b) => b.winPercentage - a.winPercentage);

	// Adding conference ranking
	eastTeams.forEach((team, index) => {
		team.rank = index + 1
	});
	westTeams.forEach((team, index) => {
		team.rank = index + 1
	});

	// Sorted based on averages (PPG, RPG, APG, OPPG) and added rankings
	teamsData.sort((a, b) => b.ppg - a.ppg);
	teamsData.forEach((team, index) => {
		team.ppgRank = index + 1
	});
	teamsData.sort((a, b) => b.offensiveStats.reb.Total - a.offensiveStats.reb.Total);
	teamsData.forEach((team, index) => {
		team.rpgRank = index + 1
	});
	teamsData.sort((a, b) => b.offensiveStats.ast.Total - a.offensiveStats.ast.Total);
	teamsData.forEach((team, index) => {
		team.apgRank = index + 1
	});
	teamsData.sort((a, b) => a.oppg - b.oppg);
	teamsData.forEach((team, index) => {
		team.oppgRank = index + 1
	});

	console.log(teamsData);

	renderPage(targetTeam);
} 

getTeams();

// Getting target team's index
function getTeam(team) {
	for (let i = 0; i < teamsData.length; i++) {
		if (teamsData[i].teamAbv === team) {
			return i
		}
	}
}

// Checking the ordinal indicators for the rankings (1st, 2nd, 3rd, 4th etc.)
function ordinalIndicators(number) {
	if (number === 1 || number === 21) {
		return "st"
	}
	else if (number === 2 || number === 22) {
		return "nd"
	}
	else if (number === 3 || number === 23) {
		return "rd"
	}
	else {
		return "th"
	}
}

// Fetching the NEWS Data from the API
async function getNews() {
	const response2 = await fetch(`/api/news?teamAbv=${teamAbrv}`);
	const result2 = await response2.json();
	const teamNews = result2

	// Checking for duplicates
	teamNewsUnique.push(teamNews[0])
	for (let i = 0; i < teamNews.length; i++) {
		let titleCheck = teamNews[i].title;
		let double = false
		for (let j = 0; j < teamNewsUnique.length; j++) {
			if (teamNewsUnique[j].title === titleCheck) {
				double = true;
				continue;
			}
		}
		if (double == false) {
			teamNewsUnique.push(teamNews[i])
		}
	}
}
// Function to return month instead of number
function getMonth(month) {
	return months[Number(month) - 1]
}
// Calculate player's age
function ageCalculator(date) {
  const today = new Date();
  const [month, day, year] = date.split('/').map(Number);
  let age = today.getFullYear() - year;
  if (today.getMonth() + 1 < month || (today.getMonth() + 1 === month) && today.getDate() < day) {
    age--
  }
  return age
}

function renderPage(targetTeam) {

	// Used "for...in" statement to make next 10 games array
	let matches = []
	let teamSchedule = targetTeam.teamSchedule

	let currentDate = new Date();
	currentDate.setHours(0, 0, 0, 0);

	for (let gameID in teamSchedule) {
		matches.push(teamSchedule[gameID])
	};

	// Filter out finished games
	matches = matches.filter(match => {
		const matchDate = new Date(
			parseInt(match.gameDate.slice(0, 4)),
			parseInt(match.gameDate.slice(4, 6)) - 1,
			parseInt(match.gameDate.slice(6, 8))
		);
		return matchDate >= currentDate;
	})

	// Sort matches by date and create the HTML
	matches.sort((a, b) => {
		const dateA = new Date (
			parseInt(a.gameDate.slice(0, 4)),
			parseInt(a.gameDate.slice(4, 6)) - 1,
			parseInt(a.gameDate.slice(6, 8))
		);
		const dateB = new Date (
			parseInt(b.gameDate.slice(0, 4)),
			parseInt(b.gameDate.slice(4, 6)) - 1,
			parseInt(b.gameDate.slice(6, 8))
		)
		return dateA - dateB
	})
	console.log(matches)
	const matchesSection = document.getElementById('matches');
	let upcomingMatchesHTML = '';
	for (let i = 0; i < 8; i++) {
		upcomingMatchesHTML += `
		<div class="match">
			<div class="date">
				<div id="date">${getMonth(matches[i].gameDate.slice(4, 6))} ${matches[i].gameDate.slice(6, 8)}</div>
				<div id="time">${matches[i].gameTime}</div>
			</div>
			<div class="team1">
				<img src="${teamsData[getTeam(matches[i].home)].nbaComLogo1}"/>
				<div class="schedule-team-name">${matches[i].home}</div>
				<div class="team1-score">${teamsData[getTeam(matches[i].home)].wins} - ${teamsData[getTeam(matches[i].home)].loss}</div>
			</div>
			<div class="team2">
				<img src="${teamsData[getTeam(matches[i].away)].nbaComLogo1}" />
				<div class="schedule-team-name">${matches[i].away}</div>
				<div class="team2-score">${teamsData[getTeam(matches[i].away)].wins} - ${teamsData[getTeam(matches[i].away)].loss}</div>
			</div>
		</div>
		`
	}
	matchesSection.innerHTML = upcomingMatchesHTML;

	// Used "for...in" statement to make an array of the roster
	let players = []
	let roster = targetTeam.Roster
	for (let playerId in roster) {
		players.push(roster[playerId])
	};

	// Looping through the players array to create table rows
	const tableBody = document.getElementById('roster-table-body');
	let tableRows = '';
	players.sort((a, b) => {
		return a.jerseyNum - b.jerseyNum;
	})
	console.log(players)
	players.forEach(player => {
		if (player.bDay) {
		tableRows += `
		<tr>
			<td><a href="player.html?playerID=${player.playerID}">${player.longName}</a></td>
			<td>${player.jerseyNum}</td>
			<td>${player.pos}</td>
			<td>${player.height}</td>
			<td>${player.weight}</td>
			<td>${player.bDay}</td>
			<td>${ageCalculator(player.bDay)}</td>
			<td>${player.exp}</td>
			<td>${player.college}</td>
		</tr>
		`
		}
	})
	tableBody.innerHTML = tableRows

	// Function to convert date string to a comparable value
	function getComparableDate(injuries) {
		const [monthStr, dayStr] = injuries.injury.date.split(" ");
		const monthIndex = months.indexOf(monthStr);
		const day = parseInt(dayStr);
		return { monthIndex, day }
	}

	// Looping through the players array to get Injuries and render it
	players.forEach(player => {
		if (player.injury.description !== "") {
			player.injury.date = player.injury.description.split(":")[0]
			teamInjuries.push(player)
		}
	})

	// Sort Injuries by date
	teamInjuries.sort((a, b) => {
		const dateA = getComparableDate(a);
		const dateB = getComparableDate(b);

		if (dateA.monthIndex !== dateB.monthIndex) {
			return dateA.monthIndex - dateB.monthIndex;
		};
		return dateB.day - dateA.day;
	})
	console.log(teamInjuries)

	// Looping through teamInjuries array to render Injuries
	const injuriesSection = document.getElementById('injury-container');
	let injuriesHTML = '';
	for (let i = 0; i < teamInjuries.length; i++) {
		injuriesHTML += `			
		<a href="player.html?playerID=${teamInjuries[i].playerID}" class="injury-content">
			<div class="image-section">
				<img
					src=${teamInjuries[i].nbaComHeadshot}
				/>
			</div>
			<div class="injury-details-section">
				<div class="injury-details-section-top">
					<div class="injury-details-section-left">
						<div class="injury-name-position">
							<div class="injury-name">${teamInjuries[i].longName}</div>
							<div class="injury-position">${teamInjuries[i].pos}</div>
						</div>
						<div class="injury-status">
							Status <span class="status-circle" style="background-color: var(--${teamInjuries[i].injury.designation}"></span>
							<span class="injury-type">${teamInjuries[i].injury.designation}</span>
						</div>
						<div class="injury-return">
							Estimated return:
							<span class="return-date">${teamInjuries[i].injury.injReturnDate.slice(6, 8)}/${teamInjuries[i].injury.injReturnDate.slice(4, 6)}/${teamInjuries[i].injury.injReturnDate.slice(0, 4)}</span>
						</div>
					</div>
					<div class="injury-details-section-right">
						<div class="injury-date">${teamInjuries[i].injury.date}</div>
					</div>
				</div>
				<div class="injury-details-section-bottom">
					${teamInjuries[i].injury.description.split(':')[1]}
				</div>
			</div>
		</a>	
		`
	}

	injuriesSection.innerHTML = injuriesHTML

	// Create variables for each rank
	let rankOrdInd = ordinalIndicators(targetTeam.rank);
	let ppgOrdInd = ordinalIndicators(targetTeam.ppgRank);
	let rpgOrdInd = ordinalIndicators(targetTeam.rpgRank);
	let apgOrdInd = ordinalIndicators(targetTeam.apgRank);
	let oppgOrdInd = ordinalIndicators(targetTeam.oppgRank);

	// Appear results on page

	// Team Profile Header
	document.querySelector('.team-logo img').src = `images/teams/${teamAbrv}.svg`;
	document.querySelector('.team-name').innerHTML = `${targetTeam.teamCity} ${targetTeam.teamName}`;
	document.querySelector('.team-record').innerHTML = `${targetTeam.wins} - ${targetTeam.loss} | ${targetTeam.rank}${rankOrdInd} in ${targetTeam.conferenceAbv}ern`;
	document.querySelector('.points-rank .rank').innerHTML = targetTeam.ppgRank + `<span class="rank-span">${ppgOrdInd}</span>`;
	document.querySelector('.points-rank .average').innerHTML = Number(targetTeam.ppg).toFixed(1);
	document.querySelector('.rebounds-rank .rank').innerHTML = targetTeam.rpgRank + `<span class="rank-span">${rpgOrdInd}</span>`;
	document.querySelector('.rebounds-rank .average').innerHTML = (Math.round(targetTeam.offensiveStats.reb.Total * 10) / 10).toFixed(1);
	document.querySelector('.assists-rank .rank').innerHTML = targetTeam.apgRank + `<span class="rank-span">${apgOrdInd}</span>`;
	document.querySelector('.assists-rank .average').innerHTML = (Math.round(targetTeam.offensiveStats.ast.Total * 10) / 10).toFixed(1);
	document.querySelector('.opponent-points-rank .rank').innerHTML = targetTeam.oppgRank + `<span class="rank-span">${oppgOrdInd}</span>`;
	document.querySelector('.opponent-points-rank .average').innerHTML = Number(targetTeam.oppg).toFixed(1);

	// Page general CSS
	document.querySelector('.team-container').style.setProperty('--team-color', `var(--${teamAbrv})`);
	document.querySelector('.container').style.background = "#f3f3f3";
	document.querySelector('body').style.background = "#f3f3f3";
	document.querySelector('.team-profile').style.display = "flex";

	// Team Background Section
	document.getElementById('dd1').innerHTML = teamsBackgroundArray[targetTeam.teamID - 1].founded;
	document.getElementById('dd2').innerHTML = teamsBackgroundArray[targetTeam.teamID - 1].city;
	document.getElementById('dd3').innerHTML = teamsBackgroundArray[targetTeam.teamID - 1].arena;
	document.getElementById('dd4').innerHTML = teamsBackgroundArray[targetTeam.teamID - 1].gLeague;
	document.getElementById('dd5').innerHTML = teamsBackgroundArray[targetTeam.teamID - 1].governor;
	document.getElementById('dd6').innerHTML = teamsBackgroundArray[targetTeam.teamID - 1].generalManager;
	document.getElementById('dd7').innerHTML = teamsBackgroundArray[targetTeam.teamID - 1].headCoach;

	// News Section
	document.getElementById('news-title1').innerHTML = teamNewsUnique[0].title;
	document.getElementById('news-image1').src = teamNewsUnique[0].image;
	document.getElementById('news-link1').href = teamNewsUnique[0].link;
	document.getElementById('news-title2').innerHTML = teamNewsUnique[1].title;
	document.getElementById('news-image2').src = teamNewsUnique[1].image;
	document.getElementById('news-link2').href = teamNewsUnique[1].link;

}
