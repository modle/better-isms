var tagCloudDict = {};

currentColorIndex = 0;
tagColors = ["mediumseagreen", "tomato", "violet", "orange", "slateblue"];

function getNextTagColor() {
  currentColorIndex += 1;
  if (currentColorIndex == tagColors.length) {
    currentColorIndex = 0;
  }
  return tagColors[currentColorIndex];
}

function highlightIfFiltered(id) {
  if (id == filterId) {
    return "highlighted";
  }
  return "";
}

function generateTagCloud() {
  var tagCloud = "";
  for (var tag of Array.from(Object.keys(tagCloudDict)).sort()) {
    var size = calculateTagSize(tag);
    tagCloud +=
      '<span><a href="#" class="linktagfilter ' +
      getNextTagColor() +
      " " +
      highlightIfFiltered(tag) +
      '" rel="' +
      tag +
      '" style="font-size:' +
      size +
      'em">';
    tagCloud += tag + "</a></span><span> </span>";
  }
  return tagCloud;
}

function setTagCloud(tagCloud) {
  $("#tagCloud").html(tagCloud);
}

function calculateTagSize(tag) {
  var tagArray = Array.from(Object.values(tagCloudDict));
  var maxCount = Math.max.apply(null, tagArray);
  var minCount = Math.min.apply(null, tagArray);
  var range = maxCount - minCount;
  var tagCount = tagCloudDict[tag];
  var tagSizeRatio = tagCount / range;
  var baseEmSize = 1;
  var finalEmSize = tagSizeRatio + baseEmSize;
  return finalEmSize;
}

function generateTagDivs(tags) {
  tagDivs = "";
  if (Array.isArray(tags)) {
    for (i = 0; i < tags.length; i++) {
      tagDivs += '<span class="tag field">';
      tagDivs += tags[i];
      tagDivs += "</span>";
    }
  } else {
    tagDivs += '<span class="tag field">';
    tagDivs += tags;
    tagDivs += "</span>";
  }
  return tagDivs;
}

function addToTags(tags) {
  if (Array.isArray(tags)) {
    for (i = 0; i < tags.length; i++) {
      addToTagDict(tags[i]);
    }
  } else {
    addToTagDict(tags);
  }
}

function addToTagDict(tag) {
  lowerCasedTag = tag.toLowerCase();
  if (lowerCasedTag in tagCloudDict) {
    tagCloudDict[lowerCasedTag] += 1;
  } else {
    tagCloudDict[lowerCasedTag] = 1;
  }
}

function clearTagCloud() {
  setTagCloud("");
}
