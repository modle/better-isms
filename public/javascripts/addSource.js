function addNewSource(event) {
  event.preventDefault();
  console.log('entering addNewSource!');
  handleLogin();
  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addSourceForm input').each(function(index, val) {
    if (this.value === '') {
      errorCount++;
    }
  });
  if (errorCount > 0) {
    alert('Please fill in all required fields');
    console.log('exiting addSource with return false');
    return false;
  }

  var source = {}
  source.title = $('#addSourceForm fieldset input#inputTitle').val();
  source.author = $('#addSourceForm fieldset input#inputAuthor').val();

  $.ajax({
    type: 'POST',
    data: source,
    url: '/isms/addsource/',
    dataType: 'JSON'
  }).done(function( response ) {
    if (response.msg === '') {
      clearSourceFormFields();
      generateContent(null);
    } else {
      alert('Error: ' + response.msg);
    }
  });
  hideModal(newSourceModal);
  showNewSourceAddedToast();  
  console.log('exiting addNewSource');
};

function showNewSourceAddedToast() {
  console.log("boop beep");
}

function clearSourceFormFields() {
  $('#addSourceForm fieldset input').val('');
}
