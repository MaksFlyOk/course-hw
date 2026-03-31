'use strict'

import {InitArticlesList} from "./modules/constants.js"

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
let articlesList = []
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

    Array.from(elements).filter((element) => !!element.name).forEach(element => result[element.name] = element.value);

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

const renderArticle = (article) => {
    const ClonedArticleNode = ArticleTemplate.content.cloneNode(true);
    const ImageNode = ClonedArticleNode.getElementById('article-image')
    const DateNode = ClonedArticleNode.getElementById('article-date')

    ClonedArticleNode.getElementById('article-title').textContent = article.title;
    ClonedArticleNode.getElementById('article-description').textContent = article.description;

    ImageNode.setAttribute('src', article.image);
    ImageNode.setAttribute('alt', `Обложка статьи ${article.title}`);

    DateNode.textContent = new Date(article.date).toLocaleString("ru-RU", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).replace(' г.', '');
    DateNode.setAttribute('datetime', article.date);

    ClonedArticleNode.getElementById('article-delete-button').setAttribute("data-delete", article.id);

    ArticlesList.prepend(ClonedArticleNode);
}

/**
 * Было принято решение добавить проверку данных для рендеринга статьи,
 * так как входные данные при добавлении в LocalStorage хоть и проверяются встроенными средствами HTML,
 * но после они могут быть изменены пользователем
 */
const checkData = (article) => {
    return new Promise((resolve) => {
        if (!article.title || !article.description || !article.image || !article.date) {
            console.error(`Отсутствуют обязательные поля статьи id-${article.id}:`, article);
            resolve(false);
            return;
        }

        if (isNaN(new Date(article.date).getTime())) {
            console.error(`Некорректный формат даты статьи id-${article.id}:`, article.date);
            resolve(false);
            return;
        }

        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => {
            console.error(`Некорректный путь до изображения статьи id-${article.id}:`, article.image);
            resolve(false);
        };
        img.src = article.image;
    })
}

/**
 * Так как в функции проверки данных присутствует асинхронная проверка пути
 * до обложки статьи, то есть необходимость в функции которая будет сохранять порядок
 * добавления статьей (по дате создания)
 */
const renderArticlesInOrder = async (articles) => {
    const promises = articles.map((article) => checkData(article));
    const results = await Promise.all(promises);

    articles.forEach((article, index) => {
        if (results[index]) {
            renderArticle(article);
        }
    })
}

const initArticlesList = async () => {
    const StorageArticlesList = localStorage.getItem("articlesList");

    if (StorageArticlesList) {
        articlesList = JSON.parse(StorageArticlesList);
    } else {
        articlesList = InitArticlesList;

        localStorage.setItem("articlesList", JSON.stringify(articlesList));
    }

    await renderArticlesInOrder(articlesList);
}

const updateStorageArticlesList = (articlesList) => {
    localStorage.setItem("articlesList", JSON.stringify(articlesList));
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
        const newArticleData = {
            id: crypto.randomUUID(),
            title: FormData.title,
            description: FormData.content,
            image: getRandomImage(),
            date: new Date().toISOString().slice(0, 10)
        }

        articlesList.push(newArticleData);
        updateStorageArticlesList(articlesList);
        renderArticle(newArticleData);

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

    const deleteAttribute = event?.target.attributes["data-delete"];

    if(deleteAttribute) {
        const currentArticle = event.target.closest("li");
        removeArticleTextNodes(currentArticle);
        currentArticle.remove();

        articlesList.splice(articlesList.findIndex(article => article.id === Number(deleteAttribute.value)), 1);
        updateStorageArticlesList(articlesList);

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
    if (event.target === ArticlesStatDialog) {
        ArticlesStatDialog.close('backdrop');
    }
});

//Init
updateArticlesStat();
await initArticlesList();