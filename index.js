//$ curl http://localhost:3001/api/login/alex/alex
//$ curl -X POST localhost:3001/api/login -d '{"nom":"alex","pass":"alex"}' -H "Content-Type: application/json"

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3001

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

/*app.get("/login", function(req, res){
    res.render('login',{})
})*/

/*app.post("/login", function(req, res){
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
    res.send("Usuari i/o contrasenya incorrectes. Torna a intentar-ho<br>s")
  }
})*/

app.get("/register", function(req, res){
  res.render('register',{})
})

app.post("/register", function(req, res){
  var usuari = req.body.nom;
  var contrasenya = req.body.contrasenya;
  var token = "";
  var data = {password: contrasenya, token: token};

  localStorage.setItem(usuari, JSON.stringify(data));
  res.send("Registro Correcto<br>")
})

app.post("/api/login", function(req, res){
  var usuari = req.body.nom;
  var contrasenya = req.body.contrasenya;
  var exist = false;
  for (var i = 0; i < localStorage.length; i++) {
    if (usuari == localStorage.key(i)){
      user_info = JSON.parse(localStorage.getItem(usuari));
      if (contrasenya == user_info['password']){
        exist = true;
        var token = require('crypto').randomBytes(64).toString('hex');
        var data = {password: contrasenya, token: token};
        localStorage.setItem(usuari, JSON.stringify(data));
        res.send("Hola Bienbenido")
      }
    };
  }
  if (exist == false) {
    res.send("ERROR: Usuari o contrasenya.")
  }
})

app.post("/api/logout", function(req, res){
  var token = req.body.token;
  for (var i = 0; i < localStorage.length; i++) {
    user = localStorage.key(i);
    user_data = JSON.parse(localStorage.getItem(user));
    if (token == user_data['token']){
      new_data = {password: user_data['password'], token: ""};
      localStorage.setItem(user, JSON.stringify(new_data));
      res.send('Cerrando sesion.');
    } else {
      res.send('Error al cerrar sesion.');
    }
  };
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})