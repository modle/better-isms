function prepFilter(event) {
  globals.filterId = $(this).attr("rel");
  eventClasses = $(this).attr("class");
  if (eventClasses.includes("linksourcefilter")) {
    globals.filterType = "source";
  } else if (eventClasses.includes("linktagfilter")) {
    globals.filterType = "tag";
  }
  generateContent();
}
