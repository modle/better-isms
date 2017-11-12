var sourceCloudDict = {};

function getSourceDisplayString(source) {
  sourceValue = sourceCloudDict[source];
  return " " + sourceValue["title"] + " (" + sourceValue["author"] + ")";
}

function generateSourceCloud() {
  var sourceCloud = "";
  for (var source of Array.from(Object.keys(sourceCloudDict).sort())) {
    sourceCloud +=
      '<div class="sourceCloudEntry"><a href="#" class="linksourcefilter ' +
      highlightIfFiltered(source) +
      '" rel="' +
      source +
      '">' +
      getSourceDisplayString(source) +
      "</a>";
    if (highlightIfFiltered(source)) {
      sourceCloud +=
        '<button id="btnEditSource" class="submit-button" value="' +
        source +
        '" style="display: inline-block;" onClick="openUpsertSourceForm()">Edit</button>';
    }
    sourceCloud += "</div>";
  }
  return sourceCloud;
}

function setSourceCloud(sourceCloud) {
  $("#sourceCloud").html(sourceCloud);
}

function clearSourceCloud() {
  setSourceCloud("");
}
