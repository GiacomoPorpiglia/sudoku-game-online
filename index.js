const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv").config()
const bodyParser = require("body-parser")

const path = require('path')

const gameRouter = require("./routes/game.js")

const app = express()

app.use(bodyParser.urlencoded({extended: true, limit: "32mb"}))
app.use(bodyParser.json({extended: true, limit: "32mb"}))
app.use(cors())

app.use('/api/v1/game', gameRouter)


if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}


const PORT = process.env.PORT || 5000



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
