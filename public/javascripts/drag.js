$(document).ready(function () {
    $('.mat').select2({
        placeholder: "Alege materia",
        theme: 'bootstrap-5'
    });
});

$(document).ready(function () {
    $('.sala').select2({
        placeholder: "Alege materia",
        theme: 'bootstrap-5'
    });
});

function show(el) {

    el.classList.remove("d-none");

    window.onbeforeunload = function() {
    return "Are you sure you want to leave?";
};

    //get the previous element sibling
    var sibling = el.previousElementSibling;

    sibling.classList.add("d-none");

    console.log(sibling);
}