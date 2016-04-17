(function() {
'use strict';

/** Timeline namespace */
var angstyTimeline = {};

/**
  * Controls the timeline page.
  * @constructor
  */
angstyTimeline.TimelineController = function(view) {
  /**
   * @type angstyTimeline.TimelineView
   * @private
   */
  this.view_ = view;

  var self = this;
  // Request data from service.
  $.ajax({
    url: 'http://tafiti-timeline-service.appspot.com',
    dataType: 'jsonp',
    success: function(result) {
      if (result) {
        // Cancel the error handling timeout
        clearTimeout(setTimeout(function() {
          self.view_.displayErrorMessage();
        }, 4000));
        self.view_.clearErrorMessage();

        // Set and then render response JSON data in view.
        self.view_.setTimelineData(result);
      }
    }
  });
};

/**
 * The Event/Bio object containing a pair of an event with an accompanying bio.
 * @typedef {Object} EventBio
 * @property {!number} event_year - Year of event described.
 * @property {!string} event - Event description.
 * @property {!string} name - Name of individual or group.
 * @property {?boolean} is_group - Whether bio is for a group of people.
 * @property {!number} birth_year - Birth year (for individual) or start year of
 *    active years (for group).
 * @property {?number} death_year - Death year (for individual) or last year of
 *    active years (for group).
 * @property {!string} blurb - Bio description.
 * @property {!picture} string - Bio illustration png in base64 format.
 */

/**
  * Manages all rendering of the timeline page.
  * @constructor
  */
angstyTimeline.TimelineView = function() {
  /**
   * Timeline data array.
   * @param {?Array.<EventBio>}
   */
  this.timelineData = null;

  // On clicking the down button, jump/scroll to timeline section. */
  $('.down-button').click(this.scrollToTimelineTop_);

  // On clicking the "to top" button, jump/scroll to the top of timeline. */
  $('#to-top').click(this.scrollToTimelineTop_);

  // 'load-animate' CSS class should trigger CSS animation only when the page
  // first loads. Remove class on window resize to suppress any subsequent 
  // animations.
  $(window).resize(function() {
    $('.load-animate').removeClass('load-animate');
  });

  // On resize, the timeline items may need to be re-stacked vertically to fix
  // their relative positions to each other.
  $(window).resize(this.restackItems_.bind(this));

  // On scroll, if items are in viewport, displays ones that were previously 
  // hidden.
  $(window).scroll(this.maybeShowHiddenItems_.bind(this));
};

angstyTimeline.TimelineView.prototype.displayErrorMessage = function() {
  var error = document.createElement('p');
  $(error).addClass('error');

  var firstText = document.createTextNode(
      'Uh oh, something\'s wrong with our service! ' +
      'Please try again later, or ');
  $(error).append(firstText);

  var mailLink = document.createElement('a');
  $(mailLink).attr('href', 'mailto:hi@angstyfeministsintech.org' +
      '?Subject=Your%20service%20is%20down');
  $(mailLink).append(document.createTextNode('contact us'));
  $(error).append(mailLink);

  var secondText = document.createTextNode(' if the problem persists.');
  $(error).append(secondText);

  $('#timeline').prepend(error);
  $('#timeline::before').hide();
};

angstyTimeline.TimelineView.prototype.clearErrorMessage = function() {
  $('.error').hide();
};

/**
 * Jumps/scrolls to the top of timeline.
 * @param {Event} e
 * @private
 */
angstyTimeline.TimelineView.prototype.scrollToTimelineTop_ = function(e) {
  e.preventDefault();
  var startOfTimeline = 500;
  $('html,body').animate(
    {scrollTop:$(this.hash).offset().top},
    startOfTimeline
  );
};

/**
 * Dynamically re-stacks timeline items/blocks to be vertically flush against
 * their neighboring items.
 * @private
 */
angstyTimeline.TimelineView.prototype.restackItems_ = function() {
  var blocks = $('.timeline-block');
  if (blocks.length <= 0) {
    return;
  }

  if ($(blocks[0]).outerWidth() > ($(window).innerWidth() * 0.5)) {
    // Timeline is in single column format: reset bottom margins to 2em.
    var SINGLE_COLUMN_MARGIN_BOTTOM = '2em';

    var blockLastIndex = blocks.length - 1;
    (blocks.slice(0, blockLastIndex)).each(function(index) {
      this.style.marginBottom = SINGLE_COLUMN_MARGIN_BOTTOM;
    });
    return;
  } // Early return from method if timeline is in single column format.

  // Re-stack timeline items below only if timeline is in double column format.
  var verticalGap = $(window).innerWidth() * 0.16;
  var radix = 10;
  blocks.each(function(index) {
    if (index === 0) {
      return;
    } // continue loop with next item.

    var topOfThisDiv = $(this).position().top;
    if (index === 1) {
      var firstDiv = blocks[0];
      var distanceBetweenTopOfThisDivAndTopOfFirstDiv =
          topOfThisDiv - $(firstDiv).position().top;
      firstDiv.style.marginBottom =
          parseInt(firstDiv.style.marginBottom, radix) -
          (distanceBetweenTopOfThisDivAndTopOfFirstDiv - verticalGap) + 'px';
      return;
    } // continue loop with next item.

    // For items at index 2 and above.

    // Take distance between the top of this item and the bottom of the 
    // previous-previous item (i.e. vertically adjacent neighbor immediately
    // north of this item and on the same column).
    var previousDivOnSameColumn = blocks[index - 2];
    var bottomOfPreviousDivOnSameColumn =
        $(previousDivOnSameColumn).position().top +
        $(previousDivOnSameColumn).outerHeight(false);
    var distanceBetweenTopOfThisDivAndBottomOfPrevDivOnSameColumn =
        topOfThisDiv - bottomOfPreviousDivOnSameColumn;

    // Calculate the distance needed to close between above two items to achieve
    // the desired vertical gap between them.
    var gapToClose = distanceBetweenTopOfThisDivAndBottomOfPrevDivOnSameColumn -
        verticalGap;

    // Get the previous item (i.e. previous item in DOM order, which is the
    // timeline item immediately north of this item, on the opposite column).
    var previousDiv = blocks[index - 1];

    // Enforce the vertical gap as the minimum vertical distance between two
    // horizontally adjacent items.
    var projectedDistanceBeweenTopOfThisDivAndTopOfPrevDiv =
        topOfThisDiv - gapToClose - $(previousDiv).position().top;
    if (projectedDistanceBeweenTopOfThisDivAndTopOfPrevDiv < verticalGap) {
        gapToClose -= verticalGap -
            projectedDistanceBeweenTopOfThisDivAndTopOfPrevDiv;
    }

    // Finally, apply new margin-bottom to the previous (in DOM order) item.
    previousDiv.style.marginBottom =
        parseInt(previousDiv.style.marginBottom, radix) - gapToClose + 'px';
  });
};

/**
 * Sets timeline data array.
 * @param {!Array.<EventBio>}
 */
angstyTimeline.TimelineView.prototype.setTimelineData = function(timelineData) {
  this.timelineData = timelineData;

  // Render the data.
  this.displayTimelineData_();
}

/**
 * Iterates through given array of Event/Bios and constructs and displays DOM
 * elements that house the data.
 * @private
 */
angstyTimeline.TimelineView.prototype.displayTimelineData_ = function() {
  var timelineData = this.timelineData;
  var timeline = $('#timeline');

  timelineData.forEach(function(item) {
    // Parent. Depth 0.
    var block = document.createElement('div');
    timeline.append(block);
    $(block).addClass('timeline-block');
    block.style.marginBottom = 0 + 'px'; // Needed for item re-stacking.

    // Children of timeline-block. Depth 1.
    var marker = document.createElement('div');
    $(block).append(marker);
    $(marker).addClass('timeline-marker is-hidden');

    var content = document.createElement('div');
    $(block).append(content);
    $(content).addClass('timeline-content is-hidden');

    // Child of timeline-content. Depth 2.
    var event = document.createElement('div');
    $(content).append(event);
    $(event).addClass('timeline-event');

    // Children of timeline-event. Depth 3.
    var eventYear = document.createElement('p');
    $(event).append(eventYear);
    $(eventYear).addClass('event-date').text(item.event_year);

    var eventDescription = document.createElement('p');
    $(event).append(eventDescription);
    $(eventDescription).addClass('event-description').text(item.event);

    // Child of timeline-content. Depth 2.
    var bio = document.createElement('div');
    $(content).append(bio);
    $(bio).addClass('timeline-bio');

    // Children of timeline-bio. Depth 3.
    var img = document.createElement('img');
    $(bio).append(img);
    $(img).attr('src', 'data:image/png;charset=utf8;base64,' + item.picture);

    var bioHeading = document.createElement('h2');
    $(bio).append(bioHeading);
    $(bioHeading).addClass('name').text(item.name);

    var bioDates = document.createElement('p');
    $(bio).append(bioDates);
    $(bioDates).addClass('lifespan');
    if (item.is_group) {
      $(bioDates).text('Years Active: ');
    }

    // Children of lifespan. Depth 4.
    var birthYear = document.createElement('span');
    $(bioDates).append(birthYear);
    var birthYearContent = item.birth_year > 0 ? item.birth_year :
        Math.abs(item.birth_year) + ' BCE';
    $(birthYear).addClass('birth_year').text(birthYearContent);

    $(bioDates).append(document.createTextNode(' - '));

    if (item.death_year) {
      var deathYear = document.createElement('span');
      $(bioDates).append(deathYear);
      $(deathYear).addClass('death_year').text(item.death_year);
    }

    // Children of timeline-bio. Depth 3.
    var bioBlurb = document.createElement('p');
    $(bio).append(bioBlurb);
    $(bioBlurb).addClass('bio').text(item.blurb);

    var resourceButton = document.createElement('div');
    $(bio).append(resourceButton);
    $(resourceButton).addClass('button-container');

    // Child of resourceButton element. Depth 4.
    var readMore = document.createElement('a');
    $(resourceButton).append(readMore);
    var readMoreText;
    if (item.resources.length > 0) {
      readMoreText = document.createTextNode('View Resources');
    } else {
      readMoreText = document.createTextNode('Learn More on Google');
      $(readMore).attr('href', 'http://www.google.com/search?q=' + item.name);
    }
    $(readMore).addClass('read-more button').append(readMoreText)
               .attr('target', '_blank');

    // Child of timeline-content. Depth 2.
    var resources = document.createElement('div');
    $(content).append(resources);
    $(resources).addClass('timeline-resources');

    // Child of timeline-resources. Depth 3.
    var resourceDiv = document.createElement('div');
    $(resources).append(resourceDiv);

    item.resources.forEach(function(resource) {
      // Child of resourceDiv element. Depth 4.
      var resourceP = document.createElement('p');
      $(resourceDiv).append(resourceP);

      // Children of resourceP element. Depth 5.
      var resourceA = document.createElement('a');
      $(resourceP).append(resourceA);
      $(resourceA).append(document.createTextNode(resource.title))
                  .attr('href', resource.url).attr('target', '_blank');

      $(resourceP).append('<br>');

      var resourceSource = document.createElement('span');
      $(resourceP).append(resourceSource);
      $(resourceSource).addClass('source').text('from ' + resource.source);
    });

    // Child of timeline-resources. Depth 3.
    var bioButton = document.createElement('div');
    $(resources).append(bioButton);
    $(bioButton).addClass('button-container');

    // Child of bioButton element. Depth 4.
    var resourceToBio = document.createElement('a');
    $(bioButton).append(resourceToBio);
    $(resourceToBio).addClass('read-more button')
        .append(document.createTextNode('Show Bio'));
  });

  // Make sure the items are in the right positions.
  this.restackItems_();

  // Make sure items within current viewport are shown.
  this.maybeShowHiddenItems_();

  // Add listener for click here, after elements are placed in DOM.
  $('.read-more').click(this.toggleResources_);

  // The timeline item height may change on click, hence stacking needs to be
  // recalculated.
  $('.read-more').click(this.restackItems_.bind(this));
};

/**
 * Toggles "Resources" modal.
 * @param {Event} e
 * @private
 */
angstyTimeline.TimelineView.prototype.toggleResources_ = function(e) {
  var element = e.target;
  var parentBlock = $(element).parents('.timeline-block');
  $(parentBlock.find('.timeline-resources')).toggle();
  $(parentBlock.find('.timeline-bio')).children('.bio').toggle();
  $(parentBlock.find('.timeline-bio')).children('.button-container').toggle();
};

/**
 * Gets the given element's distance from top of page.
 * @param {Element} element
 * @private
 * @return {number}
 */
angstyTimeline.TimelineView.prototype.getDistanceFromTop_ = function(element) {
  return $(element).offset().top;
};

/**
 * Gets the lowest "reasonably" user viewable point (y-value) on the page.
 * @private
 * @return {number}
 */
angstyTimeline.TimelineView.prototype.getLowestViewablePointOnPage_ =
    function() {
  return $(window).scrollTop() + $(window).height() * 0.8;
};

/**
 * Show hidden items with CSS class 'timeline-block' if they are in the
 * viewport.
 * @private
 */
angstyTimeline.TimelineView.prototype.maybeShowHiddenItems_ = function() {
  var self = this;
  $('.timeline-block').each(function() {
    if (self.getDistanceFromTop_(this) < self.getLowestViewablePointOnPage_()) {
      $(this).find('.timeline-marker, .timeline-content')
             .removeClass('is-hidden')
             .addClass('bounce-in');
    }
  });
};

// When document is ready, instantiate the view and controller.
jQuery(document).ready(function() {
  var view = new angstyTimeline.TimelineView();
  var controller = angstyTimeline.TimelineController(view);
});

}()); // End 'use strict'.
