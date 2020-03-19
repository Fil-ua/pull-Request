form_id.onsubmit = ()=> { return validate()};

function validate() {

    let names = document.getElementById(`form_id`).getElementsByTagName(`input`);
    const objForm = [];

    for (let k = 0; k < names.length - 1; k++) {
        objForm[names[k].id] = names[k].value;
    }

    for (let x in objForm) {

        switch (x) {
            case `SignupName`:
            case `SignupSurname`:
                if (!/^([а-яА-ЯA-Za-z]{2,20})+$/.test(objForm[x])) {
                    return warning(`Некорректный ввод!`);
                }
                break;
            case `SignupBirthday`:
                let year = new Date().getFullYear() - new Date(objForm[x].replace(/\./g, `:`)).getFullYear();
                if (!(10 < year && year < 80)) {
                    return warning(`не младше 10 и не старше 80 лет`);
                }
                break;
            case `SignupEmail`:
                if (!/[0-9a-zа-я_A-ZА-Я]+@[0-9a-zа-я_A-ZА-Я^.]+\.[a-zа-яА-ЯA-Z]{2,4}/i.test(objForm[x])) {
                    return warning(`Ошибка ввода Email-адреса!`);
                }
                break;
            case `SignupPassword`:
                if (!/^([а-яА-ЯA-Za-z0-9]{6,})+$/.test(objForm[x])) {
                    return warning(`Invalid Password!`);
                }
                break;
            case `SignupConfirmPassword`:
                if (objForm.SignupPassword !== objForm[x]) {
                    return warning(`Пароли не совпадают`);
                }
                break;
        }
    }

    function warning(x) {
        return !(document.getElementsByClassName(`warning`)[0].textContent = x);
    }
}