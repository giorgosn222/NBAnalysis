require('dotenv').config();
const axios = require('axios');

const getTeams = async () => {
  const options = {
    method: 'GET',
    url: 'https://tank01-fantasy-stats.p.rapidapi.com/getNBATeams',
    params: {
      schedules: 'true',
      rosters: 'true',
      statsToGet: 'averages',
      topPerformers: 'true',
      teamStats: 'true'
    },
    headers: {
      'x-rapidapi-key': process.env.API_KEY,
      'x-rapidapi-host': 'tank01-fantasy-stats.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data.body;  // Return the team data
  } catch (error) {
      console.error('Error fetching teams data:', error);
      throw new Error('Failed to fetch teams data');
  }
};

const getTeamNews = async (teamAbv) => {
  const urlNews = `https://tank01-fantasy-stats.p.rapidapi.com/getNBANews?teamAbv=${teamAbv}&topNews=true&recentNews=true&fantasyNews=true&maxItems=20`
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': process.env.API_KEY,
      'x-rapidapi-host': 'tank01-fantasy-stats.p.rapidapi.com'
    }
  }

  try {
    const response = await axios.request(urlNews, options);
    return response.data.body
  } catch (error) {
    console.error('Error fetching team news data:', error)
    throw new Error('Failed to fetch team news data')
  }
}

const getAllPlayers = async () => {
  const options = {
    method: 'GET',
    url: 'https://tank01-fantasy-stats.p.rapidapi.com/getNBAPlayerList',
    headers: {
      'x-rapidapi-key': process.env.API_KEY,
      'x-rapidapi-host': 'tank01-fantasy-stats.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data.body;
  } catch (error) {
      console.error(error)
  }
};

const getPlayerData = async (playerID) => {
  const options = {
    method: 'GET',
    url: `https://tank01-fantasy-stats.p.rapidapi.com/getNBAPlayerInfo?playerID=${playerID}&statsToGet=averages`,
    headers: {
      'x-rapidapi-key': process.env.API_KEY,
      'x-rapidapi-host': 'tank01-fantasy-stats.p.rapidapi.com'
    }
  }

  try {
    const response = await axios.request(options);
    return response.data
  } catch (error) {
    console.error('Error fetching player data:', error)
  }
} 

const getGames = async (playerID) => {
  const urlGames = `https://tank01-fantasy-stats.p.rapidapi.com/getNBAGamesForPlayer?playerID=${playerID}&numberOfGames=5&fantasyPoints=true&pts=1&reb=1.25&stl=3&blk=3&ast=1.5&TOV=-1&mins=0&doubleDouble=0&tripleDouble=0&quadDouble=0`

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': process.env.API_KEY,
      'x-rapidapi-host': 'tank01-fantasy-stats.p.rapidapi.com'
    }
  }

  try {
    const response = await axios.request(urlGames, options)
    return response.data.body
  } catch {
    console.error('Error fetching game data:', error)
    throw new Error('Failed to fetch game data')
  }
}

const getPlayerNews = async (playerID) => {
  const options = {
    method: 'GET',
    url: 'https://tank01-fantasy-stats.p.rapidapi.com/getNBANews',
    params: {
      playerID: playerID,
      topNews: 'true',
      recentNews: 'true',
      fantasyNews: 'true',
      maxItems: '20'
    },
    headers: {
      'x-rapidapi-key': process.env.API_KEY,
      'x-rapidapi-host': 'tank01-fantasy-stats.p.rapidapi.com'
    }
  };
  
  try {
    const response = await axios.request(options);
    console.log('Received player news response:', response.data);
    console.log('Player News:', response.data.body)
    return response.data.body
  } catch (error) {
    console.error(error);
  }
}


  module.exports = { 
    getTeams, 
    getTeamNews, 
    getAllPlayers, 
    getPlayerData,
    getGames,
    getPlayerNews
  }