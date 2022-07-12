import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Game from './components/Game'
import Home from './components/Home'
import Navbar from './components/Navbar'

const App = () => {


  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  window.addEventListener('resize',  () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`); 
  })
  
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
