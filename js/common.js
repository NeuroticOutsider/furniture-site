$(function() {

	$('.hamburger').on('click', function () {
		$(this).toggleClass('is-active right-move');
		$('.site-header__navigation').toggleClass('display-flex')
	});

	$('.drop-down__tab').click(function() {
	  $(this).toggleClass('drop-tab-focus').next().slideToggle();
	  $('.drop-down__tab').not(this).removeClass('drop-tab-focus').next().slideUp();
	});

	$(".site-header__button").on("click", function (event) {
    event.preventDefault();
 		var id = $(this).attr('href'),
 		top = $(id).offset().top;
    $('body, html').animate({scrollTop: top}, 1000);
  });

  var time = 2, cc = 1;
  $(window).scroll(function () {
		$('#counter').each(function(){
			var
			cPos = $(this).offset().top,
			topWindow = $(window).scrollTop();
			if (cPos < topWindow + 500) {
				if (cc < 2) {
					$('.our-statistics__number').addClass('viz');
				  $('span').each(function(){
				    var 
				    i = 1,
				    num = $(this).data('num'),
				    step = 1000 * time / num,
				    that = $(this),
				    int = setInterval(function(){
				      if (i <= num) {
				        that.html(i);
				      }
				      else {
				      	cc = cc + 2;
				        clearInterval(int);
				      }
				      i++;
				    },step);
				  });
			  }
			}
		});
	});

	$('.slider__carousel').owlCarousel({
		loop: true,
		items: 1,
		nav: true,
		smartSpeed: 700,
		navText: ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
		dots: false,
		autoHeight: true
	});

	$('.our-works__gallery-carousel').owlCarousel({
		loop: true, 
		smartSpeed: 700,
		responsiveClass: true,
		dots: false,
		nav: false,
		autoplay: true,
		autoplayTimeout: 3500,
		responsive: {
			0: {
				items: 1
			},
			480: {
				items: 2
			},
			800: {
				items: 3
			},
			1100: {
				items: 4
			}
		}
	});

	$(window).scroll(function() {
		if ($(this).scrollTop() > $(this).height()) {
			$('.button-top').addClass("active");
		} else {
			$('.button-top').removeClass("active");
		};
	});

	$('.button-top').click(function() {
		$('html, body').stop().animate({scrollTop: 0}, 'slow', 'swing');
	});
	
	$(window).on('load', function() {
		$('.preloader').delay(1000).fadeOut('slow');
		setTimeout(function(){new WOW().init();}, 1700); 
	});

	new WOW().init();
});

