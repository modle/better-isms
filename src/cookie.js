var cookie = {

  delete : function(cookieName) {
    cookie.set(cookieName, "", 0);
  },
  set : function(cookieName, cookieValue, daysToExpiration) {
    var d = new Date();
    d.setTime(d.getTime() + daysToExpiration * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
  },
  get : function(cookieName) {
    var name = cookieName + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  },
}
