// VARIABLES
// =============

// Zomato API authorization key
var apiKey = '9d1904342e147305e39dc198de1e915c';

var userLocation = '';
var userLatitude = '';
var userLongitude = '';
var searchCuisine = '';
var searchRadius = '';
var numResults = '';
var resultCounter = 0;

var queryURLBase = "https://developers.zomato.com/api/v2.1/search?apikey=" +
  apiKey;

// Fully formed query URL example:
// https://developers.zomato.com/api/v2.1/search?apikey=9d1904342e147305e39dc198de1e915c&lat=37.789018&lon=-122.391506&cuisines=95&radius=400&count=5


// FUNCTIONS
// =============

function runQuery(numResults, queryURL) {
  // console.log('runQuery(numResults, queryURL): ' + numResults + ' / ' + queryURL)

  $.ajax({
    url: queryURL,
    method: 'GET'
  }).done(function(zomatoData) {

    console.log('queryURL: ' + queryURL);

    // console.log('-------------');

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

      // Then display the remaining fields in the HTML (Section Name, Date, URL)
      $('#result-' + resultCounter)
        .append('<h5>Rating: ' + restaurantAggRating + ' | <a href="' + restaurantMenu + '" target="_blank">Menu</a></h5>');

    }

  });

}


// METHODS
// =============

// Runs Zomato search based on input data
$("#run-search").on("click", function(event) {
  event.preventDefault();

  resultCounter = 0;

  // Empties the previous results
  $('#results-section').empty();

  userLocation = $('#user-location').val().trim();
    // console.log('userLocation: ' + userLocation);

  userLatitude = $('#user-latitude').val().trim();
    // console.log('userLatitude: ' + userLatitude);

  userLongitude = $('#user-longitude').val().trim();
    // console.log('userLongitude: ' + userLongitude);

  searchCuisine = $('#search-cuisine').val().trim();
    // console.log('searchCuisine: ' + searchCuisine);

  searchRadius = $('#search-radius').val().trim();
    // console.log('searchRadius: ' + searchRadius);

  numResults = $('#num-records-select').val();
    // console.log('numResults: ' + numResults);

  var queryURL = queryURLBase + '&lat=' + userLatitude + '&lon=' + userLongitude + '&cuisines=' + searchCuisine + '&radius=' + searchRadius + '&count=' + numResults;
    // console.log('queryURL: ' + queryURL);

  // startYear = $("#start-year").val().trim();
  // endYear = $("#end-year").val().trim();
  // if (parseInt(startYear)) {
  //   queryURL = queryURL + "&begin_date=" + startYear + "0101";
  // }
  // if (parseInt(endYear)) {
  //   queryURL = queryURL + "&end_date=" + endYear + "0101";
  // }

  runQuery(numResults, queryURL);
});

// Clears results section
$("#clear-all").on("click", function() {
  resultCounter = 0;
  $("#results-section").empty();
});
