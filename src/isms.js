var isms = {
  clearIsmDivs : function() {
    this.setIsmsList("");
  },
  generateIsmHeaders : function() {
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
  },
  addIsmDiv : function(source, details, ismTags) {
    var divContent = "";
    var comments = details.comments === undefined ? "" : details.comments;
    divContent +=
      '<div class="record"><span class="source field">' +
      sources.getDisplayString(source) +
      "</span> | ";
    divContent += '<span class="num field">' + details.number + "</span> | ";
    divContent += tags.generateDivsForIsm(ismTags) + " | ";
    divContent += '<span class="quote field">' + details.quote + "</span> | ";
    divContent += '<span class="comment field">' + comments + "</span> | ";
    divContent +=
      '<a href="#" class="linkeditism" rel="' +
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
  },
  setIsmsList : function(ismDivs) {
    $("#ismList isms").html(ismDivs);
  },
}