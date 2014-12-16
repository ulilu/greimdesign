/*	#########################################################################
	NAVIGATION - Mobile first, responsive, CSS3-based, Jquery-enhanced Menu
	######################################################################### */

var screenwidth		= document.body.clientWidth;
var screenheight	   = document.body.clientWidth;
var navigation		   = $(".navi");
var menuwrapper		= $(".menuwrapper");
var menulistwrapper	= $(".menulist > li");
var menuitems		   = $(".menuitem");
var productitems 	   = $("ul.products a.menuitem");
var infoitems		   = $("ul.info a.menuitem");
var breakpoint		   = 750;
var timespan		   = 1;

/* 
Behaviours:

on document.ready:

- remove "a.hide-submenu"-elements
- - all opening and closing of submenus is going to be done purely in js. 
- - the no-js-":target"-method with anchortags (#sm02) forces some mobile browsers to do a page-reload upon changing the url. the js-method can prevent that by attaching <.is-open> to <a.menuitem> and prevent the click-propagation.

- remove "a.back"-element (do we need this)?	
*/



/*	=========================================================================
	closeNavi - Any time a reload or an orientationchange occurs, hide the navi
	========================================================================= */
	
var closeNavi = function() {

	navigation.removeClass("is-active");	   // remove ".is-active" on <.navi>
	menuitems.removeClass("is-open");			// reset all <a.menuitem> 
	menuitems.next("ul").hide(timespan);		// close all <ul.submenu> next to an <a.menuitem>
};


/*	=========================================================================
	toggleNavi - Only on <a.navibut> until screenwidth > 750
	========================================================================= */

var toggleNavi = function() {
	$("a.navibut").on('click', function(e){					// on click <a.navibut>
		e.preventDefault();									// stop click-event propagation

		if (navigation.hasClass("is-active"))	{			// if <.navi> is already open
			menuwrapper.hide(timespan, function() {			// hide the contained <.menuwrapper>
				navigation.toggleClass("is-active");		// TOGGLE ".is-active" on <.navi>
				menuitems.removeClass("is-open");			// reset all <a.menuitem> 
				menuitems.next("ul").hide(timespan);		// close all <ul.submenu> next to an <a.menuitem>
			});
		} else {											// if <.navi> is closed
			navigation.toggleClass("is-active");			// TOGGLE ".is-active" on <.navi>
			menuwrapper.show(timespan);    // Same problem as below - removing (timespan) solved it.
		};
	});
};


/*	=========================================================================
	toggleSubmenu - 
	========================================================================= */
	
var toggleSubmenu = function() {
	screenwidth	= document.body.clientWidth;
	
	if ((Modernizr.touch) || (screenwidth < breakpoint)) {
     
     console.log("Mobile browser");
		
		menulistwrapper.unbind('mouseenter mouseleave');
		
		menuitems.unbind('click').bind('click', function(e){
			e.preventDefault();
		
			menuitems.not(this).next("ul.submenu").hide(timespan);
			menuitems.not(this).removeClass("is-open");
			
			if ($(this).hasClass("is-open"))	{
				$(this).next("ul.submenu").hide(timespan, function() {
					$(this).prev("a.menuitem").toggleClass("is-open");

				});
			} else {
				$(this).next("ul.submenu").show(timespan);
				$(this).toggleClass("is-open");
			};
		});
		
	} else if (!(Modernizr.touch) && (screenwidth > breakpoint)) {
     
		console.log("PC browser");
     
		navigation.removeClass("is-active").addClass("is-active");
		menuwrapper.show(); 
// Attention: Since changing css to * {box-sizing: border-box}, the menuwrapper suddenly became invisible. When removing .show(timespan), it does seem to work again. no idea why though...
		menuitems.removeClass("is-open");
		menuitems.next("ul.submenu").hide(timespan);	
		
		menuitems.click(function(e){
			e.preventDefault();
		});
		
		menulistwrapper.unbind('mouseenter mouseleave').bind({
			mouseenter : function(){
				$(this).children("ul.submenu").show(timespan);
				$(this).children(menuitems).addClass("is-open");
			},
			mouseleave : function(){
				$(this).children("ul.submenu").hide(timespan, function() {
					$(this).siblings(infoitems).removeClass("is-open");
				});
				$(this).children(productitems).removeClass("is-open");
			}
		});
	};
};



$(window).bind({
	orientationchange: function(){
		closeNavi();
		toggleSubmenu();
      console.log("orientationchange triggered");
	},
	resize: function(){
		if(document.body.clientWidth != screenwidth && document.body.clientHeight != screenheight){
        console.log("resize triggered");
			closeNavi();
			toggleSubmenu();
		}	
	}	
});



$(document).ready(function() {	// does not work in ie 9 - no idea why...
// $(window).load(function() {   // doesnt work with modernizr
	$("a.hide-submenu").remove();	//remove empty collapse-link (used in no-js) after a.submenutbut 
	/*
	if ( screenwidth < breakpoint ) {
		$("a.back").remove();	// remove background-link (used in no-js) behind menu, necessary only on mobile < 750px
	};
	*/
	toggleNavi();
	toggleSubmenu();

});