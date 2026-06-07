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

		const directory = carousel.dataset.directory ? carousel.dataset.directory.trim() : '../Image/Galerie/Photo';
		const basePath = directory.endsWith('/') ? directory : directory + '/';
		const captionsList = carousel.dataset.captions ? carousel.dataset.captions.split('|').map(s => s.trim()) : [];

		function createSlide(filename, captionText) {
			const slide = document.createElement('div');
			slide.className = 'carousel-slide';

			const img = document.createElement('img');
			img.src = filename.startsWith('http') || filename.startsWith('/') ? filename : basePath + filename;
			img.alt = captionText || filename;
			slide.appendChild(img);

			const caption = document.createElement('div');
			caption.className = 'carousel-caption';
			caption.textContent = captionText || filename;
			slide.appendChild(caption);

			slidesContainer.appendChild(slide);
		}

		function buildSlides() {
			let slides = Array.from(slidesContainer.querySelectorAll('.carousel-slide'));
			if (slides.length === 0 && carousel.dataset.images){
				const list = carousel.dataset.images.split(',').map(s => s.trim()).filter(Boolean);
				list.forEach((filename, index) => {
					createSlide(filename, captionsList[index]);
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
			slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
			const thumbs = Array.from(thumbsContainer.querySelectorAll('img'));
			thumbs.forEach((t, i) => t.classList.toggle('active', i === index));
			current = index;
		}

		function next(){ show((current + 1) % slides.length); }
		function prev(){ show((current - 1 + slides.length) % slides.length); }

		function buildThumbs(){
			thumbsContainer.innerHTML = '';
			slides.forEach((slide, i) => {
				const img = slide.querySelector('img');
				if (!img) return;
				const thumb = document.createElement('img');
				thumb.src = img.src;
				thumb.alt = img.alt || '';
				thumb.addEventListener('click', () => { show(i); resetAutoplay(); });
				thumbsContainer.appendChild(thumb);
			});
		}

		function startAutoplay(){
			if (intervalId) clearInterval(intervalId);
			intervalId = setInterval(next, 4000);
		}
		function resetAutoplay(){ startAutoplay(); }

		if (slides.length > 0){
			buildThumbs();
			show(0);
			prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });
			nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });
			startAutoplay();
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
