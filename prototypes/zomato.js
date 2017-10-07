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
// https://developers.zomato.com/api/v2.1/search?apikey=9d1904342e147305e39dc198de1e915c&lat=37.789018&lon=-122.391506&cuisines=indian&radius=500&count=5


// FUNCTIONS
// =============

function runQuery(queryURL) {
  console.log(queryURL)

  $.ajax({
    url: queryURL,
    method: 'GET'
  }).done(function(numResults, searchURL) {

    // Logging the URL so we have access to it for troubleshooting
    console.log('------------------------------------');
    console.log('queryURL: ' + queryURL);
    // Log the zomatoData to console, where it will show up as an object
    console.log(zomatoData);
    console.log('------------------------------------');

    // Loop through and provide the correct number of results
    for (var i = 0; i < numResults; i++) {

      resultCounter++;

      // var resultSection = $('<div>');
      // resultSection.addClass('restaurant');
      // resultSection.attr('id', 'result-' + resultCounter);
      // $('#results-section').append(resultSection);

      // // Confirm that the specific JSON for the article isn't missing any details
      // // If the article has a headline include the headline in the HTML
      // if (zomatoData.response.restaurants.restaurant[i] !== 'null') {
      //   $('#result-' + resultCounter)
      //     .append(
      //       '<h3 class="articleHeadline"><span class="label label-primary">' +
      //       resultCounter + '</span><strong> ' +
      //       zomatoData.response.restaurants.restaurant[i].name + '</strong></h3>'
      //     );

      //   // Log the first article's headline to console
      //   console.log(zomatoData.response.docs[i].headline.main);
      // }

      // // If the article has a byline include the headline in the HTML
      // if (zomatoData.response.docs[i].byline && zomatoData.response.docs[i].byline.original) {
      //   $("#result-" + resultCounter)
      //     .append("<h5>" + zomatoData.response.docs[i].byline.original + "</h5>");

      //   // Log the first article's Author to console.
      //   console.log(zomatoData.response.docs[i].byline.original);
      // }

      // // Then display the remaining fields in the HTML (Section Name, Date, URL)
      // $("#articleWell-" + resultCounter)
      //   .append("<h5>Section: " + zomatoData.response.docs[i].section_name + "</h5>");
      // $("#articleWell-" + resultCounter)
      //   .append("<h5>" + zomatoData.response.docs[i].pub_date + "</h5>");
      // $("#articleWell-" + resultCounter)
      //   .append(
      //     "<a href='" + zomatoData.response.docs[i].web_url + "'>" +
      //     zomatoData.response.docs[i].web_url + "</a>"
      //   );

      // Log the fields to console
      console.log(zomatoData.response.restaurants.restaurant[i].name);
      console.log(zomatoData.response.restaurants.restaurant[i].location.address);
      console.log(zomatoData.response.restaurants.restaurant[i].user_rating.aggregate_rating);
    }
  });

}


// METHODS
// =============

// on.("click") function associated with the Search Button
$("#run-search").on("click", function(event) {
  event.preventDefault();

  resultCounter = 0;

  // Empties the previous results
  $('#results-section').empty();

  userLocation = $('#user-location').val().trim();
    console.log('userLocation: ' + userLocation);

  userLatitude = $('#user-latitude').val().trim();
    console.log('userLatitude: ' + userLatitude);

  userLongitude = $('#user-longitude').val().trim();
    console.log('userLongitude: ' + userLongitude);

  searchCuisine = $('#search-cuisine').val().trim();
    console.log('searchCuisine: ' + searchCuisine);

  searchRadius = $('#search-radius').val().trim();
    console.log('searchRadius: ' + searchRadius);

  numResults = $('#num-records-select').val();
    console.log('numResults: ' + numResults);

  var searchURL = queryURLBase + '&lat=' + userLatitude + '&lon=' + userLongitude + '&cuisines=' + searchCuisine + '&radius=' + searchRadius + '&count=' + numResults;
    console.log('searchURL: ' + searchURL);

  // startYear = $("#start-year").val().trim();
  // endYear = $("#end-year").val().trim();
  // if (parseInt(startYear)) {
  //   searchURL = searchURL + "&begin_date=" + startYear + "0101";
  // }
  // if (parseInt(endYear)) {
  //   searchURL = searchURL + "&end_date=" + endYear + "0101";
  // }

  runQuery(numResults, searchURL);
});

// This button clears the top articles section
$("#clear-all").on("click", function() {
  resultCounter = 0;
  $("#results-section").empty();
});
