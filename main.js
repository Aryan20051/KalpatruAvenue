$(document).ready(function() {
    // Header Scroll behavior
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('#header').addClass('header-scrolled');
        } else {
            $('#header').removeClass('header-scrolled');
        }
    });

    // Mobile nav toggle (basic implementation)
    $('.mobile-nav-toggle').on('click', function() {
        $('.nav-menu').toggleClass('mobile-nav-active');
    });

    // Smooth scroll for navigation links
    $('a[href*="#"]').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 80
        }, 500);
    });
});
