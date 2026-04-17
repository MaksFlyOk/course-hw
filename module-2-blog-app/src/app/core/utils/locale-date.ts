export const localeDate = (date: string) => {
  return new Date(date)
    .toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    .replace(' г.', '');
};
