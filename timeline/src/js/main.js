jQuery(document).ready(function($){

	/********************
	 * Timeline Animation
	 ********************/
	// Scroll to timeline
	$('.down-button').click(function(event){
		event.preventDefault();
		$('html,body').animate({scrollTop:$(this.hash).offset().top}, 500);
	});

	//var timelineBlocks = $('.timeline-block'),
	//	offset = 0.8;
	//
	////hide timeline blocks which are outside the viewport
	//hideBlocks(timelineBlocks, offset);
	//
	////on scolling, show/animate timeline blocks when enter the viewport
	//$(window).on('scroll', function(){
	//	(!window.requestAnimationFrame)
	//		? setTimeout(function(){ showBlocks(timelineBlocks, offset); }, 100)
	//		: window.requestAnimationFrame(function(){ showBlocks(timelineBlocks, offset); });
	//});
	//
	//function hideBlocks(blocks, offset) {
	//	blocks.each(function(){
	//		( $(this).offset().top > $(window).scrollTop()+$(window).height()*offset ) && $(this).find('.timeline-img, .timeline-content').addClass('is-hidden');
	//	});
	//};
	//
	//function showBlocks(blocks, offset) {
	//	blocks.each(function(){
	//		( $(this).offset().top <= $(window).scrollTop()+$(window).height()*offset && $(this).find('.timeline-img').hasClass('is-hidden') ) && $(this).find('.timeline-img, .timeline-content').removeClass('is-hidden').addClass('bounce-in');
	//	});
	//};

	/********************
	 * Data Handling
	 ********************/
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
			}
		});
	};

	// Activate knockout.js
	ko.applyBindings(new ViewModel());

});