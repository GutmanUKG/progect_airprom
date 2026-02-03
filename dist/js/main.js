// Bootstrap JS - подключается через CDN в HTML
// Или можно скопировать из node_modules

document.addEventListener('DOMContentLoaded', () => {
  $('.banner_list').owlCarousel({
    loop:false,
    margin:10,
    nav:false,
    dots: false,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:1
        },
        1000:{
            items:1
        }
    }
  })
});
