const URL = 'https://gorest.co.in/public-api/posts';

function createPageTitle(title) {
  const appTitle = document.createElement('h1');
  appTitle.classList.add('py-4');
  appTitle.innerHTML = title;
  return appTitle;
}

function createBlogList(posts, page) {
  const blogList = document.createElement('div');
  blogList.classList.add('list-group', 'mb-3');

  posts.forEach((post) => {
    const linkItem = document.createElement('a');
    linkItem.setAttribute('href', `post.html?page=${page}&id=${post.id}`);
    linkItem.setAttribute('target', '_blank');
    linkItem.classList.add('list-group-item', 'list-group-item-action');
    linkItem.textContent = post.title;
    blogList.append(linkItem);
  });

  return blogList;
}

async function getPosts() {
  const pageParams = new URLSearchParams(window.location.search);
  const page = pageParams.get('page') || 1;
  const posts = await fetch(`${URL}?page=${page}`)
    .then((response) => response.json())
    .then((response) => {
      const items = response.data.map((item) => {
        const post = {};
        post.id = item.id;
        post.title = item.title;
        return post;
      });
      return createBlogList(items, page);
    });
  return posts;
}

function paginator(total, count) {
  const nav = document.createElement('nav');
  const navList = document.createElement('ul');

  const pageParams = new URLSearchParams(window.location.search);
  let pageInit = parseInt(pageParams.get('page') || 1, 10) - count / 2;
  pageInit = Math.max(pageInit, 1);
  pageInit = Math.min(pageInit, total - count + 1);

  const nums = Math.min(total, count);
  const pages = [];

  navList.classList.add('pagination', 'justify-content-center');
  nav.append(navList);

  function createItem(page, text) {
    const navItem = document.createElement('li');
    const navLink = document.createElement('a');
    navItem.classList.add('page-item');
    navLink.classList.add('page-link');
    navLink.setAttribute('href', `index.html?page=${page}`);
    navLink.textContent = text;

    navList.append(navItem);
    navItem.append(navLink);
    return navItem;
  }

  const prevBtn = createItem('', '<<');
  for (let i = 0; i < nums; i++) {
    pages[i] = {
      item: createItem(i + pageInit, i + pageInit),
      value: i + 1 + pageInit,
      link() {
        return `index.html?page=${this.value}`;
      },
    };
  }
  const nextBtn = createItem('', '>>');

  function refill(x) {
    let y = pages[0].value + x;
    y = Math.max(y, 1);
    y = Math.min(y, total - count + 1);

    pages.reduce((result, n) => {
      n.value = y;
      y += 1;
      return result;
    }, []);

    pages.forEach((page) => {
      const a = page.item.firstChild;
      a.textContent = page.value;
      a.setAttribute('href', page.link());
    });
  }

  prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    refill(-1);
  });

  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    refill(1);
  });

  return nav;
}

async function createBlogPage() {
  const header = document.querySelector('.header');
  const main = document.querySelector('.main');

  const pageTitle = createPageTitle('Список статей блога');
  const blogList = await getPosts();

  const pages = await fetch(URL)
    .then((response) => response.json())
    .then((response) => {
      const p = response.meta.pagination.pages;
      return p;
    });
  const blogPagination = paginator(pages, 20);

  header.append(pageTitle);
  main.append(blogPagination);
  main.append(blogList);
}

window.createBlogPage = createBlogPage;
