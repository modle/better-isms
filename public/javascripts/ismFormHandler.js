
function clearIsmFormFields() {
  $('#upsertIsm fieldset input').val('');
  $('#upsertIsm fieldset textarea').val('');
  $('#upsertIsm fieldset button#btnUpsertIsm').val('');
}

function clearIsm(event) {
  event.preventDefault();
  console.log('clear ism clicked!');
  clearIsmFormFields();
  console.log('exiting clearIsm');
};

function openNewIsmForm(event) {
  handleLogin();
  hideModal(sourceSelectModal);
  clearIsmFormFields();
  source = this.rel;
  $('#upsertIsm #source').text(getSourceDisplayString(source));
  $('#btnClearIsm').show();
  showModal(formModal);
  $('#inputNumber').focus();
  $('#upsertIsm fieldset button#btnUpsertIsm').val(source);
}

function setUpdateIsmFormElementText() {
  $('#upsertIsmHeader').text("Update Ism");
  $('#btnUpsertIsm').text("Update Ism");
  $('#btnClearIsm').hide();
  showModal(formModal);
  $('#inputNumber').focus();
}

function populateIsmFields(event) {
  event.preventDefault();
  handleLogin();

  setUpdateIsmFormElementText();

  // Retrieve sourceId and ismId from link rel attribute
  var thisSource = $(this).attr('rel');
  var thisSourceId = thisSource.split(':')[0]
  var thisIsmId = thisSource.split(':')[1]

  // Get Index of source object based on source id value
  var sourceArrayIndex = ismListData.map(function(arrayItem) {
    return arrayItem._id;
  }).indexOf(thisSourceId);
  sourceIsms = ismListData[sourceArrayIndex]

  // Get Index of isms within source object based on ism id value
  var myIsmArrayIndex = sourceIsms.isms.map(function(ism) {
    return ism._id;
  }).indexOf(thisIsmId);

  // Get our Ism Object
  var thisIsmObject = ismListData[sourceArrayIndex].isms[myIsmArrayIndex];

  // generate tag string from array of tags
  joinedTags = '';
  if (Array.isArray(thisIsmObject["tags[]"])) {
    joinedTags = thisIsmObject["tags[]"].join();
  } else {
    joinedTags = thisIsmObject["tags[]"];
  }

  // Inject the current values into the appropriate fields
  // consider setting a div to sourceIsms.title instead of populating a field; we don't want to update the title here
  $('#upsertIsm #sourceTitle').text(sourceIsms.title + ' (' + sourceIsms.author + ')');
  $('#upsertIsm fieldset input#inputNumber').val(thisIsmObject.number);
  $('#upsertIsm fieldset input#inputTags').val(joinedTags);
  $('#upsertIsm fieldset textarea#inputQuote').val(thisIsmObject.quote);
  $('#upsertIsm fieldset textarea#inputComments').val(thisIsmObject.comments);
  $('#upsertIsm fieldset button#btnUpsertIsm').val(thisSource);

  console.log('exiting populateIsmFields');
}
