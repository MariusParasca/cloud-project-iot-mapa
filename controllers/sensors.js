const models = require('../models');

exports.refreshSensors = function(req, res, next) {
  if (req.session.user) {
    models.User.findOne({
      where: {
        email: req.session.user,
      }
    }).then(sendSensorsValues.bind({ req: req, res: res }));
  } else {
    res.status(401).send();
  }
}

exports.index = function(req, res, next) {
  if (req.session.user) {
    models.User.findOne({
      where: {
        email: req.session.user,
      }
    }).then(renderSensorPage.bind({ req: req, res: res }));
  }  else {
    res.status(401).send();
  }
}

exports.logout = function(req, res, next) {
  res.status(200).send();
}

function sendSensorsValues(user) {
  sensors = JSON.parse(user.dataValues["Sensors"]);
  this.res.send(JSON.stringify(sensors));
}

function renderSensorPage(user) {
  sensors = JSON.parse(user.dataValues["Sensors"]);
  this.res.render('sensors', { title: 'IOT Automation', sensors: sensors });
}

function updateSensorValuesInDB(actualValues, email) {
  models.User.update(
    { Sensors: JSON.stringify(actualValues) },
    {
      where: {
        email: email
      }
    }
  ).then(result => console.log(result + " rows affected"));
}

function handleSendDataRequest(user) {
  if(user) {
    var actualValues = this.req.body;
    updateSensorValuesInDB(actualValues, user.dataValues["email"]);
    this.res.status(200).send();
  } else {
    this.res.status(400).send();
  }
}

exports.sendData = function(req, res, next) {
    models.User.findOne({
      where: {
        keyid: req.header("Client-Key")
      }
    }).then(handleSendDataRequest.bind({ req: req, res: res }));
}
