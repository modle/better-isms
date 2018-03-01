function clearAllForms() {
  $("fieldset input").val("");
  $("fieldset textarea").val("");
  console.log('forms cleared');
}

function openBulkAddIsmForm(event) {
  auth.handleLogin();
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
