const getJar = document => document.getElementById("jar_1");

const hide = function() {
  getJar(document).style.visibility = "hidden";
  setTimeout(show, 1000);
};

const show = function() {
  getJar(document).style.visibility = "visible";
};

const initialize = function() {
  getJar(document).onclick = hide;
};

window.onload = initialize;
