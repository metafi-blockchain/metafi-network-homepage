const tooltipTriggerList = document.querySelectorAll(
	'[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
	tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl)
);
$(document).ready(function () {
	AOS.init({
		duration: 1000,
		offset: 100,
		once: true
	});
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

	const getActorSlide = actorId => `
    <div id="actor-${actorId}" class="mf-verse-slide-item">
      <button type="button" class="play" id="PlayVideo-slide-${actorId}" tabindex="0">
        <img src="assets/images/icons/play-video.svg" alt="">
      </button> 
      <img src="assets/images/metafi_verse_${3 * actorId - 2}.png" alt="" />
    </div>
	
    <div id="actor-${actorId}" class="mf-verse-slide-item">
      <img src="assets/images/metafi_verse_${3 * actorId - 2 + 1}.png" alt="" />
    </div>
    <div id="actor-${actorId}" class="mf-verse-slide-item">
      <img src="assets/images/metafi_verse_${3 * actorId - 2 + 2}.png" alt="" />
    </div>
    <div id="actor-${actorId}" class="mf-verse-slide-item">
	 <button type="button" class="play" id="PlayVideo-slide-${actorId}" tabindex="0">
        <img src="assets/images/icons/play-video.svg" alt="">
      </button> 
      <img src="assets/images/metafi_verse_${3 * actorId - 2}.png" alt="" />
    </div>
    <div id="actor-${actorId}" class="mf-verse-slide-item">
      <img src="assets/images/metafi_verse_${3 * actorId - 2 + 1}.png" alt="" />
    </div>
    <div id="actor-${actorId}" class="mf-verse-slide-item">
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
	// Initialize verse slides with first actor
	$('.mf-verse-slide').html(getActorSlide(2));
	$('.mf-verse-slide-nav').html(getActorNav(2));

	// Video URL mapping
	const videoUrls = {
		'1': 'https://www.youtube.com/embed/0T34-WHJ8d0?si=757-gN07rc2ziHZk&autoplay=1&enablejsapi=1',
		'2': 'https://www.youtube.com/embed/kNIDk5dQsJU?si=FUoOhm7T9VKU6FkK&autoplay=1&enablejsapi=1', 
		'3': 'https://www.youtube.com/embed/0T34-WHJ8d0?si=757-gN07rc2ziHZk&autoplay=1&enablejsapi=1',
		'4': 'https://www.youtube.com/embed/RK_45Z-2QC4?si=SOllsKfObeEOeUpE&autoplay=1&enablejsapi=1',
		'5': 'https://www.youtube.com/embed/XF8UbB5LhFw?si=qgJ0BOu_T0kLbhuY?autoplay=1&enablejsapi=1',
		'6': 'https://www.youtube.com/embed/XF8UbB5LhFw?si=qgJ0BOu_T0kLbhuY?autoplay=1&enablejsapi=1',
		'7': 'https://www.youtube.com/embed/XF8UbB5LhFw?si=qgJ0BOu_T0kLbhuY?autoplay=1&enablejsapi=1'
	};

	// Handle video play button clicks
	const handleVideoPlay = (event) => {
		event.preventDefault();
		event.stopPropagation();
		event.currentTarget.style.display = 'none';

		const slideId = event.currentTarget.parentElement.id.split('-')[1];
		const videoUrl = videoUrls[slideId] || videoUrls['1'];

		const iframe = document.createElement('iframe');
		iframe.setAttribute('allow', 'autoplay');
		iframe.src = videoUrl;
		iframe.className = event.currentTarget.parentElement.lastElementChild.className;
		event.currentTarget.parentElement.lastElementChild.replaceWith(iframe);
	};

	// Attach video play handlers
	for (let i = 1; i <= 7; i++) {
		$(`#PlayVideo-slide-${i}`).on('click', handleVideoPlay);
	}

	// Handle verse tab clicks
	$('.mf-verse-tabs li').on('click', function(e) {
		e.preventDefault();

		const actorItem = $(e.target).closest('li').length ? 
			$(e.target).closest('li') : 
			$(e.target).is('li') ? $(e.target) : null;

		// Update active state
		actorItem.siblings().removeClass('active');
		actorItem.addClass('active');

		const actorId = actorItem.attr('id').split('-')[1];

		// Update images
		$('#verse-image').attr('src', `assets/images/verse-${actorId}-image.png`);
		$('#verse-bg').attr('src', `assets/images/metafi_verse${actorId}.png`);

		// Reinitialize slides
		$('.mf-verse-slide').slick('unslick').empty().html(getActorSlide(actorId));
		$('.mf-verse-slide-nav').slick('unslick').empty().html(getActorNav(actorId));

		// Configure main slide
		$('.mf-verse-slide').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			arrows: false,
			dots: false,
			infinite: true,
			asNavFor: '.mf-verse-slide-nav'
		});

		// Configure nav slide  
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

		// Reattach video handlers
		for (let i = 1; i <= 7; i++) {
			$(`#PlayVideo-slide-${i}`).on('click', handleVideoPlay);
		}
	});

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
			},
			{
				breakpoint: 767,
				settings: {
					centerPadding: '10px',
					slidesToShow: 1,
					slidesToScroll: 1,
					centerMode: true
				}
			},
			{
				breakpoint: 576,
				settings: {
					centerPadding: '10px',
					slidesToShow: 1,
					slidesToScroll: 1,
					centerMode: true,
					dots: false,
					arrows: true
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
