/*  
    Lunch Date app javascript
*/

$(document).ready(function() {

  var userLatitude = '';
  var userLongitude = '';
/* 
    navigator.geolocation  -------------------
*/
  navigator.geolocation.getCurrentPosition(function(position) {
    userLatitude = position.coords.latitude;
    userLongitude = position.coords.longitude;
    $('#geolocating-now').hide();
    $('#cuisine-choice').show();
  },
  function (error) { 
    if (error.code == error.PERMISSION_DENIED)
      $('#geolocating-now').hide();
      $("#location-address").show();
  });

/* 
    Mapbox Places API -------------------
*/
  var access_token = 'pk.eyJ1IjoibWFodGFiMTIiLCJhIjoiY2o4ZXppdDRrMTh0dTMzbXNjY3NoMnN0OCJ9.6jXHANiUibQbeXNIljgFUQ';
  var userAddress = '';
  var locationQueryURLBase = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  function runLocationQuery(locationQueryURL) {

    $.ajax({
      url: locationQueryURL,
      method: 'GET'
    }).done(function(locationData) {     

      userLongitude = locationData.features[0].center[0];
      userLatitude = locationData.features[0].center[1];

    });

  };

  // Runs location conversion from street address to lat/long
  $('#location-btn').on('click', function(event) {
    event.preventDefault();

    $('#display-latlong').empty();

    userAddress = $('#location').val().trim();

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
  // var searchRadius = '3000';
  var numResults = '10';
  var resultCounter = 0;

  var restaurantQueryURLBase = "https://developers.zomato.com/api/v2.1/search?apikey=" + apiKey;

  function runRestaurantQuery(numResults, restaurantQueryURL) {

    $.ajax({
      url: restaurantQueryURL,
      method: 'GET'
    }).done(function(zomatoData) {

      // Loop through and provide the correct number of results
      for (var i = 0; i < numResults; i++) {

        resultCounter++;

        // Create variables for data sought, and log results
        var restaurantName = zomatoData.restaurants[i].restaurant.name;
        var restaurantAddress = zomatoData.restaurants[i].restaurant.location.address;
        var restaurantAggRating = zomatoData.restaurants[i].restaurant.user_rating.aggregate_rating;
        var restaurantMenu = zomatoData.restaurants[i].restaurant.menu_url;
        var restaurantThumb = zomatoData.restaurants[i].restaurant.thumb;
        var restaurantLong = zomatoData.restaurants[i].restaurant.location.longitude;
        var restaurantLat = zomatoData.restaurants[i].restaurant.location.latitude;

        // Write results to page 
        var resultSection = $('<div>');
        resultSection.addClass('restaurant');
        resultSection.attr('data-longitude', restaurantLong);
        resultSection.attr('data-latitude', restaurantLat);
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
          .append('<h5>Rating: ' + restaurantAggRating + ' | <a href="' + restaurantMenu + '" target="_blank">Menu</a></h5>').append('<button type="submit" class="btn btn-primary" id="submit-btn">Get Directions</button>');
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

    var restaurantQueryURL = restaurantQueryURLBase + '&lat=' + userLatitude + '&lon=' + userLongitude + '&cuisines=' + searchCuisine + '&count=' + numResults;

    runRestaurantQuery(numResults, restaurantQueryURL);

    $("#restaurant-lists").show();

  });

/* 
    Mapbox Directions API -------------------
*/
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

      stepsLength = directionData.routes[0].legs[0].steps.length;

      for (i = 0; i < stepsLength; i++) {

        userDirection = directionData.routes[0].legs[0].steps[i].maneuver.instruction;
        
        $('#display-direction').append('<p><span class="label label-primary">' +
          stepCount + '</span> ' + userDirection + '</p>');

        stepCount++;

      }

      $('#display-direction').append('<p><strong>Enjoy your lunch date!</strong></p>');
        
      $('#direction-row, #display-directions').show();

      $('#steps-away').text(stepCount - 1);

      $('html, body').animate({
            scrollTop: $('#direction-row').offset().top
        }, 2000);

    });
  };

  $(document).on('click', '#results-section button', function(event) {
    
    event.preventDefault();

    $('#display-direction').empty();
    stepCount = 1;

    restLat = $(this).closest('.restaurant').attr('data-latitude');
    restLon = $(this).closest('.restaurant').attr('data-longitude');

    directionsQueryURL = directionsQueryURLBase + userLongitude + ',' + userLatitude + 
      ';' + restLon + ',' + restLat + 
      '?access_token=' + access_token + '&steps=' + steps;

    runDirectionsQuery(directionsQueryURL);

  });

/* 
    Chat -------------------
*/
  // Chat header behavior
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
  // Initialize Firebase for Chat
  var config = {
    apiKey: "AIzaSyACuYdpSh6e2wKU0XFX2Cc60C88e_oVKck",
    authDomain: "lunch-date-14315.firebaseapp.com",
    databaseURL: "https://lunch-date-14315.firebaseio.com",
    projectId: "lunch-date-14315",
    storageBucket: "",
    messagingSenderId: "759801042798"
  };
  firebase.initializeApp(config);

  var database =  firebase.database();
  var playersRef = database.ref('/players');
  var chatRef = database.ref('/chat');

  var playerId = 0;
  var playerSet = false;
  var name = '';

  // Chat listeners
  chatRef.on('child_removed', function(chatSnapshot) {
    $('#chat-area').empty();
    $('#chat-area').html('The other player has disconnected.');
    setTimeout(function() {
      $('#chat-area').empty();
    }, 3000);
  });
  chatRef.on('child_added', function(chatSnapshot) {

    if (playerSet) {
      if (chatSnapshot.val()) {

        var chatPlayer = chatSnapshot.val().playerId; 
        var chatName = chatSnapshot.val().name; 
        var chatMessage = chatSnapshot.val().message;
        var newChat = $('<p>')
          .addClass('playerid-' + chatPlayer)
          .html('<span class="chat-name">' + chatName + ':</span> ' + chatMessage);
        $('#chat-area').append(newChat);
        $('#chat-area').scrollTop($('#chat-area')[0].scrollHeight);
      }
    }

  }, function(errorObject) {
    console.log("The chat read failed: " + errorObject.code);
  });

  // User listener
  playersRef.on('value', function(playersSnapshot) {
    var playersNum = playersSnapshot.numChildren();

    if (!playerSet) {
      if (playersSnapshot.child('1').exists()) {
        playerId = 2;
      } else {
        playerId = 1;
      }
    }

  }, function(errorObject) {
    console.log("The player read failed: " + errorObject.code);
  });


  function writeChatData(playerId, name, message) {
    firebase.database().ref('chat').push({
      playerId: playerId,
      name: name,
      message: message,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  }

  function writeUserData(playerId, name) {
    firebase.database().ref('players/' + playerId).set({
      name: name
    });
  }

  // Chat send button
  $('#send-button').on('click', function() {

    if (playerSet) {

      // Do nothing if no message entered
      if ($('#chat-entry').val() !== '') {

        message = $('#chat-entry').val().trim();

        // Clear previous message
        $('#chat-entry').val('');

        writeChatData(playerId, name, message);

        chatRef.onDisconnect().remove();

      }
    }
  });

  // User start button, for enter name
  $('#start-button').on('click', function() {

    playerSet = true;

    name = $('#enter-name').val().trim();

    // Hide start/name element & show chat elements
    $('#start-chat').hide();
    $('#chat-wrapper').show();
    $('#player-name').text(name);
    $('#player-number').text(playerId);
    $('#player-info, #player-id').show();

    // Clear previous name value in input
    $('#enter-name').val('');

    writeUserData(playerId, name);

    playerRef = playersRef.child(playerId);
    playerRef.onDisconnect().remove();
  });

});
