(function () {
    window.page_content_wrapper = document.querySelector(`.page-content-wrapper`);
    window.articlesCounter = counter();
    window.actionForm = document.querySelector(`[data-action]`);
    window.card = new Card();
    window.carousel = new Carousel();
    window.articlesFromLS = localStorage.getItem(`Articles`) ?
        JSON.parse(localStorage.getItem(`Articles`)) : [];

    authData.find(x => {
        if (x.isLogin) {
            window.nickName = x.sNickName;
        }
    });

    window.card.Show(window.articlesFromLS);
    window.carousel.Create(window.articlesFromLS);
    reattachListeners();


    ["closeContent", "addContent"].map(x => document.querySelector(`.${x}`)
        .addEventListener(`click`, () => {
            inputValues();
            window.page_content_wrapper.classList.toggle("show");
            setTimeout(() => {
                scrollTo();
            }, 10);
            window.actionForm.setAttribute(`data-action`, `save`);

        }));

    document.getElementById('createContent').addEventListener(`click`, () => {
        let action = window.actionForm.getAttribute(`data-action`);
        switch (action) {
            case `save` :
                scrollTo();
                checkValuesArticle();
                document.getElementById(`SearchArticle`).value = "";
                localStorage.setItem(`articlesCounter`, articlesCounter());
                addArticleToStorage(window.valuesChecked);
                window.card.Show(window.articlesFromLS);
                window.carousel.Create(window.articlesFromLS);
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
                            return;
                        }
                        window.card.Show(window.articlesFromLS);
                        window.carousel.Create(window.articlesFromLS);
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
        window.card.Show(window.articlesFromLS);
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
        document.getElementById(`logout`).modal();
        authData.find(x => {
            delete x.isLogin
        });
        localStorage.setItem(`authData`, JSON.stringify(authData));
        window.location.href = `../registration/start.html`;
    });

})();

function reattachListeners() {
    let cardsFix = document.querySelectorAll(`[data-fix-id]`);
    for (let el of cardsFix) {
        el.addEventListener(`click`, event => {
            window.id = +event.target.parentNode.parentNode.dataset.fixId;
            switch (event.target.parentNode.dataset.fix) {
                case `edit`:
                    window.card.Edit();
                    break;
                case `delete` :
                    window.card.Delete();
                    break;
            }
        });
    }
    let cardsDescript = document.querySelectorAll(`[data-article-number`);
    for (let el of cardsDescript) {
        el.addEventListener(`click`, window.carousel.ToggleOpen);
    }
}

function checkValuesArticle() {
    window.valuesChecked = {
        articleName: document.querySelector(`[name="articleName"]`).value,
        articleDescription: document.querySelector(`[name="articleDescription"]`).value,
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
    window.articlesFromLS.push(article);
    localStorage.setItem(`Articles`, JSON.stringify(window.articlesFromLS));
    console.log(window.articlesFromLS);
}

function SearchArticles() {
    CheckIfHiddenCardsContent();
    let searchArticleName = document.getElementById(`SearchArticle`).value.replace(/\s+/g, ' ').trim();
    if (!searchArticleName || searchArticleName.length < 3) {
        window.card.Show(window.articlesFromLS);
        window.carousel.Create(window.articlesFromLS);
    } else {
        let filteredArticles = window.articlesFromLS.filter(x => {
            if (x.articleName.toLowerCase().indexOf(searchArticleName.toLowerCase()) != -1) {
                return x;
            }
        });
        if (filteredArticles.length) {
            window.card.Show(filteredArticles);
            window.carousel.Create(filteredArticles);
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

function counter() {
    let count = localStorage.getItem(`articlesCounter`) || 0;
    return () => count++;
}

/*function DeleteArticle() {

    window.articlesFromLS.filter(article => {
        if (article.articleId === window.id) {
            let idx = window.articlesFromLS.indexOf(article);
            if (idx != -1) {
                window.articlesFromLS.splice(idx, 1);
                localStorage.setItem(`Articles`, JSON.stringify(window.articlesFromLS));
                if (CheckActiveSearch()) {
                    return;
                }
                carousel.Create(window.articlesFromLS);
                window.card.Show(window.articlesFromLS);
                reattachListeners();
            }
        }
    });
}*/

/*function EditArticle() {

    window.actionForm.setAttribute(`data-action`, `edit`);
    window.page_content_wrapper.classList.add(`show`);
    window.articlesFromLS.filter(article => {
        if (article.articleId === window.id) {
            scrollTo();
            inputValues(article);
        }
    });
}*/

/*function ShowArticles(arrayArticle) {
    document.querySelector(`.cardsContainer`).innerHTML = "";
    for (let i = 0; i < arrayArticle.length; i++) {
        createCard(arrayArticle[i]);
        document.querySelectorAll(`.cardsContainer .card-text`)[i]
            .setAttribute(`data-article-number`, `${i}`);
    }
}*/

/*function createCard(values) {

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
}*/

/*function CarouselMaket(array_articles) {

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
        carouselItem.querySelector(`.carousel-date`).innerHTML = card.updateDate(array_articles[el].articleLastDate);
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
        card.Show(window.articlesFromLS);
        reattachListeners();

    });
}*/

/*function CarouselShowHide(event) {

    event = +event.target.dataset.articleNumber;

    document.querySelector(`.cardsContainer`).classList.toggle(`hidden`);
    [document.querySelectorAll(`.carousel-indicators [data-target]`)[event],
        document.querySelectorAll(`.carousel-inner .carousel-item`)[event]]
        .map(x => x.classList.toggle(`active`));

}*/

/*function updateDate(date) {

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
}*/
