var sources = {
  getDisplayString : function(source) {
    return " " + source["title"] + " (" + source["author"] + ")";
  },
  generateCloud : function() {
    var sourceCloud = "";
    var splitSources = Object.keys(contentControl.props.sourceCloudDict).map(function(key) {
      return [key, contentControl.props.sourceCloudDict[key]];
    });
    splitSources.sort(function(first, second) {
      return second[1]['added'] - first[1]['added'];
    });
    for (var source of splitSources) {
      sourceCloud +=
        '<div class="sourceCloudEntry"><a href="#" class="linksourcefilter ' +
        contentControl.highlightIfFiltered(source[0]) +
        '" rel="' +
        source[0] +
        '">' +
        sources.getDisplayString(source[1]) +
        "</a>";
      if (contentControl.highlightIfFiltered(source[0])) {
        sourceCloud +=
          ' <button id="btnEditSource" class="submit-button" value="' +
          source[0] +
          '" style="display: inline-block;" onClick="database.openUpsertSourceForm()">Edit</button>';
      }
      sourceCloud += "</div>";
    }
    return sourceCloud;
  },
  setCloud : function(sourceCloud) {
    $("#sourceCloudContents").html(sourceCloud);
  },
  clearCloud : function() {
    this.setCloud("");
  },
  getRandom : function(sources) {
    return sources[Math.floor(Math.random() * sources.length)];
  },
  isms : {
    cached : {},
    getRandom : function(source) {
      return source.isms[Math.floor(Math.random() * source.isms.length)];
    },
  }
}
