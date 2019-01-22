const RequestHandler = require("../requestHandler");

const { readBody, handleRequest } = require("./serverUtil");

const app = new RequestHandler();

const { readFile, writeFile } = require("fs");

const { Comment, Comments } = require("./comments");

const userIds = require("../userIds.json");

/** This is a description of parseFormArgs function. */
const parseFormArgs = function(formData, req) {
  let formArgs = formData.match(/comment=(.*)/);
  let name = req.headers["cookie"].split("=")[1];
  let comment = formArgs[1];
  let commentLog = new Comment(name, comment);
  return commentLog;
};

/** This is a description of handleCommentLog function. */
const handleCommentLog = function(req, res, commentLog, formData) {
  let name = req.headers["cookie"].split("=")[1];
  let comments = new Comments(commentLog);
  comments.parseComments();
  comments.add(formData);
  let latestCommentLog = comments.getLatestCommentLog();
  comments.writeLatestCommentLog();
  comments.appendToGuestBook(req, res, latestCommentLog, htmls.login, name);
};

/** This is a description of handleForm function. */
const handleForm = function(req, res) {
  let formData = parseFormArgs(req.body, req);
  readFile("./public_html/commentLog.json", function(err, commentLog) {
    handleCommentLog(req, res, commentLog, formData);
  });
};

const renderLoginForm = function(req, res, name) {
  readFile("./public_html/guestBook.html", "utf8", function(err, content) {
    let guestBook = content.replace("#form#", htmls.login);
    guestBook = guestBook.replace("#name#", name);
    res.write(guestBook);
  });
};

const login = function(req, res) {
  let name = req.body.match(/name\=(.*)/)[1];
  renderLoginForm(req, res, name);
  let userId = name;
  res.setHeader("Set-Cookie", `userId=${userId}`);
  userIds.push(userId);
  writeFile("./userIds.json", JSON.stringify(userIds), () => {
    res.end();
  });
};

const renderLogoutPage = function(req, res) {
  readFile("./public_html/guestBook.html", "utf8", function(err, content) {
    let guestBook = content.replace("#form#", htmls.guestBook);
    res.write(guestBook);
    res.end();
  });
};

const logout = function(req, res) {
  res.setHeader("Set-Cookie", `userId=${null}`);
  renderLogoutPage(req, res);
};

const htmls = {
  guestBook: `<form method="POST" action="/login">
  <label>Name:</label> <input type="text" name="name" required/>
  <input type="submit" value="login"><br />
</form>`,
  login: `<form method="POST" action="/logout">
  <label>Name:</label> #name#
  <button id="logout">Logout</button> <br />
</form>
<form method="POST" action="/submitted">
  <label>Comment:</label>
  <textarea name="comment" id="comment" cols="15" rows="3"></textarea> <br />
  <input type="submit" />
</form>`
};

const renderGuestBookPage = function(req, res) {
  readFile("./public_html/guestBook.html", "utf8", function(err, content) {
    console.log(content, "in renderGuestBook");
    let guestBook = content.replace("#form#", htmls.guestBook);
    res.write(guestBook);
    res.end();
  });
};

const renderGuestBook = function(req, res) {
  renderGuestBookPage(req, res);
};

app.use(readBody);
app.get("/guestBook.html", renderGuestBook);
app.post("/login", login);
app.post("/logout", logout);
app.post("/submitted", handleForm);
app.use(handleRequest);

module.exports = app.handleRequest.bind(app);
