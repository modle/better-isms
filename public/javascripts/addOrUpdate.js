var optionalIsmFields = [];
optionalIsmFields.push('inputComments');

// var responseReceived = false;
// var myId

// function generateAnId() {
//   responseReceived = false;
//   $.ajax({
//     type: 'GET',
//     url: '/generate_id/'
//   }).done(function( response ) {
//     console.log(response.msg);
//     myId = response.msg;
//   });

// }

function addOrUpdateIsm(event) {
  event.preventDefault();
  console.log('update or add ism clicked!');
  handleLogin();
  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addOrUpdateIsm input').each(function(index, val) {
    if (this.value === '' && !optionalIsmFields.includes(this.id)) {
      errorCount++;
    }
  });
  $('#addOrUpdateIsm textarea').each(function(index, val) {
    if (this.value === '' && !optionalIsmFields.includes(this.id)) {
      errorCount++;
    }
  });
  if (errorCount > 0) {
    alert('Please fill in all required fields');
    console.log('exiting addOrUpdateIsm with return false');
    return false;
  }

  var ism = {}
  ism.number = $('#addOrUpdateIsm fieldset input#inputNumber').val();
  ism.tags = $('#addOrUpdateIsm fieldset input#inputTags').val().toLowerCase().split(/\s*,\s*/);
  ism.quote = $('#addOrUpdateIsm fieldset textarea#inputQuote').val();
  ism.comments = $('#addOrUpdateIsm fieldset textarea#inputComments').val();

  // get the button value
  var buttonValue = $('#addOrUpdateIsm fieldset button#btnAddOrUpdateIsm').val();
  console.log(buttonValue);
  // if the id includes a :, this is an update
  // otherwise, it's just the source, and we need to generate an id for the new isms array entry
  if (buttonValue.includes(':')) {
    var type = 'PUT';
    ism._id = buttonValue.split(':')[1];
    url = '/isms/updateism/' + buttonValue.replace(":", "/");
  } else {
    var type = 'POST';
    url = '/isms/addism/' + buttonValue;
  }
  // if (!ism._id) {
  //   console.log("ism id is undefined, aborting ism creation")
  //   return;
  // }
  console.log(url)
  $.ajax({
    type: type,
    data: ism,
    url: url,
    dataType: 'JSON'
  }).done(function( response ) {
    if (response.msg === '') {
      clearIsmFormFields();
      generateContent(null);
    } else {
      alert('Error: ' + response.msg);
    }
  });
  hideModal(formModal);
  console.log('exiting addOrUpdateIsm');
};
