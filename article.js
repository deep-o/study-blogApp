const URL = 'https://gorest.co.in/public-api/';
const POSTS = 'posts';
const COMMENTS = 'comments';

function createPageTitle(title) {
  const appTitle = document.createElement('h1');
  appTitle.classList.add('py-4');
  appTitle.innerHTML = title;
  return appTitle;
}

function createArticle(text) {
  const block = document.createElement('p');
  block.classList.add('fw-normal', 'fs-4');
  block.textContent = text;
  return block;
}

function createComentsList(comments) {
  const list = document.createElement('ul');

  for (const item of comments) {
    const listItem = document.createElement('li');
    const itemTitle = document.createElement('div');
    const itemContent = document.createElement('div');

    listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
    itemTitle.classList.add('fw-bold');
    itemContent.classList.add('ms-2', 'me-auto');

    itemTitle.textContent = item.name;
    itemContent.textContent = item.comment;

    list.append(listItem);
    listItem.append(itemContent);
    itemContent.prepend(itemTitle);
  }

  list.classList.add('list-group');

  return list;
}

async function createArticlePage() {
  const header = document.querySelector('.header');
  const main = document.querySelector('.main');

  const pageParams = new URLSearchParams(window.location.search);
  const id = pageParams.get('id') ?? 1;

  const article = await fetch(`${URL}${POSTS}?id=${id}`)
    .then((response) => response.json())
    .then((response) => {
      const art = response.data.map((item) => {
        const elem = {};
        elem.title = item.title;
        elem.body = item.body;
        return elem;
      });
      return art[0];
    });

  const comments = await fetch(`${URL}${COMMENTS}?post_id=${id}`)
    .then((response) => response.json())
    .then((response) => {
      const art = response.data.map((item) => {
        const elem = {};
        elem.name = item.name;
        elem.comment = item.body;
        return elem;
      });
      return art;
    });

  const pageTitle = createPageTitle(article.title);
  const content = createArticle(article.body);
  const commentsBlock = createComentsList(comments);

  // header.append(backBtn);
  header.append(pageTitle);
  main.append(content);
  main.append(commentsBlock);
}

window.createArticlePage = createArticlePage;
