const { sendResponse } = require("./serverUtil");

const { readFile, writeFile } = require("fs");

class Comment {
  /**
   * Represents a Comment.
   * @constructor
   */
  constructor(name, comment) {
    this.name = name;
    this.comment = comment;
    this.date = new Date().toLocaleString();
  }
}
class Comments {
  /**
   * Represents the Comments.
   * @constructor
   */
  constructor(comments) {
    this.comments = comments;
  }

  /** This is a description of parseComments function. */
  parseComments() {
    this.comments = JSON.parse(this.comments);
  }

  /** This is a description of add function. */
  add(comment) {
    this.comments.unshift(comment);
  }

  /** This is a description of getLatestCommentLog function. */
  getLatestCommentLog() {
    let latestCommentLog = this.comments.map(this.createCommentLogHTML);
    return latestCommentLog.join("");
  }

  /** This is a description of createCommentLogHTML function. */
  createCommentLogHTML(commentLog) {
    let { name, comment, date } = commentLog;
    return (
      "name:" + name + "<br/>comment:" + comment + "<br/>date:" + date + "<hr>"
    );
  }

  /** This is a description of writeLatestCommentLog function. */
  writeLatestCommentLog() {
    writeFile(
      "./public_html/commentLog.json",
      JSON.stringify(this.comments),
      "utf8",
      function(err) {}
    );
  }

  /** This is a description of appendToGuestBook function. */
  appendToGuestBook(req, res, commentLog) {
    readFile("./public_html/guestBook.html", "utf8", function(
      err,
      guestBookHtml
    ) {
      let response = guestBookHtml.replace("#comment_section#", commentLog);
      sendResponse(res, response, 200);
    });
  }
}

module.exports = { Comment, Comments };
