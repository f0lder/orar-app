function validateinput(id,ids,button) {
    document.getElementById(id).addEventListener('input', () => {
        let el = document.getElementById(id);
        if (el.value == '') {
            el.classList.add("is-invalid");
            el.classList.remove('is-valid');
            validateForm(button,ids);
        } else {
            el.classList.add("is-valid");
            el.classList.remove('is-invalid');
            validateForm(button,ids);
        }
    });
}

function validateForm(button,ids) {

    for (let i = 0; i < ids.length; i++) {
        if (document.getElementById(ids[i]).value == '') {
            document.getElementById(button).disabled = true;
            document.getElementById(button).classList.add('cursor-na');
            return;
        }
        document.getElementById(button).disabled = false;
        document.getElementById(button).classList.remove('cursor-na');
    }
}
