'use strict';

// ELEMENTS
const header = document.querySelector('.header');
const stickyLogo = document.querySelector('.sticky-logo-container');
const nav = document.querySelector('.nav');
const navHeight = nav.getBoundingClientRect().height;

const navLinks = document.querySelectorAll('.nav__link');
const allSections = document.querySelectorAll('.section');
const allNavLinks = document.querySelector('.nav__list');

const lastItem = document.querySelector('.js--nav-item-4');
const stickyArrow = document.querySelector('.sticky__arrow');
const navArrow = document.querySelector('.nav__arrow');
// For Sticky
const widthBelow672px = window.matchMedia('(max-width: 42em)');
// For Regular
const widthBelow576px = window.matchMedia('(max-width: 36em)');

///////////////////
// Observer - Toggle Sticky Nav
const stickyNav = function (entries) {
  const [entry] = entries;
  //   console.log(entry);
  if (!entry.isIntersecting) {
    stickyArrow.classList.remove('visibleNo');
    nav.classList.add('sticky');
    stickyLogo.classList.remove('hidden');
  } else {
    stickyArrow.classList.add('visibleNo');
    nav.classList.remove('sticky');
    stickyLogo.classList.add('hidden');
  }
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  rootMargin: `-${navHeight}px`,
  threshold: 0,
});
headerObserver.observe(header);

///////////////////
// Section Observer - Navigation - Toggle Active Class
const toggleAct = function (entries) {
  const entry = entries.find(oneEntry => oneEntry.isIntersecting);

  // if 'find' returns undefined:
  if (!entry) return;

  const sectionID = '#' + entry.target.id;
  let foundID;
  let siblings = [];
  for (const link of navLinks) {
    link.getAttribute('href') === sectionID
      ? (foundID = link)
      : siblings.push(link);
  }

  siblings.forEach(sib => sib.classList.remove('nav__link--active'));
  foundID.classList.add('nav__link--active');
};

const sectionObs = new IntersectionObserver(toggleAct, {
  root: null,
  threshold: 0.4,
});

allSections.forEach(section => sectionObs.observe(section));

///////////////////
// Dynamic Arrows (Mobile Navigation)
const toggleStickyArrow = function (entries) {
  const [entry] = entries;
  !entry.isIntersecting
    ? stickyArrow.classList.remove('hidden')
    : stickyArrow.classList.add('hidden');
};
const toggleNavArrow = function (entries) {
  const [entry] = entries;
  !entry.isIntersecting
    ? navArrow.classList.remove('hidden')
    : navArrow.classList.add('hidden');
};

const obsMobileSticky = new IntersectionObserver(toggleStickyArrow, {
  root: nav,
  rootMargin: '-10px',
  threshold: 1,
});
const obsMobileNav = new IntersectionObserver(toggleNavArrow, {
  root: nav,
  threshold: 1,
});

function checkWidth() {
  if (widthBelow672px.matches) {
    obsMobileSticky.observe(lastItem);
  } else {
    obsMobileSticky.unobserve(lastItem);
    stickyArrow.classList.add('hidden');
  }

  if (widthBelow576px.matches) {
    obsMobileNav.observe(lastItem);
  } else {
    obsMobileNav.unobserve(lastItem);
    navArrow.classList.add('hidden');
  }
}
checkWidth();
widthBelow672px.addEventListener('change', checkWidth);
widthBelow576px.addEventListener('change', checkWidth);

///////////////////
// Scroll to Section on Click
const smoothScroll = function (ev) {
  ev.preventDefault();
  // ^ prevents #anchor from appearing in the address bar

  if (ev.target.classList.contains('nav__link')) {
    const id = ev.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });

    ev.target.blur();
  }
};
allNavLinks.addEventListener('click', smoothScroll);

///////////////////
// Lazy Load Images

// image switching HTML format ---      <img srcset="img/KHibey-min-1x.webp 300w, img/KHibey-min-2x.webp 600w" sizes="(max-width: 75em) 15vw, (max-width: 34.375em) 27vw, 180px" alt="" src="img/KHibey-min-2x.webp" height="180" width="271" class="therapist-details__photo" draggable="false"/>
// ...unrelated...

const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  console.log(entries);
  // TODO: began adapting. here's where you stopped. it's just triggering two at a time. like you told it to
  const [right, left] = entries;
  if (!right.isIntersecting) return;
  right.target.src = right.target.dataset.src;
  if (left) left.target.src = left.target.dataset.src;
  right.target.addEventListener('load', function () {
    right.target.classList.remove('lazy-img');
  });
  if (left) {
    left.target.addEventListener('load', function () {
      left.target.classList.remove('lazy-img');
    });
  }
  observer.unobserve(right.target);
  if (left) observer.unobserve(left.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  rootMargin: '200px',
  threshold: 0,
});
imgTargets.forEach(img => imgObserver.observe(img));

///////////////////
// Toggle Displayed Content Based on Select Element (Switch Between Menu Categories)
const inputCategory = document.querySelector('.menu__dropdown');
const allMenuItems = document.querySelectorAll('.menu__items-grid');
// const appetizers = document.querySelector('.js--appetizers');
// const soups = document.querySelector('.js--soups-salads');
// const mainCourses = document.querySelector('.js--main-courses');
// const desserts = document.querySelector('.js--desserts');
// const beverages = document.querySelector('.js--beverages');
const toggleMenuCategory = function (ev) {
  console.log(inputCategory.selectedIndex);
  const index = inputCategory.selectedIndex;
  // take the index ..

  // remove 'visible-grid' from all elements w a class of menu__items-grid (forEach loop, ternary)
  // add 'visible-grid' to element with dataAttribute[index]
  // if item has dataset.category equal to index, add class
  allMenuItems.forEach(item =>
    +item.dataset.category !== index
      ? item.classList.remove('visible-grid')
      : item.classList.add('visible-grid')
  );
};
inputCategory.addEventListener('change', toggleMenuCategory);

///////////////////
// Footer Date (Year)
const footerDate = document.querySelector('.display-date');
footerDate.innerHTML = new Date().getFullYear();

///////////////////////////////////////
// TODO:
// (2) check it out later, when doing form validation... tho they explicitly say it's not the most optimal solution anymore.
// (2) https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
