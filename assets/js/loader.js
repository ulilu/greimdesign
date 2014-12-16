// Asynchronous JS-Loader, using Modernizrs "yepnope" for testing and conditionally loading required files


// Necessary test for parent folder. If current page resides in subfolder (= moebel), all relative paths within loader.js will fail. 
// To compensate, set var root to "../" and add root to all local paths within the loader-script.
var root = "";
var pathArray = location.pathname.split( '/' );
if (pathArray[pathArray.length - 2] == "moebel") {
  root = "../";
  console.log("up-routed ../");
}


// Test for iOS
Modernizr.addTest('ios',function(){
  return !!navigator.userAgent.match(/iPhone|iPad|iPod/i)
});


yepnope.errorTimeout = 5000;
Modernizr.load([

// Load Respond.js for Media Query Support in IE < 9
  {
    test:     Modernizr.mq('only all'),
    nope:     '//cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js',
    callback: function(url, result, key) {
      if (!respond) {
        Modernizr.load(root + 'assets/js/vendor/respond.min.js');
        console.log("Loading Respond. Cloudflare CDN is not responding, fetching local copy");
      }
    }
  },


// Load Riloadr to enable lazy loading of images
  {
    load:	  root + 'assets/js/vendor/riloadr.min.js',
    callback: function(url, result, key) {
      if (!window.Riloadr) {
        console.log("Riloadr failed loading ...");
      }
    },
    complete: function() {
      var moodpic = new Riloadr({
        name: 'moodpic',
        base: root + 'assets/img/moebel/', // {breakpoint-name} will be replaced by one of your breakpoints names
        ignoreLowBandwidth: false, // Hi-Res images will only be requested on high-bandwidth connections
        onload: function() {
          this.parentNode.className = this.parentNode.className.replace( /(?:^|\s)loading(?!\S)/g , '' ); // remove the loading-spinner
        // very complicated solution, necessary for ie9 (which doesn't support .classList.remove)
        },
        oncomplete: function(){
            console.log("Moodpic loaded");
        },
        retries: 1,
        breakpoints: [
          {name: '-pl',    maxWidth: 767},
          {name: '-pl-r',  maxWidth: 767, minDevicePixelRatio: 1.3},
          {name: '-c',     minWidth: 768 }
        ],
        watchViewportWidth: '*'
      });
      
      var blurbpic = new Riloadr({
        name: 'blurbpic',
        base: root + 'assets/img/', // {breakpoint-name} will be replaced by one of your breakpoints names
        ignoreLowBandwidth: true, // Since we only have one version of blurbpics atm, only load Hi-Res images
        oncomplete: function(){
            console.log("Blurbpic loaded");
        },
        retries: 1,
        breakpoints: [
          {name: '',    minWidth: 1}
        ]
      });
      
      var lazypic = new Riloadr({
        name: 'lazypic',
        base: root + 'assets/img/', // {breakpoint-name} will be replaced by one of your breakpoints names
        ignoreLowBandwidth: true, // Since we only have one version of blurbpics atm, only load Hi-Res images
        defer: {
            mode: 'invisible',
            threshold: 200
        },
        oncomplete: function(){
            console.log("Lazypics loaded");
        },
        retries: 1,
        breakpoints: [
          {name: '',    minWidth: 1}
        ]
      });
    }
  },


// Load jQuery from CDN with local fallback
  {           
    load:	  'timeout=2000!//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js',
    callback: function(url, result, key) {
      if (!window.jQuery) {
        Modernizr.load(root + 'assets/js/vendor/jquery-1.8.0.min.js');
        console.log("Loading jQuery. Googleapis CDN is not responding, fetching local copy");
      }
    }
  }, 

  
// Load Navigation  
  {           
    load:     root + 'assets/js/navi.min.js'
  },
  
  
// Load skrollr.js from CDN with local fallback  
  {
    test:     Modernizr.touch && Modernizr.csstransforms3d, // detect IE < 10  http://caniuse.com/#feat=transforms3d	
    nope:     '//cdnjs.cloudflare.com/ajax/libs/skrollr/0.6.25/skrollr.min.js',	// only load on non-touch devices (desktop)
    callback: function(url, result, key) {
      if (!window.skrollr) {
        Modernizr.load(root + 'assets/js/vendor/skrollr.min.js');
        console.log("Loading skrollr. Cloudflare CDN is not responding, fetching local copy");
      }
    }, 
    complete: function() {
      if (window.skrollr) {
        var s = skrollr.init([
          smoothScrolling = true,
          smoothScrollingDuration = 2000
        ]); 
      }
    }
  },
  
  
// Load Magnific Popup from CDN with local fallback  
  {
    load:     '//cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/0.9.9/jquery.magnific-popup.min.js',
    callback: function(url, result, key) {
      if (!$.magnificPopup) {
        Modernizr.load(root + 'assets/js/vendor/magnific-popup.min.js');
        console.log("Loading Magnific Popup. Cloudflare CDN is not responding, fetching local copy");
      }
    },
    complete: function() {
      $(document).ready(function(){
        $('.popup').magnificPopup({
          type: 'image',
          tLoading: '',		//'Bild wird geladen...',
          mainClass: 'mfp-img-mobile',
          gallery: {
            tCounter: '',
            enabled: true,
            navigateByImgClick: true,
            preload: [0,1] // Will preload 0 - before current, and 1 after the current image
          },
          image: {
            tError: '<a href="%url%">Das Bild #%curr%</a> konnte leider nicht geladen werden.',
            titleSrc: function(item) {
              return '<span style="display:inline-block; color:#ccc; margin:6px 9px 0 0;">' 
              + item.el.attr('title') 
              + '</span>'
              + '<small style="display:inline-block; font-size:11px; color:#888;">&copy; GreimDesign | All Rights reserved.</small>';
            }
          }
        });
      });
    }
  },
  
  
// Support faster clicks on mobile devices
  {		
    test:     Modernizr.touch,
    yep:      '//cdnjs.cloudflare.com/ajax/libs/fastclick/1.0.0/fastclick.min.js',
    callback: function(url, result, key) {
      if (!window.FastClick)	{
        Modernizr.load(root + 'assets/js/vendor/fastclick.min.js');
        console.log("Loading FT Fastclick. Cloudflare CDN is not responding, fetching local copy");
      }
    },
    complete: function() {
      if (window.FastClick)	{
        FastClick.attach(document.body);
      }
    }
  },


// Load iOS-Polyfills
  {	
    test:     Modernizr.ios,
    yep:      root + 'assets/js/polyfill/ios-fixes.min.js',
    callback: function(url, result, key) {
        console.log("Loading iOS Polyfills");
    }
  },


// Add Placeholder-Polyfills for all Browsers
// Upon consulting caniuse.com, the placeholder polyfill seems only to be necessary for ie9 and opera mini.
// In oder to be able to style all error msgs concistently across all browsers and only send the form once all input is verified, h5f needs to be called for every browser.  
  { 
    test:    document.getElementById('inquiry-form'),
    yep:     root + 'assets/js/vendor/H5F.min.js',
    callback: function(url, result, key) {
      console.log("Loading H5F-Polyfill locally.");
      H5F.setup(document.getElementById('inquiry-form'), {
        validClass: 'valid',
        invalidClass: 'invalid'
      });
    }
  }
  
]);

/* H5F remnants

    complete:	function() {
      var email = document.getElementById('user-email');
      var msg = document.getElementById('user-msg');
                 
      email.addEventListener("keyup", function (event) {
        if(email.validity.typeMismatch) {
          email.setCustomValidity("Bitte geben Sie eine korrekte E-Mail-Adresse ein.");
        } else {
          email.setCustomValidity("");
        }
      });
      
      msg.addEventListener("keyup", function (event) {
        if(msg.validity.typeMismatch) {
          msg.setCustomValidity("Bitte vergessen Sie nicht, Ihre Nachricht einzugeben.");
        } else {
          msg.setCustomValidity("");
        }
      });
    }

*/


/*
$(window).bind({
	orientationchange: function(){
     
	},
	resize: function(){
		if(document.body.clientWidth != screenwidth && document.body.clientHeight != screenheight){
        
		}	
	}	
});
*/