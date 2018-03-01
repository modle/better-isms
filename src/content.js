var updateClouds = false;

var content = {
  clearIsmDivs : function() {
    this.setIsmsList("");
  },
  generateIsmHeaders : function() {
    var divHeaders = "";
    divHeaders += '<div class="record"><span class="source">source</span> | ';
    divHeaders += '<span class="num">page number</span> | ';
    divHeaders += '<span class="tag">tags</span> | ';
    divHeaders += '<span class="quote">quote</span> | ';
    divHeaders += '<span class="comment">comments</span>';
    divHeaders += "</div>";
    divHeaders += "<hr>";
    divHeaders += "<hr>";
    return divHeaders;
  },
  addIsmDiv : function(source, details, tags) {
    var divContent = "";
    var comments = details.comments === undefined ? "" : details.comments;
    divContent +=
      '<div class="record"><span class="source field">' +
      getSourceDisplayStringFromDict(source._id) +
      "</span> | ";
    divContent += '<span class="num field">' + details.number + "</span> | ";
    divContent += generateTagDivs(tags) + " | ";
    divContent += '<span class="quote field">' + details.quote + "</span> | ";
    divContent += '<span class="comment field">' + comments + "</span> | ";
    divContent +=
      '<a href="#" class="linkeditism" rel="' +
      source._id +
      ":" +
      details._id +
      '">edit</a> | ';
    divContent +=
      '<a href="#" class="linkdeleteism" rel="' +
      source._id +
      ":" +
      details._id +
      '">delete</a> | ';
    divContent += "</div>";
    divContent += "<hr>";
    return divContent;
  },
  setIsmsList : function(ismDivs) {
    $("#ismList isms").html(ismDivs);
  },
  manageGetIsmListCall : function(url) {
    ismDivs = this.generateIsmHeaders();
    $.ajax({
      type: "GET",
      url: url,
      dataType: "JSON"
    }).done(function(response) {
      globals.cachedIsms = response;
      $.each(response, function() {
        var source = this;
        source.isms.forEach(function(ism) {
          var tags = ism["tags"];
          if (updateClouds) {
            addToTags(tags);
          }
          ismDivs += content.addIsmDiv(source, ism, tags);
        });
      });
      content.setIsmsList(ismDivs);
      var tagCloud = generateTagCloud();
      setTagCloud(tagCloud);
    });
  },
  getIsmsWithoutComments : function() {
    console.log("entering getIsmsWithoutComments");
    globals.targetIsms = globals.cachedIsms.filter( source => source.isms.length > 0 );
    console.log("exiting getIsmsWithoutComments");
  },
  kickOffUpdateForm : function(type) {
    if (type === 'uncommented') {
      this.kickOffCommentUpdateForm();
    } else if (type === 'untagged') {
      this.kickOffTagmeUpdateForm();
    }
  },
  kickOffCommentUpdateForm : function() {
    console.log("entering kickOffCommentUpdateForm");
    forms.clearAll();
    if(this.populateCommentIsmForm() && globals.targetIsms.length > 0) {
      hideFooter();
      showModal(uncommentedUpdateFormModal);
      globals.currentlyUpdating = 'uncommented';
      $("#newComments").focus();
    }
    console.log("exiting kickOffCommentUpdateForm");
  },
  populateCommentIsmForm : function() {
    console.log("entering populateCommentIsmForm");
    const formId = 'updateUncommentedForm';
    const type = 'uncommented';
    console.log("exiting populateCommentIsmForm");
    return this.populateIsmForm(type, formId);
  },
  populateIsmForm : function(type, formId) {
    console.log("entering populateIsmForm");
    // get random source, then random ism from that source
    let source = this.getRandomSource(globals.targetIsms);
    if (!source) {
      this.terminateIsmUpdate(type);
      return false;
    }
    let ism = this.getRandomIsm(source);
    if (!ism) {
      return;
    }
    if (type === 'uncommented' && ism.comments !== '') {
      console.log('ism already commented: ', ism.comments, "; ism is: ", ism);
      let sourceIndex = globals.targetIsms.findIndex(aSource => aSource._id === source._id);
      let ismIndex = globals.targetIsms[sourceIndex].isms.findIndex(anIsm => anIsm._id === ism._id);
      globals.targetIsms[sourceIndex].isms.splice(ismIndex, 1);
      this.removeSourceIfIsmsIsEmpty(sourceIndex);
      this.populateCommentIsmForm();
      return true;
    }
    this.injectIsmIntoForm(type, source, ism, formId);
    console.log("exiting populateIsmForm");
    return true;
  },
  getRandomSource : function(sources) {
    return sources[Math.floor(Math.random() * sources.length)];
  },
  terminateIsmUpdate : function(type) {
    console.log('no more ' + type + ' to update, aborting');
    hideAllModals();
    clearFilter();
    resetUpdateTracker();
    content.generate();
    showModal(noIsmsToUpdateToast);
    hideModalAfterAWhile(noIsmsToUpdateToast);
  },
  getRandomIsm : function(source) {
    return source.isms[Math.floor(Math.random() * source.isms.length)];
  },
  injectIsmIntoForm : function(type, source, ism, form) {
    console.log('setting form falues; params are: ', type, source, ism, form);
    $("#readonly-source").text(source.title + ' (' + source.author + ')');
    $("#" + form + " fieldset textarea#readonly-quote").val(ism.quote);
    $("#" + form + " fieldset button#save-and-next-" + type).val(source._id + ':' + ism._id + ':' + type);
  },
  getTagmeIsms : function() {
    console.log("entering getTagmeIsms");
    // TODO decide whether a call is needed here
    // on one hand, using mongo to do the filtering for us makes this really simple
    // on the other, we have to make a call to the DB, when we could just Array.filter the cachedIsms
    // the way we handle the uncommented isms; but this means we would have to remove already-tagged
    // isms as we come to them, rather than knowing the list we're using has all untagged isms
    $.ajax({
      type: "GET",
      url: '/isms/ismlist/tag/tagme',
      dataType: "JSON"
    }).done(function(response) {
      globals.targetIsms = response;
      content.kickOffUpdateForm('untagged');
    });
    console.log("exiting getTagmeIsms");
  },
  kickOffTagmeUpdateForm : function() {
    console.log("entering kickOffTagmeUpdateForm");
    forms.clearAll();
    if(this.populateTagIsmForm()) {
      hideFooter();
      showModal(tagmeUpdateFormModal);
      globals.currentlyUpdating = 'untagged';
      $("#newTags").focus();
    }
    console.log("exiting kickOffTagmeUpdateForm");
  },
  populateTagIsmForm : function() {
    console.log("entering populateTagIsmForm");
    const formId = 'updateTagmeForm';
    const type = 'untagged';
    console.log("exiting populateTagIsmForm");
    return this.populateIsmForm(type, formId);
  },
  manageGetSourceListCall : function() {
    var url = "/isms/sourcelist/";
    $.ajax({
      type: "GET",
      url: url,
      dataType: "JSON"
    }).done(function(response) {
      $.each(response, function() {
        if (updateClouds) {
          globals.sourceCloudDict[this._id] = { title: this.title, author: this.author, added: this.added };
        }
      });
      var sourceCloud = generateSourceCloud();
      setSourceCloud(sourceCloud);
    });
  },
  determineIsmQueryUrl : function() {
    url = "/isms/ismlist/";
    if (globals.filterType) {
      url += globals.filterType + "/" + globals.filterId;
    }
    return url;
  },
  prepClouds : function() {
    updateClouds = false;
    if (!globals.filterType) {
      globals.tagCloudDict = {};
      sourceCloudList = [];
      sourceCloudIds = [];
      updateClouds = true;
    }
  },
  generate : function() {
    console.log("entering generateIsmDivs");
    auth.handleLogin();
    this.prepClouds();
    this.manageGetSourceListCall();
    url = this.determineIsmQueryUrl();
    this.manageGetIsmListCall(url);
    console.log("exiting generateIsmDivs");
  },
  removeIsmFromList : function(sourceId, ismId) {
    let sourceIndex = globals.targetIsms.findIndex(aSource => aSource._id === sourceId);
    let ismIndex = globals.targetIsms[sourceIndex].isms.findIndex(anIsm => anIsm._id === ismId);
    if (ismIndex > -1) {
      globals.targetIsms[sourceIndex].isms.splice(ismIndex, 1);
    }
    this.removeSourceIfIsmsIsEmpty(sourceIndex);
  },
  removeSourceIfIsmsIsEmpty : function(sourceIndex) {
    if (globals.targetIsms[sourceIndex].isms.length < 1) {
      globals.targetIsms.splice(sourceIndex, 1);
      return;
    }
  },
  prepFilter : function(event) {
    globals.filterId = $(this).attr("rel");
    eventClasses = $(this).attr("class");
    if (eventClasses.includes("linksourcefilter")) {
      globals.filterType = "source";
    } else if (eventClasses.includes("linktagfilter")) {
      globals.filterType = "tag";
    }
    content.generate();
  },
};
