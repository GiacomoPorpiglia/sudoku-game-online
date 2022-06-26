import * as api from '../api'

export const getSudoku =  (mode) => async (dispatch) => {

    try {
        const {data} = await api.getSudoku(mode)

        console.log(data);
        dispatch({type:'GET_SUDOKU', data})
    } catch (error) {
        console.log(error)
    }
}

