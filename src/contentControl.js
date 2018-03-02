var contentControl = {
  var props = {
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
    if (!this.filterType) {
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
    globals.filterId = $(this).attr("rel");
    eventClasses = $(this).attr("class");
    if (eventClasses.includes("linksourcefilter")) {
      globals.filterType = "source";
    } else if (eventClasses.includes("linktagfilter")) {
      globals.filterType = "tag";
    }
    contentControl.generate();
  },
  highlightIfFiltered : function(id) {
    if (id == globals.filterId) {
      return "highlighted";
    }
    return "";
  },
  clearFilter : function() {
    globals.filterType = "";
    globals.filterId = "";
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
    let sourceIndex = sources.getIndex(source._id);
    let ismIndex = sources.isms.getIndex(source.isms, ism);
    sources.removeIfIsmsIsEmpty(sourceIndex);
    forms.populateCommentIsmForm();
    this.props.targetIsms[sourceIndex].isms.splice(ismIndex, 1);
  },
};
