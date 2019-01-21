const RequestHandler = require("../requestHandler");

const { readBody, handleRequest } = require("./serverUtil");

const app = new RequestHandler();

const { readFile } = require("fs");

const { Comment, Comments } = require("./comments");

/** This is a description of parseFormArgs function. */
const parseFormArgs = function(formData) {
  let formArgs = formData.match(/name\=(.*)\&comment=(.*)/);
  let name = formArgs[1];
  let comment = formArgs[2];
  let commentLog = new Comment(name, comment);
  return commentLog;
};

/** This is a description of handleCommentLog function. */
const handleCommentLog = function(req, res, commentLog, formData) {
  let comments = new Comments(commentLog);
  comments.parseComments();
  comments.add(formData);
  let latestCommentLog = comments.getLatestCommentLog();
  comments.writeLatestCommentLog();
  comments.appendToGuestBook(req, res, latestCommentLog);
};

/** This is a description of handleForm function. */
const handleForm = function(req, res) {
  let formData = parseFormArgs(req.body);
  readFile("./public_html/commentLog.json", function(err, commentLog) {
    handleCommentLog(req, res, commentLog, formData);
  });
};

app.use(readBody);
app.post("/submitted", handleForm);
app.use(handleRequest);

module.exports = app.handleRequest.bind(app);
