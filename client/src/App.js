import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Game from './components/Game'
import Home from './components/Home'
import Navbar from './components/Navbar'

const App = () => {
  
  return (
    <>
      <Navbar />
        <BrowserRouter>
          <Routes>

            <Route path="/" element={<Home />}></Route>
            <Route path="/game" element={<Game />}></Route>
          </Routes>
        </BrowserRouter>

    </>
  );
}

export default App;
