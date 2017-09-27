var modal;
var rel;
var tagCloudDict = {};
var sourceCloudList = [];
var updateClouds = false;
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
  $('#showAll').on('click', generateContent);

  // Clear Ism button click
  $('#btnClearIsm').on('click', clearIsm);

  // Update Ism link click
  $('#ismList isms').on('click', 'a.linkupdateism', populateIsmFields);

  // Delete Ism link click
  $('#ismList isms').on('click', 'a.linkdeleteism', deleteIsm);

  // Tag cloud link click
  $('#tagCloud').on('click', 'a.linktagfilter', generateContent);

  // Source cloud link click
  $('#sourceCloud').on('click', 'a.linksourcefilter', generateContent);

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
    generateContent('');
    showButton('logout');
  } else {
    console.log("user is not logged in");
    promptUserToLogin();
  }
});

// Functions =============================================================


function hideButton(buttonClass) {
  $('#' + buttonClass).hide();
}

function showButton(buttonClass) {
  $('#' + buttonClass).show();
}

function clearIsmDivs() {
  setIsmsList('');
}

function generateIsmHeaders() {
  var divHeaders = '';
  divHeaders += '<div class="record"><span class="source">record</span> | ';
  divHeaders += '<span class="num">page number</span> | ';
  divHeaders += '<span class="tag">tags</span> | ';
  divHeaders += '<span class="quote">quote</span> | ';
  divHeaders += '<span class="comment">comments</span>';
  divHeaders += '</div>';
  divHeaders += '<hr>';
  divHeaders += '<hr>';
  return divHeaders;
}

function addIsmDiv(source, details, tags) {
  var divContent = '';
  divContent += '<div class="record"><span class="source field">' + source.title + '</span> | ';
  divContent += '<span class="num field">' + details.number + '</span> | ';
  divContent += generateTagDivs(tags) + ' | ';
  divContent += '<span class="quote field">' + details.quote + '</span> | ';
  divContent += '<span class="comment field">' + details.comments + '</span> | ';
  divContent += '<a href="#" class="linkupdateism" rel="' + source._id + ":" + details._id + '">edit</a> | ';
  divContent += '<a href="#" class="linkdeleteism" rel="' + source._id + ":" + details._id + '">delete</a> | ';
  divContent += '</div>';
  divContent += '<hr>';
  return divContent;
}

function setIsmsList(ismDivs) {
  $('#ismList isms').html(ismDivs);
}

function manageGetIsmListCall(url) {
  console.log(url);
  ismDivs = generateIsmHeaders();
  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'JSON'
  }).done(function( response ) {
    ismListData = response;
    $.each(response, function(){
      var source = this
      source.isms.forEach(function(ism) {
        var tags = ism["tags[]"]
        if (updateClouds) {
          addToTags(tags);
        }
        ismDivs += addIsmDiv(source, ism, tags);
      });
    });
    setIsmsList(ismDivs);
    var tagCloud = generateTagCloud();
    setTagCloud(tagCloud);
  });
}

function manageGetSourceListCall() {
  var url = '/isms/sourcelist/';
  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'JSON'
  }).done(function( response ) {
    $.each(response, function(){
      if (updateClouds) {
        sourceCloudList.push(this.title);
      }
    });
    console.log(sourceCloudList);
    var sourceCloud = generateSourceCloud();
    setSourceCloud(sourceCloud);
  });
}

function determineIsmQueryUrl(eventClass, rel) {
  url = '/isms/ismlist/';
  if (eventClass == 'linktagfilter') {
    url += 'tag/' + rel;
  } else if (eventClass == 'linksourcefilter') {
    url += 'source/' + rel;
  }
  return url;
}

function prepClouds(eventClass) {
  updateClouds = false;
  if (!eventClass) {
    tagCloudDict = {};
    sourceCloudList = [];
    updateClouds = true;
  }
}

function generateContent(event) {
  console.log('entering generateIsmDivs');
  handleLogin();
  var eventClass = $(this).attr('class');
  var rel = $(this).attr('rel');
  url = determineIsmQueryUrl(eventClass, rel);
  prepClouds(eventClass)
  manageGetIsmListCall(url);
  manageGetSourceListCall();
  console.log('exiting generateIsmDivs');
};

// Add or Update Ism
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

// Delete Ism
function deleteIsm(event) {
  event.preventDefault();
  console.log('delete ism clicked!');

  handleLogin();

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
      generateContent();
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

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    hideModal(formModal);
  }
}
