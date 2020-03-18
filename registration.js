/*
document.getElementById('form_id').addEventListener("submit", function(event){
    event.preventDefault();
    return validate();
});
*/
form_id.onsubmit = ()=> { return validate()};

function validate() {

    const objForm = {
        SignupName,
        SignupSurname,
        SignupBirthday,
        SignupEmail,
        SignupPassword,
        SignupConfirmPassword
    };

    for(let key in objForm){
        if(document.getElementById(key).value){
            objForm[key] = document.getElementById(key).value;
        }
    }

    function warning(x) {
        let warningNames = {
            name: `Некорректный ввод!`,
            birthday: `не младше 10 и не старше 80 лет`,
            email: `Ошибка ввода Email-адреса!`,
            wrongSimbols: `Invalid Password!`,
            password: `Пароли не совпадают`
        };
        document.getElementsByClassName(`warning`)[0].textContent =warningNames[x];
    }

    function isValidDate(year) {
        year = new Date().getFullYear() - new Date(year.replace(/\./g, `:`)).getFullYear();
        return (10 < year && year < 80) ? true : false;
    }

    let regEmail = /[0-9a-zа-я_A-ZА-Я]+@[0-9a-zа-я_A-ZА-Я^.]+\.[a-zа-яА-ЯA-Z]{2,4}/i,
        regName = /^([а-яА-ЯA-Za-z]{2,20})+$/,
        regPassword = /^([а-яА-ЯA-Za-z0-9]{6,})+$/;

    if (!regName.test(objForm.SignupName)){
        warning(`name`);
        return false;
    }
    if (!regName.test(objForm.SignupSurname)){
        warning(`name`);
        return false;
    }
    if (!isValidDate(objForm.SignupBirthday)){
        warning(`birthday`);
        return false;
    }
    if (!regEmail.test(objForm.SignupEmail)){
        warning(`email`);
        return false;
    }
    if (!regPassword.test(objForm.SignupPassword)) {
        warning(`wrongSimbols`);
        return false;
    }
    if(objForm.SignupPassword !== objForm.SignupConfirmPassword){
        warning(`password`);
        return false;
    }
}

