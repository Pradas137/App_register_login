const express = require('express')
const bodyParser =require('body-parser')
const app = express()
const port = 3001

app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine','ejs')

/*
app.get('/', (req,res) => {
    res.send('<form method="post">\
        <input name="nom" placeholder="el teu nom...">\
        <input type="submit"/>\
        </form>')
})
*/

if (typeof localStorage === "undefined" || localStorage===null) {
    var LocalStorage=require('node-localstorage').LocalStorage;
    localStorage= new LocalStorage('./scratch');
}

localStorage.setItem("adrian","adrian")
localStorage.setItem("pili","pili")

app.get('/', (req,res) => {
    res.render('home')

})

app.post("/",function(req,res){
    var nom=req.body.nom;
    res.send("Hola "+nom);
})

app.get('/login', function(req,res) {
    res.render('login',{})
})

app.post('/login', function(req,res) {
    var usuari=req.body.nom;
    var contrasenya=req.body.contrasenya;

    var contra2 = localStorage.getItem(usuari)
    console.log("Contra2="+contra2)

    if ( contra2==contrasenya ) {
        res.send("Contraseña correcta")
    } else {
        res.send("Contraseña Incorecta")
    }
})

app.get('/register', function(req,res) {
    res.render('register',{})
})

app.post('/register', function(req,res) {
    var usuari=req.body.nom;
    var contrasenya=req.body.contrasenya;
    localStorage.setItem(usuari, contrasenya);
    res.send("OK")

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})