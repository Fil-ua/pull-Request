const firebaseConfig = {
    apiKey: "AIzaSyBiMmzvgrIFjFcyEf3mfiBXIvJ76dfmKO0",
    authDomain: "test-project-handwritter.firebaseapp.com",
    databaseURL: "https://test-project-handwritter.firebaseio.com",
    projectId: "test-project-handwritter",
    storageBucket: "test-project-handwritter.appspot.com",
    messagingSenderId: "291127579673",
    appId: "1:291127579673:web:bc20bef2adec88b5fe8688"
};

firebase.initializeApp(firebaseConfig);
this.dbUsers = firebase.database().ref("users");
this.userName;
document.querySelector(`#form_authorization`).addEventListener(`submit`, e => {
   e.preventDefault();
    if(signIn()){
        alert(`Welcome ${userName}!`);
        window.location.href = `../articleEditor/article.html`;
    }
    return false;
});
['link','closebtn'].map(x => document.querySelector(`.${x}`)
    .addEventListener(`click`, () => {
    openSidebar();
    }));

function signIn() {
    const form = document.querySelector('#form_authorization');
    const authValue = {};
    const warnings_authorization = [...new FormData(form)]
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
                    if(!UniqueValue("email",authValue[field])){
                        return `Email doesn't exist`;
                    }
                    // --localStorage--
                    /*const emailExist = authData.find(x => x.sEmail === authValue[field]);
                    if (!emailExist) {
                        return `email doesn't exist`;
                    }*/
                    break;
                case `loginPassword`:
                    if (!authValue[field] || !/^([а-яА-ЯA-Za-z0-9]{6,})+$/.test(authValue[field])) {
                        return "Password must be 6 or more symbols!";
                    }
                    break;
            }
        }).filter(Boolean);


    if (warnings_authorization.length) {
       return warning(warnings_authorization,"warnings_authorization");
    } else {
        dbUsers.orderByChild("email").on('child_added', snapshot => {
            if( snapshot.val().email == authValue.loginEmail && snapshot.val().password == authValue.loginPassword) {
                userName = snapshot.val().name;
                firebase.database().ref("users/" + snapshot.key).update({
                    "isLogin": 'true'
                });
            }
        });
          return userName ? true : warning('Incorrect password',"warnings_authorization");
        // --LocalStorage--
        /*let result = !!authData.filter( x => {
            if (x.sEmail === authValue.loginEmail && x.sPassword === authValue.loginPassword) {
                x.isLogin = `true`;
                localStorage.setItem(`authData`, JSON.stringify(authData));
                return x;
            }
        }).length;
       return result ?  true : warning(`Incorrect password`);*/
    }

}

function UniqueValue(uKey, value){
    let result;
    dbUsers.orderByChild(uKey).on('child_added', snapshot => {
        if( snapshot.val()[uKey] == value ) {
            result = true;
        }
    });
    return result;
}

function warning (messages,formName) {
    messages = Array.isArray(messages) ? messages : [messages] ;
    const container = document.querySelector(`.${formName}`);
    container.innerHTML = ``;
    messages.map(message => {
        let li = document.createElement(`li`);
        li.appendChild(document.createTextNode(message));
        container.appendChild(li);
    });
}

function openSidebar() {
    if(window.innerWidth < 800){
        window.location.href = `sign_up.html`;
    }else {
        document.getElementById("mySidebar").classList.toggle("show-sidebar");
        document.getElementById("main").classList.toggle("main-left");
    }
}
