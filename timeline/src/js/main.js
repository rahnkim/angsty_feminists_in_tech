jQuery(document).ready(function($){

	/********************
	 * Timeline Animation
	 ********************/
	var timelineBlocks = $('.cd-timeline-block'),
		offset = 0.8;

	//hide timeline blocks which are outside the viewport
	hideBlocks(timelineBlocks, offset);

	//on scolling, show/animate timeline blocks when enter the viewport
	$(window).on('scroll', function(){
		(!window.requestAnimationFrame)
			? setTimeout(function(){ showBlocks(timelineBlocks, offset); }, 100)
			: window.requestAnimationFrame(function(){ showBlocks(timelineBlocks, offset); });
	});

	function hideBlocks(blocks, offset) {
		blocks.each(function(){
			( $(this).offset().top > $(window).scrollTop()+$(window).height()*offset ) && $(this).find('.cd-timeline-img, .cd-timeline-content').addClass('is-hidden');
		});
	};

	function showBlocks(blocks, offset) {
		blocks.each(function(){
			( $(this).offset().top <= $(window).scrollTop()+$(window).height()*offset && $(this).find('.cd-timeline-img').hasClass('is-hidden') ) && $(this).find('.cd-timeline-img, .cd-timeline-content').removeClass('is-hidden').addClass('bounce-in');
		});
	};

	/********************
	 * Data Handling
	 ********************/
	// Create View Model
	function ViewModel() {
        // Map 'self' to ViewModel
        var self = this;

		// Push JSON data into observable array
		self.dataList = ko.observableArray([]);

		$.ajax({
			url: 'http://tafiti-timeline-service.appspot.com',
			dataType: 'jsonp',
			success: function(result) {
				self.dataList(result);
				console.log(result);
			},
			error: function() {
				console.log('error');
			}
		});
	};

	// Activate knockout.js
	ko.applyBindings(new ViewModel());


});