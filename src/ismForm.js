const showMoreFieldsText = 'Show More Fields';
const showFewerFieldsText = 'Show Fewer Fields';

var ismForm = {
  clearFields : function() {
    $("#upsertIsmForm fieldset input").val("");
    $("#upsertIsmForm fieldset textarea").val("");
    $("#upsertIsmForm fieldset button#btnUpsertIsm").val("");
  },
  toggleOptionalFields : function() {
    if ($('#moreFields').text() === showMoreFieldsText) {
      ismForm.showOptionalFields();
    } else {
      ismForm.hideOptionalFields();
    }
  },
  showOptionalFields : function() {
    contentControl.setText('moreFields', showFewerFieldsText);

    // TODO replace the showElement calls with a call to showElements using a list instead
    contentControl.showElement('moreFields');
    contentControl.showElement('inputTags');
    contentControl.showElement('inputComments');
  },
  hideOptionalFields : function() {
    contentControl.setText('moreFields', showMoreFieldsText);
    contentControl.showElement('moreFields');

    // TODO replace the hideElement calls with a call to hideElements using a list instead
    contentControl.hideElement('inputTags');
    contentControl.hideElement('inputComments');
  },
  openNew : function(event) {
    auth.handleLogin();
    contentControl.hideFooter();
    ismForm.hideOptionalFields();
    ismForm.clearFields();
    if (contentControl.props.filterType !== "source") {
      modals.show(noSourceSelectedModal);
      contentControl.jumpToAnchor('#currentFilter');
      return;
    }
    sourceId = contentControl.props.filterId;
    contentControl.setText('btnUpsertIsm', 'Add Ism');
    $("#btnShowBulkAddIsm").val(sourceId);
    $("#upsertIsmForm fieldset button#btnUpsertIsm").val(sourceId);
    modals.show(upsertIsmFormModal);
    $("#inputNumber").focus();
  },
  populateFields : function(event) {
    log.enter(getName());
    ismForm.prep();
    let ids = ismForm.getIds($(this).attr("rel"));
    let thisIsm = ismForm.getIsm(ids);
    ismForm.injectValues(ids, thisIsm);
    log.exit(getName());
  },
  prep : function() {
    event.preventDefault();
    auth.handleLogin();
    contentControl.hideFooter();
    ismForm.setElements();
  },
  setElements : function() {
    let updateIsmText = 'Update Ism';
    contentControl.setText('upsertIsmHeader', updateIsmText);
    contentControl.setText('btnUpsertIsm', updateIsmText);
    // TODO pass these to hide/showElements as a list instead
    contentControl.hideElement('moreFields');
    contentControl.showElement('inputTags');
    contentControl.showElement('inputComments');
    modals.show(upsertIsmFormModal);
    $("#inputNumber").focus();
  },
  getIds : function(event) {
    return {
      event : event,
      source : event.split(":")[0],
      ism : event.split(":")[1]
    };
  },
  getIsm : function(ids) {
    return sources.isms.cached
      .find(source => source._id === ids.source).isms
      .find(ism => ism._id === ids.ism);
  },
  formatTags : function(ism) {
    return Array.isArray(ism.tags) ? ism.tags.join() : ism.tags;
  },
  injectValues : function(ids, ism) {
    $("#currentSource").text(sources.getDisplayString(contentControl.props.sourceCloudDict[ids.source]));
    $("#upsertIsmForm fieldset input#inputNumber").val(ism.number);
    $("#upsertIsmForm fieldset input#inputTags").val(ismForm.formatTags(ism));
    $("#upsertIsmForm fieldset textarea#inputQuote").val(ism.quote);
    $("#upsertIsmForm fieldset textarea#inputComments").val(ism.comments);
    $("#upsertIsmForm fieldset button#btnUpsertIsm").val(ids.event);
  }
};
