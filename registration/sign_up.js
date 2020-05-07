if (!firebase.apps.length) {
    const firebaseConfig = {
        apiKey: "AIzaSyBiMmzvgrIFjFcyEf3mfiBXIvJ76dfmKO0",
        authDomain: "test-project-handwritter.firebaseapp.com",
        databaseURL: "https://test-project-handwritter.firebaseio.com",
        projectId: "test-project-handwritter",
        storageBucket: "test-project-handwritter.appspot.com",
        messagingSenderId: "291127579673",
        appId: "1:291127579673:web:bc20bef2adec88b5fe8688"
    };
    const getAuthData = localStorage.getItem(`authData`),
        authData = getAuthData ? JSON.parse(getAuthData) : [];
    firebase.initializeApp(firebaseConfig);
}

this.dbUsers = firebase.database().ref("users");
let newUser;

firebase.database().ref("users").on("value", snapshot => {
    newUser = counter(snapshot.numChildren());
});

document.getElementById('form_registration').addEventListener(`submit`, e => {
    e.preventDefault();
    if (validate()) {
        if (window.location.href.includes(`log_in.html`)) {
            document.querySelector('#form_registration').reset();
            alert(`Registration has success!`);
            document.getElementById("mySidebar").classList.toggle("show-sidebar");
            document.getElementById("main").classList.toggle("main-left");
        } else {
            alert(`                  Registration has success!
             After close this window, automatically redirect 
             to authorization form.`);
            window.location.href = `log_in.html`;
        }
    }
    return false;
});

function counter(num) {
    let count = num || authData.length || 0;
    return () => "user-"+ count++;
}

function validate() {

    const form = document.querySelector('#form_registration');
    const authValue = {};
    const warnings_registration = [...new FormData(form)]
        .map(node => {
            let [field, value] = node;
            if (field && value) {
                authValue[field] = value;
            }

            switch (field) {
                case `name`:
                case `surname`:
                    if (!authValue[field] || !/^([а-яА-ЯA-Za-z]{2,20})+$/.test(authValue[field])) {
                        return `incorrect input!`;
                    }
                    break;
                case `nickName`:
                    if (!authValue[field] || !/[._0-9-a-zA-Zа-яА-Я]/.test(authValue[field])) {
                        return `incorrect symbols in nickname`;
                    }
                    if(UniqueValue(field,authValue[field])){
                        return `nickname already used`;
                    }
                    // ---localStorage---
                    /*const uniqueNickName = authData.find(x => x.sNickName === authValue[field]);
                    if (uniqueNickName) {
                        return `nickname already used`;
                    }*/
                    break;
                case `birthday`:
                    let year = new Date().getFullYear() - new Date(authValue[field].replace(/\./g, `:`)).getFullYear();
                    if (!(10 <= year && year <= 80)) {
                        return `Age must be between 10 and 80 years`;
                    }
                    break;
                case `email`:
                    if (!authValue[field] || !/[0-9a-zа-я_A-ZА-Я]+@[0-9a-zа-я_A-ZА-Я^.]+\.[a-zа-яА-ЯA-Z]{2,4}/i
                        .test(authValue[field])) {
                        return `incorrect Email address!`;
                    }
                    if(UniqueValue(field,authValue[field])){
                        return `Email already used`;
                    }
                    // ---localStorage---
                    /*const uniqueEmail = authData.find(x => x.sEmail === authValue[field]);
                    if (uniqueEmail) {
                        return `Email already used`;
                    }*/
                    break;
                case `password`:
                    if (!authValue[field] || !/^([а-яА-ЯA-Za-z0-9]{6,})+$/.test(authValue[field])) {
                        return `Invalid Password!`;
                    }
                    break;
                case `confirmPassword`:
                    if (!authValue[field] || authValue.password !== authValue[field]) {
                        return `Passwords do not match`;
                    }
                    break;
            }
        }).filter(Boolean);

    function UniqueValue(uKey, value){
        let result;
        dbUsers.orderByChild(uKey).on('child_added', snapshot => {
            if( snapshot.val()[uKey] == value ) {
                result = true;
            }
        });
        return result;
    }

    if (warnings_registration.length) {
        warning(warnings_registration,"warnings_registration");
        return false;
    } else {
        // ---localStorage---
        //authData.push(authValue);
        //localStorage.setItem(`authData`, JSON.stringify(authData));
        delete authValue.confirmPassword;
        firebase.database().ref("users/" + newUser()).set(authValue);
        return true;
    }

    function warning(messages, formName) {
        messages = Array.isArray(messages) ? messages : [messages] ;
        const container = document.querySelector(`.${formName}`);
        container.innerHTML = ``;
        messages.map(message => {
                let li = document.createElement(`li`);
                li.appendChild(document.createTextNode(message));
                container.appendChild(li);
        })
    }

}