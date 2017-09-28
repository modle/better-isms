var sourceCloudDict = {};

function generateSourceCloud() {
  var sourceCloud = '';
  for (var source of Array.from(Object.values(sourceCloudDict).sort())) {
    sourceCloud += '<span><a href="#" class="linksourcefilter" rel="' + source + '"">';
    sourceCloud += source + '</a></span><span> </span>';
  }
  return sourceCloud;
}

function generateSourceModalContent() {
  var sourceModalContent = '';
  for (var source of Array.from(Object.keys(sourceCloudDict).sort())) {
    sourceModalContent += '<div><a href="#" class="linksource" rel="' + source + ':' + sourceCloudDict[source] + '">';
    sourceModalContent += sourceCloudDict[source] + '</a></div>';
  }
  return sourceModalContent;
}

function setSourceCloud(sourceCloud) {
  $('#sourceCloud').html(sourceCloud);
}

function clearSourceCloud() {
  setSourceCloud('');
}

function setSourceModalContent(sourceModalContent) {
  $('#sourceListDiv').html(sourceModalContent);
}

function clearSourceModalContent() {
  setSourceModalContent('');
}
