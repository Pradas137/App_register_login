 express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

// CONFIGURACIÓN GLOBAL
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


// root o "página de inicio"
app.get('/', (req, res) => {
  res.render('home', {})
})

// Publicación en la página de inicio. Devuelve Hello + nombre si la página de inicio está en POST con un nombre dado.
// Muestra la página de inicio de sesión.
app.post('/', function(req, res) {
    var nom = req.body.nom
    res.send("Hello " + nom);
})

// Muestra la página de inicio de sesión.
app.get("/login", function(req, res){
    res.render('login',{})
})

// Página de inicio de sesión. Comprueba si el usuario existe en LocalStorage. Si el usuario existe, se muestra un mensaje de bienvenida.
// De lo contrario, si el usuario no existe o la contraseña no coincide, se muestra un mensaje de error.
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
        res.send("WILLKOMMEN")
      }
    };
  }
  if (exist == false) {
    res.send("Usuari i/o contrasenya incorrectes. Torna a intentar-ho<br><a href='./login'>Inicia sessió</a>")
  }
})

// Se representa una página de registro. 
app.get("/register", function(req, res){
  res.render('register',{})
})

// Se procesan los datos proporcionados para el registro y el usuario se agrega a la base de datos con la contraseña y el nombre de usuario proporcionados. 
app.post("/register", function(req, res){
  var usuari = req.body.usuari;
  var contrasenya = req.body.contrasenya;
  var token = "";
  var data = {password: contrasenya, token: token};

  localStorage.setItem(usuari, JSON.stringify(data));
  res.send("El usuari ha estat registrat correctament <br><a href='./login'>Inicia sessió</a>")
})

// El inicio de sesión de la API funciona desde la consola con curl [url] -X POST -d "usuario = nombre" -d "contraseña = contraseña"
// Si el usuario se encuentra en la base de datos, se verifica la contraseña.
// Si ambos coinciden, se genera un token de sesión y el usuario puede acceder usándolo en lugar de enviar usuario y contraseña.
// Si no se encuentra el usuario o la contraseña no coincide, se muestra un error.
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

// El cierre de sesión de la API funciona desde la consola como el inicio de sesión, pero solo el token está integrado.
// Si el token se encuentra en la base de datos, se elimina de la base de datos y el usuario recibe un mensaje de cierre de sesión.
// Si no se encuentra el token, se muestra un mensaje de error. 
app.post("/api/logout", function(req, res){
  var token = req.body.token;
  for (var i = 0; i < localStorage.length; i++) {
    user = localStorage.key(i);
    user_data = JSON.parse(localStorage.getItem(user));
    if (token == user_data['token']){
      new_data = {password: user_data['password'], token: ""};
      localStorage.setItem(user, JSON.stringify(new_data));
      res.send('Logged out.');
    } else {
      res.send('There was an error logging out. Check if the token is correct.');
    }
  };
})

// La aplicación escucha el puerto 3000 en localhost.
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})