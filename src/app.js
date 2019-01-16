const { readFile } = require("fs");

const app = (req, res) => {
  let request = "index.html";
  if (req.url == "/style_sheet/style.css") {
    request = "./style_sheet/style.css";
  }

  if (req.url == "/fs-gayatrijagtap/media/freshorigins.jpg") {
    request = "./media/freshorigins.jpg";
  }

  if (req.url == "/fs-gayatrijagtap/media/animated-flower-image-0021.gif") {
    request = "./media/animated-flower-image-0021.gif";
  }

  if (req.url == "/src/main.js") {
    request = "./src/main.js";
  }

  readFile(request, function(err, content) {
    console.log(content);
    res.write(content);
    res.end();
  });
};
// Export a function that can act as a handler

module.exports = app;
