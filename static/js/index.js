window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    function pauseCarouselVideos(container) {
      if (!container) {
        return;
      }
      container.querySelectorAll('video').forEach(function(video) {
        video.pause();
      });
    }

    function playCurrentCarouselVideo(container, carousel) {
      if (!container) {
        return;
      }
      var currentSlide = null;
      if (carousel && carousel.state && carousel.state.length) {
        var currentIndex = Math.abs(carousel.state.index % carousel.state.length);
        currentSlide = container.querySelector('.slider-item[data-slider-index="' + currentIndex + '"]:not([data-cloned])');
      }
      if (!currentSlide) {
        currentSlide = container.querySelector('.slider-item.is-current');
      }
      if (!currentSlide) {
        currentSlide = container.querySelector('.slider-item');
      }
      if (!currentSlide) {
        return;
      }
      var video = currentSlide.querySelector('video');
      if (!video) {
        return;
      }
      video.muted = true;
      var playPromise = video.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function() {});
      }
    }

    function syncCarouselVideos(container, carousel) {
      pauseCarouselVideos(container);
      playCurrentCarouselVideo(container, carousel);
    }

    function scheduleCarouselVideoSync(container, carousel) {
      window.setTimeout(function() {
        syncCarouselVideos(container, carousel);
      }, 450);
    }

    var resultsCarouselEl = document.getElementById('results-carousel');
    var options = {
    slidesToScroll: 1,
    slidesToShow: 1,
    centerMode: false,
    loop: true,
    infinite: true,
    autoplay: false,
};

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    for (var i = 0; i < carousels.length; i++) {
      if (carousels[i].element === resultsCarouselEl) {
        var resultsCarousel = carousels[i];
        carousels[i].on('show', function() {
          scheduleCarouselVideoSync(resultsCarouselEl, resultsCarousel);
        });
      }
    }

    if (resultsCarouselEl) {
      window.setTimeout(function() {
        var resultsCarousel = null;
        for (var j = 0; j < carousels.length; j++) {
          if (carousels[j].element === resultsCarouselEl) {
            resultsCarousel = carousels[j];
            break;
          }
        }
        syncCarouselVideos(resultsCarouselEl, resultsCarousel);
      }, 350);
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

})
