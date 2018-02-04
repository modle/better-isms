var sourceCloudDict = {};

function getSourceDisplayString(source) {
  return " " + source["title"] + " (" + source["author"] + ")";
}

function getSourceDisplayStringFromDict(source) {
  sourceValue = sourceCloudDict[source];
  return " " + sourceValue["title"] + " (" + sourceValue["author"] + ")";
}

function generateSourceCloud() {
  var sourceCloud = "";
  var splitSources = Object.keys(sourceCloudDict).map(function(key) {
    return [key, sourceCloudDict[key]];
  });
  splitSources.sort(function(first, second) {
    return second[1]['added'] - first[1]['added'];
  });
  for (var source of splitSources) {
    sourceCloud +=
      '<div class="sourceCloudEntry"><a href="#" class="linksourcefilter ' +
      highlightIfFiltered(source[0]) +
      '" rel="' +
      source[0] +
      '">' +
      getSourceDisplayString(source[1]) +
      "</a>";
    if (highlightIfFiltered(source[0])) {
      sourceCloud +=
        ' <button id="btnEditSource" class="submit-button" value="' +
        source[0] +
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
