module.exports = function (app, shopData) {
  const bcrypt = require("bcrypt");
  const { check, validationResult } = require("express-validator");
  // Creating a function that redirects the user to login page if they are not authorised
  const redirectLogin = (req, res, next) => {
    //Checking if the user is logged in
    if (!req.session.userId) {
      res.redirect("./login");
    } else {
      next();
    }
  };

  // Handle our routes
  app.get("/", function (req, res) {
    res.render("index.ejs", shopData);
  });
  //This is the about page of the webpage, talking about what the website is about
  app.get("/about", function (req, res) {
    res.render("about.ejs", shopData);
  });
  // This is the EJS file of the login.
  app.get("/login", function (req, res) {
    res.render("login.ejs", shopData);
  });

app.get("/addFood", function (req, res) {
  res.render("addFood.ejs", shopData);
});

app.post("/foodadded", function (req, res) {
  // saving data in database
  const name = req.sanitize(req.body.name);
  const value = req.sanitize(req.body.value);
  const valueUnit = req.sanitize(req.body.valueUnit);
  const carbs = req.sanitize(req.body.carbs);
  const fat = req.sanitize(req.body.fat);
  const protein = req.sanitize(req.body.protein);
  const salt = req.sanitize(req.body.salt);
  const sugar = req.sanitize(req.body.sugar);
  let sqlquery = "INSERT INTO foods (name, value, valueUnit, carbs, fat, protein, salt, sugar) VALUES ('"+ req.body.name+"','"+req.body.value+"','"+req.body.valueUnit +"','"+req.body.carbs+"','"+req.body.fat+"','"+req.body.protein+"','"+req.body.salt+"','"+req.body.sugar+"');";
  // execute sql query
  console.log(sqlquery)
  let newrecord = [name, value, valueUnit, carbs, fat, protein, salt, sugar];
  db.query(sqlquery, newrecord, (err, result) => {
    if (err) {
      return console.error(err.message);
    } else
      console.log(" This food is added to database, name: " + name + " value: " + req.body.value +" valueUnit: "+ req.body.valueUnit +" carbs: "+ req.body.carbs +" fat: "+  req.body.fat+" protein: "+ req.body.protein+" salt: "+ req.body.salt +" sugar: " +req.body.sugar );
      res.redirect("./");
  });
});

app.get("/updatefood", redirectLogin, function (req, res) {
  res.render("updatefood.ejs", shopData);
});

app.post("/foodupdated", function (req, res) {
  // saving data in database
  const name = req.sanitize(req.body.name);
  const value = req.sanitize(req.body.value);
  const valueUnit = req.sanitize(req.body.valueUnit);
  const carbs = req.sanitize(req.body.carbs);
  const fat = req.sanitize(req.body.fat);
  const protein = req.sanitize(req.body.protein);
  const salt = req.sanitize(req.body.salt);
  const sugar = req.sanitize(req.body.sugar);
  var sqlquery = 'UPDATE foods SET name=?,value=?,valueUnit=?,carbs=?,fat=?,protein=?,salt=?,sugar=? WHERE id=?;';
  // execute sql query
  console.log(sqlquery)
  let newrecord = [name, value, valueUnit, carbs, fat, protein, salt, sugar, name];
  //var query = mysql.format(sqlquery, newrecord)
  db.query(sqlquery, newrecord, (err, result) => {
    if (err) {
      return console.error(err.message);
    } else
      //res.send("Updated");
      console.log("Updated")
      res.redirect("./");
  });
});


  // This is the login function to validate and sanitise the user inputs into the login page, to make sure there are no SQL injections and more.
  app.post("/loggedin", function (req, res) {
    // Here we are the variable that will store the user inputs.
    const plainPassword = req.sanitize(req.body.password);
    const username = req.sanitize(req.body.username);
    //Here is the sql code for the db.query to be used for.
    let sqlquery = "SELECT * FROM user WHERE appuser ='" + username + "'";
    db.query(sqlquery, (err, result) => {
      console.log(result);
      console.log(sqlquery);
      console.log(username);
      if (err) {
        //Checking out for errors.
        console.log("error");
        res.redirect("./");
      } else {
        if (result.length >= 1) {
          //Checking for the length of the user's input and getting the hashed password.
          const hashPassword = result[0].hashedPassword;
          console.log(hashPassword);
          bcrypt.compare(plainPassword, hashPassword, function (err, result) {
            //Now we are comparing the 'password' from the user input with the ones in the database.
            if (err) {
              console.log("not working " + plainPassword);
              res.redirect("./");
            } else if (result == true) {
              req.session.userId = req.body.username;
              console.log("This is for the login:" + req.session.userId);
              console.log(username + " is logged in successfully");
              //res.send('Hi '+username+" is logged in");
              res.redirect("./");
            } else {
              console.log("credentials not correct " + plainPassword);
              //res.send("Username or password incorrect");
              res.redirect("./");
            }
          });
        }
      }
    });
  });

  app.get("/search", function (req, res) {
    res.render("search.ejs", shopData);
  });
  app.get("/search-result", function (req, res) {
    //searching in the database
    //res.send("You searched for: " + req.query.keyword);
    var listOfCalculation = [];
    var name = "";
    var value = "";
    var valueUnit = "";
    var carbs = "";
    var fat = "";
    var protein = "";
    var salt ="";
    var sugar = "";
    const keyword = req.sanitize(req.query.keyword);
    let sqlquery = "SELECT * FROM foods WHERE name LIKE '%" + keyword + "%'"; // query database to get all the foods
    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }
      let newData = Object.assign({}, shopData, { availableBooks: result });
      console.log(newData);
      res.render("list.ejs", newData);
    });

    var completeCalculation = req.body.check;

    if(typeof completeCalculation == "object"){
      for(var i =0; i<completeCalculation.length; i++){
        listOfCalculation.push(completeCalculation[i]);
      }
      
    }

  });
  
  app.get("/register", function (req, res) {
    res.render("register.ejs", shopData);
  });
  app.post(
    "/registered",
    [check("email").isEmail(), check("password").isStrongPassword()],
    function (req, res) {
      //Here we are the variable that will store the user inputs.
      const firstName = req.sanitize(req.body.first_name);
      const lastName = req.sanitize(req.body.last_name);
      const saltRounds = 10;
      const plainPassword = req.sanitize(req.body.password);
      const appuser = req.sanitize(req.body.appuser);
      const email = req.sanitize(req.body.email);
      const errors = validationResult(req);
      //Checking for errors from the user's inputs and that the meet the requirments for the registration form.
      if (!errors.isEmpty()) {
        res.redirect("./register");
      } else {
        // saving data in database
        bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
          //Store hashed password in your database.
          console.log(hashedPassword);
          let sqlquery =
            "INSERT INTO user (firstname, lastname,appuser,email, hashedPassword) VALUES ('" +
            firstName +
            "','" +
            lastName +
            "','" +
            appuser +
            "', '" +
            email +
            "', '" +
            hashedPassword +
            "');";
          ////Here is the sql code for the db.query to be used for.
          let newUserrecord = [appuser, hashedPassword];
          console.log(sqlquery);
          db.query(sqlquery, newUserrecord, (err, result) => {
            //Checking for error and calling them out.
            if (err) {
              return console.error(err.message);
            } else {
              res.redirect("./");
            }
          });
        });
      }
    }
  );

  app.get("/list", function (req, res) {
    let sqlquery = "SELECT * FROM foods"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }
      let newData = Object.assign({}, shopData, { availableBooks: result });
      console.log(newData);
      res.render("list.ejs", newData);
    });
  });

  app.get("/logout", redirectLogin, (req, res) => {
    console.log("This is for the logout" + req.session.userId);
    //Checking for errors and sending a message that the user has logout and they can go back to the Home page if they want to.
    req.session.destroy((err) => {
      if (err) {
        return res.redirect("./");
      }
      console.log("you are now logged out, "+req.session.userId);
      //res.send("you are now logged out. <a href=" + "./" + ">Home</a>");
      res.redirect('./')
    });
  });

  app.get("/api", function (req, res) {
    let keyword = req.query.keyword;
    // Query database to get all the books
    let sqlquery = "SELECT * FROM foods";
    if(keyword){
      sqlquery += " WHERE name LIKE '%" +keyword+ "%'";
    }
    // Execute the sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }
      // Return results as a JSON object
      res.json(result);
    });
  });

};
