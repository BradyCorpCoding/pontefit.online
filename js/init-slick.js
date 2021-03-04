$(document).ready(function () {
    $('.app-preview').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        dots: true,
        centerMode: true,
        variableWidth: true,
        infinite: true,
        focusOnSelect: true,
        cssEase: 'linear',
        touchMove: true,
        swipeToSlide: true,
        prevArrow:'<div class="slick-arrow-left"></div>',
        nextArrow:'<div class="slick-arrow-right"></div>',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });
});
