var filter = "";
var filterId = "";

function clearFilter() {
  filter = "";
  filterId = "";
  generateContent();
}

function prepFilter(event) {
  filterId = $(this).attr("rel");
  eventClasses = $(this).attr("class");
  if (eventClasses.includes("linksourcefilter")) {
    filter = "source";
  } else if (eventClasses.includes("linktagfilter")) {
    filter = "tag";
  }
  generateContent();
}
