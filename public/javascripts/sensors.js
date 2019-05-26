function onclick_logout() {
    console.log("am dat click pe logout");
    window.location.replace("/logout");
}

function onclick_modal() {
    document.querySelector('.modal-bg').style.display = 'flex';
}

function onclick_modal_close() {
    document.querySelector('.modal-bg').style.display = 'none';
}

function onclick_sensor(number, sensor) {
    document.getElementById('prox-sensor-name').innerHTML = 'Proximity - S' + number;
    document.getElementById('prox').innerHTML = sensor;
}