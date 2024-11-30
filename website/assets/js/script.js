const tooltipTriggerList = document.querySelectorAll(
	'[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
	tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl)
);
$(document).ready(function () {
	window.scrollTo(0, 0);
	// AOS.init({
	// 	duration: 800
	// });
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

	let lastScrollTop = 0;
	const header = document.getElementById('header');
	window.addEventListener('scroll', function () {
		let currentScroll =
			window.pageYOffset || document.documentElement.scrollTop;
		// Check if the user is scrolling up or down
		if (currentScroll > lastScrollTop) {
			// Scrolling down, remove sticky class
			header.classList.remove('sticky');
			this.document.body.classList.remove('menu-fixed');
		} else {
			// Scrolling up, add sticky class
			header.classList.add('sticky');
			this.document.body.classList.add('menu-fixed');
		}

		if (currentScroll === 0) {
			header.classList.remove('sticky');
			this.document.body.classList.remove('menu-fixed');
		}
		lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
	});

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
		slidesToShow: 7,
		slidesToScroll: 3,
		centerMode: true,
		centerPadding: '10px',
		dots: true,
		arrows: false,
		infinite: true,
		autoPlay: true,
		swipe: false,
		autoplaySpeed: 2000,
		responsive: [
			{
				breakpoint: 1200,
				settings: {
					slidesToShow: 5,
					slidesToScroll: 3
				}
			},
			{
				breakpoint: 767,
				settings: {
					centerPadding: '80px',
					slidesToShow: 1,
					slidesToScroll: 1,
					centerMode: true,
					swipe: true
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
			fade: true,
			responsive: [
				{
					breakpoint: 768,
					settings: {
						arrows: true
					}
				},
				{
					breakpoint: 0,
					settings: {
						arrows: true
					}
				}
			]
		});
		$(previewEl).slick('slickGoTo', 1);
		// $(previewEl).slick('slickGoTo', 1);
		$(previewEl).on(
			'beforeChange',
			function (event, slick, currentSlide, nextSlide) {
				$(`${listEl} .item`).removeClass('active');
				$(`${listEl} .item-${nextSlide}`).addClass('active');

				var parentOffset = $(listEl).offset()?.top;
				var targetOffset =
					nextSlide < $(`${listEl} .item`).length
						? $($(`${listEl} .item-${nextSlide}`)).offset()?.top
						: 0;
				var scrollToPosition = targetOffset - parentOffset;
				$(listEl).animate(
					{
						scrollTop: nextSlide === 0 ? 0 : scrollToPosition
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
	$('.mf-blbotmwgp a:first-child').on('click', function (event) {
		if (event.currentTarget.href.includes('#')) {
			event.preventDefault();
			alert('Coming soon!');
		}
	});

	$('.mf-host-events-slide').slick({
		dots: false,
		arrows: false,
		slidesToShow: 4,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 1199,
				settings: {
					slidesToShow: 3,
					centerMode: true,
					centerPadding: '60px'
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
					centerMode: true,
					centerPadding: '100px'
				}
			},
			{
				breakpoint: 0,
				settings: {
					slidesToShow: 1,
					centerMode: true,
					centerPadding: '100px'
				}
			}
		]
	});
});
function checkWidth() {
	if ($(window).width() < 768) {
		if (!$('.mf-mcp-slide').hasClass('slick-initialized')) {
			$('.mf-mcp-slide').slick({
				autoplay: true,
				autoplaySpeed: 3000,
				arrows: false,
				dots: false,
				centerMode: true,
				centerPadding: '100px'
			});
		}
		if (!$('.mf-bac-slide').hasClass('slick-initialized')) {
			$('.mf-bac-slide').slick({
				autoplay: true,
				autoplaySpeed: 3000,
				arrows: false,
				dots: false,
				centerMode: true,
				centerPadding: '100px'
			});
		}
		if (!$('.mf-awaptfyv .tabs').hasClass('slick-initialized')) {
			$('.mf-awaptfyv .tabs').slick({
				arrows: false,
				dots: false,
				centerMode: true,
				centerPadding: 0,
				focusOnSelect: true,
				slidesToShow: 3,
				slidesToScroll: 1,
				infinite: true
			});
			$('.mf-awaptfyv .tabs').slick('slickGoTo', 1);
			$('.mf-awaptfyv .tabs .btn').on('click', function () {
				$('.mf-awaptfyv .tabs').slick('slickGoTo', $(this).data('slide'));
			});
		}
	} else {
		if ($('.mf-mcp-slide').hasClass('slick-initialized')) {
			$('.mf-mcp-slide').slick('unslick');
		}
		if ($('.mf-bac-slide').hasClass('slick-initialized')) {
			$('.mf-bac-slide').slick('unslick');
		}
		if ($('.mf-awaptfyv .tabs').hasClass('slick-initialized')) {
			$('.mf-awaptfyv .tabs').slick('unslick');
		}
	}
}

checkWidth();
$(window).resize(function () {
	checkWidth();
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
function showMaintenance(event) {
	event.preventDefault();
	alert('Website currently under maintenance');
}

setTimeout(() => {
	$('.mf-loading').addClass('hide');
	$('body').removeClass('overflow-hidden');
	setTimeout(() => {
		$('.mf-loading').remove();
	}, 400);
}, 800);

// let currentSection = 0;
// const sections = document.querySelectorAll('section');
// let isScrolling = false;
// let scrollTimeout;

// function goToSection(index) {
// 	if (index >= 0 && index < sections.length) {
// 		sections[index].scrollIntoView({
// 			behavior: 'smooth',
// 			block: 'start'
// 		});
// 		currentSection = index;
// 	}
// }

// function goToSection(index) {
// 	if (index >= 0 && index < sections.length) {
// 		sections[index].scrollIntoView({
// 			behavior: 'smooth',
// 			block: 'start'
// 		});
// 		currentSection = index;
// 	}
// }

// function handleScroll(event) {
// 	if (isScrolling) return;

// 	clearTimeout(scrollTimeout);
// 	isScrolling = true;

// 	scrollTimeout = setTimeout(() => {
// 		if (event.deltaY > 0) {
// 			goToSection(currentSection + 1);
// 		} else {
// 			goToSection(currentSection - 1);
// 		}
// 		isScrolling = false;
// 	}, 200);
// }

// window.addEventListener('wheel', handleScroll);
