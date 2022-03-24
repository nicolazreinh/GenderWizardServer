const express= require('express');
const mysql = require('mysql');
const fs = require('fs');

var bodyParser = require('body-parser')

const app= express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

var db = mysql.createConnection({
    host     : 'beitsahourfamilytree.mysql.database.azure.com',
    user     : 'nicola@beitsahourfamilytree',
    password : '123456789_n',
    database : 'demo',
    ssl: {
        ca : fs.readFileSync('BaltimoreCyberTrustRoot.crt.pem')
    }
  });
  
db.connect((err) =>{
if(err)
    throw err;
console.log("MySqlConnected...")
});


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
  app.get('/', (req, res, next) => {
  res.send("Hello");
});

app.get('/api/unknownGenderPersons', (req, res, next) => {
    let sql = "SELECT * FROM person WHERE gender = 'unknown'";
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
});

app.post('/api/updateGenderPersons', (req, res, next) => {
    console.log(req.body);
    var id= req.body.id;
    var gender= req.body.gender;
    var modificatedBy= req.body.modifiedby;

    let sql = `UPDATE person
    SET gender = '${gender}',
    modificatedBy= '${modificatedBy}'
    WHERE id = ${id};`;
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send("success");
    })
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server started on port 3000');
});