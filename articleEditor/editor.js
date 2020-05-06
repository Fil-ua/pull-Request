(function () {
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

    window.dbUsers = firebase.database().ref('users');
    window.dbArticles = firebase.database().ref('articles');

    dbUsers.on('child_added', snapshot => {
        if (snapshot.val().isLogin) {
           window.userName = snapshot.val().nickName;
        }
    });

    firebase.database().ref("articlesCounter").on(`value`, data => {
        window.articlesCounter = counter(data.val())();
    });

    dbArticles.orderByValue().on('value', data => {
        window.articlesFromFB = [];
        Object.values(data.val()).map(x =>{
            for( let obj of Object.values(x)){
                articlesFromFB.push(obj);
            }
        });
        Paggination(articlesFromFB);
    });

    window.page_content_wrapper = document.querySelector(`.page-content-wrapper`);
    window.actionForm = document.querySelector(`[data-action]`);
    window.card = new Card();
    window.carousel = new Carousel();

    ["closeContent", "addContent"].map(x => document.querySelector(`.${x}`)
        .addEventListener(`click`, () => {
            inputValues();
            page_content_wrapper.classList.toggle("show");
            setTimeout(() => {
                scrollTo();
            }, 10);
            actionForm.setAttribute(`data-action`, `save`);
        }));

    document.getElementById('createContent').addEventListener(`click`, () => {
        let action = actionForm.getAttribute(`data-action`);
        switch (action) {
            case `save` :
                scrollTo();
                checkValuesArticle();
                document.getElementById(`SearchArticle`).value = "";
                addArticleToStorage(valuesChecked);
                firebase.database().ref("articlesCounter").set(articlesCounter);
                CheckIfHiddenCardsContent();
                warning("");
                page_content_wrapper.classList.toggle("show");
                break;

            case `edit` :
                warning('');
                let article = checkValuesArticle();
                if(typeof article === 'undefined') {
                    break;
                }
                article.articleId =  idArticle;
                firebase.database().ref(`articles/${userName}/article-${idArticle}`).update(article);
                inputValues();
                page_content_wrapper.classList.toggle(`show`);
                actionForm.setAttribute(`data-action`, `save`);
                if (CheckActiveSearch()) {
                    return;
                }
                CheckIfHiddenCardsContent();
                break;
            default :
                alert(`Что-то пошло не так!`);
        }
    });

    document.getElementById(`ShowAllArticles`).addEventListener(`click`, () => {
        document.getElementById(`SearchArticle`).value = "";
        filteredArticles = 0;
        Paggination(articlesFromFB);
        CheckIfHiddenCardsContent();
    });
    document.getElementById(`SearchArticle`).addEventListener(`keyup`, () => {
        SearchArticles();
    });
    document.querySelector(`.articlesOnPage input`).addEventListener(`click`, ()=>{
        filteredArticles ? Paggination(filteredArticles) : Paggination(articlesFromFB);
    });
    document.querySelector(`.reloadLocation`).addEventListener(`click`, () => {
        history.go(0);
    });
    document.getElementById(`btnConfirm`).addEventListener(`click`, () => {
        dbUsers.orderByChild('isLogin').on('child_added', snapshot => {
               firebase.database().ref('users/'+snapshot.key).child('isLogin').remove();
        });
        window.location.href = `../registration/log_in.html`;
    });
    document.querySelector(`.logout`).addEventListener(`click`, () => {
        document.querySelector(`#logout`).modal;
    });
})();

function Paggination(array) {
    let articlesOnPage = +document.querySelector(`.articlesOnPage select`).value;
    let items = [];
    let ul = document.querySelector(`.pagination`);
    ul.innerHTML = '';
    let size = Math.ceil(array.length/articlesOnPage);
    for(let i = 1; i <= size; i++){
        let li = document.createElement('li');
        li.innerHTML = i;
        ul.appendChild(li);
        items.push(li);
    }
    ShowPage(items[0]);
    items.map( item => {
        item.addEventListener(`click`, () => {
            ShowPage(item);
        });
    });
    function ShowPage(item) {
        let active = document.querySelector(`.pagination li.active`);
        if (active){
            active.classList.remove(`active`);
        }
        item.classList.add(`active`);
        let start = (+item.innerHTML-1) * articlesOnPage;
        let end = start + articlesOnPage;
        let notes = array.slice(start, end);
        card.Show(notes);
        carousel.Create(notes);
        reattachListeners();
    }
};

function reattachListeners() {
    let cardsFix = document.querySelectorAll(`[data-fix-id]`);
    for (let el of cardsFix) {
        el.addEventListener(`click`, event => {
             window.idArticle = +event.target.parentNode.parentNode.dataset.fixId;
            switch (event.target.parentNode.dataset.fix) {
                case `edit`:
                    card.Edit();
                    break;
                case `delete` :
                    card.Delete(userName);
                    break;
            }
        });
    }
    let cardsDescript = document.querySelectorAll(`[data-article-number`);
    for (let el of cardsDescript) {
        el.addEventListener(`click`, carousel.ToggleOpen);
    }
}

function checkValuesArticle() {
    window.valuesChecked = {
        articleName: document.querySelector(`[name="articleName"]`).value,
        articleDescription: document.querySelector(`[name="articleDescription"]`).value,
        articleContent: CKEDITOR.instances.articleContent.getData(),
        articlenickName: userName,
        articleLastDate: Date.parse(new Date),
        articleId: articlesCounter
    };
    valuesChecked.articleName = valuesChecked.articleName.replace(/\s+/g, ' ').trim();
    if (!/[._!@0-9-a-zA-Zа-яА-Я]{2,}/.test(valuesChecked.articleName)) {
        warning(`Некорректный ввод! Заполните поле - Название!`);
    } else if (valuesChecked.articleDescription.length > 49) {
        return valuesChecked;
    } else {
        warning(`Краткое описание должно содержать от 50 символов!`);
    }
}

function inputValues(values) {
    let ckeditor = CKEDITOR.instances.articleContent,
        name = document.querySelector(`[name="articleName"]`),
        description = document.querySelector(`[name="articleDescription"]`);
    if (values) {
        ckeditor.setData(values.articleContent);
        name.value = values.articleName;
        description.value = values.articleDescription;
    } else {
        ckeditor.setData("");
        name.value = "";
        description.value = "";
    }
}

function addArticleToStorage(article) {
    firebase.database().ref(`articles/${userName}/article-${articlesCounter}`).set(article);
}

function SearchArticles() {
    CheckIfHiddenCardsContent();
    let searchArticleName = document.getElementById(`SearchArticle`).value.replace(/\s+/g, ' ').trim();
    if ( searchArticleName.length < 3) {
        Paggination(articlesFromFB);
        filteredArticles = 0;
    } else {
        window.filteredArticles = articlesFromFB.filter(x => {
            if (x.articleName.toLowerCase().indexOf(searchArticleName.toLowerCase()) != -1) {
                return x;
            }
        });
        console.log(filteredArticles);
        if (filteredArticles.length) {
            Paggination(filteredArticles);
        } else {
            document.querySelector(`.cardsContainer`).innerHTML =
                `По запросу: ${searchArticleName} , ничего не найдено!`;

        }
    }
}

function CheckActiveSearch() {
    if (document.getElementById(`SearchArticle`).value.replace(/\s+/g, ' ').trim()) {
        SearchArticles();
        return true;
    }
    return false;
}

function CheckIfHiddenCardsContent() {
    const cardsClass = document.querySelector(`.cardsContainer`).classList;
    if (cardsClass.contains(`hidden`)) {
        cardsClass.toggle(`hidden`);
    }
}

function scrollTo() {
    document.querySelector("footer").scrollIntoView({
        behavior: "smooth", block: "end",
        inline: "nearest"
    });
}

function warning(message) {
    document.querySelector(`.warning`).innerHTML = message;
}

function counter(count) {
    let co = count;
    if (co === null){
        co = 0;
    }
    return ()=> ++co;
}