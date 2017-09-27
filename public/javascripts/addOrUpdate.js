var optionalIsmFields = [];
optionalIsmFields.push('inputComments');

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

  var ism = {
    '_id': $('#addOrUpdateIsm fieldset button#btnAddOrUpdateIsm').val().split(':')[1],
    'number': $('#addOrUpdateIsm fieldset input#inputNumber').val(),
    'tags': $('#addOrUpdateIsm fieldset input#inputTags').val().toLowerCase().split(/\s*,\s*/),
    'quote': $('#addOrUpdateIsm fieldset textarea#inputQuote').val(),
    'comments': $('#addOrUpdateIsm fieldset textarea#inputComments').val(),
  }
  console.log(ism);
  var url = '/isms/addorupdateism/';
  var type = 'POST';
  if ($(this).attr('value')) {
    var thisSource = $(this).attr('value');
    console.log(thisSource)
    url += $(this).attr('value').replace(":", "/");
    type = 'PUT';
  }
  console.log(url)
  $.ajax({
    type: type,
    data: ism,
    url: url,
    dataType: 'JSON'
  }).done(function( response ) {
    if (response.msg === '') {
      $('#addOrUpdateIsm fieldset input').val('');
      $('#addOrUpdateIsm fieldset textarea').val('');
      $('#addOrUpdateIsm fieldset button#btnAddOrUpdateIsm').val('');
      generateContent(null);
    } else {
      alert('Error: ' + response.msg);
    }
  });
  hideModal(formModal);
  console.log('exiting addOrUpdateIsm');
};
