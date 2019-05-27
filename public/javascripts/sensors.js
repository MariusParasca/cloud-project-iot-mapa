const TEMPERATURE = "temperature";
const UMIDITY = "umidity";
const PROXIMITY = "proximity";
const SENSOR = "sensor";
const DEF_TEMPERATURE = "Temperature";
const DEF_UMIDITY = "Umidity";
const DEF_PROXIMITY = "Proximity";
const DEF_SENSOR = "Proximity - S";
var sensorNameId;

function onclickModal(id) {
    sensorNameId = id;
    // open modal
    document.querySelector('.modal-bg').style.display = 'flex';
}

function onclickModalClose() {
    var newName = document.getElementById('name');
    newName.value = '';
    document.querySelector('.modal-bg').style.display = 'none';
}

function displayProximity(proximityKey) {
    var proximity = {};
    var count = 1;
    for(let [key, value] of Object.entries(proximityKey)) {
      var sensorName = `${SENSOR}${count}`;
      if (key.startsWith(sensorName)) {
        var newKey = key.split('_')[1];
        if(newKey === undefined) {
            newKey = DEF_SENSOR + `${count}`;
        }
        proximity[newKey] = value;
        count += 1;
      }
    }
    return proximity;
}

function displaySensors() {
    var result = {};
    for(let [key, value] of Object.entries(sensors)) {
        if(key.startsWith(TEMPERATURE)) {
            var newKey = key.split('_')[1];
            if(newKey === undefined) {
                newKey = DEF_TEMPERATURE;
            }
            document.getElementById('t-sensor-name').innerHTML = newKey;
            document.getElementById('t-value').innerHTML = value;
            result[newKey] = value;
        }
        else if(key.startsWith(UMIDITY)) {
            var newKey = key.split('_')[1];
            if(newKey === undefined) {
                newKey = DEF_UMIDITY;
            }
            document.getElementById('u-sensor-name').innerHTML = newKey;
            document.getElementById('u-value').innerHTML = value;
            result[newKey] = value;
        }
        else if(key.startsWith(PROXIMITY)) {
            var newKey = key.split('_')[1];
            if(newKey === undefined) {
                newKey = DEF_PROXIMITY;
            }
            document.getElementById('prox-sensor-name').innerHTML = newKey;
            result[newKey] = displayProximity(sensors[key]);
        }
    }
    return result;
}

var result = displaySensors()
// console.log(result);

function onclickSensorProx(number) {
    var proxObj = result[Object.keys(result)[2]];
    var proxName = Object.keys(proxObj)[number - 1];
    var proxValue = proxObj[proxName];
    var value = proxValue == 1 ? 'True' : 'False';
    document.getElementById('prox-sensor-name').innerHTML = proxName;
    document.getElementById('prox').innerHTML = value;
}

function performNameChange() {
    var newName = document.getElementById('name');
    document.getElementById(sensorNameId).innerHTML = newName.value;
    newName.value = '';
    onclickModalClose();
}

function onclickLogout() {
    console.log("am dat click pe logout");
    window.location.replace("/logout");
}
