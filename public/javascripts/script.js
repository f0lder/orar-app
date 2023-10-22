


document.getElementById("corp").addEventListener('change', genCode);
document.getElementById("etaj").addEventListener('change', genCode);
document.getElementById("numar").addEventListener('change', genCode);
document.getElementById("capacitate").addEventListener('change', genCode);


function genCode() {

    validateInput("numar");
    validateInput("capacitate");

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

    if(validateInput("numar") &&validateInput("capacitate")){
        e.classList.add("is-valid");
    }
}

function validateInput(id) {

    if (document.getElementById(id).value != '' && document.getElementById(id).value > 0) {
        document.getElementById(id).classList.add("is-valid");
        document.getElementById(id).classList.remove("is-invalid");
        return true;
    } else {
        document.getElementById(id).classList.remove("is-valid");
        document.getElementById(id).classList.add("is-invalid");
        return false
    }
}


