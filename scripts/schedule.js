let url = 'https://tank01-fantasy-stats.p.rapidapi.com/getNBAScoresOnly?gameDate=20241106&topPerformers=true&lineups=true';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '3fa2b44c6cmsh14243e45294375fp18e42bjsncd76a852fd6f',
		'x-rapidapi-host': 'tank01-fantasy-stats.p.rapidapi.com'
	}
};

const today = new Date();

let year = today.getFullYear();
let month = today.getMonth() + 1;
let day = today.getDate();

month = month < 10 ? '0' + month : month;
day = day < 10 ? '0' + day : day;

let targetDate = `${year}${month}${day}`

targetDate = "20241106"

// NA VGALW TA "//" MOLIS TELEIWSW CSS
// getSchedule(targetDate)

async function getSchedule(date) {
  let url = `https://tank01-fantasy-stats.p.rapidapi.com/getNBAScoresOnly?gameDate=${date}&topPerformers=true&lineups=true`;
  console.log(targetDate);

  const response = await fetch(url, options);
  const result = await response.json();
  const games = result.body

  console.log(games);
}