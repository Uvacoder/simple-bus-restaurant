'use strict';

/////// ELEMENTS
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

const imgTargets = document.querySelectorAll('img[data-src]');
const imgFallbacks = document.querySelectorAll('img[data-fallback]');

const inputCategory = document.querySelector('.menu__dropdown');
const allMenuItems = document.querySelectorAll('.menu__items-grid');

///////////////////
// Observer - Toggle Sticky Nav
const stickyNav = function (entries) {
  const [entry] = entries;
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
  if (!entry) return;

  const sectionID = '#' + entry.target.id;
  let foundID;
  Array.from(navLinks, link => {
    if (link.getAttribute('href') === sectionID) foundID = link;
  });

  navLinks.forEach(link => link.classList.remove('nav__link--active'));
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

const options = { root: nav, threshold: 1 };

const obsMobileSticky = new IntersectionObserver(toggleStickyArrow, options);
const obsMobileNav = new IntersectionObserver(toggleNavArrow, options);

const checkWidth = function () {
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
};
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
const removeLazyImg = ev => ev.target.classList.remove('lazy-img');

const loadImg = function (entries, observer) {
  // Get the targets
  const [first, ...rest] = entries;
  if (!first.isIntersecting) return;

  // Set new data-src
  first.target.src = first.target.dataset.src;
  if (rest[0]) rest.map(el => (el.target.src = el.target.dataset.src));

  // Add listeners for removing blur effect
  first.target.addEventListener('load', removeLazyImg);
  if (rest[0])
    rest.map(el => el.target.addEventListener('load', removeLazyImg));
  // TODO: @ later date: remove the listeners

  // Unobserve targets
  observer.unobserve(first.target);
  if (rest[0]) rest.map(el => observer.unobserve(el.target));
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  rootMargin: '200px',
  threshold: 0,
});
imgTargets.forEach(img => imgObserver.observe(img));

///////////////////
// Graceful Degradation - webp to png/jpg
const gracefulImg = ev => (ev.target.src = ev.target.dataset.fallback);
imgFallbacks.forEach(el => el.addEventListener('error', gracefulImg));

///////////////////
// Toggle Displayed Content Based on State of Select Element (Switch Between Menu Categories)
const toggleMenuCategory = function (ev) {
  // index = the selected input
  const index = inputCategory.selectedIndex;

  // Loop menu content, display the content that matches the index
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
