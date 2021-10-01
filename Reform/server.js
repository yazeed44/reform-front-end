const express  = require('express');
const fs = require('fs');
const app = express();


app.use(express.static('./public'));


const server = app.listen(9999,()=>{
    console.log("listening on port 9999")
})

app.get('/districts', function(req, res){
    fs.readFile('./public/districts.json','utf8', (err, data)=>{
        if(err){
            res.send(err);
        }
        res.send(data);
    });
})