(function () {
    window.page_content_wrapper = document.querySelector(`.page-content-wrapper`),
        articlesCounter = counter(),
        actionForm = document.querySelector(`[data-action]`);
    let loginWindow = `../registration/start.html`;

    window.articlesFromLS = localStorage.getItem(`Articles`) ?
        JSON.parse(localStorage.getItem(`Articles`)) : [];

    authData.find(x => {
        if (x.isLogin) {
            window.nickName = x.sNickName;
        }
    });

    ShowArticles(window.articlesFromLS);
    CarouselMaket(window.articlesFromLS);
    reattachListeners();

    ["closeContent", "addContent"].map(x => document.querySelector(`.${x}`)
        .addEventListener(`click`, () => {
            inputValues();
            ["show"].map(v => window.page_content_wrapper.classList.toggle(v));
            setTimeout(() => {
                document.querySelector("footer").scrollIntoView({
                    behavior: "smooth", block: "end",
                    inline: "nearest"
                });
            }, 10);
            window.actionForm.setAttribute(`data-action`, `save`);

        }));

    document.getElementById('createContent').addEventListener(`click`, () => {
        let action = window.actionForm.getAttribute(`data-action`);
        switch (action) {
            case `save` :
                document.querySelector("footer").scrollIntoView({
                    behavior: "smooth", block: "end",
                    inline: "nearest"
                });
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
                        if (CheckActiveSearch()) {
                            return
                        }
                        ;
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

    document.querySelector(`.reloadLocation`).addEventListener(`click`, () => {
        history.go(0);
    });

    document.querySelector(`.logout`).addEventListener(`click`, () => {
        document.getElementById(`staticBackdrop`).modal();
        authData.find(x => {
            delete x.isLogin
        });
        localStorage.setItem(`authData`, JSON.stringify(authData));
        window.location.href = loginWindow;
    });

})();

function CheckIfHiddenCardsContent() {
    const cardsClass = document.getElementsByClassName(`cardsContainer`)[0].classList;
    if (cardsClass.contains(`hidden`)) {
        cardsClass.toggle(`hidden`);
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
            document.querySelector(`.cardsContainer`).innerHTML =
                `По запросу: ${searchArticleName} , ничего не найдено!`;
        }
    }
}

function CheckActiveSearch() {
    if (document.getElementById(`SearchArticle`).value.replace(/\s+/g, ' ').trim()) {
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
    let count = localStorage.getItem(`articlesCounter`) || 0;
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
        document.querySelector(`.cardsContainer`).querySelectorAll(`.card-text`)[i]
            .setAttribute(`data-article-number`, `${i}`);
    }
}

function createCard(values) {

    let newCard = document.querySelector(`.card.hidden`).cloneNode(true);
    let newCardEvent = document.querySelector(`.cardEvent.hidden`).cloneNode(true);

    newCard.querySelector(`.card-title`).innerHTML = values.articleName;
    newCard.querySelector(`.badge`).innerHTML = values.articlenickName;
    newCard.querySelector(`.card-text`).innerHTML = values.articleDescription;
    newCard.querySelector(`.text-muted`).innerHTML = "Last updated " + updateDate(values.articleLastDate);

    if (values.articlenickName === window.nickName) {
        newCardEvent.setAttribute(`data-fix-id`, `${values.articleId}`);
        newCard.querySelector(`.card-footer`).appendChild(newCardEvent);
    }

    [newCard, newCardEvent].forEach(x => x.classList.remove(`hidden`));
    document.querySelector(`.cardsContainer`).appendChild(newCard);
}

function checkValuesArticle() {

    window.valuesChecked = {
        articleName: document.querySelector(`[name = "articleName"]`).value,
        articleDescription: document.querySelector(`[name = "articleDescription"]`).value,
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

    document.querySelector(`.carousel-indicators`).innerHTML = "";
    document.querySelector(`.carousel-inner`).innerHTML = "";

    for (let el in array_articles) {
        let li = document.createElement(`li`);
        li.setAttribute(`data-target`, `#sliderFade`);
        li.setAttribute(`data-slide-to`, `${el}`);
        document.querySelector(`.carousel-indicators`).appendChild(li);

        let carouselItem = document.querySelector(`.carousel-item`).cloneNode(true);
        carouselItem.querySelector(`.carousel-name`).innerHTML = array_articles[el].articleName;
        carouselItem.querySelector(`.carousel-nickName`).innerHTML = array_articles[el].articlenickName;
        carouselItem.querySelector(`.carousel-date`).innerHTML = updateDate(array_articles[el].articleLastDate);
        carouselItem.querySelector(`.alley`).insertAdjacentHTML(`beforeend`, array_articles[el].articleContent);

        document.querySelector(`.carousel-inner`).appendChild(carouselItem);
    }

    let a = document.createElement(`a`);
    a.className = "close closeArticles";
    a.innerHTML = "[x]";
    document.querySelector(`.carousel-inner`).insertAdjacentElement(`afterbegin`, a);
    document.querySelector(`.closeArticles`).addEventListener(`click`, () => {

        for (let el of document.querySelectorAll(`[data-slide-to]`)) {

            if (el.className.includes(`active`)) {
                el.classList.toggle(`active`);
                break;
            }
        }

        document.querySelector(`.carousel-item.active`).classList.toggle(`active`);
        document.querySelector(`.cardsContainer`).classList.toggle(`hidden`);

        if (document.getElementById(`SearchArticle`).value.replace(/\s+/g, ' ').trim()) {
            return;
        }
        ShowArticles(window.articlesFromLS);
        reattachListeners();

    });
}

function inputValues(values) {

    let ckeditor = CKEDITOR.instances.articleContent,
        name = document.querySelector(`[name = "articleName"]`),
        description = document.querySelector(`[name = "articleDescription"]`);
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

function EditArticle() {

    window.actionForm.setAttribute(`data-action`, `edit`);
    window.page_content_wrapper.classList.add(`show`);
    window.articlesFromLS.filter(article => {
        if (article.articleId === window.id) {
            document.querySelector("footer").scrollIntoView({
                behavior: "smooth", block: "end",
                inline: "nearest"
            });
            inputValues(article);
        }
    });
}

function DeleteArticle() {

    window.articlesFromLS.filter(article => {
        if (article.articleId === window.id) {
            let idx = window.articlesFromLS.indexOf(article);
            if (idx != -1) {
                window.articlesFromLS.splice(idx, 1);
                localStorage.setItem(`Articles`, JSON.stringify(window.articlesFromLS));
                if (CheckActiveSearch()) {
                    return;
                }
                CarouselMaket(window.articlesFromLS);
                ShowArticles(window.articlesFromLS);
                reattachListeners();
            }
        }
    });
}

function reattachListeners() {

    let cardsFix = document.querySelectorAll(`[data-fix-id]`);
    for (let card of cardsFix) {
        card.addEventListener(`click`, event => {
            window.id = +event.target.parentNode.parentNode.dataset.fixId;
            switch (event.target.parentNode.dataset.fix) {
                case `edit`:
                    EditArticle();
                    break;
                case `delete` :
                    DeleteArticle();
                    break;
            }
        });
    }
    let cardsDescript = document.querySelectorAll(`[data-article-number`);
    for (let card of cardsDescript) {
        card.addEventListener(`click`, CarouselShowHide);
    }
}

function CarouselShowHide(event) {

    event = +event.target.dataset.articleNumber;
    document.querySelector(`.cardsContainer`).classList.toggle(`hidden`);
    [document.querySelector(`.carousel-indicators`).querySelectorAll(`[data-target]`)[event],
        document.querySelector(`.carousel-inner`).getElementsByClassName(`carousel-item`)[event]]
        .map(x => x.classList.toggle(`active`));
}


