import React, { useState } from 'react'
import FacebookLogin from 'react-facebook-login'

import './App.css'
import Game from './components/Game'

function App () {
  const [currentUser, setCurrentUser] = useState(null)

  const responseFacebook = response => {
    setCurrentUser({
      name: response.name,
      email: response.email
    })
  }

  return (
    <div className='App'>
      {!currentUser
        ? <FacebookLogin
          autoLoad
          appId='919737441746550'
          fields='name,email,picture'
          callback={responseFacebook}
          />
        : <Game currentUser={currentUser} />}
    </div>
  )
}

export default App
