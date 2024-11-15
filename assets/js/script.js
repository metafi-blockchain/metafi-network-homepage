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

	const getActorSlide = actorId => `
    <div id="actor-${actorId}" class="mf-verse-slide-item">
      <button type="button" class="play" id="PlayVideo" tabindex="0">
        <img src="assets/images/icons/play-video.svg" alt="">
      </button>
      <img src="assets/images/metafi_verse_${3 * actorId - 2}.png" alt="" />
    </div>

	
    <div id="actor-${actorId}" class="mf-verse-slide-item">
      <button type="button" class="play" id="PlayVideo" tabindex="0">
        <img src="assets/images/icons/play-video.svg" alt="">
      </button>
      <img src="assets/images/metafi_verse_${3 * actorId - 2 + 1}.png" alt="" />
    </div>

    <div id="actor-${actorId}" class="mf-verse-slide-item">
      <button type="button" class="play" id="PlayVideo" tabindex="0">
        <img src="assets/images/icons/play-video.svg" alt="">
      </button>
      <img src="assets/images/metafi_verse_${3 * actorId - 2 + 2}.png" alt="" />
    </div>

    <div id="actor-${actorId}" class="mf-verse-slide-item">
      <button type="button" class="play" id="PlayVideo" tabindex="0">
        <img src="assets/images/icons/play-video.svg" alt="">
      </button>
      <img src="assets/images/metafi_verse_${3 * actorId - 2}.png" alt="" />
    </div>

    <div id="actor-${actorId}" class="mf-verse-slide-item">
      <button type="button" class="play" id="PlayVideo" tabindex="0">
        <img src="assets/images/icons/play-video.svg" alt="">
      </button>
      <img src="assets/images/metafi_verse_${3 * actorId - 2 + 1}.png" alt="" />
    </div>

    <div id="actor-${actorId}" class="mf-verse-slide-item">
      <button type="button" class="play" id="PlayVideo" tabindex="0">
        <img src="assets/images/icons/play-video.svg" alt="">
      </button>
      	<img src="assets/images/metafi_verse_${3 * actorId - 2 + 2}.png" alt="" />
    </div>
  `;

	const getActorNav = actorId => `
    <div id="actormini-${actorId}" class="mf-verse-slide-nav-item">
      <img src="assets/images/metafi_verse_${3 * actorId - 2}.png" alt="" />
    </div>

    <div id="actormini-${actorId}" class="mf-verse-slide-nav-item">
      <img src="assets/images/metafi_verse_${3 * actorId - 2 + 1}.png" alt="" />
    </div>

    <div id="actormini-${actorId}" class="mf-verse-slide-nav-item">
      <img src="assets/images/metafi_verse_${3 * actorId - 2 + 2}.png" alt="" />
    </div>

    <div id="actormini-${actorId}" class="mf-verse-slide-nav-item">
      <img src="assets/images/metafi_verse_${3 * actorId - 2}.png" alt="" />
    </div>

    <div id="actormini-${actorId}" class="mf-verse-slide-nav-item">
      <img src="assets/images/metafi_verse_${3 * actorId - 2 + 1}.png" alt="" />
    </div>

    <div id="actormini-${actorId}" class="mf-verse-slide-nav-item">
      <img src="assets/images/metafi_verse_${3 * actorId - 2 + 2}.png" alt="" />
    </div>
  `;

	$('.mf-verse-slide').html(getActorSlide(1));
	$('.mf-verse-slide-nav').html(getActorNav(1));

	$('.mf-verse-tabs li').on('click', function (e) {
		e.preventDefault();

		// get the actor item
		const actorItem = $(e.target).closest('li').length
			? $(e.target).closest('li')
			: $(e.target).is('li')
			? $(e.target)
			: null;
		actorItem.siblings().removeClass('active');
		actorItem.addClass('active');
		const actorId = actorItem.attr('id').split('-')[1];
		$('#verse-image').attr('src', `assets/images/verse-${actorId}-image.png`);

		$('.mf-verse-slide').slick('unslick');
		$('.mf-verse-slide-nav').slick('unslick');

		$('.mf-verse-slide').empty().html(getActorSlide(actorId));
		$('.mf-verse-slide-nav').empty().html(getActorNav(actorId));
		$('.mf-verse-slide').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			arrows: false,
			dots: false,
			infinite: true,
			asNavFor: '.mf-verse-slide-nav'
		});
		$('.mf-verse-slide-nav').slick({
			infinite: true,
			slidesToShow: 3,
			slidesToScroll: 1,
			asNavFor: '.mf-verse-slide',
			dots: false,
			arrows: true,
			focusOnSelect: true,
			centerMode: true,
			centerPadding: '0px'
		});

		$('#verse-bg').attr('src', `assets/images/metafi_verse${actorId}.png`);
	});

	$('.mf-verse-slide').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		dots: false,
		infinite: true,
		asNavFor: '.mf-verse-slide-nav'
	});
	
	$('.mf-verse-slide-nav').slick({
		infinite: true,
		slidesToShow: 3,
		slidesToScroll: 1,
		asNavFor: '.mf-verse-slide',
		dots: false,
		arrows: true,
		focusOnSelect: true,
		centerMode: true,
		centerPadding: '0px'
	});

	$('.mf-banner-slide').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		dots: true,
		infinite: true,
		autoPlay: true,
		autoplaySpeed: 2000
	});
	$('.mf-verse-slide').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		dots: false,
		infinite: true,
		asNavFor: '.mf-verse-slide-nav'
	});
	$('.mf-oawmeig-slide').slick({
		slidesToShow: 3,
		slidesToScroll: 1,
		centerMode: true,
		centerPadding: '120px',
		dots: true,
		arrows: false,
		infinite: true,
		autoPlay: true,
		autoplaySpeed: 2000
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
