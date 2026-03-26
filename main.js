'use strict'

// HTML elements
const AddArticleFormContainer = document.getElementById('add-article');
const AddArticleForm = document.forms["add-article-form"]
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
    StatArticlesQuantity.textContent = ArticlesStat.articlesQuantity.toString()
    StatArticlesCommentsQuantity.textContent = ArticlesStat.articlesCommentsQuantity.toString()
}

const setAddArticleFormContainerState = (state) => {
    if (state) {
        AddArticleFormContainer.removeAttribute('data-hidden');
        AddArticleFormContainer.scrollIntoView();
    } else {
        AddArticleFormContainer.setAttribute('data-hidden', '');
    }

    isOpenAddArticleForm = !isOpenAddArticleForm
}

// Events
AddArticleFormOpenButton.addEventListener('click', (event) => {
    event.preventDefault();

    setAddArticleFormContainerState(isOpenAddArticleForm);
})

AddArticleForm.addEventListener("reset", (event) => {
    event.preventDefault();

    setAddArticleFormContainerState(false);
})

AddArticleForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const ClonedArticleNode = ArticleTemplate.content.cloneNode(true);

    ClonedArticleNode.getElementById('article-title').textContent = MockArticle.title;
    ClonedArticleNode.getElementById('article-description').textContent = MockArticle.description;
    ClonedArticleNode.getElementById('article-date').textContent = new Date().toLocaleString("ru-RU", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).replace(' г.', '');

    ArticlesList.append(ClonedArticleNode);
    setAddArticleFormContainerState(false);

    ArticlesStat.articlesQuantity++;
    updateArticlesStat()
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

