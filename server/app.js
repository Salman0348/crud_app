const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const dbService = require('./dbService');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//create
app.post('/insert',(request,response)=>{
        // response.send(request.body.name)
        const name = request.body.name;
        const db = dbService.getDbServiceInstance();

        if(name != ''){ //if name is not empty
            const result = db.insertIntoTable(name); //this function inserts a row into the DB table and return id, name and date added

            result.then(data =>response.json({data: data})) //data is the returned information back,which is sent to front end from here.
            .catch(err => console.log(err));
        }
        

        

    })
    


//read
app.get('/getAll',(request,response)=>{
    const db = dbService.getDbServiceInstance(); //instance of the class DbService which is inside dbService.js
    
    const result = db.getAllData(); //returns a promise to the result

    result.then((data)=>{ //data is extracted from the result
        response.json({data: data}) // data is sent in object form in response to get request
    }).catch(error => console.log(err))
})


//update
app.patch('/update',(request,response)=>{
    const {id,name} = request.body;

    const db = dbService.getDbServiceInstance(); 
    
    const result = db.updateName({id,name});

    result.then(data =>response.json({success:data}));
})



//delete
app.delete('/delete/:id',(request,response)=>{
    const db = dbService.getDbServiceInstance();
    const {id} = request.params;

    const result = db.deleteRowById(id);

    result.then(data =>response.json({success:data})).catch(err => console.log(err));
})

//search
app.get('/search/:name',(request,response)=>{
    const {name} = request.params;

    const db = dbService.getDbServiceInstance(); 
    
    const result = db.searchByName(name); 

    result.then((data)=>{ 
        response.json({data: data}) 
    }).catch(error => console.log(err))
})



app.listen(process.env.PORT,()=>{console.log(`app is running on port ${process.env.PORT}`)});