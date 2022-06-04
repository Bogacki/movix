const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]

toggleButton.addEventListener('click', () => {
  navbarLinks.classList.toggle('active')
})



const slider = function(){

  const sliderBtnLeft = document.querySelector('.btn-left');
  const sliderBtnRight = document.querySelector('.btn-right');
  const slides = document.querySelectorAll('.movie-item');
  
  if(sliderBtnLeft && sliderBtnRight && slides){
  
  let curSlide = 0;
  const maxSlide = slides.length;
  
  const goToSlide = function (slide) {
      slides.forEach(
        (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
      );
    };
  
    const nextSlide = function () {
      if (curSlide === maxSlide - 1) {
        curSlide = 0;
      } else {
        curSlide++;
      }
      goToSlide(curSlide);
    };
    const prevSlide = function () {
      if (curSlide === 0) {
        curSlide = maxSlide - 1;
      } else {
        curSlide--;
      }
      goToSlide(curSlide);
    };
  
    const init = function(){
      goToSlide(0);
      slides.forEach((e,i) => {
          console.log(e,i);
      });
    }
  
    setInterval(nextSlide, 8000);
  
  sliderBtnRight.addEventListener('click',nextSlide);
  sliderBtnLeft.addEventListener('click',prevSlide);
  
  document.addEventListener('keydown', function (e) {
      e.key === 'ArrowLeft' && prevSlide(); 
      e.key === 'ArrowRight' && nextSlide();
    });
  
  init();
  }
  }

  slider();