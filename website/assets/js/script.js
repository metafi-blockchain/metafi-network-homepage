const tooltipTriggerList = document.querySelectorAll(
	'[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
	tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl)
);
$(document).ready(function () {
	const setMenuMb = () => {
		if (window.innerWidth > 1199) {
			$('#main-menu').removeClass('show');
			$('body').removeClass('menu-show');
		}
	};
	setMenuMb();
	window.onresize = () => {
		setMenuMb();
	};
	$('.toggle-menu').on('click', event => {
		event.preventDefault();
		event.stopPropagation();
		$('#main-menu').addClass('show');
		$('body').addClass('menu-show');
	});
	$('.close-menu').on('click', () => {
		if ($('#main-menu').hasClass('show')) {
			$('#main-menu').removeClass('show');
			$('body').removeClass('menu-show');
		}
	});
	$('#main-menu a:not(.disabled):not(.dropdown-toggle)').on('click', () => {
		if ($('#main-menu').hasClass('show')) {
			$('#main-menu').removeClass('show');
			$('body').removeClass('menu-show');
		}
	});

	// Header
	$(window).scroll(function () {
		var wScroll = $(this).scrollTop();
		if (wScroll >= 80) {
			$('.mf-header').addClass('sticky');
		} else {
			$('.mf-header').removeClass('sticky');
		}
	});

	if ($(window).scrollTop() >= 80) {
		$('.mf-header').addClass('sticky');
	} else {
		$('.mf-header').removeClass('sticky');
	}

	// Banner
	$('.mf-banner-slide').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		dots: true,
		infinite: true,
		autoPlay: true,
		autoplaySpeed: 2000
	});
	// MPE
	$('.mf-mpe-slide').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		dots: true,
		infinite: true,
		autoPlay: true,
		autoplaySpeed: 2000
	});
	// MPEIG
	$('.mf-mpeig-slide').slick({
		slidesToShow: 5,
		slidesToScroll: 1,
		centerMode: true,
		centerPadding: '10px',
		dots: true,
		arrows: false,
		infinite: true,
		autoPlay: true,
		autoplaySpeed: 2000,
		responsive: [
			{
				breakpoint: 1400,
				settings: {
					centerPadding: '120px',
					slidesToShow: 3,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 767,
				settings: {
					centerPadding: '80px',
					slidesToShow: 1,
					slidesToScroll: 1,
					centerMode: true
				}
			}
		]
	});
	$('.mf-mpeig-item').on('click', function () {
		$('.mf-mpeig-slide').slick('slickGoTo', $(this).data('slide'));
	});

	$('.mf-blbotmwgp-slide').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		dots: false,
		fade: true,
		asNavFor: '.mf-blbotmwgp-thumbs'
	});
	$('.mf-blbotmwgp-thumbs').slick({
		slidesToShow: 4,
		slidesToScroll: 1,
		asNavFor: '.mf-blbotmwgp-slide',
		dots: false,
		arrows: false,
		centerMode: true,
		focusOnSelect: true,
		infinite: false,
		responsive: [
			{
				breakpoint: 1300,
				settings: {
					slidesToShow: 3
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 2
				}
			}
		]
	});
	$('.mf-blbotmwgp-slide').slick('slickGoTo', 2);

	for (let index = 1; index <= 7; index++) {
		const previewEl = `#video-preview-${index}`;
		const listEl = `#video-list-${index}`;
		$(previewEl).slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			arrows: false,
			dots: false,
			fade: true
		});
		// $(previewEl).slick('slickGoTo', 1);
		$(previewEl).on(
			'beforeChange',
			function (event, slick, currentSlide, nextSlide) {
				$(`${listEl} .item`).removeClass('active');
				$(`${listEl} .item-${nextSlide}`).addClass('active');

				// Scroll to active slide
				if (nextSlide === 0) {
					$(listEl).animate(
						{
							scrollTop: 0
						},
						300
					);
					return;
				}
				var targetOffset = $($(`${listEl} .item-${nextSlide - 1}`)).offset()
					.top;
				var parentOffset = $(listEl).offset().top;
				var scrollToPosition = targetOffset - parentOffset;
				$(listEl).animate(
					{
						scrollTop: scrollToPosition
					},
					300
				);
			}
		);
		$(`${listEl} .item`).on('click', function () {
			$(previewEl).slick('slickGoTo', $(this).data('slide'));
		});
	}

	$('.mf-header a.disabled').on('click', event => {
		event.preventDefault();
	});

	AOS.init({
		duration: 800,
	});

	setTimeout(()=>{
		$('.mf-loading').hide()
	},500)
});

function playVideo(url) {
	$('#videoModal iframe').attr('src', url);
	var myModalEl = document.getElementById('videoModal');
	var videoModal = new bootstrap.Modal(myModalEl, {});
	videoModal.show();
	myModalEl.addEventListener('hidden.bs.modal', function (event) {
		$('#videoModal iframe').attr('src', '');
	});
}
function showMaintenance(event){
	event.preventDefault();
	alert('Website currently under maintenance')
}