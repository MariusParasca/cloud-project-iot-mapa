const models = require('../models');
const TEMPERATURE = "temperature";
const UMIDITY = "umidity";
const PROXIMITY = "proximity";
const SENSOR = "sensor";

exports.sendData = function (req, res, next) {
  models.User.findOne({
    where: {
      keyid: req.header("Client-Key")
    }
  }).then(handleSendDataRequest.bind({ req: req, res: res }));
}

exports.updateSensorNames = function(req, res, next) {
  if (req.session.user) {
    console.log("updateSensorNames" + req.session.user);
    models.User.findOne({
      where: {
        email: req.session.user,
      }
    }).then(modifySensorsObject.bind({ req: req, res: res }));
  } else {
    res.status(401).send();
  }
}

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

function modifySensorsObject(user) {
  if(user) {
    updateSensorValuesInDB(this.req.body, user.dataValues["email"], this.res);
  } else {
    this.res.status(400).send();
  }
}

function sendSensorsValues(user) {
  sensors = JSON.parse(user.dataValues["Sensors"]);
  this.res.send(JSON.stringify(sensors));
}

function renderSensorPage(user) {
  sensors = JSON.parse(user.dataValues["Sensors"]);
  console.log(sensors);
  this.res.render('sensors', { title: 'IOT Automation', sensors: sensors });
}

function updateSensorValuesInDB(actualValues, email, res) {
  models.User.update(
    { Sensors: JSON.stringify(actualValues) },
    {
      where: {
        email: email
      }
    }
  ).then(result => {
    console.log(result + " rows affected");
    res.status(200).send();
  });
}

function handleSendDataRequest(user) {
  if(user) {
    var actualValues = this.req.body;
    var sensorValuesToUpdate = transformToDbNames(actualValues, JSON.parse(user.dataValues["Sensors"]));
    updateSensorValuesInDB(sensorValuesToUpdate, user.dataValues["email"], this.res);
  } else {
    this.res.status(400).send();
  }
}

function getProximityActualValues(actualProximity, clientProximity) {
  var proximity = {};
  var count = 1;
  for (let [key2, value2] of Object.entries(clientProximity)) {
    var sensorName = `${SENSOR}${count}`;
    if (key2.startsWith(sensorName)) {
      console.log(sensorName, actualProximity[sensorName]);
      proximity[key2] = actualProximity[sensorName];
      count += 1;
    }
  }
  return proximity;
}

function transformToDbNames(actualValues, clientValues) {
  var result = {}
  for (let [key, value] of Object.entries(clientValues)) {
    if(key.startsWith(TEMPERATURE))
      result[key] = actualValues[TEMPERATURE];
    else if (key.startsWith(UMIDITY))
      result[key] = actualValues[UMIDITY];
    else if (key.startsWith(PROXIMITY)) {
      result[key] = getProximityActualValues(actualValues[PROXIMITY], clientValues[key]);
    }
  }
  return result;
}
