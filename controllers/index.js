const models = require('../models');

exports.index = function(req, res, next) {
  // models.User.findAll().then(users => {
  //   res.json(users);
  // }).catch(err => {
  //   res.send('error' + err);
  // })
  res.render('index', { title: 'IOT Automation' });
}

exports.submit_login = function(req, res, next) {
    console.log('Ai introdus: ', req.body.email);
    res.redirect('/');
}