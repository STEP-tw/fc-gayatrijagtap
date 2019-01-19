const { readFile } = require("fs");
const NOT_FOUND = "Page Not Found";

const getRequest = function(url) {
  if (url == "/") return "./public_html/index.html";
  return "./public_html" + url;
};

const readBody = (req, res, next) => {
  let content = "";
  req.on("data", chunk => (content += chunk));
  req.on("end", () => {
    req.body = content;
    next();
  });
};

const sendResponse = function(res, content, status) {
  res.statusCode = status;
  res.write(content);
  res.end();
};

const handleRequest = function(req, res) {
  let request = getRequest(req.url);
  readFile(request, function(err, content) {
    if (err) {
      sendResponse(res, NOT_FOUND, 404);
      return;
    }
    sendResponse(res, content, 200);
  });
};

module.exports = { readBody, sendResponse, getRequest, handleRequest };
