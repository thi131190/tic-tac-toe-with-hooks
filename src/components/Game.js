import React, { useState, useEffect } from 'react'
import Board from './Board'
import axios from 'axios'

/**
 * calculateWinner (helper function)
 *
 * Parameter: squares (array of 'X', '0', or null)
 * Return value: 'X', 'O', or null
 */
function calculateWinner (squares) {
  /* Squares indexes as they appear in UI:
  0 1 2
  3 4 5
  6 7 8
  */
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ] // shows all of the winning combinations ("lines")

  // Iterate over all the winning line combinations to see if the
  // input squares array has one of the with all 'X's or all 'O's.
  // If it does, return 'X' or 'O'.
  for (let line of lines) {
    const [a, b, c] = line
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  // If none of the winning line combinations is contained in
  // input squares array, return null...
  return null
}

const Game = props => {
  const initialHistory = [{ squares: Array(9).fill(null) }]
  const [history, setHistory] = useState(initialHistory)
  const [xIsNext, setXIsNext] = useState(true)
  const [stepNumber, setStepNumber] = useState(0)
  const [highScores, setHighScores] = useState([])

  const getHighScores = async () => {
    const res = await axios.get(
      `https://ftw-highscores.herokuapp.com/tictactoe-dev`
    )
    const data = await res.data.items
    setHighScores(data)
  }

  const postScore = async () => {
    console.log('Posting...')
    const currentDate = new Date()
    let data = new URLSearchParams()
    data.append('player', props.currentUser)
    data.append('score', currentDate.getTime())
    const url = `https://ftw-highscores.herokuapp.com/tictactoe-dev`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data.toString(),
      json: true
    })
    console.log(response)
  }

  useEffect(() => {
    getHighScores()
  }, [])

  const handleClick = i => {
    const slicedHistory = history.slice(0, stepNumber + 1)
    const finalStepInSlicedHistory = slicedHistory[slicedHistory.length - 1]
    const newSquares = [...finalStepInSlicedHistory.squares]

    const winnerDeclared = Boolean(calculateWinner(newSquares))
    const squareAlreadyFilled = Boolean(newSquares[i])
    if (winnerDeclared || squareAlreadyFilled) {
      return
    }
    newSquares[i] = xIsNext ? 'X' : 'O'
    const newStep = { squares: newSquares }
    const newHistory = [...slicedHistory, newStep]

    setHistory(newHistory)
    setXIsNext(!xIsNext)
    setStepNumber(slicedHistory.length)
  }
  const jumpTo = step => {
    setStepNumber(step)

    const isEvenStepNumber = step % 2 === 0
    setXIsNext(isEvenStepNumber)
  }
  const moves = history.map((step, move) => {
    const description = move ? `Go to move #${move}` : `Go to game start`
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>
          {description}
        </button>
      </li>
    )
  })

  const currentStep = history[stepNumber]

  const winner = calculateWinner(currentStep.squares)

  const status = winner
    ? `Winner: ${winner}`
    : `Next player: ${xIsNext ? 'X' : 'O'}`

  winner && postScore()

  return (
    <div className='game'>
      <div className='game-board'>
        <Board squares={currentStep.squares} onClick={i => handleClick(i)} />
      </div>
      <div className='game-info'>
        <div>
          {status}
        </div>
        <ol>
          {moves}
        </ol>
      </div>
      <div className='high-scores'>
        <div>Top players</div>
        <ol>
          {highScores &&
            highScores.map(player => {
              return (
                <li key={player._id}>
                  {player.player}: {player.score}
                </li>
              )
            })}
        </ol>
      </div>
    </div>
  )
}

export default Game
