

$(document).ready(function () {
    $('.multiple-sel').select2({
        placeholder: "Alege grupe",
        theme: 'bootstrap-5'
    });
});


validateForm("iMat", ['numeMaterie', 'idProf']);
validateinput('numeMaterie', ['numeMaterie', 'idProf'], 'iMat');
validateinput('idProf', ['numeMaterie', 'idProf'], 'iMat');