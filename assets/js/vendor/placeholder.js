// SETTING PLACEHOLDER VALUES AS STANDARD TEXT IN INPUT-FIELDS AND REMOVE THEM ON USER INPUT
// Setting the html5 placeholder-value via jquery as value of inputfields. via:
// http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html
// Script at: https://gist.github.com/379601
// Released under MIT license: http://www.opensource.org/licenses/mit-license.php

$(document).ready(function() {
	$('[placeholder]').focus(function() {
	  var input = $(this);
	  if (input.val() == input.attr('placeholder')) {
	    input.val('');
	    input.removeClass('placeholder');
	  }
	}).blur(function() {
	  var input = $(this);
	  if (input.val() == '' || input.val() == input.attr('placeholder')) {
	    input.addClass('placeholder');
	    input.val(input.attr('placeholder'));
	  }
	}).blur().parents('form').submit(function() {
	  $(this).find('[placeholder]').each(function() {
	    var input = $(this);
	    if (input.val() == input.attr('placeholder')) {
	      input.val('');
	    }
	  })
	});
});
