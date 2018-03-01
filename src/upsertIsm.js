
function upsertIsm(event) {
  auth.handleLogin();
  event.preventDefault();
  console.log("entering upsertIsm");
  var optionalIsmFields = ["inputComments", "inputTags"];
  if (!forms.validate("upsertIsmForm", optionalIsmFields)) {
    console.log("exiting upsertIsm before request");
    return;
  }

  var ism = {};
  ism.number = $("#upsertIsmForm fieldset input#inputNumber").val();
  ism.tags = buildTags($("#upsertIsmForm fieldset input#inputTags").val());
  ism.quote = $("#upsertIsmForm fieldset textarea#inputQuote").val();
  ism.comments = $("#upsertIsmForm fieldset textarea#inputComments").val();

  var buttonValue = $("#upsertIsmForm fieldset button#btnUpsertIsm").val();
  if (buttonValue.includes(":")) {
    var type = "PUT";
    ism._id = buttonValue.split(":")[1];
    url = "/isms/updateism/" + buttonValue.replace(":", "/");
  } else {
    var type = "POST";
    url = "/isms/addism/" + buttonValue;
  }
  console.log(type, "to", url);
  $.ajax({
    type: type,
    data: ism,
    url: url,
    dataType: "JSON"
  }).done(function(response) {
    if (response.msg === "") {
      clearIsmFormFields();
      content.generate(null);
      modals.hide();
    } else {
      alert("Error: " + response.msg);
    }
  });
  console.log("exiting upsertIsm");
}

function buildTags(tags) {
  if (Array.isArray(tags)) {
    return tags;
  }
  return Array.from(
    tags
    .trim()
    .toLowerCase()
    .split(/\s*,\s*/)
  );
}

function bulkUpsertIsms(event) {
  auth.handleLogin();
  event.preventDefault();
  console.log("entering bulkUpsertIsms");
  if (!forms.validate("bulkAddIsmForm")) {
    console.log("exiting bulkUpsertIsms before request");
    return;
  }
  var sourceId = $(this).attr("value");
  var content = {};
  content["isms"] = $("#bulkAddIsmForm fieldset textarea#inputBulkIsms").val();
  console.log(content);
  $.ajax({
    type: "POST",
    data: content,
    url: "/isms/bulkadd/" + sourceId,
    dataType: "JSON"
  }).done(function(response) {
    if (response.msg === "") {
      console.log("no problems here, jim");
      content.generate(null);
    } else {
      alert("Error: " + response.msg);
    }
  });
  modals.hide();
  console.log("exiting bulkUpsertIsms");
}

function updateIsmSingleField(event) {
  console.log("entering updateIsmSingleField");
  let ids = forms.getIdsFromButton();
  let ism = getIsm(ids);
  let url = "/isms/updateism/" + ids.sourceId + "/" + ids.ismId;
  $.ajax({
    type: "PUT",
    data: ism,
    url: url,
    dataType: "JSON"
  }).done(function(response) {
    if (response.msg === "") {
      content.removeIsmFromList(ids.sourceId, ids.ismId);
      content.kickOffUpdateForm(ids.type);
    } else {
      alert("Error: " + response.msg);
      resetUpdateTracker();
    }
  });
  console.log("exiting updateIsmSingleField");
}

function getIsm(ids) {
  let ism = getIsmFromSource(ids);
  if (globals.currentlyUpdating === 'untagged') {
    ism.tags = getTagsFromForm();
  } else if (globals.currentlyUpdating === 'uncommented') {
    ism.comments = getCommentFromForm();
    // this is needed because the post expects an array, but the object stores a string for single tags
    ism.tags = buildTags(ism.tags);
  }
  return ism;
}

function getIsmFromSource(ids) {
  let source = globals.targetIsms.find(aSource => aSource._id === ids.sourceId);
  return source.isms.find(anIsm => anIsm._id === ids.ismId);
}

function getTagsFromForm() {
  return buildTags($("#updateTagmeForm fieldset input#newTags").val());
}

function getCommentFromForm() {
  return $("#updateUncommentedForm fieldset textarea#newComments").val();
}
