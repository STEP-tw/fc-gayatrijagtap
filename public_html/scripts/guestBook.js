const createHtml = function(commentLog) {
  let { name, comment, date } = commentLog;
  return (
    "name:" + name + "<br/>comment:" + comment + "<br/>date:" + date + "<hr>"
  );
};

const getComments = document => document.getElementById("comments");

const refresh = function() {
  fetch("commentLog.json")
    .then(function(response) {
      return response.json();
    })
    .then(function(myjson) {
      let myhtml = myjson.map(createHtml);
      getComments(document).innerHTML = myhtml.join("");
    });
};

window.onload = refresh;
