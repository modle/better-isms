var updateClouds = false;

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
        sourceCloudDict[this._id] = this.title;
      }
    });
    var sourceCloud = generateSourceCloud();
    setSourceCloud(sourceCloud);
    var sourceModalContent = generateSourceModalContent();
    setSourceModalContent(sourceModalContent);
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
    sourceCloudIds = [];
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
