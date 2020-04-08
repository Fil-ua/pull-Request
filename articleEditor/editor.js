(function () {
    window.page_content_wrapper = document.querySelector(`.page-content-wrapper`),
        actionForm = document.querySelector(`[data-action]`);
    let loginWindow = `../registration/start.html`;

    window.articlesFromLS = localStorage.getItem(`Articles`) ? JSON.parse(localStorage.getItem(`Articles`)) : [];


    window.articlesCounter = counter();

    console.log(window.articlesFromLS);
    authData.find(x => {
        if (x.isLogin) {
            window.nickName = x.sNickName;
        }
    });
    window.articlesFromLS.forEach(x => createCard(x));

    ["closeContent", "addContent"].map(x => document.querySelector(`.${x}`).addEventListener(`click`, () => {
        inputValues();
        ["show"].map(v => window.page_content_wrapper.classList.toggle(v));
        window.actionForm.setAttribute(`data-action`, `save`);
    }));

    document.getElementById('createContent').addEventListener(`click`, () => {
        let action = window.actionForm.getAttribute(`data-action`);
        switch (action) {
            case `save` :
                createCard(checkValuesArticle());
                localStorage.setItem(`articlesCounter`, articlesCounter());
                addArticleToStorage(window.valuesChecked);
                warning("");
                inputValues();
                window.page_content_wrapper.classList.toggle("show");
                reattachListeners();

                break;
            case `edit` :

                window.articlesFromLS.filter(article => {
                    if (article.articleId === window.id) {
                        let idx = window.articlesFromLS.indexOf(article);
                        article = checkValuesArticle();
                        article.articleId = window.id;
                        window.articlesFromLS[idx] = article;
                        localStorage.setItem(`Articles`, JSON.stringify(window.articlesFromLS));
                        inputValues();
                        window.page_content_wrapper.classList.toggle(`show`);
                        window.actionForm.setAttribute(`data-action`, `save`);
                        refreshCards(idx, article);
                        reattachListeners();

                    }
                });
                break;
            default :
                console.log(`Что-то пошло не так!`);
        }

    });
    document.getElementById(`ShowAllArticles`).addEventListener(`click`, ()=>{
        ShowArticles(articlesFromLS);
        reattachListeners();
    });
    document.getElementById(`btn-Search`).addEventListener(`click`, () => {
        SearchArticles();
        reattachListeners();
    });

    document.getElementsByClassName(`reloadLocation`)[0].addEventListener(`click`, () => {
        history.go(0);
    });

    document.getElementsByClassName(`logout`)[0].addEventListener(`click`, () => {
        authData.find(x => {
            delete x.isLogin
        });
        localStorage.setItem(`authData`, JSON.stringify(authData));
        window.location.href = loginWindow;
    });

    reattachListeners();

})();

function ViewArticles() {
    //window.articlesFromLS.


}
function ShowArticles(arrayArticle) {
    document.body.children[1].innerHTML = "";
    arrayArticle.forEach(x => createCard(x));

}

function SearchArticles() {

    let searchArticleName = document.getElementById(`SearchArticle`).value.replace(/\s+/g,' ');
    console.log(searchArticleName);
    if(!searchArticleName || searchArticleName.length < 2) {

        alert('Введите больше символов');
    } else {
        let filteredArticles = window.articlesFromLS.filter(x => {
            if (x.articleName.indexOf(searchArticleName) != -1) {
                return x;
            }
        });
        if(filteredArticles.length){
            ShowArticles(filteredArticles);
        }else {
            alert(`По запросу: ${searchArticleName} , ничего не найдено!`);
        }
    }

}

function updateDate(date) {

    let now = new Date();
    let diffMillis = now - date;
    if (diffMillis < 1000) return "right now";
    if (diffMillis < 1000 * 60) return `${Math.round((diffMillis / 1000))} sec. ago`;
    if (diffMillis < 1000 * 60 * 60) return `${Math.round(diffMillis / 1000 / 60)} min. ago`;
    if (diffMillis < 1000 * 60 * 60 * 24) return `${Math.round(diffMillis / 1000 / 60 / 60)} hour ago`;
    const twoD = (number) => number.toString().slice(-2).padStart(2, '0');
    return twoD(date.getDate()) + '.' +
        twoD(date.getMonth() + 1) + '.' +
        twoD(date.getFullYear()) + ' ' +
        twoD(date.getHours()) + ':' +
        twoD(date.getMinutes());
}

function refreshCards(id_replace, values) {
    let elem = document.getElementsByClassName(`update`)[0],
        elemFirst = elem.children[id_replace];
    elem.replaceChild(Card(values), elemFirst);
}

function checkValuesArticle() {

    window.valuesChecked = {
        articleName: document.getElementById('articleName').value,
        articleDescription: document.getElementById('articleDescription').value,
        articleContent: CKEDITOR.instances.articleContent.getData(),
        articlenickName: nickName,
        articleLastDate: Date.parse(new Date),
        articleId: articlesCounter()
    };

    window.valuesChecked.articleName = window.valuesChecked.articleName.replace(/\s+/g,' ');
    if (!/[._!@0-9-a-zA-Zа-яА-Я]{2,}/.test(window.valuesChecked.articleName)) {
        warning(`Некорректный ввод! Заполните поле - Название!`);
    } else if (window.valuesChecked.articleDescription.length > 49) {
        return window.valuesChecked;
    } else {
        warning(`Краткое описание должно содержать от 50 символов!`);
    }
}

function addArticleToStorage(article) {
    window.articlesFromLS.push(article);
    localStorage.setItem(`Articles`, JSON.stringify(window.articlesFromLS));
    console.log(window.articlesFromLS);
}

function warning(message) {
    document.getElementsByClassName(`warning`)[0].innerHTML = message;
}

function counter() {
    let count = localStorage.getItem(`articlesCounter`) ?
        localStorage.getItem(`articlesCounter`) : 0;
    return () => count++;
}

function Card(values) {

    let div = document.createElement('div');
    div.className = "card col-4 p-3 mb-4";
    div.innerHTML = `<div class="card-body h-100 form-inline">
            <a class="w-100"> <span class="card-title w-75 h5 float-left">${values.articleName}</span>
                <span class="badge badge-secondary w-25 float-right">${values.articlenickName}</span>
            </a>
            <p class="card-text w-100">${values.articleDescription}</p>
        </div>
        <div class="card-footer  form-inline p-2 rounded">
            <small class="text-muted w-50 mr-auto">Last updated ${updateDate(values.articleLastDate)}</small>
            ${(values.articlenickName === window.nickName) ? `
            <div data-fix-id="${values.articleId}" class="w-50  form-inline">
                 <div  data-fix="edit" class="m-auto div_img">
                    <img src="../src/edit_pen.png" alt="Редактировать"  class="img">
                 </div>
                 <div  data-fix="delete" class="m-auto div_img">
                     <img src="../src/delete.png" alt="Удалить"  class="img">
                 </div>
            </div>` : `<div class="m-auto x"></div>`}
        </div>`;
    return div;
}

function createCard(values) {
    document.querySelector(`.cardsContainer`).appendChild(Card(values));
}

function inputValues(values) {
    let ckeditor = CKEDITOR.instances.articleContent,
        name = document.getElementById('articleName'),
        description = document.getElementById('articleDescription');

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

function EditDelete(event) {

    window.id = +this.dataset.fixId;
    switch (event.target.parentNode.dataset.fix) {
        case `edit`:
            window.actionForm.setAttribute(`data-action`, `edit`);
            window.page_content_wrapper.classList.add(`show`);
            window.articlesFromLS.filter(article => {
                if (article.articleId === window.id) {
                    inputValues(article);
                }
            });
            break;
        case `delete` :
            window.articlesFromLS.filter(article => {
                if (article.articleId === window.id) {
                    this.parentNode.parentNode.classList.add(`hidden`);
                    let idx = window.articlesFromLS.indexOf(article);
                    if (idx != -1) {
                        window.articlesFromLS.splice(idx, 1);
                        localStorage.setItem(`Articles`, JSON.stringify(window.articlesFromLS));
                    }
                }
            });
            break;
    }
}

function reattachListeners() {
    let cardsFix = document.querySelectorAll(`[data-fix-id]`);
    for (let card of cardsFix) {
        card.addEventListener(`click`, EditDelete);
    }
}


