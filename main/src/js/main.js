jQuery(document).ready(function($){
	// On clicking the "to top" button, jump/scroll to the top of page.
	$('#to-top').click(function() {
	    $('html, body').animate({
	        scrollTop: $('#top').offset().top
	    }, 500);
	});
});