const models = require('../models');
const PROXIMITY = "proximity";

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
  console.log(sensors);
  // var sensors = {
  //   temperature: valueTemperature, 
  //   umidity: valueUmidity,
  //   proximity: {
  //     sensor1: valueProximity1,
  //     sensor2: valueProximity2,
  //     sensor3: valueProximity3
  //   }
  // };
  // res.render('sensors', { title: 'IOT Automation', sensors: sensors });
  this.res.render('sensors', { title: 'IOT Automation' });
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
  var actualValues = this.req.body;
  var clientValues = JSON.parse(user.dataValues["Sensors"]);

  //if (areSensorValueDifferent(actualValues, clientValues)) {
    updateSensorValuesInDB(actualValues, user.dataValues["email"]);
    //updateSensorValuesInView()
  //}
}

exports.sendData = function(req, res, next) {
  console.log(req.header);
  if (req.session.user) {
    models.User.findOne({
      where: {
        email: req.session.user,
        keyid: req.header("Client-Key")
      }
    }).then(handleSendDataRequest.bind({ req: req, res: res }));
    res.status(200).send();
  } else {
    res.status(400).send();
  }
}


function areSensorValueDifferent(actualValues, clientValues) {
  if (Object.keys(actualValues).length > Object.keys(clientValues).length)
    return true;
  for (let [key, value] of Object.entries(clientValues)) {
    if (typeof (value) == "obecjt") {
      if (areSensorValueDifferent(value, actualValues[key]))
        return true;
    } else if (value != actualValues[key]) {
      return true;
    }
  }

  return false;
}

function transformToDbObjectFormat(clientValues) {
  var proximitySensors = {}
  var result = {}
  for (let [key, value] of Object.entries(clientValues)) {
    if (key.startsWith("sensor")) {
      proximitySensors[key] = value;
    } else {
      result[key] = value;
    }
  }

  result[PROXIMITY] = proximitySensors;
  return result;
}
