var tags = {
  cloudData : {},
  generateCloudHtml : function() {
    let tagCloud = "";
    Array.from(Object.keys(tags.cloudData)).sort().forEach( letter => {
      tagCloud += tags.htmlBuilder.letter.opening(letter);
      tagCloud += tags.htmlBuilder.tag(letter);
      tagCloud += tags.htmlBuilder.letter.closing(letter);
    });
    return tagCloud;
  },
  htmlBuilder : {
    colors : ["mediumseagreen", "tomato", "violet", "orange", "slateblue"],
    currentIndex : 0,
    baseEmSize : 1.5,
    previousLetter : "",
    letter : {
      opening : function(letter) {
        return '<div><span style="font-size: 2em">' + letter + ': </span>';
      },
      closing : function() {
        return '</div>';
      },
    },
    tag : function(letter) {
      theHtml = ""
      Array.from(Object.keys(tags.cloudData[letter])).sort().forEach( tag => {
        theHtml += '<span class="tagSpan">' + tags.htmlBuilder.buildLink(tag) + '</span>';
        theHtml += tags.htmlBuilder.buildSeparator();
      });
      return theHtml;
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
      if (!tagLetter) {
        return;
      }
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
