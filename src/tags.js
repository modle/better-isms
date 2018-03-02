var tags = {
  currentIndex : 0,
  colors : ["mediumseagreen", "tomato", "violet", "orange", "slateblue"],
  getNextColor : function() {
    tags.currentIndex += 1;
    if (tags.currentIndex == tags.colors.length) {
      tags.currentIndex = 0;
    }
    return tags.colors[tags.currentIndex];
  },
  generateCloud : function() {
    var tagCloud = "";
    for (var tag of Array.from(Object.keys(globals.tagCloudDict)).sort()) {
      var size = tags.calculateSize(tag);
      tagCloud +=
        '<span class="tagSpan"><a href="#" class="linktagfilter ' +
        tags.getNextColor() +
        " " +
        contentControl.highlightIfFiltered(tag) +
        '" rel="' +
        tag +
        '" style="font-size:' +
        size +
        'em">';
      tagCloud += tag + "</a></span><span>&nbsp;</span>";
    }
    return tagCloud;
  },
  setCloud : function(tagCloud) {
    $("#tagCloud").html(tagCloud);
  },
  calculateSize : function(tag) {
    var tagArray = Array.from(Object.values(globals.tagCloudDict));
    var maxCount = Math.max.apply(null, tagArray);
    var minCount = Math.min.apply(null, tagArray);
    var range = maxCount - minCount;
    var tagCount = globals.tagCloudDict[tag];
    var tagSizeRatio = tagCount / range;
    var baseEmSize = 1.5;
    var finalEmSize = tagSizeRatio + baseEmSize;
    return finalEmSize;
  },
  generateDivs : function(tagsToUse) {
    tagDivs = "";
    if (Array.isArray(tagsToUse)) {
      for (i = 0; i < tagsToUse.length; i++) {
        tagDivs += '<span class="tag field">';
        tagDivs += tagsToUse[i];
        tagDivs += "</span>";
      }
    } else {
      tagDivs += '<span class="tag field">';
      tagDivs += tagsToUse;
      tagDivs += "</span>";
    }
    return tagDivs;
  },
  add : function(tagsToAdd) {
    if (Array.isArray(tagsToAdd)) {
      for (i = 0; i < tagsToAdd.length; i++) {
        tags.addToDict(tagsToAdd[i]);
      }
    } else {
      tags.addToDict(tagsToAdd);
    }
  },
  addToDict : function(tagToAdd) {
    lowerCasedTag = tagToAdd.toLowerCase();
    if (lowerCasedTag in globals.tagCloudDict) {
      globals.tagCloudDict[lowerCasedTag] += 1;
    } else {
      globals.tagCloudDict[lowerCasedTag] = 1;
    }
  },
  clearCloud : function() {
    setCloud("");
  },
};
