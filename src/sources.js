var sources = {
  getDisplayString : function(source) {
    return " " + source["title"] + " (" + source["author"] + ")";
  },
  generateCloud : function() {
    var sourceCloud = "";
    var splitSources = Object.keys(globals.sourceCloudDict).map(function(key) {
      return [key, globals.sourceCloudDict[key]];
    });
    splitSources.sort(function(first, second) {
      return second[1]['added'] - first[1]['added'];
    });
    for (var source of splitSources) {
      sourceCloud +=
        '<div class="sourceCloudEntry"><a href="#" class="linksourcefilter ' +
        content.highlightIfFiltered(source[0]) +
        '" rel="' +
        source[0] +
        '">' +
        sources.getDisplayString(source[1]) +
        "</a>";
      if (content.highlightIfFiltered(source[0])) {
        sourceCloud +=
          ' <button id="btnEditSource" class="submit-button" value="' +
          source[0] +
          '" style="display: inline-block;" onClick="openUpsertSourceForm()">Edit</button>';
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
}
