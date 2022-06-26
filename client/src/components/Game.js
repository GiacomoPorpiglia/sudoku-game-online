import React, { useEffect, useState } from 'react'
import {getSudoku} from '../actions/sudoku'
import {useSelector, useDispatch} from 'react-redux'
import {useLocation, useNavigate} from 'react-router-dom'

import { useSearchParams } from "react-router-dom";

import '../css/index.css'
// import 'bootstrap/dist/css/bootstrap.min.css';

// import { Container, Row, Col } from 'react-bootstrap';

const Game = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const {search} = location

    let mode = ""

    if(!search) {
        mode = "easy"
    } else {
        const searchParams = new URLSearchParams(search)
        let modeParam = searchParams.get('mode')
        if(modeParam == "easy" || modeParam == "medium" || modeParam == "hard" || modeParam=="extreme") mode = modeParam
        else navigate('/')
    }

    const [selectedCellIdx, setSelectedCellIdx] = useState(0)
    useEffect(() => {
        console.log("Dispatched");
        console.log(mode)
        dispatch(getSudoku(mode))
    }, [dispatch])


   

    
    const handleSelected = (idx) => {
        setSelectedCellIdx((prev) => idx)
        console.log(selectedCellIdx);
    }


    const updateSudokuGrid = (number) => {
        let row = Math.floor(selectedCellIdx/9)
        let col = selectedCellIdx%9
        console.log(selectedCellIdx, row, col);
        if(sudoku?.gridWithBlanks[row][col] == 0) {
            dispatch({type: "UPDATE_SUDOKU", data: {number, row, col}})
        }

        if(sudokuIsCompleted()) {
            document.querySelector("#game-screen").classList.remove('active')
            document.querySelector("#result-screen").classList.add('active')
        }

    }


    const sudokuIsCompleted = () => {
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                if(sudoku?.gridToBeFilled[i][j] != sudoku?.grid[i][j]) return false
            }
        }
        return true
    }

    const handleKeyPress = (e) => {
       if(e.keyCode >= 49 && e.keyCode <= 57) { // IF IT IS A NUMBER (ascii code)
            let number = e.keyCode - 48
            updateSudokuGrid(number, sudoku)
       } else if(e.keyCode === 8) {
           updateSudokuGrid(0, sudoku)
       } else if(e.keyCode == 37) { // LEFT_ARROW
            if(selectedCellIdx%9 != 0) setSelectedCellIdx((prev) => --prev)
       } else if (e.keyCode == 38) { // UP_ARROW
            if(selectedCellIdx > 8) setSelectedCellIdx((prev) => prev-9)
       } else if (e.keyCode == 39) { // RIGHT_ARROW
            if(selectedCellIdx%9 != 8) setSelectedCellIdx((prev) => ++prev)
       } else if (e.keyCode == 40) { //DOWN_ARROW
            if(selectedCellIdx < 72) setSelectedCellIdx((prev) => prev+9)
       }
    }

    useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    }
  }, [selectedCellIdx])



    const newGame = () => {
        navigate('/')
    }

    const sudoku = useSelector((state) => state.sudoku)



    return (

        <div className='main'>
            <div className='screen'>
                <div className="main-game active" id="game-screen">
                    <div className="main-sudoku-grid">
                        {sudoku?.gridToBeFilled?.map((elem, row) => (
                            elem.map((number, col) => (<div
                            className={"main-grid-cell "
                            .concat( (row%3 == 0) ? "border-top ": "")
                            .concat((row%3 == 2) ? "border-bottom " : "")
                            .concat((col%3==0) ? "border-left " : "")
                            .concat((col%3==2) ? "border-right " : "")
                            .concat((row*9 + col == selectedCellIdx) ? "selected " : "")
                            .concat((number && sudoku?.gridWithBlanks[row][col] != 0) ? "given " : "")
                            .concat((number && sudoku?.gridWithBlanks[row][col] == 0) ? "inserted " : "")
                            .concat((row == Math.floor(selectedCellIdx/9)) ? "highlighted " : "")
                            .concat((col == selectedCellIdx%9) ? "highlighted " : "")
                            .concat(((Math.floor(row/3) == Math.floor(Math.floor(selectedCellIdx/9)/3)) && (Math.floor(col/3) == Math.floor((selectedCellIdx%9)/3))) ? "highlighted " : "")
                            }
                            
                            
                            key={row*9+col}
                            onClick={() => handleSelected(row*9+col)}>{number ? number : ''}</div>))
                        ))}
                    </div>

                    <div className="numbers">
                        <div className="number" onClick={() => updateSudokuGrid(1)}>1</div>
                        <div className="number" onClick={() => updateSudokuGrid(2)}>2</div>
                        <div className="number" onClick={() => updateSudokuGrid(3)}>3</div>
                        <div className="number" onClick={() => updateSudokuGrid(4)}>4</div>
                        <div className="number" onClick={() => updateSudokuGrid(5)}>5</div>
                        <div className="number" onClick={() => updateSudokuGrid(6)}>6</div>
                        <div className="number" onClick={() => updateSudokuGrid(7)}>7</div>
                        <div className="number" onClick={() => updateSudokuGrid(8)}>8</div>
                        <div className="number" onClick={() => updateSudokuGrid(9   )}>9</div>
                        <div className="delete" id="btn-delete" onClick={() => updateSudokuGrid(0, sudoku)}>X</div>
                    </div>

                </div>


            <div className="result-screen" id="result-screen">
                <div className="congrate">Sudoku Completed!</div>
                <div className="btn btn-blue" id="btn-new-game-2" onClick={() => newGame()}>New game</div>
            </div>

            </div>


        </div>

    )
}

export default Game

