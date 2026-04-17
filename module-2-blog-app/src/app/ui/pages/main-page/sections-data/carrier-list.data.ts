import { ListSectionModel } from '@models/list-section.model';

export const carrierListData: ListSectionModel = {
  title: 'Моя карьера',
  description:
    'Постоянно развиваюсь в области веб-разработки, изучаю новые технологии и применяю их на практике в личных и учебных проектах',
  list: [
    {
      title: 'Старший веб-разработчик',
      subtitle: 'ООО "DigitalStudio" (2022 — по настоящее время)',
      description:
        'Руководство командой из 4 разработчиков, разработка архитектуры фронтенда, менторство младших специалистов, внедрение новых технологий в рабочий процесс.',
      img: {
        src: 'images/work/work-img1.webp',
        alt: 'Логотип компании DigitalStudio',
      },
    },
    {
      title: 'Веб-разработчик',
      subtitle: 'ООО "CreativeAgency" (2019 — 2022)',
      description:
        'Создание корпоративных сайтов и веб-приложений на React и Vue.js, оптимизация производительности, работа с клиентами и сбор требований.',
      img: {
        src: 'images/work/work-img2.webp',
        alt: 'Логотип компании CreativeAgency',
      },
    },
    {
      title: 'Фронтенд-разработчик',
      subtitle: 'Стартап "TechVenture" (2018 — 2019)',
      description:
        'Разработка пользовательского интерфейса для платформы e-learning, работа с REST API и веб-стандартами.',
      img: {
        src: 'images/work/work-img3.webp',
        alt: 'Логотип компании TechVenture',
      },
    },
  ],
};
