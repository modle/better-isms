var updateClouds = false;

function clearIsmDivs() {
  setIsmsList("");
}

function generateIsmHeaders() {
  var divHeaders = "";
  divHeaders += '<div class="record"><span class="source">source</span> | ';
  divHeaders += '<span class="num">page number</span> | ';
  divHeaders += '<span class="tag">tags</span> | ';
  divHeaders += '<span class="quote">quote</span> | ';
  divHeaders += '<span class="comment">comments</span>';
  divHeaders += "</div>";
  divHeaders += "<hr>";
  divHeaders += "<hr>";
  return divHeaders;
}

function addIsmDiv(source, details, tags) {
  var divContent = "";
  var comments = details.comments === undefined ? "" : details.comments;
  divContent +=
    '<div class="record"><span class="source field">' +
    getSourceDisplayString(source._id) +
    "</span> | ";
  divContent += '<span class="num field">' + details.number + "</span> | ";
  divContent += generateTagDivs(tags) + " | ";
  divContent += '<span class="quote field">' + details.quote + "</span> | ";
  divContent += '<span class="comment field">' + comments + "</span> | ";
  divContent +=
    '<a href="#" class="linkupdateism" rel="' +
    source._id +
    ":" +
    details._id +
    '">edit</a> | ';
  divContent +=
    '<a href="#" class="linkdeleteism" rel="' +
    source._id +
    ":" +
    details._id +
    '">delete</a> | ';
  divContent += "</div>";
  divContent += "<hr>";
  return divContent;
}

function setIsmsList(ismDivs) {
  $("#ismList isms").html(ismDivs);
}

function manageGetIsmListCall(url) {
  ismDivs = generateIsmHeaders();
  $.ajax({
    type: "GET",
    url: url,
    dataType: "JSON"
  }).done(function(response) {
    ismListData = response;
    $.each(response, function() {
      var source = this;
      source.isms.forEach(function(ism) {
        var tags = ism["tags"];
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
  var url = "/isms/sourcelist/";
  $.ajax({
    type: "GET",
    url: url,
    dataType: "JSON"
  }).done(function(response) {
    $.each(response, function() {
      if (updateClouds) {
        sourceCloudDict[this._id] = { title: this.title, author: this.author };
      }
    });
    var sourceCloud = generateSourceCloud();
    setSourceCloud(sourceCloud);
    var sourceModalContent = generateSourceModalContent();
    setSourceModalContent(sourceModalContent);
  });
}

function determineIsmQueryUrl() {
  url = "/isms/ismlist/";
  if (filter) {
    url += filter + "/" + filterId;
  }
  return url;
}

function prepClouds() {
  updateClouds = false;
  if (!filter) {
    tagCloudDict = {};
    sourceCloudList = [];
    sourceCloudIds = [];
    updateClouds = true;
  }
}

function generateContent() {
  console.log("entering generateIsmDivs");
  handleLogin();
  url = determineIsmQueryUrl();
  prepClouds();
  manageGetSourceListCall();
  manageGetIsmListCall(url);
  console.log("exiting generateIsmDivs");
}