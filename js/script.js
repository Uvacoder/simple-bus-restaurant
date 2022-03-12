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

const contactForm = document.querySelector('.form');
const formInputs = document.querySelectorAll('.form__input');
const formTextarea = document.querySelector('.form__textarea');

const submitBtn = document.querySelector('.form__submit');
const submitResponseBlock = document.querySelector('.submit-clicked');
const contactSection = document.querySelector('.section-contact');

///////////////////
// #region Observer - Toggle Sticky Nav
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
// #endregion Observer - Toggle Sticky Nav

///////////////////
// #region Section Observer - Navigation - Toggle Active Class
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
// #endregion Section Observer

///////////////////
// #region Dynamic Arrows (Mobile Navigation)
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
// #endregion Dynamic Arrows

///////////////////
// #region Scroll to Section on Click
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
// #endregion Scroll to Section on Click

///////////////////
// #region Lazy Load Images
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
// #endregion Lazy Load Images

///////////////////
// Graceful Degradation - webp to png/jpg
const gracefulImg = ev => (ev.target.src = ev.target.dataset.fallback);
imgFallbacks.forEach(el => el.addEventListener('error', gracefulImg));

///////////////////
// Toggle Displayed Content Based on State of Select Element (Switch Between Menu Categories)
const toggleMenuCategory = function (ev) {
  // So the focus state goes away
  ev.target.blur();

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

/////////////////////////////////////////
// #region Validate Form Input
const patterns = {
  name: new RegExp('^[a-z]{2,} [a-z]{2,}$', 'i'),
  // ⌄SEE: ->  https://regex101.com/r/FHsYQi/2
  //   prettier-ignore
  email: new RegExp('^([a-z\\d\\.-]+)@([a-z\\d-]+)\\.([a-z]{2,8})(\\.[a-z]{2,8})?$', 'i'),
  // ⌄ matches everything
  message: new RegExp('^[^]+$'),
};

//////////////////////
// Validate user input
const validate = function (field, regex) {
  if (regex.test(field.value)) {
    field.classList.add('valid');
    field.classList.remove('invalid');
  } else {
    field.classList.add('invalid');
    field.classList.remove('valid');
  }
};

// Callback to Run when Form Receives Input
const passToValidator = function (ev) {
  if (ev.target.type === 'submit' || !ev.target) return;

  validate(ev.target, patterns[ev.target.name]);
};

contactForm.addEventListener('keyup', passToValidator);

//////////////////////
// Handle Various Error States
// When Field is Blurred & Invalid -- Add backgroundColor
// const controlBgColor = ev => {
//   const evT = ev.target;

//   if (evT.required && evT.classList.contains('invalid'))
//     evT.style.backgroundColor = '#f5c6c4';

//   // Remove the background color 3 seconds after blur
//   if (evT.classList.contains('invalid'))
//     setTimeout(() => (evT.style.backgroundColor = '#fff'), 3000);
// };

// // When Field is Focused -- Remove red background color -- for the case of a quick blur/focus
// const removeBgColor = ev => (ev.target.style.backgroundColor = '#fff');

// formInputs.forEach(input => {
//   input.onblur = controlBgColor;
//   input.onfocus = removeBgColor;
// });
// formTextarea.onblur = controlBgColor;
// formTextarea.onfocus = removeBgColor;
// ^ NOTE: it works fine, i just don't like it.
// #endregion Validate Form Input

/////////////////////
// Animated message if user clicks submit on form.
submitBtn.addEventListener('click', handleSubmit);

function handleSubmit(ev) {
  ev.preventDefault();

  contactSection.classList.add('section-override');
  submitResponseBlock.classList.add('fadeInRight');
  submitResponseBlock.classList.remove('hidden');
}

///////////////////
// Footer Date (Year)
const footerDate = document.querySelector('.display-date');
footerDate.innerHTML = new Date().getFullYear();
