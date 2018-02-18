var updateClouds = false;

function clearIsmDivs() {
  setIsmsList("");
}

function generateIsmHeaders() {
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
}

function addIsmDiv(source, details, tags) {
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
}

function setIsmsList(ismDivs) {
  $("#ismList isms").html(ismDivs);
}

function manageGetIsmListCall(url) {
  ismDivs = generateIsmHeaders();
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
        ismDivs += addIsmDiv(source, ism, tags);
      });
    });
    setIsmsList(ismDivs);
    var tagCloud = generateTagCloud();
    setTagCloud(tagCloud);
  });
}

function getIsmsWithoutComments() {
  console.log("entering getIsmsWithoutComments");
  globals.targetIsms = globals.cachedIsms.filter( source => source.isms.length > 0 );
  console.log("exiting getIsmsWithoutComments");
}

function kickOffUpdateForm(type) {
  if (type === 'uncommented') {
    kickOffCommentUpdateForm();
  } else if (type === 'untagged') {
    kickOffTagmeUpdateForm();
  }
}

function kickOffCommentUpdateForm() {
  console.log("entering kickOffCommentUpdateForm");
  clearAllForms();
  if(populateCommentIsmForm() && globals.targetIsms.length > 0) {
    hideFooter();
    showModal(uncommentedUpdateFormModal);
    globals.currentlyUpdating = 'uncommented';
    $("#newComments").focus();
  }
  console.log("exiting kickOffCommentUpdateForm");
}

function populateCommentIsmForm() {
  console.log("entering populateCommentIsmForm");
  const formId = 'updateUncommentedForm';
  const type = 'uncommented';
  console.log("exiting populateCommentIsmForm");
  return populateIsmForm(type, formId);
}

function populateIsmForm(type, formId) {
  console.log("entering populateIsmForm");
  // get random source, then random ism from that source
  let source = getRandomSource(globals.targetIsms);
  if (!source) {
    terminateIsmUpdate(type);
    return false;
  }
  let ism = getRandomIsm(source);
  if (!ism) {
    return;
  }
  if (type === 'uncommented' && ism.comments !== '') {
    console.log('ism already commented: ', ism.comments, "; ism is: ", ism);
    let sourceIndex = globals.targetIsms.findIndex(aSource => aSource._id === source._id);
    let ismIndex = globals.targetIsms[sourceIndex].isms.findIndex(anIsm => anIsm._id === ism._id);
    globals.targetIsms[sourceIndex].isms.splice(ismIndex, 1);
    removeSourceIfIsmsIsEmpty(sourceIndex);
    populateCommentIsmForm();
    return true;
  }
  injectIsmIntoForm(type, source, ism, formId);
  console.log("exiting populateIsmForm");
  return true;
}

function getRandomSource(sources) {
  return sources[Math.floor(Math.random() * sources.length)];
}

function terminateIsmUpdate(type) {
  console.log('no more ' + type + ' to update, aborting');
  hideAllModals();
  clearFilter();
  resetUpdateTracker();
  generateContent();
  showModal(noIsmsToUpdateToast);
  hideModalAfterAWhile(noIsmsToUpdateToast);
}

function getRandomIsm(source) {
  return source.isms[Math.floor(Math.random() * source.isms.length)];
}

function injectIsmIntoForm(type, source, ism, form) {
  console.log('setting form falues; params are: ', type, source, ism, form);
  $("#readonly-source").text(source.title + ' (' + source.author + ')');
  $("#" + form + " fieldset textarea#readonly-quote").val(ism.quote);
  $("#" + form + " fieldset button#save-and-next-" + type).val(source._id + ':' + ism._id + ':' + type);
}

function getTagmeIsms() {
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
    kickOffUpdateForm('untagged');
  });
  console.log("exiting getTagmeIsms");
}

function kickOffTagmeUpdateForm() {
  console.log("entering kickOffTagmeUpdateForm");
  clearAllForms();
  if(populateTagIsmForm()) {
    hideFooter();
    showModal(tagmeUpdateFormModal);
    globals.currentlyUpdating = 'untagged';
    $("#newTags").focus();
  }
  console.log("exiting kickOffTagmeUpdateForm");
}

function populateTagIsmForm() {
  console.log("entering populateTagIsmForm");
  const formId = 'updateTagmeForm';
  const type = 'untagged';
  console.log("exiting populateTagIsmForm");
  return populateIsmForm(type, formId);
}

function manageGetSourceListCall() {
  var url = "/isms/sourcelist/";
  $.ajax({
    type: "GET",
    url: url,
    dataType: "JSON"
  }).done(function(response) {
    $.each(response, function() {
      if (updateClouds) {
        sourceCloudDict[this._id] = { title: this.title, author: this.author, added: this.added };
      }
    });
    var sourceCloud = generateSourceCloud();
    setSourceCloud(sourceCloud);
  });
}

function determineIsmQueryUrl() {
  url = "/isms/ismlist/";
  if (globals.filterType) {
    url += globals.filterType + "/" + globals.filterId;
  }
  return url;
}

function prepClouds() {
  updateClouds = false;
  if (!globals.filterType) {
    tagCloudDict = {};
    sourceCloudList = [];
    sourceCloudIds = [];
    updateClouds = true;
  }
}

function generateContent() {
  console.log("entering generateIsmDivs");
  handleLogin();
  prepClouds();
  manageGetSourceListCall();
  url = determineIsmQueryUrl();
  manageGetIsmListCall(url);
  console.log("exiting generateIsmDivs");
}
