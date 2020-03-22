document.querySelector(`#form_id`).addEventListener(`submit`, e => {
    e.preventDefault();
    if(validate()) {
        window.location.href = `start.html`;
    }
    return false;
});

function validate() {

    let names = document.querySelectorAll('#form_id input');
    const values = {};

    for (let k = 0; k < names.length - 1; k++) {
        values[names[k].id] = names[k].value;
    }

    for (let x in values) {
        switch (x) {
            case `SignupName`:
            case `SignupSurname`:
                if (!/^([а-яА-ЯA-Za-z]{2,20})+$/.test(values[x])) {
                    return warning(`Некорректный ввод!`);
                }
                break;
            case `SignupBirthday`:
                let year = new Date().getFullYear() - new Date(values[x].replace(/\./g, `:`)).getFullYear();
                if (!(10 < year && year < 80)) {
                    return warning(`не младше 10 и не старше 80 лет`);
                }
                break;
            case `SignupEmail`:
                if (!/[0-9a-zа-я_A-ZА-Я]+@[0-9a-zа-я_A-ZА-Я^.]+\.[a-zа-яА-ЯA-Z]{2,4}/i.test(values[x])) {
                    return warning(`Ошибка ввода Email-адреса!`);
                }
                break;
            case `SignupPassword`:
                if (!/^([а-яА-ЯA-Za-z0-9]{6,})+$/.test(values[x])) {
                    return warning(`Invalid Password!`);
                }
                break;
            case `SignupConfirmPassword`:
                if (values.SignupPassword !== values[x]) {
                    return warning(`Пароли не совпадают`);
                }
                break;
        }
    }
    function warning(x) {
        return !(document.getElementsByClassName(`warning`)[0].textContent = x);
    }
    localStorage.setItem(`authData`, JSON.stringify([values.SignupName, values.SignupEmail, values.SignupPassword]));
    warning(``);
    return true;
}