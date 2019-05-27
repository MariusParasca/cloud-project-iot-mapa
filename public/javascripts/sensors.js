const TEMPERATURE = 'temperature';
const UMIDITY = 'umidity';
const PROXIMITY = 'proximity';
const SENSOR = 'sensor';
const DEF_TEMPERATURE = 'Temperature';
const DEF_UMIDITY = 'Umidity';
const DEF_PROXIMITY = 'Proximity';
const DEF_SENSOR = 'Proximity - S';
const ID_TEMPERATURE = 't';
const ID_UMIDITY = 'u';
const ID_PROXIMITY = 'prox';
var sensorNameId;
var proxNumber;

function onclickModal(id) {
    sensorNameId = id;
    document.querySelector('.modal-bg').style.display = 'flex';
}

function onclickModalClose() {
    var newName = document.getElementById('name');
    newName.value = '';
    document.querySelector('.modal-bg').style.display = 'none';
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

var result = displaySensors()
// console.log(result);

function onclickSensorProx(number) {
    var proxKey = Object.keys(result)[2];
    var proxObj = result[proxKey];
    var proxName = Object.keys(proxObj)[number - 1];
    var proxValue = proxObj[proxName];
    var value = proxValue == 1 ? 'True' : 'False';
    document.getElementById('prox-sensor-name').innerHTML = proxName;
    document.getElementById('prox').innerHTML = value;
    proxNumber = number;
}

function performNameChange() {
    var newName = document.getElementById('name');
    if(sensorNameId.startsWith(ID_TEMPERATURE)) {
        var defName = TEMPERATURE;
        modifyObject(0, defName, newName);
    }
    else if(sensorNameId.startsWith(ID_UMIDITY)) {
        var defName = UMIDITY;
        modifyObject(1, defName, newName);
    }
    else if(sensorNameId.startsWith(ID_PROXIMITY) && (!proxNumber)) {
        var defName = PROXIMITY;
        modifyObject(2, defName, newName);
    }
    else if(sensorNameId.startsWith(ID_PROXIMITY) && proxNumber) {
        var defName = SENSOR;
        var index = proxNumber;
        modifyProxObject(index, defName, newName);
    }
    // console.log(sensors);
    var http = new XMLHttpRequest();
    http.open('POST', '/sensors/updateSensorNames', true);
    http.setRequestHeader('Content-Type', 'application/json');
    http.onreadystatechange = function() { 
        if(http.readyState == 4 && http.status == 200) {
            document.getElementById(sensorNameId).innerHTML = newName.value;
            newName.value = '';
        }
    }
    http.send(JSON.stringify(sensors));
    onclickModalClose();
}

function modifyObject(index, defName, newName) {
    var oldKey = Object.keys(sensors)[index];
    var newKey = defName + '_' + newName.value;
    sensors = JSON.parse(JSON.stringify(sensors).split(oldKey).join(newKey));
}

function modifyProxObject(index, defName, newName) {
    var proxKey = Object.keys(sensors)[2];
    var proxObj = sensors[proxKey];
    var oldKey = Object.keys(proxObj)[index - 1];
    var newKey = defName + index + '_' + newName.value;
    proxObj = JSON.parse(JSON.stringify(proxObj).split(oldKey).join(newKey));
    sensors[proxKey] = proxObj;
}

function onclickLogout() {
    console.log("am dat click pe logout");
    window.location.replace("/logout");
}
