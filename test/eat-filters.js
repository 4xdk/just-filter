/* ================= NOTES 
- post codes examples: SW1A 1AA, SW7 5BD, EC3A 8BF, E14 5AB, W14 8UX
- in DOM, closed restaurants don't have restaurant IDs;
- TR stands for Takeaway Restaurant
=========================== */

var JustFilterPlugin = (function(){

	// VARIABLES
	var serpTRList_data, // data for all TRs for a given location
		allTRs = [], // Array of IDs [Str] for all TRs for a given location
		TRtoShow = [], // Array of IDs [Str] for currently shown TRs
		css = '<style> /* Styles for current website"s elements */ #content { background-color: #f5f5f5; } #breadcrumb { display: none; } .o-card { box-shadow: none; } .c-serp .c-serp__header { display: none; } .c-serp__header.c-serp__header--primary { margin-bottom: 0; } #content > .l-container { padding-top: 32px; } .c-serp-filter__list[data-ft="cuisineFilter"] ul.o-car { display: none; } .c-serp > div:first-child { width: 30%; } .c-serp > div:last-child { margin-left: 3%; } .c-restaurant.hidden { display: none; } /* General */ .clearfix:after { content: ""; display: table; clear: both; } .just-filter-tickbox { box-sizing: border-box; width: 20px; height: 20px; position: absolute; left: 0; display: inline-block; border: 1px solid #eaeaea; background-color: #fff; vertical-align: middle; margin-left: 0; margin-top: 0; -moz-box-shadow: 0 0 0 2px transparent,0 0 0 0 transparent; box-shadow: 0 0 0 2px transparent, 0 0 0 0 transparent; border-radius: 3px; cursor: pointer; } .just-filter-tickbox:before { content: ""; position: absolute; box-sizing: border-box; top: 0; left: 50%; -webkit-transform: translateX(-50%) rotate(45deg) scale(0); -moz-transform: translateX(-50%) rotate(45deg) scale(0); -ms-transform: translateX(-50%) rotate(45deg) scale(0); transform: translateX(-50%) rotate(45deg) scale(0); border: 2px solid #fff; background-color: transparent; width: 40%; height: 80%; border-top: 0; border-left: 0; display: block; opacity: 0; -moz-transition: all 0.25s ease-in-out; transition: all 0.25s ease-in-out; } li p:hover .just-filter-tickbox { border-color: #266abd; -moz-transition: all 0.25s ease-in-out; transition: all 0.25s ease-in-out; } .is-selected .just-filter-tickbox { background-color: #266abd; border: 3px solid #266abd; } .is-selected .just-filter-tickbox:before { opacity: 1; -webkit-transform: translateX(-50%) rotate(45deg) scale(1); -moz-transform: translateX(-50%) rotate(45deg) scale(1); -ms-transform: translateX(-50%) rotate(45deg) scale(1); transform: translateX(-50%) rotate(45deg) scale(1); } /* Cuisines Filters */ .c-serp-filter__list[data-ft="cuisineFilter"] ul.o-card { display: none; } .c-serp-filter__list[data-ft="cuisineFilter"] .o-card { padding: 8px; } .just-filter-cuisines li { border: 0; cursor: pointer; } .just-filter-cuisines li:hover, .just-filter-cuisines li:active { text-decoration: underline; } .just-filter-cuisines li p { padding: 8px 8px 8px 32px; margin-bottom: 5px; position: relative; } .just-filter-cuisines li.just-filter-separate-item { border-bottom: 1px solid #cacaca; margin-bottom: 8px; } .just-filter-cuisines li.is-selected { padding: 0; font-weight: 400; } .just-filter-cuisines li.is-hideable { display: none; } .just-filter-cuisines li.is-hideable.is-shown { display: block; } .just-filter-cuisines-control { color: #266abd; font-size: 16px; font-weight: 400; cursor: pointer; border-top: 1px solid #cacaca; padding-top: 15px; } .just-filter-cuisines-control .just-filter-cuisines-show-more { display: inline-block; background-image: url(\'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56"><path fill="%232F7DE1" d="M27.9 43.4c-1.5 0-3.1-.6-4.3-1.8L0 17.9l5.2-5.2 22.7 22.7 22.8-22.7 5.2 5.2-23.6 23.7c-1.2 1.2-2.7 1.8-4.4 1.8z"/></svg>\'); background-position: 100%; background-repeat: no-repeat; -moz-background-size: 14px; background-size: 14px; padding-right: 15px; width: 100%; box-sizing: border-box; } .just-filter-cuisines-control .just-filter-cuisines-show-fewer { display: none; background-image: url(\'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56"><path fill="%232F7DE1" d="M5.4 43.2L.2 37.9l23.5-23.4c2.3-2.3 6.2-2.3 8.5 0L55.8 38l-5.2 5.2L28 20.7 5.4 43.2z" class="st0"/></svg>\'); background-position: 100%; background-repeat: no-repeat; -moz-background-size: 14px; background-size: 14px; padding-right: 15px; width: 100%; box-sizing: border-box; } .just-filter-cuisines-control.just-filter-list-expanded .just-filter-cuisines-show-more { display: none; } .just-filter-cuisines-control.just-filter-list-expanded .just-filter-cuisines-show-fewer { display: inline-block; } .just-filter-hide-based-on-cuisine, .just-filter-hide-based-on-minorder, .just-filter-hide-based-on-freedelivery, .just-filter-hide-based-on-rating, .just-filter-hide-based-on-promotion { display: none; } /* New Filters */ #just-filter { width: 100%; background-color: #fff; border-bottom: 1px solid #cacaca; padding: 10px 0; } #just-filter .just-filter-wrapper { width: 100%; max-width: 940px; margin: 0 auto; } #just-filter .headline { font-size: 20px; font-family: "Ubuntu"; color: #333; font-weight: 500; } #just-filter ul { list-style: none; } #just-filter li { float: left; font-size: 18px; color: #000; cursor: pointer; padding: 5px 5px; margin: 0 15px; } #just-filter li.active { color: #266abd; font-weight: bold; } #just-filter li.active:hover, #just-filter li.active:active { color: #266abd; } #just-filter li:hover, #just-filter li:active { color: #E37222; } /* Overlay */ #just-filter-overlay { position: fixed; width: 100%; height: 100%; top: 0; left: 0; background-color: rgba(255, 255, 255, 0.5); z-index: 9; } #just-filter-overlay.hidden { display: none; } /* Scroll to the top button */ #just-filter-scroll-top { position: fixed; bottom: 10px; right: 10px; height: 40px; width: 40px; border-radius: 20px; background-color: #266abd; cursor: pointer; } #just-filter-scroll-top .just-filter-scroll-top-copy { color: #fff; font-size: 14px; line-height: 1; font-family: "Hind Vadodara", "Helvetica Neue", Helvetica, Arial, sans-serif; display: inline-block; position: absolute; bottom: 5px; width: 100%; text-align: center; } #just-filter-scroll-top .just-filter-scroll-top-icon { display: inline-block; position: absolute; top: 10px; left: 50%; height: 13px; width: 13px; -webkit-transform: translateX(-50%) rotate(-45deg) scale(1); -moz-transform: translateX(-50%) rotate(-45deg) scale(1); transform: translateX(-50%) rotate(-45deg) scale(1); border-width: 3px; border-style: solid; border-color: #fff #fff transparent transparent; transition: all 0.2s ease-in-out; } #just-filter-scroll-top:hover .just-filter-scroll-top-icon, #just-filter-scroll-top:active .just-filter-scroll-top-icon { top: 7px; transition: all 0.2s ease-in-out; } /*# sourceMappingURL=style.css.map */ </style>',
		html = '<div id="just-filter-scroll-top"><span class="just-filter-scroll-top-icon"></span><span class="just-filter-scroll-top-copy">TOP</span></div><div id="just-filter-overlay" class="hidden"></div> <div id="just-filter"> <div class="just-filter-wrapper"> <p class="headline">Filters:</p> <ul class="clearfix"> <li data-just-filter-type="open">Open</li> <li data-just-filter-type="minorder">Minimum Order 0-10&pound;</li> <li data-just-filter-type="freedelivery">Free Delivery</li> <li data-just-filter-type="rating">Rating min. 4/6</li> <li data-just-filter-type="promotion">Promotion</li> </ul> </div> </div>',
		htmlCuisines = '',
		highlightedCuisinesTypes = ['Burgers', 'Pizza', 'Chinese', 'Indian', 'Italian'],
		searchState = { cuisines: [], sorting: [], filters: [] },
		shouldIShowResults = false, // a flag indicating the timing for showing TR results (to control overlay animation and minimum overlay time)
		overlayAnimationTiming = [200, 400, 200, 600, 200]; // timing for overlay animation: [ overlay appear -> scrolling begins, scroll time, scrolling stops -> hiding TRs, no TRs shown, showing TRs -> removing overlay]

	var init = function(){

		// CSS styles and the filters element
		$('body').append( css );
		$('.c-serp__header.c-serp__header--primary').after(html);

		// change Cuisine filters title
		$('.c-serp-filter__list[data-ft="cuisineFilter"] h3').html( $('.c-serp-filter__list[data-ft="cuisineFilter"] h3').html().replace("Cuisines", "Cuisines and dishes") );

		// get object with TR based on IDs
		serpTRList_data = JSON.parse(window.localStorage.getItem("JE-GTM-serpTRList"));	

		// start with full TR list
		for (var _restaurantID in serpTRList_data ) {
			allTRs.push( _restaurantID );
		}

		TRtoShow = allTRs.slice();

		// add new Cuisines filters
		_buildCuisines();

		_addIDsToOffileRestaurants();

		// TODO: re-think this initial overlay animation
		// pre-select 'Open' filter
		searchState.filters.push('open');
		updateTRResults();
		$('#just-filter li[data-just-filter-type="open"]').addClass('active');

		// filters handler
		$('#just-filter li').on('click', function(){
			// FIXME: add 'disabled' check
			if( true ){
				var _filterType = $(this).data('just-filter-type');

				if( !$(this).hasClass('active') ){
					$('#just-filter-overlay').removeClass('hidden');
					searchState.filters.push(_filterType);
					$(this).addClass('active');
					updateTRResults();

				} else {
					searchState.filters.splice( searchState.filters.indexOf(_filterType), 1);	
					$(this).removeClass('active');
					updateTRResults();
				}				
			}
		});

		// 'Scroll to the top' buton 
		$('#just-filter-scroll-top').on('click', function(){
			scrollTo(0, 400 );
		});
	};

	var _addIDsToOffileRestaurants = function(){
		$('.c-serp__offline .c-restaurant').each(function(){
			var _tempData = $(this).find('.c-restaurant__logo').data('original').split('/').pop();
			_tempData = ""+_tempData.substr(0, _tempData.indexOf('.') );

			$(this).attr('data-restaurant-id', _tempData);
		});
	};

	var _buildCuisines = function(){

		var _htmlCuisinesHighlighted = '';
		var _htmlCuisinesNormal = '';

		htmlCuisines = '<div class="o-card"> <ul class="just-filter-cuisines">';

		// loop through current Cuisine DOM list
		// TODO: change it to rely solely on JS object
		$('.c-serp-filter__list[data-ft="cuisineFilter"] ul.o-card li').each(function(index){

			if( index === 0 ){
				// 'All' Cusines count
				htmlCuisines += '<li class="is-selected just-filter-separate-item" data-cuisine-type="all"><p><span class="just-filter-tickbox"></span>All <span class="just-filter-cuisine-count">(213)</span></p></li>';
			} else {

				var _title = $(this).find('a').attr('title');
				var _cuisineName = _title.substring(0, _title.indexOf(' (') );
				var _trCount = _title.substring( _title.indexOf(' (') +2, _title.length - 1 );

				// highlighted cuisines gathered at the top
				// TODO: arrange them in a specific and fixed order
				if( highlightedCuisinesTypes.indexOf( _cuisineName ) > -1 ){
					_htmlCuisinesHighlighted += '<li class="just-filter-highlighted-item" data-cuisine-type="'+_cuisineName.toLowerCase()+'"><p><span class="just-filter-tickbox"></span>'+_cuisineName+' <span class="just-filter-cuisine-count">('+_trCount+')</span></p></li>';
				} else {
					_htmlCuisinesNormal += '<li class="is-hideable" data-cuisine-type="'+_cuisineName.toLowerCase()+'"><p><span class="just-filter-tickbox"></span>'+_cuisineName+' <span class="just-filter-cuisine-count">('+_trCount+')</span></p></li>';
				}
			}
		});

		htmlCuisines += _htmlCuisinesHighlighted;
		htmlCuisines += _htmlCuisinesNormal;

		htmlCuisines += '</ul> <p class="just-filter-cuisines-control"> <span class="just-filter-cuisines-show-more">More Cuisines</span> <span class="just-filter-cuisines-show-fewer">Fewer Cuisiens</span> </p> </div>';

		$('.c-serp-filter__list[data-ft="cuisineFilter"] h3').after( htmlCuisines );

		// Cuisine Filters functionality
		$('.just-filter-cuisines li p').on('click', function(){
			// TODO: add check for disabled item
			if( true ){
				if( $(this).parent('li').hasClass('is-selected') ){
					$(this).parent('li').removeClass('is-selected');
				} else {
					$(this).parent('li').addClass('is-selected');
				}
				selectCuisine( $(this).closest('li').data('cuisine-type') );
			}
		});

		// Cuisines expand/hide list functionality
		$('.just-filter-cuisines-control').on('click', function(){
			if( $(this).hasClass('just-filter-list-expanded') ){
				$(this).removeClass('just-filter-list-expanded');
				$('.just-filter-cuisines li.is-hideable').removeClass('is-shown');
			} else {
				$(this).addClass('just-filter-list-expanded');
				$('.just-filter-cuisines li.is-hideable').addClass('is-shown');
			}
		});
	};

	var hideTRs = function() {

		// show overlay
		$('#just-filter-overlay').removeClass('hidden');

		setTimeout(function(){
			// scroll the viewport with animation
			// 1px from top of the page as a fix for restaurants' logo not loading (when at the top)
			scrollTo(1, overlayAnimationTiming[1] );

			setTimeout(function(){
				// hide all TRs
				$('.c-restaurant').addClass('hidden');

				setTimeout(function(){
					// allow to show TR results (minimum overlay time has passed)
					shouldIShowResults = true;	
				}, overlayAnimationTiming[3] );				
			}, overlayAnimationTiming[1] + overlayAnimationTiming[2] );
		}, overlayAnimationTiming[0] );
	};

	var showTRs = function() {

		// wait for minimum overlay time to pass
		var waitForHidingTRs = setInterval(function(){
			if( shouldIShowResults ){
				clearInterval();

				for (var i = TRtoShow.length - 1; i >= 0; i--) {
					$('.c-restaurant[data-restaurant-id="'+TRtoShow[i]+'"]').removeClass('hidden');
				}

				setTimeout(function(){
					$('#just-filter-overlay').addClass('hidden');
					shouldIShowResults = false;					
				}, overlayAnimationTiming[4] );
			}
		}, 50);
	};	

	var filterBy = function(filterType){

		var _temp_TRtoShow = TRtoShow.slice();

		for (var i = _temp_TRtoShow.length - 1; i >= 0; i--) {
			var _restaurantID = _temp_TRtoShow[i];
			var _hasPassedFilterConditions = false;

			switch(filterType){
				case "open":
					if( serpTRList_data[_restaurantID].open === true ){
						_hasPassedFilterConditions = true;
					}
					break;
				case "minorder":
					if( parseInt(serpTRList_data[_restaurantID].minAmount) <= 10 ){
						_hasPassedFilterConditions = true;
					}
					break;
				case "freedelivery":
					// free delivery and available collection conditions
					if( parseFloat(serpTRList_data[_restaurantID].deliveryCost) === 0 && serpTRList_data[_restaurantID].deliveryOptions.indexOf("delivery") >= 0 ){
						_hasPassedFilterConditions = true;
					}
					break;
				case "rating":
					if( parseFloat(serpTRList_data[_restaurantID].rating.average) >= 4 ){
						_hasPassedFilterConditions = true;
					}
					break;
				case "promotion":
					if( serpTRList_data[_restaurantID].promotion !== null && serpTRList_data[_restaurantID].promotion !== "" ){
						_hasPassedFilterConditions = true;
					}
					break;
				default:
					console.log("error: 'Just Filter' plugin doesn't recognise the filter");						
			}

			if( !_hasPassedFilterConditions ){
				TRtoShow.splice( TRtoShow.indexOf( _restaurantID ), 1);
			}
		}
	};	

	var selectCuisine = function(cuisineType){

		// update global scope of serachState
		if( cuisineType === 'all' ){
			// deselect all other cuisines
			$('.just-filter-cuisines li.is-selected').removeClass('is-selected');
			$('.just-filter-cuisines li[data-cuisine-type="all"]').addClass('is-selected');
			// if 'All' is selected
			searchState.cuisines = [];

		} else if( searchState.cuisines.indexOf(cuisineType) > -1 ){
			// deselect cuisine type
			searchState.cuisines.splice( searchState.cuisines.indexOf(cuisineType), 1);	
			// when deselecting the only/last cuisine switch to 'All'
			if( searchState.cuisines.length === 0 ){
				$('.just-filter-cuisines li[data-cuisine-type="all"]').addClass('is-selected');
			}

		} else {
			// deselect 'All' option
			$('.just-filter-cuisines li[data-cuisine-type="all"]').removeClass('is-selected');
			// add cuisite type to the list
			searchState.cuisines.push(cuisineType);
		}

		updateTRResults();
	};

	var updateTRResults = function(){
		// hide TRs with an animated changes and overlay
		hideTRs();

		TRtoShow = [];
		TRtoShow = allTRs.slice(); // reset

		// Filters
		// removes filtered out TRs
		if( searchState.filters.length > 0 ){

			for (var i = searchState.filters.length - 1; i >= 0; i--) {
				filterBy( searchState.filters[i] );
			}
		}

		// update 'All' TRs count at this point
		$('.just-filter-cuisines li[data-cuisine-type="all"] .just-filter-cuisine-count').html( '('+TRtoShow.length+')' );		

		// Cuisine types
		// filter available TRs by cuisines
		var _cuisinesCount = {}; //reset

		for (var i = TRtoShow.length - 1; i >= 0; i--) {

			var _restaurantID = TRtoShow[i];
			var _hasPassedFilterConditions = false; // flag for filtering out non-selected TRs

			if( typeof serpTRList_data[_restaurantID].cuisines != 'undefined' && serpTRList_data[_restaurantID].cuisines.trim().length > 1 ){

				var _cuisineTypes = serpTRList_data[_restaurantID].cuisines.toLowerCase().split(', ');

				if( _cuisineTypes.length >= 1){

					// loop through restaurant's cuisines
					for (var j = _cuisineTypes.length - 1; j >= 0; j--) {
						var _cuisineName = _cuisineTypes[j];

						// check if any of the cuisines is selected ('All' is not listed as a cuisine, hence the check for length)
						if( searchState.cuisines.length > 0 && searchState.cuisines.indexOf(_cuisineName) > -1 ){
							_hasPassedFilterConditions = true;
						}

						if( typeof _cuisinesCount[ _cuisineName ] === 'undefined' ){
                            _cuisinesCount[ _cuisineName ] = 1;
                        } else {
                            _cuisinesCount[ _cuisineName ] += 1;
                        }
					}
				}
			}

			// filter out TR if it's not selected ('All' is not listed as a cuisine, hence the check for length)
			if( searchState.cuisines.length > 0 && !_hasPassedFilterConditions ){
				TRtoShow.splice( TRtoShow.indexOf( _restaurantID ), 1);
			}
		}

		// update cuisines count
		for( var _cuisineType in _cuisinesCount ){
			$('.just-filter-cuisines li[data-cuisine-type="'+_cuisineType+'"] .just-filter-cuisine-count').html( '('+_cuisinesCount[ _cuisineType ]+')' );
		}

		// Sorting
		// rearranges TRs
		if( searchState.sorting.length > 0 ){
			
		}

		// update 'All' count in the header( total number of currently shown TRs )
		$('h1 .c-serp__header--count').html( TRtoShow.length );

		// show TRs
		showTRs();
	};

	// util function for scroll animation
	var easeInOut = function(currentTime, start, change, duration) {
	    currentTime /= duration / 2;
	    if (currentTime < 1) {
	        return change / 2 * currentTime * currentTime + start;
	    }
	    currentTime -= 1;
	    return Math.floor( -change / 2 * (currentTime * (currentTime - 2) - 1) + start );
	};

	// animated scrolling fn
	var scrollTo = function(to, duration) {

	    var start = (document.documentElement && document.documentElement.scrollTop) || 
	          document.body.scrollTop;
	    var change = to - start,
	        increment = 20;

	    var animateScroll = function(elapsedTime) { 
		     
	        elapsedTime += increment;
	        var position = easeInOut(elapsedTime, start, change, duration);  

	        // crude fix for cross-browser inconsistency between (IE11, FF) and (Chrome, Safari, Edge)
	        document.body.scrollTop = position;
			document.documentElement.scrollTop = position;

	        if (elapsedTime < duration) {
	            setTimeout(function() {
	                animateScroll(elapsedTime);
	            }, increment);
	        }
	    };

	    animateScroll(0);
	};

	return {
		init: init
	}
})();

$(document).ready(function(){
	JustFilterPlugin.init();	
});