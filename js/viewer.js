document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category") || "watches";
  const container = document.getElementById("flipbookContainer");
  const loader = document.getElementById("loader");

  const imageCount = 67; // You can change this based on your category
  const imageUrls = [];

  loader.style.display = "block";

  let loaded = 0;
  for (let i = 1; i <= imageCount; i++) {
    const src = `images/${category}/${i}.jpg`;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      imageUrls.push(src);
      loaded++;
      if (loaded === imageCount) {
        loader.style.display = "none";
        initFlipbook(imageUrls);
      }
    };
    img.onerror = () => {
      console.warn(`Missing: ${src}`);
      loaded++;
      if (loaded === imageCount) {
        loader.style.display = "none";
        initFlipbook(imageUrls);
      }
    };
  }

 function initFlipbook(images) {
  const pageFlip = new St.PageFlip(container, {
    width: container.clientWidth,  // 100% of container width
    height: container.clientHeight, // 100% of container height
    size: 'fixed',                // ❗ Keeps original image size
    showCover: false,
    usePortrait: true,
    mode: 'portrait',             // ✅ Single-page only
    maxShadowOpacity: 0.3,
    flippingTime: 900
  });

  const pages = images.map(src => {
  const wrapper = document.createElement("div");
  wrapper.className = "page-wrapper";
  
  const innerBox = document.createElement("div");
  innerBox.className = "page-box";

    const img = new Image();
    img.src = src;
    img.className = "page-img fade-in";

  innerBox.appendChild(img);
  wrapper.appendChild(innerBox);
  return wrapper;
});

  pageFlip.loadFromHTML(pages);
  window.pageFlip = pageFlip;


}


  window.prevPage = () => window.pageFlip?.flipPrev();
  window.nextPage = () => window.pageFlip?.flipNext();


window.toggleFullscreen = () => {
  const el = document.getElementById("flipbookContainer");
  if (!document.fullscreenElement) {
    el.requestFullscreen().catch(err => {
      console.error(`Error: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
};

document.addEventListener("fullscreenchange", () => {
  const isFullscreen = !!document.fullscreenElement;
  document.body.classList.toggle("is-fullscreen", isFullscreen);
});


  window.goHome = () => window.location.href = "index.html";

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") window.prevPage();
    if (e.key === "ArrowRight") window.nextPage();
  });
});



document.addEventListener("click", (e) => {
  if (e.target.classList.contains("page-img")) {
    e.target.classList.toggle("zoomed");
  }
});



function switchView(mode) {
  const flip = document.getElementById("flipbookContainer");
  const grid = document.getElementById("imageGridContainer");

  if (mode === "flip") {
    flip.style.display = "flex";
    grid.style.display = "none";
  } else {
    flip.style.display = "none";
    grid.style.display = "grid";
  }
}

function populateGrid(images) {
  gridContainer.innerHTML = ""; // clear if any

  images.forEach(src => {
    const wrapper = document.createElement("div");
    wrapper.className = "grid-img-wrapper";

    const img = new Image();
    img.src = src;
    img.className = "grid-img";

    wrapper.appendChild(img);
    gridContainer.appendChild(wrapper);
  });
}

const preloadImage = (src) => new Promise(resolve => {
  const img = new Image();
  img.src = src;
  img.onload = () => resolve(src);
  img.onerror = () => resolve(null);
});
Promise.all(
  Array.from({ length: imageCount }, (_, i) => preloadImage(`images/${category}/${i + 1}.jpg`))
).then(images => {
  const valid = images.filter(src => src);
  loader.style.display = "none";
  initFlipbook(valid);
});