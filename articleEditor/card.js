function Card () {

    this.Show = function(arrayArticle) {
        document.querySelector(`.cardsContainer`).innerHTML = "";
        for (let i = 0; i < arrayArticle.length; i++) {
            this.Сreate(arrayArticle[i]);
            document.querySelectorAll(`.cardsContainer .card-text`)[i]
                .setAttribute(`data-article-number`, `${i}`);
        }
    };

    this.Сreate = function(values) {
        let newCard = document.querySelector(`.card.hidden`).cloneNode(true);
        let newCardEvent = document.querySelector(`.cardEvent.hidden`).cloneNode(true);
        newCard.querySelector(`.card-title`).innerHTML = values.articleName;
        newCard.querySelector(`.badge`).innerHTML = values.articlenickName;
        newCard.querySelector(`.card-text`).innerHTML = values.articleDescription;
        newCard.querySelector(`.text-muted`).innerHTML = "Last updated " + this.updateDate(values.articleLastDate);

        if (values.articlenickName === window.nickName) {
            newCardEvent.setAttribute(`data-fix-id`, `${values.articleId}`);
            newCard.querySelector(`.card-footer`).appendChild(newCardEvent);
        }
        [newCard, newCardEvent].forEach(x => x.classList.remove(`hidden`));
        document.querySelector(`.cardsContainer`).appendChild(newCard);
    };

    this.updateDate = function(date) {
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
    };

    this.Delete = function() {
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
                    this.Show(window.articlesFromLS);
                    reattachListeners();
                }
            }
        });
    };

    this.Edit = function() {
        window.actionForm.setAttribute(`data-action`, `edit`);
        window.page_content_wrapper.classList.add(`show`);
        window.articlesFromLS.filter(article => {
            if (article.articleId === window.id) {
                scrollTo();
                inputValues(article);
            }
        });
    }
}

