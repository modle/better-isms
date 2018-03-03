var tags = {
  cloudData : {},
  generateCloudHtml : function() {
    // should there be a new data structure to handle a mapping of the tags?
    // {a: {atag1, atag2, atag3}, b: {btag1, btag2, btag3}}
    // if it were organized this way, there wouldn't be the need to check the letter of each tag
    // and it would be easier to wrap each tag grouping in a div of its own, which would allow
    // the use of flex to appropriately wrap them
    let tagCloud = "";
    Array.from(Object.keys(tags.cloudData)).sort().forEach( letter => {
      Array.from(Object.keys(tags.cloudData[letter])).sort().forEach( tag => {
        tagCloud += tags.htmlBuilder.getNextLetterIfNeeded(tag);
        tagCloud += '<span class="tagSpan">' + tags.htmlBuilder.buildLink(tag) + '</span>';
        tagCloud += tags.htmlBuilder.buildSeparator();
      });
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
        return '<div style="font-size:' + this.baseEmSize + 'em">' + currentLetter + ': </div>';
      };
      return "";
    },
    buildLink : function(tag) {
      let size = this.calculateSize(tag);
      return '<a href="#" ' +
        this.getCssClasses(tag) +
        ' rel="' + tag + '"' +
        'style="font-size:' + size + 'em" ' +
        '>' + tag + '</a>';
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
      var tagArray = Array.from(Object.values(tags.cloudData));
      var maxCount = Math.max.apply(null, tagArray);
      var minCount = Math.min.apply(null, tagArray);
      var range = 1 + maxCount - minCount;
      var tagCount = tags.cloudData[tag];
      var tagSizeRatio = tagCount / range;
      var finalEmSize = tagSizeRatio + this.baseEmSize;
      return finalEmSize;
    },
  },
  display : {
    setElement : function() {
      $("#tagCloud").html(tags.generateCloudHtml());
    },
    clearElement : function() {
      this.setElement("");
    },
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
  cloud : {
    add : function(tagsToAdd) {
      if (Array.isArray(tagsToAdd)) {
        for (i = 0; i < tagsToAdd.length; i++) {
          this.addToDict(tagsToAdd[i]);
        }
      } else {
        this.addToDict(tagsToAdd);
      }
    },
    addToDict : function(tagToAdd) {
      tagToAdd = tagToAdd.toLowerCase();
      tagLetter = tagToAdd.substring(0, 1);
      if (!(tagLetter in tags.cloudData)) {
        tags.cloudData[tagLetter] = {}
      }
      if (tagToAdd in tags.cloudData[tagLetter]) {
        tags.cloudData[tagLetter][tagToAdd] += 1;
      } else {
        tags.cloudData[tagLetter][tagToAdd] = 1;
      }
    },
  },
};
