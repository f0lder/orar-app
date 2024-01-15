document.getElementById("corp").addEventListener('input', genCode);
document.getElementById("etaj").addEventListener('input', genCode);
document.getElementById("numar").addEventListener('input', genCode);
document.getElementById("capacitate").addEventListener('input', genCode);


//exec on page load?
genCode();

function genCode() {

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
}

validateForm("iSala", ['numar', 'capacitate']);
validateinput('numar', ['numar', 'capacitate'], 'iSala');
validateinput('capacitate', ['numar', 'capacitate'], 'iSala');

document.getElementById('rSala').addEventListener('click',resetSala);


function resetSala(){
    genCode();
}
