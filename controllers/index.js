const models = require('../models');
const sha256 = require('sha256');

function sendServerError(err) {
  this.res.status(500).send(err);
}

function createNewUser(req, res) {
  models.User.create({
    email: req.body.email,
    password: sha256(req.body.password),
    keyid: req.body.key
  }).then(() => {
    res.redirect('/');
  })
}

function handleUserLogin(user) {
  if (user && user.length) {
    console.log(this.req.session);
    this.req.session.user = this.req.body.email;
    this.res.redirect('/sensors');
  } else {
    this.res.status(400).send();
  }
}

function handleUserRegister(user) {
  if (user.length == 0) {
    createNewUser(this.req, this.res);
  } else {
    this.res.status(400).send();
  }
}

exports.index = function(req, res, next) {
  res.render('index', { title: 'IOT Automation' });
}

exports.login = function (req, res, next) {
  models.User.findAll({
    where: {
      email: req.body.email,
      password: sha256(req.body.password)
    }
  })
  .then(handleUserLogin.bind({req: req, res: res}))

}

exports.register = function(req, res, next) {
  models.User.findAll({
    where: {
      keyid: req.body.key
    }
  })
  .then(handleUserRegister.bind({ req: req, res: res }))
  .catch(sendServerError.bind({res: res}));
}

exports.key = function(req, res, next) {
  models.Key.create({
  }).then(key => {
    console.log("Key created!");
    res.redirect('/');
  })
}