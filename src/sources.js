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
  removeIfIsmsIsEmpty : function(sourceIndex) {
    if (contentControl.props.targetIsms[sourceIndex].isms.length < 1) {
      contentControl.props.targetIsms.splice(sourceIndex, 1);
      return;
    }
  },
  getIndex : function(id) {
    return contentControl.props.targetIsms.findIndex(item => item._id === id);
  },
  isms : {
    cached : {},
    getRandom : function(source) {
      return source.isms[Math.floor(Math.random() * source.isms.length)];
    },
    removeFromList : function(sourceId, ismId) {
      let sourceIndex = contentControl.props.targetIsms.findIndex(aSource => aSource._id === sourceId);
      let ismIndex = contentControl.props.targetIsms[sourceIndex].isms.findIndex(anIsm => anIsm._id === ismId);
      if (ismIndex > -1) {
        contentControl.props.targetIsms[sourceIndex].isms.splice(ismIndex, 1);
      }
      sources.removeIfIsmsIsEmpty(sourceIndex);
    },
    getWithoutComments : function() {
      log.enter(getName());
      contentControl.props.targetIsms = sources.isms.cached.filter( source => source.isms.length > 0 );
      log.exit(getName());
    },
    getIndex : function(isms, id) {
      return isms.findIndex(item => item._id === id);
    },
  }
}
