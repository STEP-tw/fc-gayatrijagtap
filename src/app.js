const Sheeghra = require("../sheeghra");
const app = new Sheeghra();

const NOT_FOUND = "Page Not Found";
const { readFile, appendFile } = require("fs");

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

const appendToGuestBook = function(req, res, content) {
  readFile("./public_html/guestBook.html", function(err, content1) {
    let response = content1 + content;
    res.write(response);
    res.end();
  });
};

const getFormData = function(req, res) {
  let formData = req.body.match(/name\=(.*)\&comment=(.*)/);
  let name = formData[1];
  let comment = formData[2];
  let date = new Date().toLocaleString();
  let response =
    "name:" + name + "<br/>comment:" + comment + "<br/>date:" + date + "<br/>";
  appendFile("./src/commentLog", response, "utf8", function(err) {});
  readFile("./src/commentLog", function(err, content) {
    appendToGuestBook(req, res, content);
  });
};

app.use(readBody);
app.post("/submitted", getFormData);
app.use(handleRequest);

module.exports = app.handleRequest.bind(app);
