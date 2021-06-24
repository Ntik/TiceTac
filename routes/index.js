var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var userModel = require('../models/users');
var journeyModel = require('../models/journey');

const { route } = require('../app');
const { Router } = require('express');



var city = ['Paris',
'Marseille',
'Nantes',
'Lyon',
'Rennes',
'Melun',
'Bordeaux',
'Lille'];

var date = ['2018-11-20',
'2018-11-21',
'2018-11-22',
'2018-11-23',
'2018-11-24'];





router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// PAGE LOGIN
router.get('/login', function(req, res, next) {


  res.render('login');
});

// PAGE SIGN UP
router.post('/sign-up', async function(req, res, next) {

  console.log('REQ BODY ALL ==== >>>>', req.body)

  var alreadyExist = await userModel.findOne({ email: req.body.email });
  // console.log('ALREADY EXIST =====> ', alreadyExist);
  
  if (alreadyExist !== null) {
    res.render('login', { isError: 'your account already exists, please sign in in the other form'})
  } if (alreadyExist === null && req.body.email) {
      var newUser = new userModel({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: req.body.password
      });
    
    await newUser.save();
    
    req.session.user = { email: newUser.email, password: newUser.password };
    req.session.lastname = { lastname: newUser.lastname}

    res.redirect('/homepage')
  }

  res.render('login');
});
  

// PAGE SIGN IN
router.post('/sign-in', async function(req, res, next) {

  var alreadyExist = await userModel.findOne({ email: req.body.email });

  // console.log('REQ.BODY', req.body)
  // console.log('alreadyEXIST ==== >>>>', alreadyExist)
  // // console.log('alreadyEXIST.email ==== >>>>', alreadyExist.email)
  // // console.log('alreadyEXIST.password ==== >>>>', alreadyExist.password)

  if (alreadyExist === null) {
    res.render('login', { isError: `your account doesn't exist, please use the sign up form` })
  } else if (alreadyExist.email === req.body.email && alreadyExist.password !== req.body.password) { 
    res.render('login', { isError: `oups! it looks like your password doesn't match your email adress... try again!` })
  } else if (alreadyExist.email === req.body.email && alreadyExist.password === req.body.password) {
    
    req.session.user = { email: alreadyExist.email, password: alreadyExist.password };
    req.session.lastname = { lastname: alreadyExist.lastname }

    res.redirect('/homepage')
  }


  res.render('login');
});

router.get('/homepage', function(req, res, next) {


res.render('homepage')
});


// Remplissage de la base de donnée, une fois suffit
router.get('/save', async function(req, res, next) {

  // // How many journeys we want
  var count = 300

  // // Save  ---------------------------------------------------
    for(var i = 0; i< count; i++){

    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if (departureCity != arrivalCity) {

      var newJourney = new journeyModel ({
        departure: departureCity , 
        arrival: arrivalCity, 
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });
       
       await newJourney.save();

    }

  }
  res.render('index', { title: 'Express' });
});

router.get('/log-out', async function(req, res, next) {

  req.session._id = null
  req.session.lastname = null
  
  res.render('login')
});


// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.

router.get('/result', function(req, res, next) {

  // Permet de savoir combien de trajets il y a par ville en base
  for(i=0; i<city.length; i++){

    journeyModel.find( 
      { departure: city[i] } , //filtre
  
      function (err, journey) {

          console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
      }
    )

  }


  res.render('index', { title: 'Express' });
});

module.exports = router;
