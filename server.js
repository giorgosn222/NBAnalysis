const express = require('express')
const { getTeams, getTeamNews, getAllPlayers, getPlayerData, getGames, getPlayerNews } = require('./getData')
const path = require('path')
// const axios = require('axios')
const app = express()
const port = process.env.PORT || 3000
require('dotenv').config()

app.use(express.static(__dirname))
app.use(express.json())

// Route To Get Teams Data
app.get('/api/teams', async (req, res) => {
  try {
    const teams = await getTeams()
    res.json(teams)
  } catch (error) {
      console.log('Error fetching teams data:', error)
      res.status(500).json({ error: 'Failed to fetch teams data'})
  }
})


// Route to Get News
app.get('/api/news', async (req, res) => {
  const { teamAbv } = req.query
  if (!teamAbv) {
    return res.status(400).json({ error: 'Team abbreviation (teamAbv) is required'})
  }

  try {
    const news = await getTeamNews(teamAbv)
    res.json(news)
    console.log(news)
  } catch (error) {
    console.log('Error fetching team news data:', error)
    res.status(500).json({ error: 'Failed to fetch team news data'})
  }
})

// Route To Get All Players
app.get('/api/players', async (req, res) => {
  try {
    const players = await getAllPlayers()
    // Filter The Players If Needed
    const activePlayers = players.filter(player => player.pos !== "" && player.team !== "")
    res.json(activePlayers) //Send The Filtered List Back To The Client
  } catch (error) {
    console.log('Error fetching players data:', error)
    res.status(500).json({ error: 'Failed to fetch team news data'})
  }
  }
)

// Route To Get Player Data
app.get('/api/playerData', async (req, res) => {
  const { playerID } = req.query
  if (!playerID) {
    return res.status(400).json({ error: 'Player ID (playerID) is required'})
  }

  try {
    const player = await getPlayerData(playerID)
    res.json(player)
    console.log(player)
  } catch (error) {
    console.log('Error fetching player data:', error)
    res.status(500).json({ error: 'Failed to fetch player data'})
  }
})

// Route To Get Target Team
app.get('/api/team', async (req, res) => {
  const { teamAbv } = req.query
  if (!teamAbv) {
    return res.status(400).json({ error: 'Team abbreviation (teamAbv) is required'})
  }

  try {
    const teams = await getTeams()
    const team = teams.find(team => team.teamAbv === teamAbv)

    if (!team) {
      return res.status(404).json({ error: 'Team not found'})
    }

    res.json(team)
  }catch (error) {
    console.error('Error fetching team data:', error)
    res.status(500).json({ error: 'Failed to fetch team data'})
  }
})

// Route To Get Last 5 Games
app.get('/api/games', async (req, res) => {
  const { playerID } = req.query

  if (!playerID) {
    return res.status(400).json({ error: 'Player ID (playerID) is required' })
  }

  try {
    const games = await getGames(playerID)
    res.json(games)
  } catch (error) {
    console.error('Error fetching game data:', error)
    res.status(500).json({ error: 'Failed to fetch game data' })
  }
})

// Route To Get Player News
app.get('/api/player-news', async (req, res) => {
  const { playerID } = req.query

  if (!playerID) {
    return res.status(400).json({ error: 'Player ID (playerID) is required' })
  }

  try {
    const playerNews = await getPlayerNews(playerID)
    res.json(playerNews)
    console.log('Fetched player news:', playerNews)
  } catch (error) {
    console.error('Error fetching player news:', error.message || error)
    res.status(500).json({ error: 'Failed to fetch player news' })
  }
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(port, () => console.log(`Server has started on port: ${port}`))