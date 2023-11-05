document.getElementById("username").addEventListener('change', validateUsername);
document.getElementById("password").addEventListener('change', validatePass);

function validateUsername() {

    let login = document.getElementById('username');

    if (login.value == '') {
        login.classList.add("is-invalid");
        login.classList.remove('is-valid');
        document.getElementById('login').setAttribute('disabled', 'true');
    } else {
        login.classList.add("is-valid");
        login.classList.remove('is-invalid');
        document.getElementById('login').removeAttribute('disabled');
    }
}
function validatePass() {
    let pass = document.getElementById('password');

    if(pass.value.length < 2){
        pass.classList.add("is-invalid");
        pass.classList.remove('is-valid');
        document.getElementById('login').setAttribute('disabled', 'true');
    } else {
        pass.classList.add("is-valid");
        pass.classList.remove('is-invalid');
        document.getElementById('login').removeAttribute('disabled');
    }
}
if(document.getElementById('alert')){
document.getElementById('alert').addEventListener('click',removeAlert);
}

function removeAlert(){
    document.getElementById('login-alert').remove();
}