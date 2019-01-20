const createHtml = function(commentLog) {
  let { name, comment, date } = commentLog;
  return (
    "name:" + name + "<br/>comment:" + comment + "<br/>date:" + date + "<hr>"
  );
};

const getBody = document => document.getElementById("body");

const refresh = function() {
  fetch("commentLog.json")
    .then(function(response) {
      return response.json();
    })
    .then(function(myjson) {
      let myhtml = myjson.map(createHtml);
      let guestBookHtml = getBody(document).innerHTML;
      let guestBookBody = guestBookHtml.split("name:")[0];
      getBody(document).innerHTML = guestBookBody + myhtml.join("");
    });
};
