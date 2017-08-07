// Ismlist data array for filling in info box
var ismData = [];

// DOM Ready =============================================================
$(document).ready(function() {
  // Populate the ism table on initial page load
  populateTable();

  hideAddOrUpdateForm();

  // Add or Update Ism button click
  $('#btnAddOrUpdateIsm').on('click', addOrUpdateIsm);

  // New Ism button click
  $('#newIsm').on('click', setNewIsmFormElementText);

  // Clear Ism button click
  $('#btnClearIsm').on('click', clearIsm);

  // Update Ism link click
  $('#ismList isms').on('click', 'a.linkupdateism', populateIsmFields);

  // Delete Ism link click
  $('#ismList isms').on('click', 'a.linkdeleteism', deleteIsm);

  $("#addOrUpdateIsm").keyup(function (event) {
    // enter or ctrl+s
    if (event.keyCode == 13 || (event.ctrlKey && event.keyCode == 83)) {
      $("#btnAddOrUpdateIsm").click();
      event.preventDefault();
    }
  });

  $(window).keydown(function(event) {
    // ctrl+s
    if(event.ctrlKey && event.keyCode == 83) {
      event.preventDefault();
    }
    // ctrl+i
    if(event.ctrlKey && event.keyCode == 73) {
      $('#newIsm').click();
      event.preventDefault();
    }
  });

});

// Functions =============================================================

function setNewIsmFormElementText() {
  $('#addOrUpdateIsmHeader').text("New Ism");
  $('#btnAddOrUpdateIsm').text("Add Ism");
  clearTheFields();
  $('#btnClearIsm').show();
  showAddOrUpdateForm();
}

function setUpdateIsmFormElementText() {
  $('#addOrUpdateIsmHeader').text("Update Ism");
  $('#btnAddOrUpdateIsm').text("Update Ism");
  $('#btnClearIsm').hide();
  showAddOrUpdateForm();
}

function hideAddOrUpdateForm() {
  $('#addOrUpdateIsm').hide();
  $('#addOrUpdateIsmHeader').hide();
  $('#addOrUpdateIsmHeader').text("");
}

function showAddOrUpdateForm() {
  $('#addOrUpdateIsm').show();
  $('#addOrUpdateIsmHeader').show();
  $('#inputSource').focus();
}

function clearTheFields() {
  $('#addOrUpdateIsm fieldset input').val('');
  $('#addOrUpdateIsm fieldset textarea').val('');
  $('#addOrUpdateIsm fieldset button#btnAddOrUpdateIsm').val('');
}

// Fill table with data
function populateTable() {
  // Empty content string
  console.log('entering populateTable');

  var tableContent = '';
  // jQuery AJAX call for JSON
  $.getJSON( '/isms/ismlist', function( data ) {
    ismListData = data;
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<div>' + this.source + ' | ' + this.number + ' | ' + (this.tags || '') + ' | ' + this.quote + ' | ' + this.comments + ' | ';
      tableContent += '<a href="#" class="linkupdateism" rel="' + this._id + '">u</a>' + ' | ';
      tableContent += '<a href="#" class="linkdeleteism" rel="' + this._id + '">d</a>';
      tableContent += '</div>';
      tableContent += '<hr>';
    });

    // Inject the whole content string into our existing HTML
    $('#ismList isms').html(tableContent);
  });
  console.log('exiting populateTable');
};

// Add or Update Ism
function addOrUpdateIsm(event) {
  event.preventDefault();
  console.log('update or add ism clicked!');

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addOrUpdateIsm input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  if(errorCount === 0) {
    var ism = {
      'source': $('#addOrUpdateIsm fieldset input#inputSource').val(),
      'number': $('#addOrUpdateIsm fieldset input#inputNumber').val(),
      'tags': $('#addOrUpdateIsm fieldset input#inputTags').val(),
      'quote': $('#addOrUpdateIsm fieldset textarea#inputQuote').val(),
      'comments': $('#addOrUpdateIsm fieldset textarea#inputComments').val(),
    }
    var url = '/isms/addorupdateism/';
    var type = 'POST';
    if ($(this).attr('value')) {
      url += $(this).attr('value')
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
        populateTable();
      } else {
        alert('Error: ' + response.msg);
      }
    });
  }
  else {
    alert('Please fill in all fields');
    console.log('exiting clearIsm with return false');
    return false;
  }
  hideAddOrUpdateForm();
  console.log('exiting addOrUpdateIsm');
};

// Add or Update Ism
function clearIsm(event) {
  event.preventDefault();
  console.log('clear ism clicked!');
  clearTheFields();
  console.log('exiting clearIsm');
};


// Delete Ism
function deleteIsm(event) {
  event.preventDefault();
  console.log('delete ism clicked!');

  var confirmation = confirm('Are you sure you want to delete this ism?');
  ismId = $(this).attr('rel');
  if (confirmation === true) {
    $.ajax({
      type: 'DELETE',
      url: '/isms/deleteism/' + ismId
    }).done(function( response ) {
      if (response.msg === '') {
      } else {
        alert('Error: ' + response.msg);
      }
      populateTable();
      // clear the update fields if the id matches
      if ($('#addOrUpdateIsm fieldset button#btnAddOrUpdateIsm').val() === ismId) {
        $('#addOrUpdateIsm fieldset input').val('');
      }
    });
  }
  else {
    console.log('exiting deleteIsm with return false');
    return false;
  }
  console.log('exiting deleteIsm');
};

function populateIsmFields(event) {
  event.preventDefault();
  console.log('populatefieldsclicked!');
  setUpdateIsmFormElementText();

  // Retrieve ismname from link rel attribute
  var thisIsmId = $(this).attr('rel');

  console.log('id is ' + thisIsmId);

  // Get Index of object based on id value
  var arrayPosition = ismListData.map(function(arrayItem) {
      return arrayItem._id;
  }).indexOf(thisIsmId);

  // Get our Ism Object
  var thisIsmObject = ismListData[arrayPosition];

  //Populate Update Fields
  console.log('the ism is ' + JSON.stringify(thisIsmObject));

  // fill the ism to update field with the ismname
  $('#ismBeingUpdated').text(thisIsmObject.ismname);

  // Inject the current value into the update field
  $('#addOrUpdateIsm fieldset input#inputSource').val(thisIsmObject.source);
  $('#addOrUpdateIsm fieldset input#inputNumber').val(thisIsmObject.number);
  $('#addOrUpdateIsm fieldset input#inputTags').val(thisIsmObject.tags);
  $('#addOrUpdateIsm fieldset textarea#inputQuote').val(thisIsmObject.quote);
  $('#addOrUpdateIsm fieldset textarea#inputComments').val(thisIsmObject.comments);
  $('#addOrUpdateIsm fieldset button#btnAddOrUpdateIsm').val(thisIsmObject._id);

  console.log('exiting populateIsmFields');
}
