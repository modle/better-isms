var sourceCloudDict = {};

function getSourceDisplayString(source) {
  sourceValue = sourceCloudDict[source];
  return " " + sourceValue["title"] + "(" + sourceValue["author"] + ")";
}

function generateSourceCloud() {
  var sourceCloud = "";
  for (var source of Array.from(Object.keys(sourceCloudDict).sort())) {
    sourceCloud +=
      '<span><a href="#" class="linksourcefilter" rel="' + source + '">';
    sourceCloud += getSourceDisplayString(source) + "</a></span><br>";
  }
  return sourceCloud;
}

function generateSourceModalContent() {
  var sourceModalContent = "";
  for (var source of Array.from(Object.keys(sourceCloudDict).sort())) {
    sourceModalContent +=
      '<div><a href="#" class="linksource" rel="' + source + '">';
    sourceModalContent += getSourceDisplayString(source) + "</a></div>";
  }
  return sourceModalContent;
}

function setSourceCloud(sourceCloud) {
  $("#sourceCloud").html(sourceCloud);
}

function clearSourceCloud() {
  setSourceCloud("");
}

function setSourceModalContent(sourceModalContent) {
  $("#sourceListDiv").html(sourceModalContent);
}

function clearSourceModalContent() {
  setSourceModalContent("");
}
