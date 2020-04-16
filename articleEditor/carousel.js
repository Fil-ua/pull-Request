function Carousel() {

    this.Create = function (array_articles) {
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
            carouselItem.querySelector(`.carousel-date`).innerHTML = window.card.updateDate(array_articles[el].articleLastDate);
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
            window.card.Show(window.articlesFromLS);
            reattachListeners();

        });
    };

    this.ToggleOpen = function (event) {
        event = +event.target.dataset.articleNumber;
        document.querySelector(`.cardsContainer`).classList.toggle(`hidden`);
        [document.querySelectorAll(`.carousel-indicators [data-target]`)[event],
            document.querySelectorAll(`.carousel-inner .carousel-item`)[event]]
            .map(x => x.classList.toggle(`active`));
    }
}