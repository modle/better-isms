
var auth = {
  loggedInElements : [
    "newIsm",
    "addSource",
    "toTop",
    "toBottom",
    "clearFilter",
    "toggleSources",
    "toggleTags",
    "untagged",
    "uncommented",
    "export",
    "logout"
  ],
  loggedOutElements : [
    "login"
  ],
  showLoggedInButtons : function() {
    contentControl.showElements(this.loggedInElements);
    contentControl.hideElements(this.loggedOutElements);
  },
  showLoggedOutButtons : function() {
    contentControl.showElements(this.loggedOutElements);
    contentControl.hideElements(this.loggedInElements);
  },
  logUserOut : function() {
    cookie.delete("username");
    elements.clearIsmDivs();
    tags.clearCloud();
    sources.clearCloud();
    console.log("user is logged out");
    auth.showLoggedOutButtons();
    modals.hide();
    modals.show(loggedOutModal);
    modals.hideAfterAWhile(loggedOutModal);
  },
  checkLoggedIn : function() {
    var user = cookie.get("username");
    if (user != "") {
      console.log("user is logged in");
      return true;
    }
    return false;
  },
  promptUserToLogin : function() {
    contentControl.hideFooter();
    modals.show(loginModal);
    $("#inputUsername").focus();
  },
  handleLogin : function() {
    if (!auth.checkLoggedIn()) {
      console.log("user is not logged in");
      this.promptUserToLogin();
    }
  },
  logUserIn : function(event) {
    event.preventDefault();
    log.enter(getName());

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $("#loginForm input").each(function(index, val) {
      if ($(this).val() === "") {
        errorCount++;
      }
    });

    if (errorCount === 0) {
      var user = {
        username: $("#loginForm fieldset input#inputUsername").val(),
        password: $("#loginForm fieldset input#inputPassword").val()
      };
      var url = "/login/";
      var type = "POST";
      $.ajax({
        type: type,
        data: user,
        url: url,
        dataType: "JSON"
      }).done(function(response) {
        if (response.msg === "") {
          cookie.set("username", user.username, 365);
          modals.hide();
          contentControl.generate("");
          auth.showLoggedInButtons();
        } else {
          alert("Error: " + response.msg);
        }
      });
    } else {
      alert("Please fill in all fields");
      log.exit(getName());
      return false;
    }
    log.exit(getName());
  },
};
