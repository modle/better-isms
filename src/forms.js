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
    contentControl.props.targetIsms = undefined;
    modals.hide();
    contentControl.clearFilterAndReload()
  },
  resetUpdateTracker : function() {
    forms.currentlyUpdating = undefined;
  },
  injectIsmIntoForm : function(type, source, ism, form) {
    console.log('setting form falues; params are: ', type, source, ism, form);
    $("#readonly-source").text(source.title + ' (' + source.author + ')');
    $("#" + form + " fieldset textarea#readonly-quote").val(ism.quote);
    $("#" + form + " fieldset button#save-and-next-" + type).val(source._id + ':' + ism._id + ':' + type);
  },
  kickOffTagmeUpdateForm : function() {
    log.enter(getName());
    forms.clearAll();
    if(this.populateTagIsmForm()) {
      contentControl.hideFooter();
      modals.show(tagmeUpdateFormModal);
      forms.currentlyUpdating = 'untagged';
      $("#newTags").focus();
    }
    log.exit(getName());
  },
  populateTagIsmForm : function() {
    log.enter(getName());
    const formId = 'updateTagmeForm';
    const type = 'untagged';
    log.exit(getName());
    return this.populateIsmForm(type, formId);
  },
  kickOffUpdateForm : function(type) {
    if (type === 'uncommented') {
      this.kickOffCommentUpdateForm();
    } else if (type === 'untagged') {
      this.kickOffTagmeUpdateForm();
    }
  },
  kickOffCommentUpdateForm : function() {
    log.enter(getName());
    forms.clearAll();
    if(this.populateCommentIsmForm() && contentControl.props.targetIsms.length > 0) {
      contentControl.hideFooter();
      modals.show(uncommentedUpdateFormModal);
      forms.currentlyUpdating = 'uncommented';
      $("#newComments").focus();
    }
    log.exit(getName());
  },
  populateCommentIsmForm : function() {
    log.enter(getName());
    const formId = 'updateUncommentedForm';
    const type = 'uncommented';
    log.exit(getName());
    return this.populateIsmForm(type, formId);
  },
  populateIsmForm : function(type, formId) {
    log.enter(getName());
    // get random source, then random ism from that source
    let source = sources.getRandom(contentControl.props.targetIsms);
    if (!source) {
      main.terminateIsmUpdate(type);
      return false;
    }
    let ism = sources.isms.getRandom(source);
    if (!ism) {
      return;
    }
    if (type === 'uncommented' && ism.comments !== '') {
      contentControl.removeTargetIsm(source, ism);
      // RECURSIVE
      forms.populateCommentIsmForm();
      return true;
    }
    this.injectIsmIntoForm(type, source, ism, formId);
    log.exit(getName());
    return true;
  },
  getTagsFromForm : function() {
    return utils.buildArray($("#updateTagmeForm fieldset input#newTags").val());
  },
  getCommentFromForm : function() {
    return $("#updateUncommentedForm fieldset textarea#newComments").val();
  },
  clearSourceFormFields : function() {
    $("#upsertSourceForm fieldset input").val("");
  },
};
