document.querySelector(`#form_id`).addEventListener(`submit`,  (e)=> {
    e.preventDefault();
    if(signIn()) {
        let str = ["spider","css-form","spiderNetBotR","displayed"];
        str.map(classes =>  document.querySelector(`.${classes}`).classList.add("hide"));
        document.querySelector('body').classList.add("strawberry");
    }
    return false;
});
function signIn() {

    let names = document.querySelectorAll('#form_id input');
    const values = {};

    for (let k = 0; k < names.length - 1; k++) {
        values[names[k].id] = names[k].value;
    }
    console.log(values);

    for (let x in values) {

        switch (x) {
            case `SigninEmail`:
                if (!/[0-9a-zа-я_A-ZА-Я]+@[0-9a-zа-я_A-ZА-Я^.]+\.[a-zа-яА-ЯA-Z]{2,4}/i.test(values[x])) {
                   return  warning("Please type a correct email!");
                }
                break;
            case `SigninPassword`:
                if (!/^([а-яА-ЯA-Za-z0-9]{6,})+$/.test(values[x])) {
                   return  warning("password must include more then 6 simbols!");
                }
                break;
        }
    }

    let authData = JSON.parse(localStorage.getItem(`authData`));
    return values.SigninEmail == authData[1] ?
            authData[2] == values.SigninPassword ? true : warning(`Wrong password`)
            : warning("email doen`t exist in base");

        function warning(x) {
            return !(document.getElementsByClassName(`warning`)[0].textContent = x);
        };
    warning(``);
}

