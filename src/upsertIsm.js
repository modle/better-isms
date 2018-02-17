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
  ism.tags = Array.from(
    $("#upsertIsmForm fieldset input#inputTags")
      .val()
      .trim()
      .toLowerCase()
      .split(/\s*,\s*/)
  );
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

function updateUncommentedIsm(event) {
  console.log("entering updateUncommentedIsm");
  // TODO implement me
  // The only difference between this and updateUncommentedIsm is that instead of
  // getting tags from the form and adding them to the ism, we use the current tags
  // and we get the comments from the form instead of using the current comments
  console.log("exiting updateUncommentedIsm");
}

function updateTagmeIsm(event) {
  console.log("entering updateTagmeIsm");
  let buttonValue = $("#updateTagmeForm fieldset button#saveAndNextTag").val();
  console.log(buttonValue);
  let theSourceId = buttonValue.split(":")[0];
  let theIsmId = buttonValue.split(":")[1];
  let source = untaggedIsms.find(aSource => aSource._id === theSourceId);
  let ism = source.isms.find(anIsm => anIsm._id === theIsmId);
  // TODO pull ism.tags out into a function
  ism.tags = Array.from(
    $("#updateTagmeForm fieldset input#newTags")
      .val()
      .trim()
      .toLowerCase()
      .split(/\s*,\s*/)
  );
  let url = "/isms/updateism/" + buttonValue.replace(":", "/");
  $.ajax({
    type: "PUT",
    data: ism,
    url: url,
    dataType: "JSON"
  }).done(function(response) {
    if (response.msg === "") {
      removeIsmFromUntaggedList(theSourceId, theIsmId);
      kickOffTagmeUpdateForm();
    } else {
      alert("Error: " + response.msg);
    }
  });
  console.log("exiting updateTagmeIsm");
}


function removeIsmFromUntaggedList(sourceId, ismId) {
  // TODO does oneEntry make sense for all uses of it? It's working.
  const oneEntry = 1;
  let sourceIndex = untaggedIsms.findIndex(aSource => aSource._id === sourceId);
  // what is happening here?
  // if this is the only one left, remove it and return
  if (sourceIndex > -1 && untaggedIsms[sourceIndex].isms.length === oneEntry) {
    untaggedIsms.splice(sourceIndex, oneEntry);
    return;
  }
  let ismIndex = untaggedIsms[sourceIndex].isms.findIndex(anIsm => anIsm._id === ismId);
  if (ismIndex > -1) {
    untaggedIsms[sourceIndex].isms.splice(ismIndex, oneEntry);
  }
  // TODO this is the same as the above code, only we're not checking sourceIndex; refactor
  // remove source if it no longer has isms to update
  if (untaggedIsms[sourceIndex].isms.length < oneEntry) {
    untaggedIsms.splice(sourceIndex, oneEntry);
    return;
  }
}
