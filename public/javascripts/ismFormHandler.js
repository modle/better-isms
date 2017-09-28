
function clearIsmFormFields() {
  $('#addOrUpdateIsm fieldset input').val('');
  $('#addOrUpdateIsm fieldset textarea').val('');
  $('#addOrUpdateIsm fieldset button#btnAddOrUpdateIsm').val('');
}

function clearIsm(event) {
  event.preventDefault();
  console.log('clear ism clicked!');
  clearIsmFormFields();
  console.log('exiting clearIsm');
};

function openNewIsmForm() {
  handleLogin();
  clearIsmFormFields();
  $('#btnClearIsm').show();
  showModal(formModal);
  $('#inputNumber').focus();
  $('#addOrUpdateIsm fieldset button#btnAddOrUpdateIsm').val('58c9b67d734d1d341d3b90fb');
}

function setUpdateIsmFormElementText() {
  $('#addOrUpdateIsmHeader').text("Update Ism");
  $('#btnAddOrUpdateIsm').text("Update Ism");
  $('#btnClearIsm').hide();
  showModal(formModal);
  $('#inputNumber').focus();
}

function populateIsmFields(event) {
  event.preventDefault();
  console.log('populatefieldsclicked!');
  handleLogin();

  setUpdateIsmFormElementText();

  // Retrieve sourceId and ismId from link rel attribute
  var thisSource = $(this).attr('rel');
  var thisSourceId = thisSource.split(':')[0]
  var thisIsmId = thisSource.split(':')[1]

  console.log('source id is ' + thisSourceId);
  console.log('ism id is ' + thisIsmId);

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
  $('#addOrUpdateIsm #inputSource').text(sourceIsms.title);
  $('#addOrUpdateIsm fieldset input#inputNumber').val(thisIsmObject.number);
  $('#addOrUpdateIsm fieldset input#inputTags').val(joinedTags);
  $('#addOrUpdateIsm fieldset textarea#inputQuote').val(thisIsmObject.quote);
  $('#addOrUpdateIsm fieldset textarea#inputComments').val(thisIsmObject.comments);
  $('#addOrUpdateIsm fieldset button#btnAddOrUpdateIsm').val(thisSource);

  console.log('exiting populateIsmFields');
}
