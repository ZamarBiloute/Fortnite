/* ========================= */
/* CAROUSEL IMAGES */
/* ========================= */

const carousels = document.querySelectorAll(".carousel");

carousels.forEach((carousel) => {

    const folder = carousel.dataset.folder;
    const count = parseInt(carousel.dataset.count);

    const ul = carousel.querySelector(".Liste_Image");

    for (let i = 1; i <= count; i++) {

        const li = document.createElement("li");
        li.classList.add("slide");

        if (i === 1) li.classList.add("active");

        const img = document.createElement("img");
        img.src = `${folder}/${i}.jpg`;

        li.appendChild(img);
        ul.appendChild(li);
    }

    const slides = carousel.querySelectorAll(".slide");
    const next = carousel.querySelector("#next");
    const prev = carousel.querySelector("#prev");

    function changeSlide(direction) {

        const active = carousel.querySelector(".active");
        let index = [...slides].indexOf(active);

        index += direction;

        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        active.classList.remove("active");
        slides[index].classList.add("active");
    }

    next.addEventListener("click", () => changeSlide(1));
    prev.addEventListener("click", () => changeSlide(-1));

});


/* ========================= */
/* CAROUSEL VIDEO AUTO */
/* ========================= */

document.querySelectorAll(".auto-carousel-video").forEach(carousel => {

    const folder = carousel.dataset.folder;
    const max = parseInt(carousel.dataset.max);

    const prev = document.createElement("button");
    prev.className = "btn prev";
    prev.innerHTML = "❮";

    const next = document.createElement("button");
    next.className = "btn next";
    next.innerHTML = "❯";

    const ul = document.createElement("ul");
    ul.className = "Liste_Video";

    carousel.appendChild(prev);
    carousel.appendChild(ul);
    carousel.appendChild(next);

    let slides = [];

    for (let i = 1; i <= max; i++) {

        const video = document.createElement("video");

        video.src = `${folder}/${i}.mp4`;
        video.controls = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;

        video.onloadeddata = () => {

            const li = document.createElement("li");
            li.className = "slide";

            if (slides.length === 0) {
                li.classList.add("active");
                video.play();
            }

            li.appendChild(video);
            ul.appendChild(li);

            slides.push(li);
        };
    }

    function changeSlide(direction){

        const active = carousel.querySelector(".active");
        let index = slides.indexOf(active);

        const currentVideo = active.querySelector("video");
        if(currentVideo){
            currentVideo.pause();
            currentVideo.currentTime = 0;
        }

        index += direction;

        if(index < 0) index = slides.length - 1;
        if(index >= slides.length) index = 0;

        active.classList.remove("active");
        slides[index].classList.add("active");

        const newVideo = slides[index].querySelector("video");
        if(newVideo){
            newVideo.play();
        }
    }

    prev.addEventListener("click", () => changeSlide(-1));
    next.addEventListener("click", () => changeSlide(1));

});