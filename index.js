const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


app.get('/', (req, res) => {
  res.render('home', {})
})

app.post('/', function(req, res) {
    var nom = req.body.nom
    res.send("Hello " + nom);
})

app.get("/login", function(req, res){
    res.render('login',{})
})

app.post("/login", function(req, res){
  var usuari = req.body.usuari;
  var contrasenya = req.body.contrasenya;
  var exist = false;
  for (var i = 0; i < localStorage.length; i++) {
    if (usuari == localStorage.key(i)){
      user_info = JSON.parse(localStorage.getItem(usuari));
      console.log(user_info);
      if (contrasenya == user_info['password']){
        exist = true;
        res.send("Hello")
      }
    };
  }
  if (exist == false) {
    res.send("Usuari i/o contrasenya incorrectes. Torna a intentar-ho<br><a href='./login'>Inicia sessió</a>")
  }
})

app.get("/register", function(req, res){
  res.render('register',{})
})

app.post("/register", function(req, res){
  var usuari = req.body.usuari;
  var contrasenya = req.body.contrasenya;
  var token = "";
  var data = {password: contrasenya, token: token};

  localStorage.setItem(usuari, JSON.stringify(data));
  res.send("El usuari ha estat registrat correctament <br><a href='./login'>Inicia sessió</a>")
})

app.post("/api/login", function(req, res){
  var usuari = req.body.user;
  var contrasenya = req.body.pass;
  var exist = false;
  for (var i = 0; i < localStorage.length; i++) {
    if (usuari == localStorage.key(i)){
      user_info = JSON.parse(localStorage.getItem(usuari));
      if (contrasenya == user_info['password']){
        exist = true;
        var token = require('crypto').randomBytes(64).toString('hex');
        var data = {password: contrasenya, token: token};
        localStorage.setItem(usuari, JSON.stringify(data));
        res.send("WILLKOMMEN")
      }
    };
  }
  if (exist == false) {
    res.send("Usuari i/o contrasenya incorrectes. Torna a intentar-ho")
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})