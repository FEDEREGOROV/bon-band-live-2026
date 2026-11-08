(() => {
  'use strict';
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.nav');
  const closeMenu = () => {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Открыть меню');
  };
  menuButton.addEventListener('click', () => {
    const opened = menuButton.getAttribute('aria-expanded') !== 'true';
    navigation.classList.toggle('is-open', opened);
    menuButton.setAttribute('aria-expanded', String(opened));
    menuButton.setAttribute('aria-label', opened ? 'Закрыть меню' : 'Открыть меню');
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => {
    if (!event.target.closest('.header')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });
  matchMedia('(min-width: 851px)').addEventListener('change', closeMenu);

  const track = document.querySelector('#band-track');
  const scrollButtons = [...document.querySelectorAll('[data-scroll]')];
  const updateScroll = () => {
    scrollButtons[0].disabled = track.scrollLeft < 2;
    scrollButtons[1].disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  };
  scrollButtons.forEach(button => button.addEventListener('click', () => {
    const card = track.querySelector('.member');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 15;
    track.scrollBy({ left: Number(button.dataset.scroll) * (card.offsetWidth + gap), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }));
  track.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });
  updateScroll();

  const photos = [...document.querySelectorAll('[data-photo]')];
  const dialog = document.querySelector('.lightbox');
  const image = dialog.querySelector('img');
  const caption = dialog.querySelector('.lightbox-caption');
  let current = 0;
  let trigger = null;
  const showPhoto = index => {
    current = (index + photos.length) % photos.length;
    image.src = photos[current].dataset.photo;
    image.alt = photos[current].querySelector('img').alt;
    caption.textContent = photos[current].dataset.caption;
    document.querySelector('#photo-counter').textContent = `${String(current + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
  };
  photos.forEach((photo, index) => photo.addEventListener('click', () => {
    trigger = photo;
    showPhoto(index);
    dialog.showModal();
    document.body.classList.add('modal-open');
    dialog.querySelector('.lightbox-close').focus();
  }));
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.lightbox-prev').addEventListener('click', () => showPhoto(current - 1));
  dialog.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(current + 1));
  dialog.addEventListener('click', event => {
    if (event.target === dialog || event.target.classList.contains('lightbox-view')) dialog.close();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(current + 1); }
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    trigger?.focus({ preventScroll: true });
  });
  let touchStart = null;
  image.addEventListener('touchstart', event => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
  image.addEventListener('touchend', event => {
    if (touchStart === null) return;
    const distance = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(distance) > 50) showPhoto(current + (distance < 0 ? 1 : -1));
    touchStart = null;
  }, { passive: true });

  const inlineForm = document.querySelector('.inline-registration');
  inlineForm.addEventListener('toggle', () => {
    const frame = inlineForm.querySelector('iframe');
    if (inlineForm.open && !frame.hasAttribute('src')) frame.src = frame.dataset.src;
  });
})();
