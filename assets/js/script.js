const tooltipTriggerList = document.querySelectorAll(
	'[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
	tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl)
);
$(document).ready(function () {
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

	$('.mf-banner-slide').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		dots: true,
		infinite: true,
		autoPlay: true,
		autoplaySpeed: 2000,
		fade: true
	});
	$('.mf-verse-slide').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		dots: false,
		asNavFor: '.mf-verse-slide-nav'
	});
	$('.mf-verse-slide-nav').slick({
		slidesToShow: 3,
		slidesToScroll: 1,
		asNavFor: '.mf-verse-slide',
		dots: false,
		arrows: true,
		focusOnSelect: true,
		centerMode: true,
		centerPadding: '0px'
	});
	$('.mf-oawbmp-slide').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		dots: true,
		infinite: true,
		autoPlay: true,
		autoplaySpeed: 2000
	});
	$('.mf-oawmeig-slide').slick({
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
			}
		]
	});
	$('.mf-oawmeig-item').on('click', function () {
		$('.mf-oawmeig-slide').slick('slickGoTo', $(this).data('slide'));
	});
	$('#PlayVideo').on('click', () => {
		$('#videoModal iframe').attr(
			'src',
			'https://www.youtube.com/embed/XF8UbB5LhFw?si=qgJ0BOu_T0kLbhuY?autoplay=1&enablejsapi=1'
		);
		var myModalEl = document.getElementById('videoModal');
		var videoModal = new bootstrap.Modal(myModalEl, {});
		videoModal.show();
		myModalEl.addEventListener('hidden.bs.modal', function (event) {
			$('#videoModal iframe').attr('src', '');
		});
	});
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
	$('body').on('click', () => {
		if ($('#main-menu').hasClass('show')) {
			$('#main-menu').removeClass('show');
			$('body').removeClass('menu-show');
		}
	});
});
function playVideo(url) {
	$('#IFRAME_VIDEO').attr('src', url);
	var myModalEl = document.getElementById('videoModal');
	var videoModal = new bootstrap.Modal(myModalEl, {});
	videoModal.show();
	myModalEl.addEventListener('hidden.bs.modal', function (event) {
		$('#IFRAME_VIDEO').attr('src', '');
	});
}
