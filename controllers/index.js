
exports.index = function(req, res, next) {
  res.render('index', { title: 'IOT Automation' });
}

exports.submit_login = function(req, res, next) {
    console.log('Ai introdus: ', req.body.email);
    res.redirect('/');
}