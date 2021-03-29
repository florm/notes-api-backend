//const http = require('http') //se importa un modulo llamado http. Es un modulo nativo. Lo comento porque uso express
const express = require('express')
const logger = require('./loggerMiddleware')

const cors = require('cors')
const app = express() //creamos nuestra aplicacion ejecutando express

app.use(cors()) //lo que hace por defecto es que funcione cualquier origen
app.use(express.json()) // esto dice que la app tien que usar este modulo que esta en express.json(). Con esto
//hago que parsee el objeto del request y lo tenga disponible en el request.body

app.use(logger)
let notes = [
    {
        id: 1,
        content: 'HTML is easy',
        date: '2019-05-30T17:30:31.098Z',
        important: true
    },
    {
        id: 2,
        content: 'Browser can execute only Javascript',
        date: '2019-05-30T18:39:34.091Z',
        important: false
    },
    {
        id: 3,
        content: 'GET and POST are the most important methods of HTTP protocol',
        date: '2019-05-30T19:20:14.298Z',
        important: true
    }
]

//a createServer se le pasa un callback. En este caso el callback es una funcion que se ejecuta cada vez que le llegue un request
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' })
//   response.end(JSON.stringify(notes))
// })

app.get('/', (request, response) => {
    response.send('<h1>Hello Word</h1>')
})

app.get('/api/notes', (req, res) => {
    res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id) //params es un string asi que hay que transformarlo
    const note = notes.find(n => n.id === id)
    if (note) {
        res.json(note)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/notes/:id', (req, resp) => {
    const id = Number(req.params.id)
    notes = notes.filter(n => n.id !== id)
    resp.status(204).end()
})

app.post('/api/notes', (req, resp) => {
    const note = req.body
    if (!note || !note.content) {
        return resp.status(400).json({
            error: 'note.content is missing'
        })
    }
    const ids = notes.map(n => n.id)
    const maxId = Math.max(...ids)
    const newNote = {
        id: maxId + 1,
        content: note.content,
        important: typeof note.important !== 'undefined' ? note.important : false,
        date: new Date().toISOString()
    }
    notes = [...notes, newNote] // o usar concat
    resp.status(201).json(newNote)
})

//middleware
app.use((request, response) =>{
    console.log(request.path)
    response.status(404).json({
        error: 'Not found'
    })
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`) //va en el callback porque el listen del express es asincrono
})