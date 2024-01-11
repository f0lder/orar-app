

//TODO: check for length of input


validateForm("login",['username','password']);
validateinput('username',['username','password'], 'login');
validateinput('password',['username','password'], 'login');



if(document.getElementById('alert')){
document.getElementById('alert').addEventListener('click',removeAlert);
}

function removeAlert(){
    document.getElementById('login-alert').remove();
}