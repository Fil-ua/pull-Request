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

    ShowArticles(window.articlesFromLS);
    CarouselMaket(window.articlesFromLS);
    reattachListeners();

    ["closeContent", "addContent"].map(x => document.querySelector(`.${x}`).addEventListener(`click`, () => {
        inputValues();
        ["show"].map(v => window.page_content_wrapper.classList.toggle(v));
        setTimeout(() => {
            document.querySelector("footer").scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
        },10);
        window.actionForm.setAttribute(`data-action`, `save`);

    }));

    document.getElementById('createContent').addEventListener(`click`, () => {
        let action = window.actionForm.getAttribute(`data-action`);
        switch (action) {
            case `save` :
                document.querySelector("footer").scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
                createCard(checkValuesArticle());
                document.getElementById(`SearchArticle`).value = "";
                localStorage.setItem(`articlesCounter`, articlesCounter());
                addArticleToStorage(window.valuesChecked);
                ShowArticles(window.articlesFromLS);
                CarouselMaket(window.articlesFromLS);
                CheckIfHiddenCardsContent();
                reattachListeners();
                warning("");
                inputValues();
                window.page_content_wrapper.classList.toggle("show");
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
                        if(CheckActiveSearch()){return};
                        ShowArticles(window.articlesFromLS);
                        CarouselMaket(window.articlesFromLS);
                        CheckIfHiddenCardsContent();
                        reattachListeners();
                    }
                });
                break;

            default :
                console.log(`Что-то пошло не так!`);
        }

    });
    document.getElementById(`ShowAllArticles`).addEventListener(`click`, () => {
        document.getElementById(`SearchArticle`).value = "";
        ShowArticles(window.articlesFromLS);
        reattachListeners();
    });

    document.getElementById(`SearchArticle`).addEventListener(`keyup`, () => {
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

})();


function CheckIfHiddenCardsContent() {

    if (document.getElementsByClassName(`cardsContainer`)[0].className.indexOf(`hidden`) != -1) {
        document.getElementsByClassName(`cardsContainer`)[0].classList.toggle(`hidden`);
    }
}
function SearchArticles() {
    CheckIfHiddenCardsContent();
    let searchArticleName = document.getElementById(`SearchArticle`).value.replace(/\s+/g, ' ').trim();
    if (!searchArticleName || searchArticleName.length < 3) {
        ShowArticles(window.articlesFromLS);
        CarouselMaket(window.articlesFromLS);
    } else {
        let filteredArticles = window.articlesFromLS.filter(x => {
            if (x.articleName.toLowerCase().indexOf(searchArticleName.toLowerCase()) != -1) {
                return x;
            }
        });
        if (filteredArticles.length) {
            ShowArticles(filteredArticles);
            CarouselMaket(filteredArticles);
        } else {
            document.querySelector(`.cardsContainer`).innerHTML = `По запросу: ${searchArticleName} , ничего не найдено!`;
        }
    }
}
function CheckActiveSearch() {
    if(document.getElementById(`SearchArticle`).value.replace(/\s+/g, ' ').trim()){
        SearchArticles();
        CheckIfHiddenCardsContent();
        reattachListeners();
        return true;
    }
    return false;
}
function updateDate(date) {

    let now = new Date();

    let diffMillis = now - date;
    if (diffMillis < 1000) return "right now";
    if (diffMillis < 1000 * 60) return `${Math.round((diffMillis / 1000))} sec. ago`;
    if (diffMillis < 1000 * 60 * 60) return `${Math.round(diffMillis / 1000 / 60)} min. ago`;
    if (diffMillis < 1000 * 60 * 60 * 24) return `${Math.round(diffMillis / 1000 / 60 / 60)} hour ago`;
    const twoD = (number) => number.toString().slice(-2).padStart(2, '0');
    date = new Date(date);
    return twoD(date.getDate()) + '.' +
        twoD(date.getMonth() + 1) + '.' +
        twoD(date.getFullYear());
}
function warning(message) {

    document.getElementsByClassName(`warning`)[0].innerHTML = message;
}
function counter() {

    let count = localStorage.getItem(`articlesCounter`) ?
        localStorage.getItem(`articlesCounter`) : 0;
    return () => count++;
}
function addArticleToStorage(article) {

    window.articlesFromLS.push(article);
    localStorage.setItem(`Articles`, JSON.stringify(window.articlesFromLS));
    console.log(window.articlesFromLS);
}

function ShowArticles(arrayArticle) {

    document.querySelector(`.cardsContainer`).innerHTML = "";

    for (let i = 0; i < arrayArticle.length; i++) {
        createCard(arrayArticle[i]);
        document.querySelectorAll(`.card-text`)[i].setAttribute(`data-article-number`, i);
    }
}
function createCard(values) {

    document.querySelector(`.cardsContainer`).appendChild(Card(values));
}
function Card(values) {

    let div = document.createElement('div');

    div.className = "card col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 mb-4";
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
function checkValuesArticle() {

    window.valuesChecked = {
        articleName: document.getElementById('articleName').value,
        articleDescription: document.getElementById('articleDescription').value,
        articleContent: CKEDITOR.instances.articleContent.getData(),
        articlenickName: nickName,
        articleLastDate: Date.parse(new Date),
        articleId: articlesCounter()
    };

    window.valuesChecked.articleName = window.valuesChecked.articleName.replace(/\s+/g, ' ').trim();

    if (!/[._!@0-9-a-zA-Zа-яА-Я]{2,}/.test(window.valuesChecked.articleName)) {
        warning(`Некорректный ввод! Заполните поле - Название!`);
    } else if (window.valuesChecked.articleDescription.length > 49) {
        return window.valuesChecked;
    } else {
        warning(`Краткое описание должно содержать от 50 символов!`);
    }
}
function CarouselMaket(array_articles) {

    document.getElementsByClassName(`carousel-indicators`)[0].innerHTML = "";
    document.getElementsByClassName(`carousel-inner`)[0].innerHTML = "";

    for (let el in array_articles) {
        let li = document.createElement(`li`);

        li.setAttribute(`data-target`, `#sliderFade`);
        li.setAttribute(`data-slide-to`, `${el}`);
        document.getElementsByClassName(`carousel-indicators`)[0].appendChild(li);
        let div = document.createElement(`div`);
        div.className = "carousel-item";

        div.innerHTML = `<div class="alley">
                <div class="mt-4 mb-5">
                <div class="h2">${array_articles[el].articleName}</div>
                    <a class="float-left rounded  p-1 font-weight-bold badge-secondary mr-3">${array_articles[el].articlenickName}</a>
                    <a class="badge pt-2">Last update ${updateDate(array_articles[el].articleLastDate)}</a>
            </div>
            ${array_articles[el].articleContent}
         </div>`;
        document.querySelector(`.carousel-inner`).appendChild(div);
    }

    let a = document.createElement(`a`);
    a.className = "close closeArticles";
    a.innerHTML = "[x]";
    document.getElementsByClassName(`carousel-inner`)[0].insertAdjacentElement(`afterbegin`, a);
    document.querySelector(`.closeArticles`).addEventListener(`click`, () => {

        for (let el of document.querySelectorAll(`[data-slide-to]`)) {

            if (el.className.indexOf(`active`) != -1) {
                el.classList.toggle(`active`);
                break;
            }
        }

        document.getElementsByClassName(`carousel-item active`)[0].classList.toggle(`active`);
        document.getElementsByClassName(`cardsContainer`)[0].classList.toggle(`hidden`);

        if(document.getElementById(`SearchArticle`).value.replace(/\s+/g, ' ').trim()){
            return;
        }
        ShowArticles(window.articlesFromLS);
        reattachListeners();

    });
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
                    document.querySelector("footer").scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
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
                        if(CheckActiveSearch()){return};
                        CarouselMaket(window.articlesFromLS);
                        ShowArticles(window.articlesFromLS);
                        reattachListeners();
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
    let cardsDescript = document.querySelectorAll(`[data-article-number`);
    for (let card of cardsDescript) {
        card.addEventListener(`click`, CarouselShowHide);
    }
}
function CarouselShowHide(event) {

    event = +event.target.dataset.articleNumber;
    document.getElementsByClassName(`cardsContainer`)[0].classList.toggle(`hidden`);
    [document.querySelectorAll(`[data-target]`)[event],
        document.getElementsByClassName(`carousel-item`)[event]]
        .map(x => x.classList.toggle(`active`));
}


