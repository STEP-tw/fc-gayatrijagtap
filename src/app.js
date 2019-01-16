const { readFile } = require("fs");

const getRequest = function(url) {
  if (url == "/") {
    return "./index.html";
  }
  return "." + url;
};

const app = (req, res) => {
  let request = getRequest(req.url);
  readFile(request, function(err, content) {
    if (!err) {
      res.write(content);
      res.end();
      return;
    }
    res.statusCode = 404;
    res.end();
  });
};

module.exports = app;
