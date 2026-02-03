// Импорт стилей
import '../sass/main.scss';

// Импорт библиотек
import 'bootstrap';
import $ from 'jquery';
import 'owl.carousel';

// Owl Carousel стили
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

// Инициализация после загрузки DOM
$(document).ready(function() {
  // Owl Carousel
  $('.banner_list').owlCarousel({
    loop: true,
    margin: 10,
    nav: false,
    dots: false,
    autoplay: false,
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      1000: { items: 1 }
    }
  });
});
