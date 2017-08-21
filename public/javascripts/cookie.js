function deleteCookie(cookieName) {
  setCookie(cookieName, '', 0);
}

function setCookie(cookieName, cookieValue, daysToExpiration) {
    var d = new Date();
    d.setTime(d.getTime() + (daysToExpiration * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

function getCookie(cookieName) {
  var name = cookieName + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkLoggedIn() {
  var user = getCookie("username");
  if (user != "") {
    console.log("user is logged in");
    return true;
  }
  return false;
}
