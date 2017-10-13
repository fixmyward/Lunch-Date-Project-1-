# Lunch-Date (Project 1, Team 3)

**User Story:** As an urban office worker, I want to be able to find and discuss nearby restaurant options with a friend.  We then both get directions to a tasty lunch. 

**[Project Proposal](https://docs.google.com/document/d/1PQPgRwO9DvEastm3IRZoy6MZkn9RRP-yyEdNMpsNK18/)**


<!-- look up how link images of code for  -->
## Synopsis
An app which facilitates two friends in nearby locations discussing and choosing a restaurant at which to share lunch, providing each user directions to the mutually selected restaurant.

## Motivation
We were tired of using 3 different apps () when we could instead design a single app which contains the same functionality.

## Technology Utilized:

* Bootstrap
* Javascript/jQuery
* HTML5 Geolocation
* Mapbox Places API 
* Zomato API
* Mapbox Directions API
* Firebase

## Code Examples

**MapBox API**

```javascript

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

      $('#chosen-restaurant-name').text(restName);
      $('#steps-away').text(stepCount - 1);
      
      $('html, body').animate({
        scrollTop: $('#direction-row').offset().top
      }, 2000);

    });
  };

```

**Zomato API**

```javascript

function runRestaurantQuery(numResults, restaurantQueryURL) {

    $.ajax({
      url: restaurantQueryURL,
      method: 'GET'
    }).done(function(zomatoData) {

      // Loop through and provide the correct number of results
      for (var i = 0; i < numResults; i++) {

        resultCounter++;

        var restaurantName = zomatoData.restaurants[i].restaurant.name;
        var restaurantAddress = zomatoData.restaurants[i].restaurant.location.address;
        var restaurantAggRating = zomatoData.restaurants[i].restaurant.user_rating.aggregate_rating;
        var restaurantMenu = zomatoData.restaurants[i].restaurant.menu_url;
        var restaurantThumb = zomatoData.restaurants[i].restaurant.thumb;
        var restaurantLong = zomatoData.restaurants[i].restaurant.location.longitude;
        var restaurantLat = zomatoData.restaurants[i].restaurant.location.latitude;

        
        var resultSection = $('<div>');
        resultSection.addClass('restaurant');
        resultSection.attr('data-longitude', restaurantLong);
        resultSection.attr('data-latitude', restaurantLat);
        resultSection.attr('data-name', restaurantName);
        resultSection.attr('id', 'result-' + resultCounter);
        $('#results-section').append(resultSection);

  
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

```

**Firebase Chat**

```javascript

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

```

## Visual App Walk-Through
 
![Lunch Date walk-through](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Lunch Date in Action")

(Real animated GIF for above coming soon)

## Authors

* **Samuel Boediono** ([samuelboediono.github.io](https://dbmarshall.github.io))
* **Mathab Ghez** ([mghezel.github.io](https://mghezel.github.io))
* **Alex Iturreria** ([alexitu3.github.io](https://alexitu3.github.io))
* **David Morse** ([dbmarshall.github.io](https://dbmarshall.github.io))

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

