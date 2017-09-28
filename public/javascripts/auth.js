
function logUserOut() {
  deleteCookie('username');
  clearIsmDivs();
  clearTagCloud();
  clearSourceCloud();
  console.log('user is logged out');
  hideButton('logout');
  showButton('login');
  hideModal(formModal);
  showModal(loggedOutModal);
  hideModalAfterAWhile(loggedOutModal);
}

function checkLoggedIn() {
  var user = getCookie("username");
  if (user != "") {
    console.log("user is logged in");
    return true;
  }
  return false;
}

function promptUserToLogin() {
  showModal(loginModal);
  $('#inputUsername').focus();
}

function handleLogin() {
  if (!checkLoggedIn()) {
    console.log("user is not logged in");
    promptUserToLogin();
  }
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
      generateContent('');
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
