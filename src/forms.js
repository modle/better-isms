var forms = {
  currentlyUpdating : undefined,
  clearAll : function() {
    $("fieldset input").val("");
    $("fieldset textarea").val("");
    console.log('forms cleared');
  },
  openBulkAddIsm : function(event) {
    auth.handleLogin();
    var sourceId = $(this).attr("value");
    modals.hide();
    bulkIsmPlaceholder =
      "Format: yaml or json. Structure: Array of JavaScript objects (dicts).";
    bulkIsmPlaceholder +=
      " Objects must contain 'number' and 'quote' fields, both strings. Field 'tags' is optional: list of strings.";
    $("#inputBulkIsms").prop("placeholder", bulkIsmPlaceholder);
    $("#btnSubmitBulkAddIsm").val(sourceId);
    $("#bulkAddIsmSourceHeader").html(sources.getDisplayString(sourceId));
    modals.show(bulkAddIsmModal);
  },
  validate : function(formId, optionalFields) {
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
  },
  getIdsFromButton : function() {
    let buttonValues = [];
    if (forms.currentlyUpdating === 'uncommented') {
      buttonValues = $("#updateUncommentedForm fieldset button#save-and-next-uncommented").val().split(":");
    } else if (forms.currentlyUpdating === 'untagged') {
      buttonValues = $("#updateTagmeForm fieldset button#save-and-next-untagged").val().split(":");
    }
    if (buttonValues.length != 3) {
      throw 'Save button has incorrect number of elements. Expected sourceId,ismId,type, got ' + buttonValues;
    }
    return {sourceId: buttonValues[0], ismId: buttonValues[1], type: buttonValues[2]};
  },
  stopUpdate : function() {
    globals.targetIsms = undefined;
    modals.hide();
    content.clearFilterAndReload()
  },
  resetUpdateTracker : function() {
    forms.currentlyUpdating = undefined;
  }
};
