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
    showElement('moreFields');
    setText('moreFields', showFewerFieldsText);
    showElement('inputTags');
    showElement('inputComments');
  },
  hideOptionalFields : function() {
    showElement('moreFields');
    setText('moreFields', showMoreFieldsText);
    hideElement('inputTags');
    hideElement('inputComments');
  },
  openNew : function(event) {
    auth.handleLogin();
    hideFooter();
    ismForm.hideOptionalFields();
    ismForm.clearFields();
    if (globals.filterType !== "source") {
      modals.show(noSourceSelectedModal);
      return;
    }
    sourceId = globals.filterId;
    setText('btnUpsertIsm', 'Add Ism');
    $("#btnShowBulkAddIsm").val(sourceId);
    $("#upsertIsmForm fieldset button#btnUpsertIsm").val(sourceId);
    modals.show(upsertIsmFormModal);
    $("#inputNumber").focus();
  },
  setElementText : function() {
    let updateIsmText = 'Update Ism';
    setText('upsertIsmHeader', updateIsmText);
    setText('btnUpsertIsm', updateIsmText);
    $("#btnClearIsm").hide();
    modals.show(upsertIsmFormModal);
    $("#inputNumber").focus();
  },
  populateFields : function(event) {
    event.preventDefault();
    auth.handleLogin();
    hideFooter();
    ismForm.setElementText();

    // Retrieve sourceId and ismId from link rel attribute
    var thisSource = $(this).attr("rel");
    var thisSourceId = thisSource.split(":")[0];
    var thisIsmId = thisSource.split(":")[1];

    // Get Index of source object based on source id value
    var sourceArrayIndex = globals.cachedIsms
      .map(function(arrayItem) {
        return arrayItem._id;
      })
      .indexOf(thisSourceId);
    sourceIsms = globals.cachedIsms[sourceArrayIndex];

    // Get Index of isms within source object based on ism id value
    var myIsmArrayIndex = sourceIsms.isms
      .map(function(ism) {
        return ism._id;
      })
      .indexOf(thisIsmId);

    // Get our Ism Object
    var thisIsmObject = globals.cachedIsms[sourceArrayIndex].isms[myIsmArrayIndex];

    // generate tag string from array of tags
    joinedTags = "";
    if (Array.isArray(thisIsmObject.tags)) {
      joinedTags = thisIsmObject.tags.join();
    } else {
      joinedTags = thisIsmObject.tags;
    }

    hideElement('moreFields');
    showElement('inputTags');
    showElement('inputComments');

    // Inject the current values into the appropriate fields
    // consider setting a div to sourceIsms.title instead of populating a field; we don't want to update the title here
    $("#currentSource").text(sourceIsms.title + " (" + sourceIsms.author + ")");

    $("#upsertIsmForm fieldset input#inputNumber").val(thisIsmObject.number);
    $("#upsertIsmForm fieldset input#inputTags").val(joinedTags);
    $("#upsertIsmForm fieldset textarea#inputQuote").val(thisIsmObject.quote);
    $("#upsertIsmForm fieldset textarea#inputComments").val(
      thisIsmObject.comments
    );
    $("#upsertIsmForm fieldset button#btnUpsertIsm").val(thisSource);

    console.log("exiting", getName());
  },
};
