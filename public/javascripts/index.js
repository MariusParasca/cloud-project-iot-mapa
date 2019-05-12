function onclick_sign_up() {
    $('.content-title').text('IOT SIGN UP');
    $('.sign-up').remove();
    $('.forgot-password').before('<a class="log-in" onclick="onclick_log_in()">Log In</a>');
    $('.form-submit').val('SIGN UP');
    $('.form-label').last().after('<input name="key" class="form-label" placeholder="KEY">');
    $('.form-submit').attr("onclick", "perform_sign_up()");
    $('.info').remove();
}

function onclick_log_in() {
    $('.content-title').text('IOT LOGIN');
    $('.log-in').remove();
    $('.forgot-password').before('<a class="sign-up" onclick="onclick_sign_up()">Sign up</a>');
    $('.form-submit').val('LOGIN').attr("onclick", "perform_login()");
    $('.form-label').last().remove();
    $('.info').remove();
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
    $('.form-submit').css('margin-top', '5em auto').val("SUBMIT").attr("onclick", "perform_forgot_password()");
    $('.info').remove();
    $('.form-submit').after('<div class="info" onclick="onclick_back_forgot_password()">Back</div>');
    $('.content-title').text('IOT Problems');
}

function onclick_back_forgot_password() {
    $('.form-label').after('<input class="form-label" name="password" type="password" placeholder="Password">');
    $('.form-label').last().after('<a class="sign-up" onclick="onclick_sign_up()">Sign up</a>');
    $('.sign-up').after('<a class="forgot-password" onclick="onclick_forgot_password()">Forgot password?</a>');
    $('.content-title').text('IOT LOGIN');
    $('.form-submit').val('LOGIN').attr("onclick", "perform_login()");
    $('.info').remove();
}

function perform_login() {
    if(!document.getElementsByName("email")[0].validity.valid)
        return;
    $.post('login', {email: $('input[name="email"]').val(), password: $('input[name="password"]').val()},
        function(returnedData) {
            window.location.replace("sensors");
        }).fail(function(){
            show_info_message("Login failed!");
        });
}

function perform_sign_up() {
    console.log("sign up performed");
    if(!document.getElementsByName("email")[0].validity.valid)
        return;
    $.post('register', {email: $('input[name="email"]').val(), password: $('input[name="password"]').val(), keyid: $('input[name="key"]').val()},
        function(returnedData) {
            console.log("works, signup done");
            //window.location.replace("/");
        }).fail(function(jqXHR, textStatus, errorThrown){
            switch(jqXHR.status) {
                case 400:
                    show_info_message("User already exists.");
                    break;
                case 500:
                    show_info_message("KEY is invalid.");
                    break;
                default:
                    show_info_message("Unknown error.");
                    break;
            }
        });
}

function perform_forgot_password() {
    console.log("forgot password performed");
}

function show_info_message(txt) {
    $('.info').remove();
    setTimeout(function(){
        $('.form-submit').after('<div class="info">' + txt + '</div>');
    }, 100);
}