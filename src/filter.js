var filterType = "";
var filterId = "";

function clearFilter() {
  filterType = "";
  filterId = "";
}

function prepFilter(event) {
  filterId = $(this).attr("rel");
  eventClasses = $(this).attr("class");
  if (eventClasses.includes("linksourcefilter")) {
    filterType = "source";
  } else if (eventClasses.includes("linktagfilter")) {
    filterType = "tag";
  }
  generateContent();
}
