'use strict'

// HTML elements
const AddArticleFormContainer = document.getElementById('add-article');
const AddArticleForm = document.forms["add-article-form"];
const ArticlesStatDialog = document.getElementById('articlesStatDialog');
const ArticlesList = document.getElementById('articles-list');
const StatArticlesQuantity = document.getElementById('stat-articles-quantity');
const ModalCloseButton = document.getElementById('modal-close-btn');
const StatArticlesCommentsQuantity = document.getElementById('stat-articles-comments-quantity');
const ArticleTemplate = document.getElementById('article-template');
const [AddArticleFormOpenButton, ArticlesStatOpenButton] = document.getElementById('side-menu').children;

// Vars
const ArticlesStat = {
    articlesQuantity: ArticlesList.children.length,
    articlesCommentsQuantity: 0 // Пока неоткуда получать комментарии, так что просто 0
};
const MockArticle = {
    title: "Article title",
    description: "Article description"
};
let isOpenAddArticleForm = true;

// Functions
const updateArticlesStat = () => {
    StatArticlesQuantity.textContent = ArticlesStat.articlesQuantity.toString();
    StatArticlesCommentsQuantity.textContent = ArticlesStat.articlesCommentsQuantity.toString();
}

const setAddArticleFormContainerState = (state) => {
    if (state) {
        AddArticleFormContainer.removeAttribute('data-hidden');
        AddArticleFormContainer.scrollIntoView();
    } else {
        AddArticleFormContainer.setAttribute('data-hidden', '');
    }

    isOpenAddArticleForm = !isOpenAddArticleForm;
}

const getRandomImage = () => {
    const images = [
        "../assets/images/blog/blog-img1.webp",
        "../assets/images/blog/blog-img2.webp",
        "../assets/images/blog/blog-img3.webp",
        "../assets/images/blog/blog-img4.webp",
        "../assets/images/blog/blog-img5.webp",
        "../assets/images/blog/blog-img6.webp",
        "../assets/images/blog/blog-img7.webp"
    ]

    return images[Math.floor(Math.random() * images.length)];
}

const getFormData = (form) => {
    const { elements } = form;
    const result = {};

    Array.from(elements).filter((element) => !!element.name).forEach(element => result[element.name] = element.value)

    return result;
}

/**
 * Данная функция удаляет лишние текстовые узлы находящиеся сверху и снизу статьи,
 * чтобы они не мешали CSS empty определять пуст ли список
 */
const removeArticleTextNodes = (articleElement) => {
    if(articleElement?.previousSibling?.nodeName === "#text") {
        articleElement.previousSibling.remove();
    }

    if(articleElement?.nextSibling?.nodeName === "#text") {
        articleElement.nextSibling.remove();
    }
}

// Events
AddArticleFormOpenButton.addEventListener('click', (event) => {
    event.preventDefault();

    setAddArticleFormContainerState(isOpenAddArticleForm);
})

AddArticleForm.addEventListener("reset", () => {
    setAddArticleFormContainerState(false);
})

AddArticleForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if(AddArticleForm.checkValidity()) {
        const FormData = getFormData(AddArticleForm);
        const ClonedArticleNode = ArticleTemplate.content.cloneNode(true);

        ClonedArticleNode.getElementById('article-title').textContent = FormData.title;
        ClonedArticleNode.getElementById('article-description').textContent = FormData.content;
        ClonedArticleNode.getElementById('article-image').setAttribute('src', getRandomImage());
        ClonedArticleNode.getElementById('article-date').textContent = new Date().toLocaleString("ru-RU", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).replace(' г.', '');

        ArticlesList.append(ClonedArticleNode);
        /*
        В данной функции нет необходимости т.к. при сбросе вызывается событие сброса,
        где уже скрывается форма
        setAddArticleFormContainerState(false);
         */

        AddArticleForm.reset();

        ArticlesStat.articlesQuantity++;
        updateArticlesStat();
    }
})

ArticlesList.addEventListener('click', (event) => {
    event.preventDefault();

    if(event?.target.attributes["data-delete"]) {
        const currentArticle =  event.target.closest("li");
        removeArticleTextNodes(currentArticle);
        currentArticle.remove();

        ArticlesStat.articlesQuantity--;
        updateArticlesStat();
    }
})

ArticlesStatOpenButton.addEventListener('click', (event) => {
    event.preventDefault();

    ArticlesStatDialog.showModal();
})

ModalCloseButton.addEventListener('click', (event) => {
    event.preventDefault();

    ArticlesStatDialog.close();
})

ArticlesStatDialog.addEventListener('click', function(event) {
    if (event.target === ArticlesStatDialog) ArticlesStatDialog.close('backdrop');
});

//Init
updateArticlesStat();