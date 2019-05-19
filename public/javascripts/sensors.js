function onclick_logout() {
    console.log("am dat click pe logout");
    window.location.replace("/logout");
}

function onclick_sensor1() {
    document.getElementById("p-sensor-name").innerHTML = "Proximity - S1"
}

function onclick_sensor2() {
    document.getElementById("p-sensor-name").innerHTML = "Proximity - S2"
}

function onclick_senzor3() {
    document.getElementById("p-sensor-name").innerHTML = "Proximity - S3"
}