import axios from 'axios'

const API  = axios.create({baseURL: "/api/v1"})

export const getSudoku = (mode) => API.get(`/game?mode=${mode}`)