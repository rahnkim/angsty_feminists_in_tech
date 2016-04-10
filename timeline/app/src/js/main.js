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
	// Create View Model.
	var ViewModel = function() {
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
	}

    // Toggle "Resources" modal.
	ViewModel.prototype.toggleResources = function(element, data, event) {
		var parentBlock = $(element).parents('.timeline-block');
		$(parentBlock.find('.timeline-resources')).toggle();
		$(parentBlock.find('.timeline-bio')).children('.bio').toggle();
		$(parentBlock.find('.timeline-bio')).children('.button-container').toggle();
	};

    // The given element's distance from top of page.
	ViewModel.prototype.distanceFromTop = function(element) {
		return $(element).offset().top;
	};

    // The lowest "reasonably" user viewable point (y-value) on the page.
	ViewModel.prototype.lowestViewablePointOnPage = function() {
	    return $(window).scrollTop() + $(window).height() * .8;
	};

	// Check if DOM element is in viewport on load.
	ViewModel.prototype.isInViewport = function(element) {
		if (this.distanceFromTop(element) > this.lowestViewablePointOnPage()) {
			return 'is-hidden';
		} else {
			return 'bounce-in';
		}
	};

	// Update CSS class while scrolling.
	ViewModel.prototype.isStillInViewport = function(element) {
	    var self = this;
		$(window).on('scroll', function(){
			if (self.distanceFromTop(element) < self.lowestViewablePointOnPage()) {
				$(element).find('.timeline-marker, .timeline-content')
				          .removeClass('is-hidden')
				          .addClass('bounce-in');
			}
		});
	};

	// Activate knockout.js
	ko.applyBindings(new ViewModel());

});