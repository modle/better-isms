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

  url = '/isms/addsource/'
  type = 'POST';
  upsertedToastString = "Source added";
  var sourceId = $(this).attr('value');
  if (sourceId) {
    url += sourceId;
    type = 'PUT';
    upsertedToastString = "Source " + getSourceDisplayString(sourceId) + " updated. New value: " + source.title + "(" + source.author + ")";
  }

  $.ajax({
    type: type,
    data: source,
    url: url,
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
  showNewSourceAddedToast(upsertedToastString);
  console.log('exiting addNewSource');
};

function showNewSourceAddedToast(toastString) {
  $('#sourceUpsertedHeader').html(toastString);
  showModal(sourceUpsertedModal);
  hideModalAfterAWhile(sourceUpsertedModal);
}

function clearSourceFormFields() {
  $('#addSourceForm fieldset input').val('');
}

function deactivateSourceEditButton() {
  $('#addOrUpdateIsm fieldset button#btnEditSource').val('');
  $('#btnEditSource').hide();
}

function activateSourceEditButton(rel) {
  $('button#btnEditSource').val(rel);
  $('#btnEditSource').show();
}
