const express = require('express')
const exphbs = require('express-handlebars')
const todos = require('../data/tasklist.js')
const morgan = require('morgan')
const app = express();

function createNewId(todos) {
    let maxId = 0
    for (const item of todos) {
        if (item.id > maxId) {
            maxId = item.id
        }
    }
    return maxId + 1
}

app.engine('hbs', exphbs.engine({
    defaultLayout: 'main',
    extname: '.hbs'
}))

app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('common'))

app.get('/', (req, res) => {
    res.render('homepage')
})

app.get('/tasks/summary', (req, res) => {
    res.render('task-summary', { todos })
})

app.get('/tasks/new', (req, res) => {
    res.render('task-create')
})

app.post('/tasks/new', (req, res) => {
    const id = createNewId(todos)
    const todaysDate = new Date();
    const day = ("0" + todaysDate.getDate()).slice(-2);
    const month = ("0" + (todaysDate.getMonth() + 1)).slice(-2);
    const year = todaysDate.getFullYear();
    const hours = todaysDate.getHours();
    const minutes = todaysDate.getMinutes();

    const newTask = {
        id: id,
        created: year + "-" + month + "-" + day + " " + hours + ":" + minutes,
        description: req.body.description,
        done: false,
    }

    todos.push(newTask)

    res.redirect('/tasks/' + id)
    
})

app.get('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const task = todos.find(i => (i.id === id))

    res.render('task-single', task)
})

app.get('/tasks/:id/delete', (req, res) => {

    const id = parseInt(req.params.id)
    const task = todos.find(i => (i.id === id))
    res.render('task-delete', task)     

})

app.get('/tasks/:id/edit', (req, res) => {

        const id = parseInt(req.params.id)
        const task = todos.find(i => (i.id === id))
        res.render('task-edit', task)

})

app.post('/tasks/:id/edit', (req, res) => {
    const id = parseInt(req.params.id)
    const index = todos.findIndex(i => (i.id === id))

    todos[index].created = req.body.created
    todos[index].description = req.body.description
    todos[index].done = req.body.done

    res.redirect('/tasks/' + id)
})

app.post('/tasks/:id/delete', (req, res) => {

    const id = parseInt(req.params.id)
    const index = todos.findIndex(i => (i.id === id))

    todos.splice(index, 1)

    res.redirect('/tasks/summary')
})

app.listen(8000, () => {
    console.log("http://localhost:8000/")
})
