function onclick_sign_up() {
    $('.content-title').text('IOT SIGN UP');
    $('.sign-up').remove();
    $('.forgot-password').before('<a class="log-in" onclick="onclick_log_in()">Log In</a>');
    $('.form-submit').val('SIGN UP');
    $('.form-label').last().after('<input class="form-label" placeholder="KEY">');
}

function onclick_log_in() {
    $('.content-title').text('IOT LOGIN');
    $('.log-in').remove();
    $('.forgot-password').before('<a class="sign-up" onclick="onclick_sign_up()">Sign up</a>');
    $('.form-submit').val('LOGIN');
    $('.form-label').last().remove();
}

function onclick_forgot_password() {
    $('.forgot-password').remove();
    $('.sign-up').remove();
    $('.log-in').remove();
    var context = $('.content-title').text();
    if(context === 'IOT LOGIN') {
        $('.form-label').last().remove();
    }
    else {
        $('.form-label').last().remove();
        $('.form-label').last().remove();
    }
    $('.form-submit').css('margin', '5em auto').val("SUBMIT");
}