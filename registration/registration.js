document.querySelector(`#form_id`).addEventListener(`submit`, e => {
    e.preventDefault();
    if (validate()) {
        window.location.href = `start.html`;
    }
    return false;
});
const getAuthData = localStorage.getItem(`authData`),
    authData = getAuthData ? JSON.parse(getAuthData) : [];

function validate() {

    const form = document.querySelector('form');
    const authValue = {};

    const warnings = [...new FormData(form).entries()]
        .map(node => {

            let [field, value] = node;

            if (field && value) {
                authValue[field] = value;
            }

            switch (field) {
                case `sName`:
                case `sSurname`:
                    if (!authValue[field] || !/^([а-яА-ЯA-Za-z]{2,20})+$/.test(authValue[field])) {
                        return `incorrect input!`;
                    }
                    break;
                case `sNickName`:
                    if (!authValue[field] || !/[._0-9-a-zA-Zа-яА-Я]/.test(authValue[field])) {
                        return `incorrect symbols in nickname`;
                    }
                    const uniqueNickName = authData.find(x => x.sNickName === authValue[field]);
                    if (uniqueNickName) {
                        return `nickname already used`;
                    }
                    break;
                case `sBirthday`:
                    let year = new Date().getFullYear() - new Date(authValue[field].replace(/\./g, `:`)).getFullYear();
                    if (!(10 <= year && year <= 80)) {
                        return `Age must be between 10 and 80 years`;
                    }
                    break;
                case `sEmail`:
                    if (!authValue[field] || !/[0-9a-zа-я_A-ZА-Я]+@[0-9a-zа-я_A-ZА-Я^.]+\.[a-zа-яА-ЯA-Z]{2,4}/i
                        .test(authValue[field])) {
                        return `incorrect Email address!`;
                    }
                    const uniqueEmail = authData.find(x => x.sEmail === authValue[field]);
                    if (uniqueEmail) {
                        return `Email already used`;
                    }
                    break;
                case `sPassword`:
                    if (!authValue[field] || !/^([а-яА-ЯA-Za-z0-9]{6,})+$/.test(authValue[field])) {
                        return `Invalid Password!`;
                    }
                    break;
                case `sConfirmPassword`:
                    if (!authValue[field] || authValue.sPassword !== authValue[field]) {
                        return `Passwords do not match`;
                    }
                    break;
            }
        }).filter(Boolean);

    if (warnings.length) {
        warning(warnings);
        return false;
    } else {
        authData.push(authValue);
        localStorage.setItem(`authData`, JSON.stringify(authData));
        return true;
    }

    function warning(messages) {
        messages = Array.isArray(messages) ? messages : [messages] ;
        const container = document.querySelector(`.warning`);
        container.innerHTML = ``;
        messages.map(message => {
                let li = document.createElement(`li`);
                li.appendChild(document.createTextNode(message));
                container.appendChild(li);

        })
    }

}