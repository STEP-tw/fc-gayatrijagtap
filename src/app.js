const { readFile } = require("fs");

const getRequest = function(url) {
  if (url == "/") return "./index.html";
  return "." + url;
};

const sendResponse = function(res, content, status) {
  res.statusCode = status;
  res.write(content);
  res.end();
};

const handleRequest = function(request, res) {
  readFile(request, function(err, content) {
    if (err) {
      sendResponse(res, "not found", 404);
      return;
    }
    sendResponse(res, content, 200);
  });
};

const app = (req, res) => {
  let request = getRequest(req.url);
  handleRequest(request, res);
};

module.exports = app;
