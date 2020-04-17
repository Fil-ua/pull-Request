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