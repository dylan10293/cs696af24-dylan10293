const express = require('express')
const cors = require('cors')
const app = express()
const port = 9000

app.use(cors())

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.get('/intro', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.send('Intro works too')
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})