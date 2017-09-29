
function deleteIsm(event) {
  event.preventDefault();
  console.log('delete ism clicked!');

  handleLogin();

  var confirmation = confirm('Are you sure you want to delete this ism?');
  var thisSource = $(this).attr('rel');
  if (confirmation === true) {
    $.ajax({
      type: 'DELETE',
      url: '/isms/deleteism/' + $(this).attr('rel').replace(":", "/")
    }).done(function( response ) {
      if (response.msg === '') {
      } else {
        alert('Error: ' + response.msg);
      }
      generateContent();
      // clear the update fields if the id matches
      if ($('#addOrUpdateIsm fieldset button#btnAddOrUpdateIsm').val() === thisSource) {
        $('#addOrUpdateIsm fieldset input').val('');
      }
      showModal(ismDeletedModal);
      hideModalAfterAWhile(ismDeletedModal);
    });
  }
  else {
    console.log('exiting deleteIsm with return false');
    return false;
  }
  console.log('exiting deleteIsm');
};
