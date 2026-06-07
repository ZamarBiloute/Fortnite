// Carousel script for photo gallery
document.addEventListener('DOMContentLoaded', function () {
	const carousel = document.getElementById('galleryCarousel');
	if (!carousel) return;

	const slidesContainer = carousel.querySelector('.carousel-slides');
	const thumbsContainer = carousel.querySelector('.carousel-thumbs');
	const prevBtn = carousel.querySelector('.carousel-control.prev');
	const nextBtn = carousel.querySelector('.carousel-control.next');

	// If there are no images in HTML, try to auto-insert all files listed by the user.
	// Since static sites cannot read folders, the author must add <img> tags in the HTML.

	let slides = Array.from(slidesContainer.querySelectorAll('img'));
	// If no <img> tags are present, allow using data-images attribute with comma-separated filenames
	if (slides.length === 0 && carousel.dataset.images){
		const list = carousel.dataset.images.split(',').map(s=>s.trim()).filter(Boolean);
		list.forEach(filename=>{
			const img = document.createElement('img');
			img.src = filename.startsWith('http') || filename.startsWith('/') ? filename : ('../Image/Galerie/Photo/' + filename);
			slidesContainer.appendChild(img);
		});
		slides = Array.from(slidesContainer.querySelectorAll('img'));
	}
	let current = 0;
	let intervalId = null;

	function show(index){
		if (slides.length === 0) return;
		slides.forEach((img,i)=> img.classList.toggle('active', i===index));
		const thumbs = Array.from(thumbsContainer.querySelectorAll('img'));
		thumbs.forEach((t,i)=> t.classList.toggle('active', i===index));
		current = index;
	}

	function next(){ show((current+1) % slides.length); }
	function prev(){ show((current-1 + slides.length) % slides.length); }

	// Build thumbnails from slides
	function buildThumbs(){
		thumbsContainer.innerHTML = '';
		slides.forEach((img, i)=>{
			const t = document.createElement('img');
			t.src = img.src;
			t.alt = img.alt || '';
			t.addEventListener('click', ()=>{ show(i); resetAutoplay(); });
			thumbsContainer.appendChild(t);
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
		prevBtn.addEventListener('click', ()=>{ prev(); resetAutoplay(); });
		nextBtn.addEventListener('click', ()=>{ next(); resetAutoplay(); });
		startAutoplay();
	}
});
