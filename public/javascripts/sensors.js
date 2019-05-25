function onclick_logout() {
    console.log("am dat click pe logout");
    window.location.replace("/logout");
}

function onclick_sensor(number, sensor) {
    document.getElementById('p-sensor-name').innerHTML = 'Proximity - S' + number;
    document.getElementById('p').innerHTML = sensor;
}