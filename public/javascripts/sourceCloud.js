var sourceCloudList = [];

function generateSourceCloud() {
  var sourceCloud = '';
  for (var source of Array.from(sourceCloudList).sort()) {
    sourceCloud += '<span><a href="#" class="linksourcefilter" rel="' + source + '"">';
    sourceCloud += source + '</a></span><span> </span>';
  }
  return sourceCloud;
}

function setSourceCloud(sourceCloud) {
  $('#sourceCloud').html(sourceCloud);
}

function clearSourceCloud() {
  setSourceCloud('');
}
