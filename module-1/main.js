'use strict'

import {InitArticlesList, localStorageArticlesListKey} from "./modules/constants.js";

// HTML elements
const addArticleFormContainer = document.getElementById('add-article');
const addArticleForm = document.forms["add-article-form"];
const articlesStatDialog = document.getElementById('articlesStatDialog');
const articlesLoader = document.getElementById('articles-loader');
const articlesList = document.getElementById('articles-list');
const statArticlesQuantity = document.getElementById('stat-articles-quantity');
const modalCloseButton = document.getElementById('modal-close-btn');
const statArticlesCommentsQuantity = document.getElementById('stat-articles-comments-quantity');
const articleTemplate = document.getElementById('article-template');
const [addArticleFormOpenButton, articlesStatOpenButton] = document.getElementById('side-menu').children;

// Vars
const ArticlesStat = {
    articlesQuantity: 0,
    articlesCommentsQuantity: 0 // Пока неоткуда получать комментарии, так что просто 0
};
/**
 * Для хранения списка статей по факту есть 2 варианта:
 *  - Хранить их только в LocalStorage
 *  - Хранить их еще и в переменной
 * Взвесив плюсы и минусы было принято решение хранить их в коде, в таком варианте
 * больше гибкости по управлению данными, меньше запросов к LocalStorage(получение при инициализации,
 * и обновление при удалении статьи)
 */
let articlesListStorage = [];
let isOpenAddArticleForm = true;

// Functions
const updateArticlesStat = () => {
    statArticlesQuantity.textContent = ArticlesStat.articlesQuantity.toString();
    statArticlesCommentsQuantity.textContent = ArticlesStat.articlesCommentsQuantity.toString();
}

const setAddArticleFormContainerState = (state) => {
    if (state) {
        addArticleFormContainer.removeAttribute('data-hidden');
        addArticleFormContainer.scrollIntoView();
    } else {
        addArticleFormContainer.setAttribute('data-hidden', '');
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
    ];

    return images[Math.floor(Math.random() * images.length)];
}

const toggleLoader = (show) => {
    if (articlesLoader) {
        articlesLoader.hidden = !show;
    }
};

const simulateNetworkDelay = (ms = 1000) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

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
    const ClonedArticleNode = articleTemplate.content.cloneNode(true);
    const ImageNode = ClonedArticleNode.getElementById('article-image');
    const DateNode = ClonedArticleNode.getElementById('article-date');

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

    articlesList.prepend(ClonedArticleNode);
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
    const results = await Promise.all(articles.map((article) => checkData(article)));

    articles.forEach((article, index) => {
        if (results[index]) {
            renderArticle(article);
        }
    })
}

const initArticlesList = async () => {
    toggleLoader(true);

    await simulateNetworkDelay();

    const StorageArticlesList = localStorage.getItem(localStorageArticlesListKey);

    if (StorageArticlesList) {
        articlesListStorage = JSON.parse(StorageArticlesList);
    } else {
        articlesListStorage = InitArticlesList;

        localStorage.setItem(localStorageArticlesListKey, JSON.stringify(articlesListStorage));
    }

    ArticlesStat.articlesQuantity = articlesListStorage.length;
    updateArticlesStat();

    await renderArticlesInOrder(articlesListStorage);

    toggleLoader(false);
}

const toggleEnabledFormElements = (form, enabled) => {
    const { elements } = form;

    Array.from(elements).forEach(element => element.disabled = !enabled);
}

const updateStorageArticlesList = (articlesListStorage) => {
    localStorage.setItem(localStorageArticlesListKey, JSON.stringify(articlesListStorage));
}

// Events
addArticleFormOpenButton.addEventListener('click', (event) => {
    event.preventDefault();

    setAddArticleFormContainerState(isOpenAddArticleForm);
})

addArticleForm.addEventListener("reset", () => {
    setAddArticleFormContainerState(false);
})

addArticleForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if(addArticleForm.checkValidity()) {
        const FormData = getFormData(addArticleForm);
        const newArticleData = {
            id: crypto.randomUUID(),
            title: FormData.title,
            description: FormData.content,
            image: getRandomImage(),
            date: new Date().toISOString().slice(0, 10)
        };

        toggleEnabledFormElements(addArticleForm, false);
        await simulateNetworkDelay();

        articlesListStorage.push(newArticleData);
        updateStorageArticlesList(articlesListStorage);
        renderArticle(newArticleData);

        /*
        В данной функции нет необходимости т.к. при сбросе вызывается событие сброса,
        где уже скрывается форма
        setAddArticleFormContainerState(false);
         */
        toggleEnabledFormElements(addArticleForm, true);
        addArticleForm.reset();

        ArticlesStat.articlesQuantity++;
        updateArticlesStat();
    }
})

articlesList.addEventListener('click', (event) => {
    event.preventDefault();

    const deleteAttribute = event?.target.attributes["data-delete"];

    if(deleteAttribute) {
        const currentArticle = event.target.closest("li");
        removeArticleTextNodes(currentArticle);
        currentArticle.remove();

        articlesListStorage.splice(articlesListStorage.findIndex(article => article.id === deleteAttribute.value), 1);
        updateStorageArticlesList(articlesListStorage);

        ArticlesStat.articlesQuantity--;
        updateArticlesStat();
    }
})

articlesStatOpenButton.addEventListener('click', (event) => {
    event.preventDefault();

    articlesStatDialog.showModal();
})

modalCloseButton.addEventListener('click', (event) => {
    event.preventDefault();

    articlesStatDialog.close();
})

articlesStatDialog.addEventListener('click', function(event) {
    if (event.target === articlesStatDialog) {
        articlesStatDialog.close('backdrop');
    }
});

//Init
updateArticlesStat();
await initArticlesList();
