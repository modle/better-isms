var optionalIsmFields = [];
optionalIsmFields.push('inputComments');

function upsertIsm(event) {
  event.preventDefault();
  console.log('update or add ism clicked!');
  handleLogin();
  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#upsertIsm input').each(function(index, val) {
    if (this.value === '' && !optionalIsmFields.includes(this.id)) {
      errorCount++;
    }
  });
  $('#upsertIsm textarea').each(function(index, val) {
    if (this.value === '' && !optionalIsmFields.includes(this.id)) {
      errorCount++;
    }
  });
  if (errorCount > 0) {
    alert('Please fill in all required fields');
    console.log('exiting upsertIsm with return false');
    return false;
  }

  var ism = {}
  ism.number = $('#upsertIsm fieldset input#inputNumber').val();
  ism.tags = Array.from($('#upsertIsm fieldset input#inputTags').val().toLowerCase().split(/\s*,\s*/));
  ism.quote = $('#upsertIsm fieldset textarea#inputQuote').val();
  ism.comments = $('#upsertIsm fieldset textarea#inputComments').val();

  var buttonValue = $('#upsertIsm fieldset button#btnUpsertIsm').val();
  if (buttonValue.includes(':')) {
    var type = 'PUT';
    ism._id = buttonValue.split(':')[1];
    url = '/isms/updateism/' + buttonValue.replace(":", "/");
  } else {
    var type = 'POST';
    url = '/isms/addism/' + buttonValue;
  }
  console.log(type, ' to ', url)
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
  console.log('exiting upsertIsm');
};
