var tags = {
  generateCloud : function() {
    // should there be a new data structure to handle a mapping of the tags?
    // {a: {atag1, atag2, atag3}, b: {btag1, btag2, btag3}}
    let tagCloud = "";
    Array.from(Object.keys(contentControl.props.tagCloudDict)).sort().forEach( tag => {
      tagCloud += tags.htmlBuilder.getNextLetterIfNeeded(tag);
      tagCloud += '<span class="tagSpan">' + tags.htmlBuilder.buildLink(tag) + '</span>';
      tagCloud += tags.htmlBuilder.buildSeparator();
    });
    return tagCloud;
  },
  htmlBuilder : {
    colors : ["mediumseagreen", "tomato", "violet", "orange", "slateblue"],
    currentIndex : 0,
    baseEmSize : 1.5,
    previousLetter : "",
    getNextLetterIfNeeded : function(tag) {
      currentLetter = tag.substring(0, 1);
      if (currentLetter != this.previousLetter) {
        this.previousLetter = currentLetter;
        return '<br><div style="font-size:' + tags.baseEmSize + '">' + currentLetter + ': </div>';
      };
      return "";
    },
    buildLink : function(tag) {
      let size = this.calculateSize(tag);
      return '<a href="#" ' +
        this.getCssClasses(tag) +
        ' rel="' + tag + '"' +
        'style="font-size:' + size + 'em" ' +
        '>' +tag + '</a>';
    },
    getCssClasses : function(tag) {
      return 'class="linktagfilter ' +
        this.getNextColor() +
        " " +
        contentControl.highlightIfFiltered(tag) +
        '"';
    },
    getNextColor : function() {
      this.currentIndex += 1;
      if (this.currentIndex == this.colors.length) {
        this.currentIndex = 0;
      }
      return this.colors[this.currentIndex];
    },
    buildSeparator : function() {
      return '<span>&nbsp;</span>';
    },
    calculateSize : function(tag) {
      var tagArray = Array.from(Object.values(contentControl.props.tagCloudDict));
      var maxCount = Math.max.apply(null, tagArray);
      var minCount = Math.min.apply(null, tagArray);
      var range = maxCount - minCount;
      var tagCount = contentControl.props.tagCloudDict[tag];
      var tagSizeRatio = tagCount / range;
      var baseEmSize = 1.5;
      var finalEmSize = tagSizeRatio + baseEmSize;
      return finalEmSize;
    },
  },
  setCloud : function(tagCloud) {
    $("#tagCloud").html(tagCloud);
  },
  generateDivsForIsm : function(tagsToUse) {
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
    if (lowerCasedTag in contentControl.props.tagCloudDict) {
      contentControl.props.tagCloudDict[lowerCasedTag] += 1;
    } else {
      contentControl.props.tagCloudDict[lowerCasedTag] = 1;
    }
  },
  clearCloud : function() {
    setCloud("");
  },
  buildArray : function(tags) {
    if (Array.isArray(tags)) {
      return tags;
    }
    return Array.from(
      tags
      .trim()
      .toLowerCase()
      .split(/\s*,\s*/)
    );
  },
};
