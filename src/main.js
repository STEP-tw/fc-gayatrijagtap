const getJar = document => document.getElementById("jar_1");

const hide = function() {
  getJar(document).style.display = "none";
  setTimeout(() => {
    getJar(document).style.display = "inline";
  }, 1000);
};

const initialize = function() {
  getJar(document).onclick = hide;
};

window.onload = initialize;
