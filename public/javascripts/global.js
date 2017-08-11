var modal;
var tagCloud = '';

// DOM Ready =============================================================
$(document).ready(function() {
  // Populate the ism table on initial page load
  populateTable('');

  modal = document.getElementById('formModal');

  closeFormModal();

  // Add or Update Ism button click
  $('#btnAddOrUpdateIsm').on('click', addOrUpdateIsm);

  // New Ism button click
  $('#newIsm').on('click', openFormModal);

  // show all button click
  $('#showAll').on('click', populateTable);

  // Clear Ism button click
  $('#btnClearIsm').on('click', clearIsm);

  // Update Ism link click
  $('#ismList isms').on('click', 'a.linkupdateism', populateIsmFields);

  // Delete Ism link click
  $('#ismList isms').on('click', 'a.linkdeleteism', deleteIsm);

  // Tag cloud link click
  $('#tagCloud').on('click', 'a.linktagfilter', populateTable);

  $("#addOrUpdateIsm").keyup(function (event) {
    // enter or ctrl+s
    if (event.ctrlKey && event.keyCode == 83) {
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
    // esc
    if(event.keyCode == 27) {
      closeFormModal();
      event.preventDefault();
    }
  });

  $('#btnClearIsm').on('keydown', function (evt) {
      if(evt.keyCode === 9) { // Tab pressed
          evt.preventDefault();
          $('#inputSource').focus();
      }
  });

  $('input,select').keydown(function(event) {
    var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;
    if (key == 13) {
      event.preventDefault();
      var inputs = $('#addOrUpdateIsm').find(':input:visible');
      var nextinput = 0;
      if (inputs.index(this) < (inputs.length - 1)) {
        nextinput = inputs.index(this) + 1;
      }
      if (inputs.length == 1) {
        $(this).blur().focus();
      } else {
        inputs.eq(nextinput).focus();
      }
    }
  });

});

// Functions =============================================================


function openFormModal() {
  console.log("opening form modal");
  modal.style.display = "block";
  $('#inputSource').focus();
}

function closeFormModal() {
  console.log("closing form modal");
  modal.style.display = "none";
  $('#addOrUpdateIsmHeader').hide();
  $('#addOrUpdateIsmHeader').text("");
}

function setNewIsmFormElementText() {
  $('#addOrUpdateIsmHeader').text("New Ism");
  $('#btnAddOrUpdateIsm').text("Add Ism");
  clearTheFields();
  $('#btnClearIsm').show();
  openFormModal();
}

function setUpdateIsmFormElementText() {
  $('#addOrUpdateIsmHeader').text("Update Ism");
  $('#btnAddOrUpdateIsm').text("Update Ism");
  $('#btnClearIsm').hide();
  openFormModal();
}

function clearTheFields() {
  $('#addOrUpdateIsm fieldset input').val('');
  $('#addOrUpdateIsm fieldset textarea').val('');
  $('#addOrUpdateIsm fieldset button#btnAddOrUpdateIsm').val('');
}

// Fill table with data
function populateTable(event) {
  // Empty content string
  console.log('entering populateTable');
  var tableContent = '';
  var url = '/isms/ismlist/';
  var rel = $(this).attr('rel');
  if (rel) {
    url += rel;
  }
  // // jQuery AJAX call for JSON
  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'JSON'
  }).done(function( response ) {
    ismListData = response;
    $.each(response.reverse(), function(){
      // a single element gets added to the document as a string :(
      if (Array.isArray(this["tags[]"])) {
        // this bit for gathering tags is fugly
        // also, should probably add them all to a set to avoid duplicates, then create the tagCloud html

        // only generate the tag cloud if this is not a filter from a tag anchor click
        if (!event) {
          for(i = 0; i < this["tags[]"].length; i++) {
            tagCloud += '<span><a href="#" class="linktagfilter" rel="' + this["tags[]"][i] + '">' + this["tags[]"][i] + '</a></span><span> </span>';
          }
        }
        joinedTags = this["tags[]"].join();
      } else {
        if (!event) {
          tagCloud += '<span><a href="#" class="linktagfilter" rel="' + this["tags[]"] + '">' + this["tags[]"] + '</a></span><span> </span>';
        }
        joinedTags = this["tags[]"];
      }
      tableContent += '<div class="record">' + this.source + ' | ' + this.number + ' | ' + joinedTags + ' | ' + this.quote + ' | ' + this.comments + ' | ';
      tableContent += '<a href="#" class="linkupdateism" rel="' + this._id + '">u</a>' + ' | ';
      tableContent += '<a href="#" class="linkdeleteism" rel="' + this._id + '">d</a>';
      tableContent += '</div>';
      tableContent += '<hr>';
    });
    $('#ismList isms').html(tableContent);
    $('#tagCloud').html(tagCloud);
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
      'tags': $('#addOrUpdateIsm fieldset input#inputTags').val().split(/\s*,\s*/),
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
  closeFormModal();
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
this
  // Inject the current value into the update field
  $('#addOrUpdateIsm fieldset input#inputSource').val(thisIsmObject.source);
  $('#addOrUpdateIsm fieldset input#inputNumber').val(thisIsmObject.number);
  $('#addOrUpdateIsm fieldset input#inputTags').val(thisIsmObject["tags[]"].join());
  $('#addOrUpdateIsm fieldset textarea#inputQuote').val(thisIsmObject.quote);
  $('#addOrUpdateIsm fieldset textarea#inputComments').val(thisIsmObject.comments);
  $('#addOrUpdateIsm fieldset button#btnAddOrUpdateIsm').val(thisIsmObject._id);

  console.log('exiting populateIsmFields');
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        closeFormModal();
    }
}
