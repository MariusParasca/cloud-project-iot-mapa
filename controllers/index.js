const models = require('../models');
const sha256 = require('sha256');

exports.index = function(req, res, next) {
  res.render('index', { title: 'IOT Automation' });
}

exports.login = function (req, res, next) {
  models.User.findAll({
    where: {
      email: req.body.email,
      password: sha256(req.body.password)
    }
  }).then(user => {
      if (user && user.length) {
        req.session.email = req.body.email;
        res.render('index', { title: 'IOT Automation' });
      } else {
        res.status(400).send();
      }
    }).catch(err => {
      res.status(500).send();
    })
}

exports.register = function(req, res, next) {
  // Test for existing key
  models.User.create({
    email: req.body.email,
    password: sha256(req.body.password),
    keyid: req.body.key
  }).then(user => {
    console.log("User created!");
    res.redirect('/');
  })
  console.log('Email: ', req.body.email);
  console.log('Password: ', req.body.password);
  console.log('Key: ', req.body.key);
}

exports.key = function(req, res, next) {
  models.Key.create({
  }).then(key => {
    console.log("Key created!");
    res.redirect('/');
  })
}