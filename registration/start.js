document.querySelector(`#form_id`).addEventListener(`submit`, function (e) {
    e.preventDefault();
    if(signIn()) {
        let str = ["spider","css-form","spiderNetBotR","displayed"];
        for (let i in str) {
            document.querySelector(`.${str[i]}`).classList.add("hide");
        }
        document.querySelector('body').classList.add("strawberry");
    }
    return false;
});
function signIn() {

    let names = document.querySelectorAll('#form_id input');
    const objForm = [];

    for (let k = 0; k < names.length - 1; k++) {
        objForm[k] = names[k].value;
    }

    for (let x in objForm) {

        switch (+x) {
            case 0:
                if (!/[0-9a-zа-я_A-ZА-Я]+@[0-9a-zа-я_A-ZА-Я^.]+\.[a-zа-яА-ЯA-Z]{2,4}/i.test(objForm[x])) {
                   return  warning("Please type a correct email!");
                }
                break;
            case 1:
                if (!/^([а-яА-ЯA-Za-z0-9]{6,})+$/.test(objForm[x])) {
                   return  warning("password must include more then 6 simbols!");
                }
                break;
        }
    }

let data = localStorage.getItem(objForm[0]);
return data ?
    data == objForm[1] ? true : warning(`Wrong password`)
    : warning("email doen`t exist in base");

    function warning(x) {
        return !(document.getElementsByClassName(`warning`)[0].textContent = x);
    };
    warning(``);
}

