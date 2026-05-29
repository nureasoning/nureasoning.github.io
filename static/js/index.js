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

    var options = {
    slidesToScroll: 1,
    slidesToShow: 1,
    centerMode: false,
    loop: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 20000,
};

    function stopCarouselControlPropagation(carouselEl) {
      var controlEvents = ['mousedown', 'touchstart', 'pointerdown', 'click'];

      carouselEl.querySelectorAll('video').forEach(function(video) {
        controlEvents.forEach(function(eventName) {
          video.addEventListener(eventName, function(event) {
            event.stopPropagation();
          });
        });
      });
    }

    function playCenteredCarouselVideo() {
      var carouselEl = document.getElementById('results-carousel');
      if (!carouselEl) return;

      carouselEl.querySelectorAll('video').forEach(function(video) {
        video.pause();
      });

      var slider = carouselEl.querySelector('.slider');
      if (!slider) return;

      var sliderRect = slider.getBoundingClientRect();
      var centerX = sliderRect.left + sliderRect.width / 2;
      var activeVideo = null;
      var bestDistance = Infinity;

      carouselEl.querySelectorAll('.slider-item').forEach(function(item) {
        var rect = item.getBoundingClientRect();
        if (rect.width === 0) return;

        var distance = Math.abs(rect.left + rect.width / 2 - centerX);
        if (distance < bestDistance) {
          bestDistance = distance;
          activeVideo = item.querySelector('video');
        }
      });

      if (activeVideo) {
        activeVideo.muted = true;
        var playPromise = activeVideo.play();
        if (playPromise && playPromise.catch) {
          playPromise.catch(function() {});
        }
      }
    }

    function scheduleCarouselVideoSync() {
      requestAnimationFrame(function() {
        requestAnimationFrame(playCenteredCarouselVideo);
      });
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    var resultsCarouselEl = document.getElementById('results-carousel');
    for (var i = 0; i < carousels.length; i++) {
      if (carousels[i].element.id === 'results-carousel') {
        carousels[i].on('show', scheduleCarouselVideoSync);

        var sliderContainer = resultsCarouselEl.querySelector('.slider-container');
        if (sliderContainer) {
          sliderContainer.addEventListener('transitionend', scheduleCarouselVideoSync);
        }

        resultsCarouselEl.addEventListener('click', function(event) {
          if (event.target.closest('.slider-navigation-next, .slider-navigation-previous, .slider-pagination, .slider-page')) {
            scheduleCarouselVideoSync();
          }
        });

        stopCarouselControlPropagation(resultsCarouselEl);
        scheduleCarouselVideoSync();
      }
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
