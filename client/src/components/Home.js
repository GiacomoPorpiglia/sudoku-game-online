import React, {useState} from 'react'
import {Navigate, useLocation, useNavigate} from 'react-router-dom'

import '../css/index.css'

const Home = () => {

    const navigate = useNavigate()

    //0 = easy, 1 = medium, 2 = hard, 3 = extreme
    const difficulties = ["easy", "medium", "hard", "extreme"]
    const difficultyColors = [
        "rgb(38, 245, 72)", // easy
        "yellow", // medium
        "orange", //hard
        "red" //extreme
    ]


    const [difficulty, setDifficulty] = useState(0)

    const changeDifficulty = () => {
        setDifficulty((prev) => ((prev+1) % difficulties.length))
    }

    const handlePlayButton = () => {

        navigate('/game?mode=' + difficulties[difficulty])
    }


  return (
    
        <div className="main">
            <div className="screen">
                <div className="start-screen active">
                    {/* <input type="text" placeholder="Your name" maxLength="11" className="input-name" id="input-name"></input> */}
                    <div className="btn btn-blue" id="btn-level" onClick={changeDifficulty}>
                        Mode: {difficulties[difficulty]}
                    </div>
                    <div className="btn btn-blue" id="btn-play" onClick={handlePlayButton}>Play</div>
                </div>
            </div>
        </div>
  )
}

export default Home