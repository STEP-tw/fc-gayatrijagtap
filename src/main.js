const getJar = document => document.getElementById("jar_1");

const hide = function() {
  getJar(document).style.visibility = "hidden";
  setTimeout(() => {
    getJar(document).style.visibility = "visible";
  }, 1000);
};

const initialize = function() {
  getJar(document).onclick = hide;
};

window.onload = initialize;
