// Reveal on scroll
const obs = new IntersectionObserver(e => {
  e.forEach(el => { if(el.isIntersecting) el.target.classList.add('visible'); });
}, {threshold: 0.1});
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Hero carousel
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dot');
const totalSlides = slides.length;

function goSlide(n) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (n + totalSlides) % totalSlides;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
  // Restart video on new slide if it has one
  const vid = slides[currentSlide].querySelector('video');
  if (vid) { vid.currentTime = 0; vid.play(); }
}
function nextSlide() { goSlide(currentSlide + 1); }
function prevSlide() { goSlide(currentSlide - 1); }

let autoPlay = setInterval(nextSlide, 6000);
// Pause on hover (desktop only — touch devices use swipe)
const heroEl = document.querySelector('.hero');
if(window.matchMedia('(hover:hover)').matches){
  heroEl.addEventListener('mouseenter', () => clearInterval(autoPlay));
  heroEl.addEventListener('mouseleave', () => { autoPlay = setInterval(nextSlide, 6000); });
}
// Touch swipe support
let touchX = 0;
heroEl.addEventListener('touchstart', e => { touchX = e.changedTouches[0].screenX; }, {passive:true});
heroEl.addEventListener('touchend', e => {
  const diff = e.changedTouches[0].screenX - touchX;
  if(Math.abs(diff) > 50){ diff < 0 ? nextSlide() : prevSlide(); clearInterval(autoPlay); autoPlay = setInterval(nextSlide, 6000); }
}, {passive:true});

// Force video autoplay on iOS
document.querySelectorAll('.hero-slide video').forEach(v => {
  v.play().catch(() => {});
  document.addEventListener('touchstart', function playOnTouch(){
    v.play().catch(() => {});
    document.removeEventListener('touchstart', playOnTouch);
  }, {once:true, passive:true});
});

// JS-driven ticker marquee (desktop only — mobile uses native scroll)
(function(){
  if(window.innerWidth <= 768) return;
  const track = document.querySelector('.ticker-track');
  if(!track) return;
  let pos = 0;
  const speed = 0.5;
  function tick(){
    pos -= speed;
    const halfW = track.scrollWidth / 2;
    if(halfW > 0 && Math.abs(pos) >= halfW) pos = 0;
    track.style.transform = 'translate(' + pos + 'px, -50%)';
    requestAnimationFrame(tick);
  }
  setTimeout(function(){ requestAnimationFrame(tick); }, 100);
})();
