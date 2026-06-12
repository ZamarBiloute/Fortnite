// Carousel script for photo gallery
document.addEventListener('DOMContentLoaded', function () {
	const carousels = document.querySelectorAll('.carousel');
	if (!carousels.length) return;

	carousels.forEach(carousel => {
		const slidesContainer = carousel.querySelector('.carousel-slides');
		const thumbsContainer = carousel.querySelector('.carousel-thumbs');
		const prevBtn = carousel.querySelector('.carousel-control.prev');
		const nextBtn = carousel.querySelector('.carousel-control.next');
		if (!slidesContainer || !thumbsContainer || !prevBtn || !nextBtn) return;

		const directory = carousel.dataset.directory ? carousel.dataset.directory.trim() : '../image/Galerie/Photo';
		const basePath = directory.endsWith('/') ? directory : directory + '/';
		const captionsList = carousel.dataset.captions ? carousel.dataset.captions.split('|').map(s => s.trim()) : [];

		function isYoutubeEmbed(url) {
			return typeof url === 'string' && /youtube\.com\/embed\//.test(url);
		}

		function isVideoFile(url) {
			return typeof url === 'string' && /\.(mp4|webm|ogg|mov)(?:\?.*)?$/i.test(url.trim());
		}

		function getYoutubeThumb(url) {
			const match = url.match(/embed\/([^?\/]+)/);
			return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : url;
		}

		function createSlide(source, captionText) {
			const slide = document.createElement('div');
			slide.className = 'carousel-slide';

			if (isYoutubeEmbed(source)) {
				const iframe = document.createElement('iframe');
				iframe.dataset.src = source;
				iframe.src = source;
				iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
				iframe.allowFullscreen = true;
				iframe.title = captionText || 'YouTube vidéo';
				iframe.className = 'carousel-iframe';
				slide.appendChild(iframe);
			} else if (isVideoFile(source)) {
				const video = document.createElement('video');
				video.src = source.startsWith('http') || source.startsWith('/') ? source : basePath + source;
				video.controls = true;
				video.preload = 'metadata';
				video.className = 'carousel-video';
				slide.appendChild(video);
			} else {
				const img = document.createElement('img');
				img.src = source.startsWith('http') || source.startsWith('/') ? source : basePath + source;
				img.alt = captionText || source;
				slide.appendChild(img);
			}

			const caption = document.createElement('div');
			caption.className = 'carousel-caption';
			caption.textContent = captionText || source;
			slide.appendChild(caption);

			slidesContainer.appendChild(slide);
		}

		function buildSlides() {
			let slides = Array.from(slidesContainer.querySelectorAll('.carousel-slide'));
			if (slides.length === 0) {
				const list = [];
				if (carousel.dataset.images) {
					list.push(...carousel.dataset.images.split(',').map(s => s.trim()).filter(Boolean));
				}
				if (carousel.dataset.videos) {
					list.push(...carousel.dataset.videos.split(',').map(s => s.trim()).filter(Boolean));
				}
				list.forEach((source, index) => {
					createSlide(source, captionsList[index]);
				});
				slides = Array.from(slidesContainer.querySelectorAll('.carousel-slide'));
			}
			return slides;
		}

		const slides = buildSlides();
		let current = 0;
		let intervalId = null;

		function show(index){
			if (slides.length === 0) return;
			slides.forEach((slide, i) => {
				const active = i === index;
				slide.classList.toggle('active', active);
				const iframe = slide.querySelector('iframe');
				if (iframe) {
					if (active) {
						if (iframe.src !== iframe.dataset.src) {
							iframe.src = iframe.dataset.src;
						}
					} else {
						iframe.src = 'about:blank';
					}
				}
				const video = slide.querySelector('video');
				if (video) {
					if (!active) {
						try { video.pause(); video.currentTime = 0; } catch (e) { /* ignore */ }
					}
				}
			});
			const thumbs = Array.from(thumbsContainer.querySelectorAll('img, video'));
			thumbs.forEach((t, i) => t.classList.toggle('active', i === index));
			current = index;
		}

		function next(){ show((current + 1) % slides.length); }
		function prev(){ show((current - 1 + slides.length) % slides.length); }

		function buildThumbs(){
			thumbsContainer.innerHTML = '';
			slides.forEach((slide, i) => {
				const img = slide.querySelector('img');
				const iframe = slide.querySelector('iframe');
				const video = slide.querySelector('video');
				let thumbElem = null;

				if (img) {
					thumbElem = document.createElement('img');
					thumbElem.src = img.src;
					thumbElem.alt = img.alt || '';
				} else if (iframe) {
					thumbElem = document.createElement('img');
					thumbElem.src = getYoutubeThumb(iframe.src);
					thumbElem.alt = slide.querySelector('.carousel-caption')?.textContent || '';
				} else if (video) {
					thumbElem = document.createElement('video');
					thumbElem.src = video.src;
					thumbElem.muted = true;
					thumbElem.preload = 'metadata';
					thumbElem.className = 'thumb-video';
				}

				if (!thumbElem) return;
				thumbElem.addEventListener('click', () => { show(i); });
				thumbsContainer.appendChild(thumbElem);
			});
		}

		if (slides.length > 0){
			buildThumbs();
			show(0);
			prevBtn.addEventListener('click', () => { prev(); });
			nextBtn.addEventListener('click', () => { next(); });
		}
	});
});

// Side-menu toggle: keep separate to avoid interfering with carousel logic
document.addEventListener('DOMContentLoaded', function () {
	const toggle = document.getElementById('sideMenuToggle');
	const menu = document.getElementById('sideMenu');
	if (!toggle || !menu) return;

	toggle.addEventListener('click', function () {
		const open = menu.classList.toggle('open');
		toggle.classList.toggle('rotated', open);
		menu.setAttribute('aria-hidden', (!open).toString());
		toggle.setAttribute('aria-expanded', open.toString());
	});

	menu.addEventListener('click', function (e) {
		const target = e.target;
		if (target && target.tagName && target.tagName.toLowerCase() === 'a') {
			// allow anchor default behavior then hide menu
			setTimeout(function () {
				menu.classList.remove('open');
				toggle.classList.remove('rotated');
				menu.setAttribute('aria-hidden', 'true');
				toggle.setAttribute('aria-expanded', 'false');
			}, 50);
		}
	});
});

// Gestion du menu Burger Mobile (Version FontAwesome)
document.addEventListener('DOMContentLoaded', function () {
    const burgerToggle = document.getElementById('burgerToggle');
    const menuContainer = document.getElementById('myNav');

    if (burgerToggle && menuContainer) {
        burgerToggle.addEventListener('click', function (e) {
            e.stopPropagation(); 
            menuContainer.classList.toggle('open');
        });

        // Ferme le menu si on clique à côté
        document.addEventListener('click', function (e) {
            if (!menuContainer.contains(e.target)) {
                menuContainer.classList.remove('open');
            }
        });
    }
});
