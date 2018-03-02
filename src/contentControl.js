var contentControl = {
  props : {
    targetIsms: undefined,
    updateClouds : false,
    currentlyUpdating: undefined,
    filterType: "",
    filterId: "",
    sourceCloudDict: {},
    tagCloudDict: {},
  },
  prepClouds : function() {
    updateClouds = false;
    if (!this.props.filterType) {
      this.tagCloudDict = {};
      sourceCloudList = [];
      sourceCloudIds = [];
      updateClouds = true;
    }
  },
  generate : function() {
    log.enter(getName());
    auth.handleLogin();
    this.prepClouds();
    database.manageGetSourceListCall();
    url = database.determineIsmQueryUrl();
    database.getIsms(url);
    log.exit(getName());
  },
  prepFilter : function(event) {
    contentControl.props.filterId = $(this).attr("rel");
    eventClasses = $(this).attr("class");
    if (eventClasses.includes("linksourcefilter")) {
      contentControl.props.filterType = "source";
    } else if (eventClasses.includes("linktagfilter")) {
      contentControl.props.filterType = "tag";
    }
    contentControl.generate();
  },
  highlightIfFiltered : function(id) {
    if (id == this.props.filterId) {
      return "highlighted";
    }
    return "";
  },
  clearFilter : function() {
    this.props.filterType = "";
    this.props.filterId = "";
  },
  clearFilterAndReload : function() {
    contentControl.clearFilter();
    contentControl.generate();
  },
  hideFooter : function() {
    var footer = document.getElementById("footer");
    footer.style.display = "none";
  },
  showFooter : function() {
    var footer = document.getElementById("footer");
    footer.style.display = "block";
  },
  toggleTags : function() {
    let tagDiv = document.getElementById("tagCloud");
    if (tagDiv.style.display === "none" || !tagDiv.style.display) {
      tagDiv.style.display = "flex";
    } else {
      tagDiv.style.display = "none";
    }
  },
  toggleSources : function() {
    let sourceDiv = document.getElementById("sourceCloud");
    if (sourceDiv.style.display === "flex" || !sourceDiv.style.display) {
      sourceDiv.style.display = "none";
    } else {
      sourceDiv.style.display = "flex";
    }
  },
  hideElements : function(elements) {
    for (var element of elements) {
      contentControl.hideElement(element);
    }
  },
  hideElement : function(elementClass) {
    $("#" + elementClass).hide();
  },
  showElements : function(elements) {
    for (var element of elements) {
      contentControl.showElement(element);
    }
  },
  showElement : function(elementClass) {
    $("#" + elementClass).show();
  },
  setText : function(elementClass, text) {
    $("#" + elementClass).text(text);
  },
  removeTargetIsm : function(source, ism) {
    console.log('ism already commented: ', ism.comments, "; ism is: ", ism);
    let sourceIndex = this.targetIsmsControl.getSourceIndex(source._id);
    let ismIndex = this.targetIsmsControl.getIsmIndex(source.isms, ism._id);
    this.props.targetIsms[sourceIndex].isms.splice(ismIndex, 1);
    this.targetIsmsControl.removeIfIsmsIsEmpty(sourceIndex);
  },
  targetIsmsControl : {
    getSourceIndex : function(id) {
      return contentControl.props.targetIsms.findIndex(item => item._id === id);
    },
    getIsmIndex : function(isms, id) {
      return isms.findIndex(item => item._id === id);
    },
    removeIfIsmsIsEmpty : function(sourceIndex) {
      if (contentControl.props.targetIsms[sourceIndex].isms.length < 1) {
        contentControl.props.targetIsms.splice(sourceIndex, 1);
        return;
      }
    },
    removeFromList : function(sourceId, ismId) {
      let sourceIndex = contentControl.props.targetIsms.findIndex(aSource => aSource._id === sourceId);
      let ismIndex = contentControl.props.targetIsms[sourceIndex].isms.findIndex(anIsm => anIsm._id === ismId);
      if (ismIndex > -1) {
        contentControl.props.targetIsms[sourceIndex].isms.splice(ismIndex, 1);
      }
      this.removeIfIsmsIsEmpty(sourceIndex);
    },
    getWithoutComments : function() {
      log.enter(getName());
      contentControl.props.targetIsms = sources.isms.cached.filter( source => source.isms.length > 0 );
      log.exit(getName());
    },
  }
};
