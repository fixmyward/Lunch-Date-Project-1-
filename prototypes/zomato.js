// VARIABLES
// =============

// Zomato API authorization key
var authKey = '717e99a4555f6f42df499e13e387af0b';

var searchLocation = '';
var searchCuisine = '';

var queryURLBase = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" +
  authKey + "&q=";

var resultCounter = 0;

// FUNCTIONS
// =============

// This runQuery function expects two parameters:
// (the number of articles to show and the final URL to download data from)
function runQuery(numResults, queryURL) {
  console.log(queryURL)

  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(zomatoData) {

    // Logging the URL so we have access to it for troubleshooting
    console.log("------------------------------------");
    console.log("URL: " + queryURL);
    console.log("------------------------------------");

    // Log the zomatoData to console, where it will show up as an object
    console.log(zomatoData);
    console.log("------------------------------------");

    // Loop through and provide the correct number of articles
    for (var i = 0; i < numResults; i++) {

      // Add to the Article Counter (to make sure we show the right number)
      resultCounter++;

      // Create the HTML well (section) and add the article content for each
      var wellSection = $("<div>");
      wellSection.addClass("well");
      wellSection.attr("id", "result-" + resultCounter);
      $("#results-section").append(wellSection);

      // Confirm that the specific JSON for the article isn't missing any details
      // If the article has a headline include the headline in the HTML
      if (zomatoData.response.docs[i].headline !== "null") {
        $("#result-" + resultCounter)
          .append(
            "<h3 class='articleHeadline'><span class='label label-primary'>" +
            resultCounter + "</span><strong> " +
            zomatoData.response.docs[i].headline.main + "</strong></h3>"
          );

        // Log the first article's headline to console
        console.log(zomatoData.response.docs[i].headline.main);
      }

      // If the article has a byline include the headline in the HTML
      if (zomatoData.response.docs[i].byline && zomatoData.response.docs[i].byline.original) {
        $("#result-" + resultCounter)
          .append("<h5>" + zomatoData.response.docs[i].byline.original + "</h5>");

        // Log the first article's Author to console.
        console.log(zomatoData.response.docs[i].byline.original);
      }

      // Then display the remaining fields in the HTML (Section Name, Date, URL)
      $("#articleWell-" + resultCounter)
        .append("<h5>Section: " + zomatoData.response.docs[i].section_name + "</h5>");
      $("#articleWell-" + resultCounter)
        .append("<h5>" + zomatoData.response.docs[i].pub_date + "</h5>");
      $("#articleWell-" + resultCounter)
        .append(
          "<a href='" + zomatoData.response.docs[i].web_url + "'>" +
          zomatoData.response.docs[i].web_url + "</a>"
        );

      // Log the remaining fields to console as well
      console.log(zomatoData.response.docs[i].pub_date);
      console.log(zomatoData.response.docs[i].section_name);
      console.log(zomatoData.response.docs[i].web_url);
    }
  });

}

// METHODS
// =============

// on.("click") function associated with the Search Button
$("#run-search").on("click", function(event) {
  // This line allows us to take advantage of the HTML "submit" property
  // This way we can hit enter on the keyboard and it registers the search
  // (in addition to clicks).
  event.preventDefault();

  // Initially sets the resultCounter to 0
  resultCounter = 0;

  // Empties the region associated with the articles
  $("#results-section").empty();

  userLocation = $("#user-location").val().trim();
  var searchURL = queryURLBase + userLocation;

  numResults = $("#num-records-select").val();

  // startYear = $("#start-year").val().trim();
  // endYear = $("#end-year").val().trim();
  // if (parseInt(startYear)) {
  //   searchURL = searchURL + "&begin_date=" + startYear + "0101";
  // }
  // if (parseInt(endYear)) {
  //   searchURL = searchURL + "&end_date=" + endYear + "0101";
  // }

  // include to the runQuery function
  runQuery(numResults, searchURL);
});

// This button clears the top articles section
$("#clear-all").on("click", function() {
  resultCounter = 0;
  $("#results-section").empty();
});
