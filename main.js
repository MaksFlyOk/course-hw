'use strict'

// HTML elements
const AddArticleForm = document.getElementById('add-article');
const AddArticleFormResetButton = document.getElementById('add-article-reset');
const AddArticleFormSubmitButton = document.getElementById('add-article-submit');
const ArticlesStatDialog = document.getElementById('articlesStatDialog');
const ArticlesList = document.getElementById('articles-list');
const StatArticlesQuantity = document.getElementById('stat-articles-quantity');
const ModalCloseButton = document.getElementById('modal-close-btn');
const StatArticlesCommentsQuantity = document.getElementById('stat-articles-comments-quantity');
const ArticleTemplate = document.getElementById('article-template');
const [AddArticleFormOpenButton, ArticlesStatOpenButton] = document.getElementById('side-menu').children;

console.log({ArticlesList});

// Vars
const ArticlesStat = {
    articlesQuantity: ArticlesList.children.length,
    articlesCommentsQuantity: 0 // Пока не откуда получать комменатрии, так что просто 0
};
const MockArticle = {
    title: "Article title",
    description: "Article description",
    date: "2026-03-23",
};
let isOpenAddArticleForm = true;

// Functions
const updateArticlesStat = () => {
    StatArticlesQuantity.textContent = ArticlesStat.articlesQuantity.toString()
    StatArticlesCommentsQuantity.textContent = ArticlesStat.articlesCommentsQuantity.toString()
}

const setAddArticleFormState = (state) => {
    if (state) {
        AddArticleForm.removeAttribute('data-hidden');
        AddArticleForm.scrollIntoView();
    } else {
        AddArticleForm.setAttribute('data-hidden', '');
    }

    isOpenAddArticleForm = !isOpenAddArticleForm
}

// Events
AddArticleFormOpenButton.addEventListener('click', (event) => {
    event.preventDefault();

    setAddArticleFormState(isOpenAddArticleForm);
})

AddArticleFormResetButton.addEventListener('click', (event) => {
    event.preventDefault();

    setAddArticleFormState(false);
})

AddArticleFormSubmitButton.addEventListener('click', (event) => {
    event.preventDefault();

    const ClonedArticleNode = ArticleTemplate.content.cloneNode(true);

    ClonedArticleNode.getElementById('article-title').textContent = MockArticle.title;
    ClonedArticleNode.getElementById('article-description').textContent = MockArticle.description;
    ClonedArticleNode.getElementById('article-date').textContent = MockArticle.date;

    ArticlesList.append(ClonedArticleNode);
    setAddArticleFormState(false);

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

