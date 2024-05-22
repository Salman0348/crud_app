const mysql = require('mysql');
let instance = null;
const dotenv = require('dotenv');
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.MYSQL_PORT
})

connection.connect((error)=>{
    if(error){
        console.log(error.message)
    }
    console.log('db ' + connection.state)

})

class DbService{
    static getDbServiceInstance(){
        return instance ? instance : new DbService();
    }

    async getAllData(){ //read function
        try
        {   
            const query = 'SELECT * FROM persons;';
            const response = await new Promise((resolve,reject)=>{
                connection.query(query,(error,result)=>{ //querying database for the above query
                    if(error) reject(new Error(error.message));
                    resolve(result);
                })
            })
            return response;
        }
        catch(error)
        {
            console.log(error)
        }
    }

    //insert/create function

    async insertIntoTable(name){
        try
        {   
            const dateAdded = new Date();
            const query = 'INSERT INTO persons (name,date_added) VALUES (?,?);'; //? is used for prevention of sequel injection and it's values are given as an array in the second argmnt of query.

            const insertId = await new Promise((resolve,reject)=>{
                connection.query(query,[name,dateAdded],(error,result)=>{ //querying database for the above query
                    if(error) reject(new Error(error.message));
                    resolve(result.insertId);
                })
            })
            return {
                id: insertId,
                name: name,
                dateAdded: dateAdded
            };
        }
        catch(error)
        {
            console.log(error)
        }
    }

    //delete function
async deleteRowById(id){
    try{
        id = parseInt(id,10);
        const query = 'DELETE FROM persons WHERE id =  ?;';
            const response = await new Promise((resolve,reject)=>{
                connection.query(query,[id],(error,result)=>{ //querying database for the above query
                    if(error) reject(new Error(error.message));
                    resolve(result);
                })
            })
            return response.affectedRows == 1? true:false;
    } catch(error) {
        console.log(error)
        return false;
    }
}

//update function
async updateName({id,name}){
    try
        {   
            const query = 'UPDATE persons SET name = ? WHERE id = ?;'; 

            const response = await new Promise((resolve,reject)=>{
                connection.query(query,[name,id],(error,result)=>{ 
                    if(error) reject(new Error(error.message));
                    resolve(result);
                })
            })
            return response.affectedRows == 1 ? true:false; 
        }
        catch(error)
        {
            console.log(error)
            return false;
        }
}

//search by name

async searchByName(name){ 
    try
    {   
        const query = 'SELECT * FROM persons WHERE name = ?;';
        const response = await new Promise((resolve,reject)=>{
            connection.query(query,[name],(error,result)=>{ 
                if(error) reject(new Error(error.message));
                resolve(result);
            })
        })
        return response;
    }
    catch(error)
    {
        console.log(error)
    }
}

}




module.exports = DbService;