document.querySelector(`#form_id`).addEventListener(`submit`, e => {
    e.preventDefault();
    if (signIn()) {
        window.location.href = `../articleEditor/article.html`;
    }
    return false;
});

function signIn() {
    const form = document.querySelector('form');
    const authValue = {};
    const warnings = [...new FormData(form).entries()]
        .map(node => {

            let [field, value] = node;

            if (field && value) {
                authValue[field] = value;
            }

            switch (field) {
                case `loginEmail`:
                    if (!authValue[field] || !/[0-9a-zа-я_A-ZА-Я]+@[0-9a-zа-я_A-ZА-Я^.]+\.[a-zа-яА-ЯA-Z]{2,4}/i.test(authValue[field])) {
                        return "Please type a correct email!";
                    }
                    const emailExist = authData.find(x => x.sEmail === authValue[field]);
                    if (!emailExist) {
                        return `email doesn't exist`;
                    }
                    break;
                case `loginPassword`:
                    if (!authValue[field] || !/^([а-яА-ЯA-Za-z0-9]{6,})+$/.test(authValue[field])) {
                        return "Password must be 6 or more symbols!";
                    }
                    break;
            }
        }).filter(Boolean);


    if (warnings.length) {
        warning(warnings);
        return false;
    } else {
        authData.find( x => {
            if (x.sEmail === authValue.loginEmail && x.sPassword === authValue.loginPassword) {
                x.isLogin = `true`;
                localStorage.setItem(`authData`, JSON.stringify(authData));
                window.location.href = `../articleEditor/article.html`;
                return true;
            }else{
                warnings.push(`Incorrect password`);
            }
        })

    }

function warning (messages) {
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