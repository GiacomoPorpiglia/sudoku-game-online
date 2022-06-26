//import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from 'redux'
import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import sudoku from '../reducers/sudoku'

const rootReducer = combineReducers({
    sudoku
})

// const store = configureStore ({
//     reducer: {rootReducer}
// })
const store = createStore(rootReducer, compose(applyMiddleware(thunk)))


export default store