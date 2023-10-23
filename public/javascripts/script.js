
//TODO move tihs to back-end for lite client

document.getElementById("corp").addEventListener('change', genCode);
document.getElementById("etaj").addEventListener('change', genCode);
document.getElementById("numar").addEventListener('change', genCode);
document.getElementById("capacitate").addEventListener('change', genCode);


//exec on page load?
genCode();

function genCode() {

    validateInput("numar", 'iSala');
    validateInput("capacitate", 'iSala');

    let corp = document.getElementById("corp").value;
    let etaj = document.getElementById("etaj").value;
    let numar = document.getElementById("numar").value;
    //let capacitate = document.getElementById("capacitate").value;
    let e = document.getElementById("cod");
    let cod = "";

    if (etaj == 0) {
        cod = corp + 'P' + numar;
    } else {
        cod = corp + etaj + numar;
    }
    e.value = cod;

    if (validateInput("numar") && validateInput("capacitate")) {
        e.classList.add("is-valid");
    }
}

function validateInput(id) {

    if (document.getElementById(id).value != '') {
        document.getElementById(id).classList.add("is-valid");
        document.getElementById(id).classList.remove("is-invalid");
        document.getElementById('iSala').removeAttribute('disabled');
        return true;
    } else {
        document.getElementById(id).classList.remove("is-valid");
        document.getElementById(id).classList.add("is-invalid");
        document.getElementById('iSala').setAttribute('disabled', 'true');
        return false
    }
}
document.getElementById('rSala').addEventListener('click',resetSala);

function resetSala(){
    genCode();
}