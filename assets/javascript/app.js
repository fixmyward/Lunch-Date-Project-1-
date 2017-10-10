/*  
    Lunch Date app javascript
*/

$(document).ready(function() {

/* 
    Mapbox Places API -------------------
*/
  var access_token = 'pk.eyJ1IjoibWFodGFiMTIiLCJhIjoiY2o4ZXppdDRrMTh0dTMzbXNjY3NoMnN0OCJ9.6jXHANiUibQbeXNIljgFUQ';
  var userAddress = '';
  var userLatitude = '';
  var userLongitude = '';
  var locationQueryURLBase = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  function runLocationQuery(locationQueryURL) {
          // console.log(locationQueryURLBase);

    $.ajax({
      url: locationQueryURL,
      method: 'GET'
    }).done(function(locationData) {     

      userLongitude = locationData.features[0].center[0];
      userLatitude = locationData.features[0].center[1];
      console.log(userLongitude);
      console.log(userLatitude);
      console.log("------------");

    });

  };

  // Runs location conversion from street address to lat/long
  $('#location-btn').on('click', function(event) {
    event.preventDefault();

    $('#display-latlong').empty();

    userAddress = $('#location').val().trim();
         console.log(userAddress);

    userAddress = encodeURIComponent(userAddress);

    var locationQueryURL = locationQueryURLBase + '/' + '&place_name=' + userAddress + '.json?access_token=' + access_token;

    runLocationQuery(locationQueryURL);

    $("#cuisine-choice").show();
  });

/* 
    Zomato API -------------------
*/
  var apiKey = '9d1904342e147305e39dc198de1e915c';

  var searchCuisine = '';
  var searchRadius = '400';
  var numResults = '5';
  var resultCounter = 0;

  var restaurantQueryURLBase = "https://developers.zomato.com/api/v2.1/search?apikey=" + apiKey;

  function runRestaurantQuery(numResults, restaurantQueryURL) {

    $.ajax({
      url: restaurantQueryURL,
      method: 'GET'
    }).done(function(zomatoData) {

      console.log('restaurantQueryURL: ' + restaurantQueryURL);

      // Loop through and provide the correct number of results
      for (var i = 0; i < numResults; i++) {

        resultCounter++;

        // Create variables for data sought, and log results
        var restaurantName = zomatoData.restaurants[i].restaurant.name;
        var restaurantAddress = zomatoData.restaurants[i].restaurant.location.address;
        var restaurantAggRating = zomatoData.restaurants[i].restaurant.user_rating.aggregate_rating;
        var restaurantMenu = zomatoData.restaurants[i].restaurant.menu_url;
        var restaurantThumb = zomatoData.restaurants[i].restaurant.thumb;

        // Write results to page 
        var resultSection = $('<div>');
        resultSection.addClass('restaurant');
        resultSection.attr('id', 'result-' + resultCounter);
        $('#results-section').append(resultSection);

        // Confirm that the specific JSON for the result isn't missing any details
        if (restaurantThumb !== 'null') {
          $('#result-' + resultCounter)
            .append('<div class="restaurant-thumb"><img src="'+ restaurantThumb + '"></div>');
        }
        if (restaurantName !== 'null') {
          $('#result-' + resultCounter)
            .append(
              '<h3 class="articleHeadline"><span class="label label-primary">' +
              resultCounter + '</span><strong> ' +
              restaurantName + '</strong></h3>'
            );
        }
        if (restaurantAddress !== 'null') {
          $('#result-' + resultCounter)
            .append('<h5> '+ restaurantAddress + '</h5>');
        }

        // Then display the remaining fields
        $('#result-' + resultCounter)
          .append('<h5>Rating: ' + restaurantAggRating + ' | <a href="' + restaurantMenu + '" target="_blank">Menu</a></h5>');

      }

    });

  }

  // Runs Zomato search
  $("#search-cuisine").on("change", function(event) {
    event.preventDefault();

    resultCounter = 0;

    // Empties the previous results
    $('#results-section').empty();

    searchCuisine = $('#search-cuisine').val();
    
      console.log(userLongitude);
      console.log(userLatitude);

    var restaurantQueryURL = restaurantQueryURLBase + '&lat=' + userLatitude + '&lon=' + userLongitude + '&cuisines=' + searchCuisine + '&radius=' + searchRadius + '&count=' + numResults;

    runRestaurantQuery(numResults, restaurantQueryURL);

    $("#restaurant-lists").show();
    $("#direction-row").show();
  });

/* 
    Mapbox Directions API -------------------
*/
  // var userAddress = '';
  // var userLat = '';
  // var userLon = '';
  var restAddress = '';
  var restLat = '';
  var restLon = '';
  var steps = true;
  var stepCount = 1;

  var directionsQueryURLBase = 'https://api.mapbox.com/directions/v5/mapbox/walking/';

  function runDirectionsQuery(directionsQueryURL) {

    $.ajax({
      url: directionsQueryURL,
      method: 'GET'
    }).done(function(directionData) {  
        // console.log(directionData);

      stepsLength = directionData.routes[0].legs[0].steps.length;
        //console.log('stepsLength: ' + stepsLength);

      for (i = 0; i < stepsLength; i++) {

        userDirection = directionData.routes[0].legs[0].steps[i].maneuver.instruction;
        
        $('#display-direction').append('<p><span class="label label-primary">' +
          stepCount + '</span> ' + userDirection + '</p>');

        stepCount++;

      }

      $('#display-direction').append('<p><strong>Enjoy your lunch date!</strong></p>');
        
      $('#display-directions').show();

    });
  };

  $('#directions-btn').on('click', function(event) {
    event.preventDefault();

    $('#display-direction').empty();

    userLat = $('#user-lat').val().trim();
      console.log(userLat);
    userLon = $('#user-lon').val().trim();
      console.log(userLon);

    restLat = $('#rest-lat').val().trim();
      console.log(restLat);
    restLon = $('#rest-lon').val().trim();
      console.log(restLon);

    //userAddress = encodeURIComponent(userAddress);
    
    // https://api.mapbox.com/directions/v5/mapbox/cycling/-122.42,37.78;-77.03,38.91?steps=true&alternatives=true&access_token=your-access-token
    directionsQueryURL = directionsQueryURLBase + userLon + ',' + userLat + 
      ';' + restLon + ',' + restLat + 
      '?access_token=' + access_token + '&steps=' + steps;

      // console.log(queryURL);

    // $('#display-directions').append('Click to see directions JSON: <a href="' + queryURL + '" target="_blank">https://api.mapbox.com/directions/v5/mapbox/walking/...</a>');

    runDirectionsQuery(directionsQueryURL);
  });

/* 
    Chat -------------------
*/
  var closedHeight = 48;
  var openHeight = 170;
  $('#chat-heading').on('click', function(event) {
    footerHeight = $(this).closest('.footer').outerHeight();
    if (footerHeight !== openHeight) {
      $('.footer').css('height', openHeight);
      $('.container').css('margin-bottom', openHeight);
      $(this).attr('title', 'Click to close chat');
      $(this).toggleClass('collapsed');
    } else {
      $('.footer').css('height', closedHeight);
      $('.container').css('margin-bottom', closedHeight);
      $(this).attr('title', 'Click to open chat');
      $(this).toggleClass('collapsed');
    }
  });

});
