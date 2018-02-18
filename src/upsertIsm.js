function validateTheForm(formId, optionalFields) {
  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  if (!optionalFields) {
    optionalFields = [];
  }
  $("#" + formId + " input").each(function(index, val) {
    if (this.value === "" && !optionalFields.includes(this.id)) {
      errorCount++;
    }
  });
  $("#" + formId + " textarea").each(function(index, val) {
    if (this.value === "" && !optionalFields.includes(this.id)) {
      errorCount++;
    }
  });
  if (errorCount > 0) {
    alert("Please fill in all required fields");
    return false;
  }
  return true;
}

function upsertIsm(event) {
  handleLogin();
  event.preventDefault();
  console.log("entering upsertIsm");
  var optionalIsmFields = ["inputComments", "inputTags"];
  if (!validateTheForm("upsertIsmForm", optionalIsmFields)) {
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
      generateContent(null);
      hideAllModals();
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

function openBulkAddIsmForm(event) {
  handleLogin();
  var sourceId = $(this).attr("value");
  hideAllModals();
  bulkIsmPlaceholder =
    "Format: yaml or json. Structure: Array of JavaScript objects (dicts).";
  bulkIsmPlaceholder +=
    " Objects must contain 'number' and 'quote' fields, both strings. Field 'tags' is optional: list of strings.";
  $("#inputBulkIsms").prop("placeholder", bulkIsmPlaceholder);
  $("#btnSubmitBulkAddIsm").val(sourceId);
  $("#bulkAddIsmSourceHeader").html(getSourceDisplayString(sourceId));
  showModal(bulkAddIsmModal);
}

function bulkUpsertIsms(event) {
  handleLogin();
  event.preventDefault();
  console.log("entering bulkUpsertIsms");
  if (!validateTheForm("bulkAddIsmForm")) {
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
      generateContent(null);
    } else {
      alert("Error: " + response.msg);
    }
  });
  hideAllModals();
  console.log("exiting bulkUpsertIsms");
}

function updateIsmSingleField(event) {
  console.log("entering updateIsmSingleField");
  let ids = getIdsFromButton();
  let ism = getIsm(ids);
  let url = "/isms/updateism/" + ids.sourceId + "/" + ids.ismId;
  $.ajax({
    type: "PUT",
    data: ism,
    url: url,
    dataType: "JSON"
  }).done(function(response) {
    if (response.msg === "") {
      removeIsmFromList(ids.sourceId, ids.ismId);
      kickOffUpdateForm(ids.type);
    } else {
      alert("Error: " + response.msg);
      resetUpdateTracker();
    }
  });
  console.log("exiting updateIsmSingleField");
}

function getIdsFromButton() {
  let buttonValues = [];
  if (globals.currentlyUpdating === 'uncommented') {
    buttonValues = $("#updateUncommentedForm fieldset button#save-and-next-uncommented").val().split(":");
  } else if (globals.currentlyUpdating === 'untagged') {
    buttonValues = $("#updateTagmeForm fieldset button#save-and-next-untagged").val().split(":");
  }
  if (buttonValues.length != 3) {
    throw 'Save button has incorrect number of elements. Expected sourceId,ismId,type, got ' + buttonValues;
  }
  return {sourceId: buttonValues[0], ismId: buttonValues[1], type: buttonValues[2]};
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

function removeIsmFromList(sourceId, ismId) {
  let sourceIndex = globals.targetIsms.findIndex(aSource => aSource._id === sourceId);
  let ismIndex = globals.targetIsms[sourceIndex].isms.findIndex(anIsm => anIsm._id === ismId);
  if (ismIndex > -1) {
    globals.targetIsms[sourceIndex].isms.splice(ismIndex, 1);
  }
  removeSourceIfIsmsIsEmpty(sourceIndex);
}

function removeSourceIfIsmsIsEmpty(sourceIndex) {
  if (globals.targetIsms[sourceIndex].isms.length < 1) {
    globals.targetIsms.splice(sourceIndex, 1);
    return;
  }
}
