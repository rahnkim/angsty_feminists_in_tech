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
	// Dummy data
	var dummyData = {
		data: [
			{
				name: 'Test Person 1',
				start: 1800,
				end: 1900,
				bio: 'Known for the Turing Machine, a hypothetical device capable of simulating any algorithm, Alan helped break German ciphers during WWII. He was prosecuted for “homosexual acts” by the UK.'
			},
			{
				name: 'Test Person 2',
				start: 1800,
				end: 1900,
				bio: 'Known for the Turing Machine, a hypothetical device capable of simulating any algorithm, Alan helped break German ciphers during WWII. He was prosecuted for “homosexual acts” by the UK.'
			},
			{
				name: 'Test Person 3',
				start: 1800,
				end: 1900,
				bio: 'Known for the Turing Machine, a hypothetical device capable of simulating any algorithm, Alan helped break German ciphers during WWII. He was prosecuted for “homosexual acts” by the UK.'
			},
			{
				name: 'Test Person 4',
				start: 1800,
				end: 1900,
				bio: 'Known for the Turing Machine, a hypothetical device capable of simulating any algorithm, Alan helped break German ciphers during WWII. He was prosecuted for “homosexual acts” by the UK.'
			},
		]
	};

	// Controller
	var controller = {
		getData: function() {
			return dummyData.data;
		}
	};

	// Create View Model
	function ViewModel() {
        // Map 'self' to ViewModel
        var self = this;

		this.dataList = controller.getData();
	};

	// Activate knockout.js
	ko.applyBindings(new ViewModel());


});