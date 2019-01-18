const RequestHandler = require("../requestHandler");
const app = new RequestHandler();

const NOT_FOUND = "Page Not Found";
const { readFile, writeFile } = require("fs");

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

const appendToGuestBook = function(req, res, commentLog) {
  readFile("./public_html/guestBook.html", function(err, guestBookHtml) {
    let response = guestBookHtml + commentLog;
    res.write(response);
    res.end();
  });
};

const createCommentLogHTML = function(commentLog) {
  let { name, comment, date } = commentLog;
  return (
    "name:" + name + "<br/>comment:" + comment + "<br/>date:" + date + "<hr>"
  );
};

const getLatestCommentLog = function(parsedCommentLog) {
  let latestCommentLog = parsedCommentLog.map(createCommentLogHTML);
  return latestCommentLog.join("");
};

const parseFormArgs = function(data) {
  let formArgs = data.match(/name\=(.*)\&comment=(.*)/);
  let name = formArgs[1];
  let comment = formArgs[2];
  let date = new Date().toLocaleString();
  return { name, comment, date };
};

const writeLatestCommentLog = function(parsedCommentLog) {
  writeFile(
    "./src/commentLog.json",
    JSON.stringify(parsedCommentLog),
    "utf8",
    function(err) {}
  );
};

const handleCommentLog = function(req, res, commentLog, formData) {
  let parsedCommentLog = JSON.parse(commentLog);
  parsedCommentLog.unshift(formData);
  let latestCommentLog = getLatestCommentLog(parsedCommentLog);
  writeLatestCommentLog(parsedCommentLog);
  appendToGuestBook(req, res, latestCommentLog);
};

const handleForm = function(req, res) {
  let formData = parseFormArgs(req.body);
  readFile("./src/commentLog.json", function(err, commentLog) {
    handleCommentLog(req, res, commentLog, formData);
  });
};

app.use(readBody);
app.post("/submitted", handleForm);
app.use(handleRequest);

module.exports = app.handleRequest.bind(app);
