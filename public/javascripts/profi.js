$(document).ready(function () {
    $('.multiple-sel').select2({
        placeholder: "Alege materii",
        theme: 'bootstrap-5'
    });
});

validateForm("send", ['numeProf', 'idProf']);
validateinput('numeProf', ['numeProf', 'idProf'], 'send');
validateinput('idProf', ['numeProf', 'idProf'], 'send');