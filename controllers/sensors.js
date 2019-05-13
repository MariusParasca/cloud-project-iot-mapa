exports.index = function(req, res, next) {
  if (req.session.user)  {
    res.render('sensors', { title: 'IOT Automation' });
  }  else {
    res.status(401).send();
  }
}

exports.logout = function(req, res, next) {
  res.status(200).send();
}
