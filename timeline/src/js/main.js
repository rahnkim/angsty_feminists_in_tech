jQuery(document).ready(function($){

	/********************
	 * Scroll To
	 ********************/
	// Scroll to timeline
	$('.down-button').click(function(event){
		event.preventDefault();
		$('html,body').animate({scrollTop:$(this.hash).offset().top}, 500);
	});

	// Scroll to top
	$('#to-top').click(function(event){
		event.preventDefault();
		$('html,body').animate({scrollTop:$(this.hash).offset().top}, 500);
	});

	/************************
	 * Intro Animation
	 ************************/
	$(window).resize(function() {
		$('.load-animate').removeClass('load-animate');
	});

	/************************
	 * Knockout Data Handling
	 ************************/
	// Create View Model
	function ViewModel() {
        // Map 'self' to ViewModel
        var self = this;

		// Create observable array for data
		self.dataList = ko.observableArray([]);

		// Error handling with timeout
		var serviceError = setTimeout(function() {
			$('#timeline').prepend('<p class="error">Uh oh, something\'s wrong with our service! Please try again later, or <a href="mailto:hi@angstyfeministsintech.org?Subject=Your%20service%20is%20down">contact us</a> if the problem persists.</p>');

			$('#timeline::before').hide();
		}, 4000);

		// Request data from service
		$.ajax({
			url: 'http://tafiti-timeline-service.appspot.com',
			dataType: 'jsonp',
			success: function(result) {
				// Push JSON data into observable array
				self.dataList(result);

				// Cancel the error handling timeout
				clearTimeout(serviceError);
				$('.error').hide();
			}
		});

		// Check if DOM element is in viewport on load
		self.isInViewport = function(element) {
			if ($(element).offset().top > $(window).scrollTop()+$(window).height()*.8) {
				return 'is-hidden';
			} else {
				return 'bounce-in';
			}
		};

		// Update CSS class while scrolling
		self.isStillInViewport = function(element) {
			$(window).on('scroll', function(){
				if ($(element).offset().top < $(window).scrollTop()+$(window).height()*.8) {
					$(element).find('.timeline-marker, .timeline-content').removeClass('is-hidden').addClass('bounce-in');
				}
			});
		};
	};

	// Activate knockout.js
	ko.applyBindings(new ViewModel());

});