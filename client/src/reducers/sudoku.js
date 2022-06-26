const sudokuReducer = (sudoku = [], action) => {
    switch (action.type) {
        case "GET_SUDOKU":
            return action?.data
        case "UPDATE_SUDOKU":
            console.log(sudoku);
            let newGridToBeFilled = sudoku["gridToBeFilled"]
            newGridToBeFilled[action?.data?.row][action?.data?.col] = action?.data?.number
            return {...sudoku, gridToBeFilled: newGridToBeFilled}
        
        default:
            return sudoku
    }
}

export default sudokuReducer