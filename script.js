// ==========================================================
// Shaon.archive, small interactions: gallery render, lightbox,
// filter, scroll reveal, lazy video
// ==========================================================

document.getElementById('year').textContent = new Date().getFullYear();

// ---------- gallery: fetch data, render grid ----------
const galleryGrid = document.getElementById('galleryGrid');

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

function renderGallery(photos) {
  galleryGrid.innerHTML = photos
    .map((p) => {
      const classes = ['grid-item'];
      if (p.span) classes.push('span-2');
      if (p.bw) classes.push('bw');
      const tags = (p.tags || []).join(' ');
      return `
      <figure class="${classes.join(' ')}" data-caption="${escapeHtml(p.caption)}" data-tags="${escapeHtml(tags)}">
        <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.alt)}" loading="lazy" />
      </figure>`;
    })
    .join('');
}

fetch('content/gallery.json')
  .then((res) => res.json())
  .then((data) => {
    renderGallery(data.photos || []);
    initGalleryInteractions();
  })
  .catch(() => {
    galleryGrid.innerHTML = '<p class="grid-loading">Couldn&rsquo;t load the gallery right now. Try refreshing the page.</p>';
  });

// ---------- everything that depends on the grid existing ----------
function initGalleryInteractions() {
  // filter
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.grid-item');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      galleryItems.forEach((item) => {
        const tags = (item.dataset.tags || '').split(' ');
        const match = filter === 'all' || tags.includes(filter);
        item.classList.toggle('filtered-out', !match);
      });
    });
  });

  // scroll reveal
  galleryItems.forEach((item) => item.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  galleryItems.forEach((item) => revealObserver.observe(item));

  // lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  const figures = Array.from(document.querySelectorAll('.grid-item'));
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const fig = figures[currentIndex];
    const img = fig.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = fig.dataset.caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showNext(step) {
    currentIndex = (currentIndex + step + figures.length) % figures.length;
    openLightbox(currentIndex);
  }

  figures.forEach((fig, index) => {
    fig.addEventListener('click', () => openLightbox(index));
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => showNext(-1));
  nextBtn.addEventListener('click', () => showNext(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext(1);
    if (e.key === 'ArrowLeft') showNext(-1);
  });
}

// ---------- film: lazy-load, autoplay-on-view, click to pause ----------
const lazyVideos = document.querySelectorAll('.lazy-video');

lazyVideos.forEach((frame) => {
  const video = frame.querySelector('video');
  const src = frame.dataset.src;
  let loaded = false;

  function loadAndPlay() {
    if (!loaded) {
      video.src = src;
      loaded = true;
    }
    video.play().catch(() => {});
  }

  // click anywhere on the frame toggles play/pause (loads on first click too)
  frame.addEventListener('click', () => {
    if (!loaded || video.paused) {
      loadAndPlay();
    } else {
      video.pause();
    }
  });

  video.addEventListener('play', () => frame.classList.add('is-playing'));
  video.addEventListener('pause', () => frame.classList.remove('is-playing'));

  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadAndPlay();
        } else if (loaded) {
          video.pause();
        }
      });
    },
    { threshold: 0.4 }
  );

  videoObserver.observe(frame);
});
