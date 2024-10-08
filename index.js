// Jorrel Tigbayan
// 101329925

const express = require('express');
const fs = require('fs');
const users = require('./user.json');
const app = express();
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

/*
- Create new html file name home.html 
- add <h1> tag with message "Welcome to ExpressJs Tutorial"
- Return home.html page to client
*/
router.get('/home', (req,res) => {
  
  const homePromise = new Promise((resolve, reject) => {
    if (!fs.existsSync("home.html")) {
        reject("Creating home.html...");
    } else {
        resolve("home.html found");
    }
  });

  homePromise.then((resolve) => {
    console.log(resolve);
  }).catch((reject) => {
    fs.writeFile("home.html", `<html>
  <body>
    <h1>Welcome to ExpressJS Tutorial</h1>
  </body>
</html>`, err => {
      if (err) {
        console.error(err);
      } else {
        console.log("home.html created");
      }
    });
  });
  res.sendFile('home.html', {root: __dirname })
});

/*
- Return all details from user.json file to client as JSON format
*/
router.get('/profile', (req,res) => {
  res.header("Content-Type", 'application/json');
  res.send(JSON.stringify(users));
});

/*
- Modify /login router to accept username and password as JSON body parameter
- Read data from user.json file
- If username and  passsword is valid then send resonse as below 
    {
        status: true,
        message: "User Is valid"
    }
- If username is invalid then send response as below 
    {
        status: false,
        message: "User Name is invalid"
    }
- If passsword is invalid then send response as below 
    {
        status: false,
        message: "Password is invalid"
    }
*/
router.post('/login', (req,res) => {
  const jsonInput = req.body;
  let inputUsername;
  let inputPassword;
  let userNameValid = false;
  let passwordValid = false;
  let output;
  for (var key in jsonInput) {
    if (key == "username") {
      inputUsername = jsonInput[key];
    }
    if (key == "password") {
      inputPassword = jsonInput[key];
    }
  }
  for (var key in users) {
    if (key == "username") {
      if (users[key] == inputUsername) {
        userNameValid = true;
      }
    }
    if (key == "password") {
      if (users[key] == inputPassword) {
        passwordValid = true;
      }
    }
  }

  if (userNameValid == false) {
    output = {
      "status": "false",
      "message": "Username is invalid"
    }
  } else if (passwordValid == false) {
    output = {
      "status": "false",
      "message": "Password is invalid"
    }
  } else {
    output = {
      "status": "true",
      "message": "User is valid"
    }
  }

  res.send(output);
});

/*
- Modify /logout route to accept username as parameter and display message
    in HTML format like <b>${username} successfully logout.<b>
*/
router.get('/logout', (req,res) => {
  let username = req.query.username;
  res.send(`<b>${username} successfully logged out.</b>`);
});

/*
Add error handling middleware to handle below error
- Return 500 page with message "Server Error"
*/

app.use((err,req,res,next) => {
  console.error(err.stack);
    const errorObj = {
        status: 500,
        message: 'Server Error',
        err: err.message
    }
    res.status(500).send(errorObj);
});

app.use('/', router);

app.listen(process.env.port || 8081);

console.log('Web Server is listening at port '+ (process.env.port || 8081));