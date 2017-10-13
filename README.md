# Lunch-Date (Project 1, Team 3)

**User Story:** As an urban office worker, I want to be able to find and discuss nearby restaurant options with a friend.  We then both get directions to a tasty lunch. 

**[Project Proposal](https://docs.google.com/document/d/1PQPgRwO9DvEastm3IRZoy6MZkn9RRP-yyEdNMpsNK18/)**


<!-- look up how link images of code for  -->
## Synopsis
An app which facilitates two friends in nearby locations discussing and choosing a restaurant at which to share lunch, providing each user directions to the mutually selected restaurant.

## Motivation
Instead of using three different apps (Yelp, google maps and text message) to arrange a lunch date, we could design a single app which contains the same functionality.

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

        // Create variables for data sought, and log results
        ...

        // Write results to page 
        ...

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
          .append('<h5>Rating: ' + restaurantAggRating + ' | <a href="' + restaurantMenu + '" target="_blank">Menu</a></h5>')
          .append('<button type="submit" class="btn btn-primary" id="submit-btn">Get Directions</button>');
      }

      $("#direction-row").hide();
      $("#restaurant-lists").show();

      $('html, body').animate({
        scrollTop: $('#restaurant-lists').offset().top
      }, 2000);


    });

  }

```

**Firebase Chat**

```javascript

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

```

## Visual App Walk-Through
 
![Lunch Date walk-through](https://samuelboediono.github.io/Lunch-Date-Project-1-/assets/images/LunchDate_animated_600.gif "Lunch Date in Action")

## Authors

* **Samuel Boediono** ([samuelboediono.github.io](https://dbmarshall.github.io))
* **Mathab Ghez** ([mghezel.github.io](https://mghezel.github.io))
* **Alex Iturreria** ([alexitu3.github.io](https://alexitu3.github.io))
* **David Morse** ([dbmarshall.github.io](https://dbmarshall.github.io))

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

