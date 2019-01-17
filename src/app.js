const Sheeghra = require("../sheeghra");
const app = new Sheeghra();

const NOT_FOUND = "Page Not Found";
const { readFile } = require("fs");

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

const getFormData = function(req, res) {
  let formData = req.body.match(/name\=(.*)\&comment=(.*)/);
  let name = formData[1];
  let comment = formData[2];
  let date = new Date();
  let response = "name:" + name + "\ncomment:" + comment + "\ndate:" + date;
  res.write(response);
  res.end();
};

app.use(readBody);
app.post("/submitted", getFormData);
app.use(handleRequest);

module.exports = app.handleRequest.bind(app);
