const getSudokuGrid = (req, res) => {
    

    var size = 3
    var sudokuGrid = new Array(Math.pow(size, 2))
    var availableNumbers = new Array(Math.pow(size, 4))

    const allNumbers = new Array(Math.pow(size, 2)).fill(0).map((elem, idx) => idx+1) // array with all possible numbers you can play with (if size == 3 allNUmbers will be [1, 2, 3, 4, 5, 6, 7, 8 , 9] )

    for(let i = 0; i < sudokuGrid.length; i++) {
        sudokuGrid[i] = Array(Math.pow(size, 2)).fill(0) // initialize every cell to 0
    }

    for(let i = 0; i < availableNumbers.length; i++) {
        availableNumbers[i] = allNumbers.slice() // every cell, at the beginning, could have every number in it
    }

    const reset = () => {
        sudokuGrid = new Array(Math.pow(size, 2))
        availableNumbers = new Array(Math.pow(size, 4))
        for(let i = 0; i < sudokuGrid.length; i++) {
            sudokuGrid[i] = Array(Math.pow(size, 2)).fill(0)
        }

        for(let i = 0; i < availableNumbers.length; i++) {
            availableNumbers[i] = allNumbers.slice()
        }
    }


    const createSudoku = (grid, pos) => {

        //reset()
        //pos is defined as the numbers of the cells, like:
        //1  2  3  4
        //5  6  7  8
        //9  10 11 12
        //13 14 15 16

        while(pos < Math.pow(size, 4)) {

            let [row, col] = coordinatesOfPos(pos)

            if(availableNumbers[pos].length == 0 ) { // ifno more numbers are available for the cell, then backtrack and reset the availableNumbers of that cell to allNumbers
                grid[row][col] = 0
                let av = allNumbers.slice()
                availableNumbers[pos] = av
                pos--
            }
            else {
                let newNumber // number guess, that we check to be valid
                while(availableNumbers[pos].length > 0) {
                    newNumber = availableNumbers[pos][Math.floor(Math.random() * availableNumbers[pos].length)]
                    if(numberIsValid(pos, newNumber, grid)) {
                        break
                    } else {
                        numIndex = availableNumbers[pos].indexOf(newNumber)
                        availableNumbers[pos].splice(numIndex, 1)            
                    }
                    
                }
                
                if(availableNumbers[pos].length == 0) { 
                    // if no valid unmber is found, do nothing(the loop will restart and it will backtrack)
                }

                else if (numberIsValid(pos, newNumber, grid)) {

                    grid[row][col] = newNumber // put the number in the grid

                    numIndex = availableNumbers[pos].indexOf(newNumber)
                    //DELETE THE NUMBER FROM AVAILABLE ONES (need to explicitly make a copy, delete from the copy and make the original array equal to the copy, otherwise there are bugs   )
                    let av = availableNumbers[pos].slice()
                    av.splice(numIndex, 1)
                    availableNumbers[pos] = av

                    pos++
                }
            }

        }
        return grid  
        
    }

    const coordinatesOfPos = (pos) => {
        return [Math.floor(pos/Math.pow(size, 2)), pos % Math.pow(size, 2)] // [row, col]
    }

    const numberIsValid = (pos, num, grid) => {
        let [row, col] = coordinatesOfPos(pos)
        for(let i = 0; i < Math.pow(size, 2); i++) {
            
            if(i != col && grid[row][i] == num) {
                return false
            } 
            if(i!= row && grid[i][col] == num) {
                return false
            }
        }

        let squareCol = Math.floor(col / size) * size
        let squareRow = Math.floor(row / size) * size
        for(let i = 0; i < size; i++) {
            for(let j = 0; j < size; j++) {
                
                let tempRow = (squareRow) + i
                let tempCol = (squareCol) + j
                if(tempRow != row || tempCol != col) {
                    if(grid[tempRow][tempCol] == num) {
                        return false
                    }
                }
            }
        }
        // console.log(num,"is valid at position", [row, col] );


        return true
    }



    //!!!!!!!!!!!!!!!!!!!!!!! First value to return 
    //COMPLETE GRID, WITH ALL NUMBERS FILLED
    sudokuGrid = createSudoku(sudokuGrid, 0)


    let numbersToDelete = 0
    //DECIDE NUMBER OF CELlS TO BE EMPTIED BASED ON THE DIFFICULTY CHOSEN BY THE USER; PASSED AS A QUEY PARAM
    switch (req.query.mode) {
        case "easy":
            numbersToDelete = Math.floor(Math.random()*8 + 40)
            break;
        case "medium":
            numbersToDelete = Math.floor(Math.random()*5 + 45)
            break;
        case "hard":
            numbersToDelete = Math.floor(Math.random()*5 + 50)
            break;
        case "extreme":
            numbersToDelete = Math.floor(Math.random()*5 + 55)
            break;
    
        default:
            numbersToDelete = Math.floor(Math.random()*8 + 40) // as if it was easy
            break;
    }

    //NOW WE USE BACKTRACKING AGAIN TO DELETE SoME NUMBERS, BUT MAKING SURE THAT THE solUTION TO THE SUDOKU REMAINS UNIQUE

    var solutionsCount = {
        val: 0
    }

    var gridWithBlanks = new Array(Math.pow(size, 2))
    for(let i = 0; i < Math.pow(size, 2); i++) gridWithBlanks[i] = new Array(Math.pow(size, 2)).fill(0)

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    var shuffledPositions = new Array(Math.pow(size, 4)).fill(0).map((elem, idx) => idx)
    shuffleArray(shuffledPositions)


    const removeNumbers = (grid, k) => {

        let deletedNumbers = 0
        let [row, col] = coordinatesOfPos(shuffledPositions[k])

        // make copy of the original grid, because some numbers will be deleted but we still want to keep the original
        for(let i = 0; i < Math.pow(size, 2); i++) {
            for(let j = 0; j < Math.pow(size, 2); j++) {
                gridWithBlanks[i][j] = grid[i][j]
            }
        }

        let prevNum = gridWithBlanks[row][col]
        gridWithBlanks[row][col] = 0


        while(k < Math.pow(size, 4)) {
            solveIsUnique(gridWithBlanks)

            if(solutionsCount.val  < 2) {
                deletedNumbers++
                if(deletedNumbers == numbersToDelete) break

            } else {
                gridWithBlanks[row][col] = prevNum  
            }
            solutionsCount.val = 0
            
            k++
            if(k >= Math.pow(size, 4)) break
            [row, col] = coordinatesOfPos(shuffledPositions[k])
            prevNum = gridWithBlanks[row][col]
            gridWithBlanks[row][col] = 0
        }

        
        // gridWithBlanks[row][col] = prevNum
        // console.log("Finished grid:", gridWithBlanks, "\n with", deletedNumbers, " empty spaces(", Math.pow(size, 4)-deletedNumbers, " numbers)" )
        return gridWithBlanks

    }


    const solveIsUnique = (grid) => {

        let length = Math.pow(size, 2)
        for(let i = 0; i < length; i++) {
            for(let j = 0; j < length; j++) {
                if(grid[i][j] == 0) {
                    for(let num = 1; num < 10; num++) {
                        if(numberIsValid(i*length + j, num, grid) && solutionsCount.val < 2) {
                            grid[i][j] = num
                            solveIsUnique(grid)
                            grid[i][j] = 0
                        }
                    }
                    return 
                }
            }
        }
        solutionsCount.val++

    }

    const gridsAreEqual = (grid1, grid2) => {
        for(let i = 0; i < Math.pow(size, 2); i++) {
            for(let j = 0; j < Math.pow(size, 2); j++) {
                if(grid1[i][j] != grid2[i][j]) return false
            }
        }
        return true
    }


    // var board = [
    //     [0, 0, 0, 0, 0, 0, 0, 0, 0],
    //     [0, 9, 8, 0, 1, 0, 2, 7, 0],
    //     [4, 0, 0, 0, 0, 5, 0, 0, 8],
    //     [0, 0, 5, 0, 8, 0, 0, 0, 0],
    //     [0, 6, 0, 0, 0, 0, 0, 9, 0],
    //     [0, 0, 0, 0, 2, 0, 7, 0, 0],
    //     [8, 0, 0, 3, 0, 0, 0, 0, 4],
    //     [0, 7, 1, 0, 9, 0, 6, 2, 0],
    //     [0, 0, 0, 0, 0, 0, 0, 0, 0],
    // ]

    const solve = (grid, idx) => {

        while(idx < 81 && grid[Math.floor(idx/9)][idx%9] != 0) idx++
        if(idx == 81) {
            console.log(grid);

            return grid
        }
        for(let num = 1; num < 10; num++) {
            if(numberIsValid(idx, num, grid)) {
                grid[Math.floor(idx/9)][idx%9] = num
                if(solve(grid, idx+1)) return grid

            }
        }
        grid[Math.floor(idx/9)][idx%9] = 0
        return false
    }

    //!!!!!!!!!!!!!!!!!!!!!!! Second value to return 
    gridWithBlanks = removeNumbers(sudokuGrid, 0)

    //grid: complete grid ------ gridWithBlanks: grid with blanks that will remain so, in order to have the numbers that can't be deleted by the user ------ gridToBeFilled: grid that will be filled by the author
    res.status(200).json({grid: sudokuGrid, gridWithBlanks, gridToBeFilled: gridWithBlanks})
}



module.exports = {
    getSudokuGrid
}