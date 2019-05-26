function onclick_sensor(number, sensorValue) {
    document.getElementById('prox-sensor-name').innerHTML = 'Proximity - S' + number;
    var value = sensorValue == 1 ? 'True' : 'False'
    document.getElementById('prox').innerHTML= value
}

function onclick_modal() {
    document.querySelector('.modal-bg').style.display = 'flex';
}

function onclick_modal_close() {
    document.querySelector('.modal-bg').style.display = 'none';
}

function perform_name_change() {
    var newName = $('input[name="name"]').val();
    document.querySelector('.modal-bg').style.display = 'none';
}

function onclick_logout() {
    console.log("am dat click pe logout");
    window.location.replace("/logout");
}
