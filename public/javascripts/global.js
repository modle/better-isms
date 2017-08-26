var modal;
var rel;
var tagCloudDict = {}
var optionalIsmFields = [];
optionalIsmFields.push('inputComments');


// DOM Ready =============================================================
$(document).ready(function() {
  // Add or Update Ism button click
  $('#btnAddOrUpdateIsm').on('click', addOrUpdateIsm);

  // New Ism button click
  $('#newIsm').on('click', openNewIsmForm);

  // Show login form button click
  $('#login').on('click', promptUserToLogin);

  // Login submit button click
  $('#btnSubmitLogin').on('click', logUserIn);

  // Login submit button click
  $('#logout').on('click', logUserOut);

  // Show all button click
  $('#showAll').on('click', generateIsmDivs);

  // Clear Ism button click
  $('#btnClearIsm').on('click', clearIsm);

  // Update Ism link click
  $('#ismList isms').on('click', 'a.linkupdateism', populateIsmFields);

  // Delete Ism link click
  $('#ismList isms').on('click', 'a.linkdeleteism', deleteIsm);

  // Tag cloud link click
  $('#tagCloud').on('click', 'a.linktagfilter', generateIsmDivs);

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
      hideModal(formModal);
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

  // close the modals on initial page load
  modal = document.getElementById('formModal');
  hideModal(formModal);

  loginModal = document.getElementById('loginModal');
  hideModal(loginModal);

  loggedOutModal = document.getElementById('loggedOutModal');
  hideModal(loggedOutModal);

  ismDeletedModal = document.getElementById('ismDeletedModal');
  hideModal(ismDeletedModal);

  hideButton('logout');
  hideButton('login');

  // generate the isms on initial page load if user is logged in
  if (checkLoggedIn()) {
    generateIsmDivs('');
    showButton('logout');
  } else {
    console.log("user is not logged in");
    promptUserToLogin();
  }
});

// Functions =============================================================

function logUserOut() {
  deleteCookie('username');
  clearIsmDivs();
  clearTagCloud();
  console.log('user is logged out');
  hideButton('logout');
  showButton('login');
  hideModal(formModal);
  showModal(loggedOutModal);
  hideModalAfterAWhile(loggedOutModal);
}

function hideButton(buttonClass) {
  $('#' + buttonClass).hide();
}

function showButton(buttonClass) {
  $('#' + buttonClass).show();
}

function hideModalAfterAWhile(modal) {
  setTimeout(function(){ hideModal(modal); }, 3000);
}

function hideModal(modal) {
  modal.style.display = "none";
}

function showModal(modal) {
  console.log("showing modal: " + modal.id)
  modal.style.display = "block";
}

function clearTagCloud() {
  setTagCloud('');
}

function clearIsmDivs() {
  setIsmsList('');
}

function promptUserToLogin() {
  showModal(loginModal);
  $('#inputUsername').focus();
}

// Login event
function logUserIn(event) {
  event.preventDefault();
  console.log('login button clicked!');

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#loginForm input').each(function(index, val) {
    console.log(this)
    if ($(this).val() === '') {
      errorCount++;
    }
  });

  if(errorCount === 0) {
    var user = {
      'username': $('#loginForm fieldset input#inputUsername').val(),
      'password': $('#loginForm fieldset input#inputPassword').val(),
    }
    var url = '/login/';
    var type = 'POST';
    $.ajax({
      type: type,
      data: user,
      url: url,
      dataType: 'JSON'
    }).done(function( response ) {
      if (response.msg === '') {
        setCookie("username", user.username, 365);
      } else {
        alert('Error: ' + response.msg);
      }
      hideModal(loginModal);
      generateIsmDivs('');
      showButton('logout');
      hideButton('login');
    });
  }
  else {
    alert('Please fill in all fields');
    console.log('exiting login with return false');
    return false;
  }
  console.log('exiting logUserIn');
};

function openNewIsmForm() {
  if (!checkLoggedIn()) {
    console.log("user is not logged in");
    promptUserToLogin();
    return;
  }
  clearIsmFormFields();
  $('#btnClearIsm').show();
  showModal(formModal);
  $('#inputSource').focus();
}

function setUpdateIsmFormElementText() {
  $('#addOrUpdateIsmHeader').text("Update Ism");
  $('#btnAddOrUpdateIsm').text("Update Ism");
  $('#btnClearIsm').hide();
  showModal(formModal);
  $('#inputSource').focus();
}

function clearIsmFormFields() {
  $('#addOrUpdateIsm fieldset input').val('');
  $('#addOrUpdateIsm fieldset textarea').val('');
  $('#addOrUpdateIsm fieldset button#btnAddOrUpdateIsm').val('');
}

function addToTagDict(tag) {
  lowerCasedTag = tag.toLowerCase();
  if (lowerCasedTag in tagCloudDict) {
    tagCloudDict[lowerCasedTag] += 1;
  } else {
    tagCloudDict[lowerCasedTag] = 1;
  }
}

function addToTags(tags) {
  if (Array.isArray(tags)) {
    for (i = 0; i < tags.length; i++) {
      addToTagDict(tags[i]);
    }
  } else {
    addToTagDict(tags);
  }
}

function generateTagDivs(tags) {
  tagDivs = ''
  if (Array.isArray(tags)) {
    for (i = 0; i < tags.length; i++) {
      tagDivs += '<span class="tag">'
      tagDivs += tags[i];
      tagDivs += '</span>'
    }
  } else {
    tagDivs += '<span class="tag">'
    tagDivs += tags;
    tagDivs += '</span>'
  }
  return tagDivs;
}

function addIsmDiv(record, tags) {
  var divContent = '';
  divContent += '<div class="record">' + record.source;
  divContent += ' | ' + record.number;
  divContent += ' | ' + generateTagDivs(tags);
  divContent += ' | ' + record.quote;
  divContent += ' | ' + record.comments;
  divContent += ' | ' + '<a href="#" class="linkupdateism" rel="' + record._id + '">u</a>';
  divContent += ' | ' + '<a href="#" class="linkdeleteism" rel="' + record._id + '">d</a>';
  divContent += '</div>';
  divContent += '<hr>';
  return divContent;
}

function setIsmsList(ismDivs) {
  $('#ismList isms').html(ismDivs);
}

function calculateTagSize(tag) {
  var tagArray = Array.from(Object.values(tagCloudDict));
  var maxCount = Math.max.apply(null, tagArray);
  var minCount = Math.min.apply(null, tagArray);
  var range = maxCount - minCount;
  var tagCount = tagCloudDict[tag];
  var tagSizeRatio = tagCount / range;
  var baseEmSize = 1;
  var finalEmSize = tagSizeRatio + baseEmSize;
  return finalEmSize;
}

function generateTagCloud() {
  var tagCloud = '';
  for (var tag of Array.from(Object.keys(tagCloudDict)).sort()) {
    var size = calculateTagSize(tag);
    tagCloud += '<span><a href="#" class="linktagfilter" rel="' + tag + '" style="font-size:' + size + 'em">';
    tagCloud += tag + '</a></span><span> </span>';
  }
  return tagCloud;
}

function setTagCloud(tagCloud) {
  $('#tagCloud').html(tagCloud);
}

function generateIsmHeaders() {
  var divHeaders = '';
  divHeaders += '<div class="record">record | page number | tags | quote | comments | ';
  divHeaders += 'update | ';
  divHeaders += 'delete';
  divHeaders += '</div>';
  divHeaders += '<hr>';
  divHeaders += '<hr>';
  return divHeaders;
}

function generateIsmDivs(event) {
  console.log('entering generateIsmDivs');
  if (!checkLoggedIn()) {
    console.log("user is not logged in");
    promptUserToLogin();
    return;
  }
  var ismDivs = generateIsmHeaders();
  var tagQuery = false;
  var url = '/isms/ismlist/';
  var rel = $(this).attr('rel');
  if (rel != null) {
    tagQuery = true;
    url += rel;
  } else {
    tagQuery = false;
    tagCloudDict = {};
  }
  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'JSON'
  }).done(function( response ) {
    ismListData = response;
    $.each(response.reverse(), function(){
      var tags = this["tags[]"]
      if (!tagQuery) {
        addToTags(tags);
      }
      ismDivs += addIsmDiv(this, tags);
    });
    setIsmsList(ismDivs);
    var tagCloud = generateTagCloud();
    setTagCloud(tagCloud);
  });
  console.log('exiting generateIsmDivs');
};

// Add or Update Ism
function addOrUpdateIsm(event) {
  event.preventDefault();
  console.log('update or add ism clicked!');
  if (!checkLoggedIn()) {
    console.log("user is not logged in");
    promptUserToLogin();
    return;
  }

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
    'source': $('#addOrUpdateIsm fieldset input#inputSource').val(),
    'number': $('#addOrUpdateIsm fieldset input#inputNumber').val(),
    'tags': $('#addOrUpdateIsm fieldset input#inputTags').val().toLowerCase().split(/\s*,\s*/),
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
      generateIsmDivs(null);
    } else {
      alert('Error: ' + response.msg);
    }
  });
  hideModal(formModal);
  console.log('exiting addOrUpdateIsm');
};

// Add or Update Ism
function clearIsm(event) {
  event.preventDefault();
  console.log('clear ism clicked!');
  clearIsmFormFields();
  console.log('exiting clearIsm');
};

// Delete Ism
function deleteIsm(event) {
  event.preventDefault();
  console.log('delete ism clicked!');

  if (!checkLoggedIn()) {
    console.log("user is not logged in");
    promptUserToLogin();
    return;
  }

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
      generateIsmDivs();
      // clear the update fields if the id matches
      if ($('#addOrUpdateIsm fieldset button#btnAddOrUpdateIsm').val() === ismId) {
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

function populateIsmFields(event) {
  event.preventDefault();
  console.log('populatefieldsclicked!');
  if (!checkLoggedIn()) {
    console.log("user is not logged in");
    promptUserToLogin();
    return;
  }

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

  joinedTags = '';
  if (Array.isArray(thisIsmObject["tags[]"])) {
    joinedTags = thisIsmObject["tags[]"].join();
  } else {
    joinedTags = thisIsmObject["tags[]"];
  }

  // Inject the current value into the update field
  $('#addOrUpdateIsm fieldset input#inputSource').val(thisIsmObject.source);
  $('#addOrUpdateIsm fieldset input#inputNumber').val(thisIsmObject.number);
  $('#addOrUpdateIsm fieldset input#inputTags').val(joinedTags);
  $('#addOrUpdateIsm fieldset textarea#inputQuote').val(thisIsmObject.quote);
  $('#addOrUpdateIsm fieldset textarea#inputComments').val(thisIsmObject.comments);
  $('#addOrUpdateIsm fieldset button#btnAddOrUpdateIsm').val(thisIsmObject._id);

  console.log('exiting populateIsmFields');
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    hideModal(formModal);
  }
}
