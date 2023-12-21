const express = require('express')
const app = express()
const PORT = 4000
const mongoose = require('mongoose')
const TodoTask = require('./models/todotask')
const path = require('path')
const { log } = require('console')
require('dotenv').config()


//set middleware 
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

//connect to mongo
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  
  // Connection events
  const db = mongoose.connection;
  
  db.on('error', (error) => {
    console.error('Connection error:', error);
  });
  
  db.on('open', () => {
    console.log('Connected to the database');
  });
  
  db.on('close', () => {
    console.log('Connection to the database closed');
  });


  //creating a sample task 

//   app.get('/', async (req,res, next) => {
//     const options = {
//         root: path.join(__dirname)
//     };
//     const fileName = '/views/index.html';
//     res.sendFile(fileName, options, (err) => {
//         if(err){
//             next(err)
//         }else {
//             console.log('Sent:', fileName);
//             next();
//         }
//     })
//   })

//read
app.get("/", async (req, res) => {
  try {
    const tasks = await TodoTask.find({})
    res.render('index.ejs', {todoTasks: tasks})
  } catch (err) {
      if (err){
        console.log(err);
        return res.status(500).send(err)
      } 
  }
});

//create
app.post('/', async (req, res) => {
    const todoTask = new TodoTask({
        title: req.body.title,
        content: req.body.content
    })
    try{
        await todoTask.save()
        console.log(todoTask);
        res.redirect('/')
    }catch (err){
        res.redirect('/')
    }
})

//update 
app
.route('/edit/:id')
.get(async(req,res) => {
  const id = req.params.id
  try{
    const tasks = await TodoTask.find()
    res.render('edit.ejs', {todoTasks: tasks, idTask: id})
  }catch (err){
    if(err){
      console.log(err);
      return res.status(500).send(err)
    }
  }})
  .post(async(req, res) => {
    const id = req.params.id
    try{
       await TodoTask.findByIdAndUpdate( id,
        {
            title: req.body.title,
            content: req.body.content
        })
        res.redirect('/')

    }catch(err){
      if(err){
        console.log(err);
        return res.status(500).send(err)
      }
    }
  })


  app
  .route('/remove/:id')
  .get(async(req,res) => {
    const id = req.params.id
    try{
      const task = await TodoTask.findById(id)
      res.render('delete.ejs', {task: task});
    }catch(err){
      if(err){
        console.log(err)
        return res.status(500).send(err);
      }  
    }
  })

  app 
  .route('/removeConfirmed/:id')
  .get(async(req, res) => {
    const id = req.params.id
    try{
      await TodoTask.findByIdAndDelete(id)
      res.redirect('/')
    }catch(err){
      console.log(err);
      return res.status(500).send(err)
    }
  })
  





  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  })

  
  
  
  
  
  
  
  
  
  