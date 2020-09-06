import React, { Component } from "react";
import { comment, uncomment } from "./apiPost";
import { isAuthenticated } from "./../auth/index";
import { Link } from "react-router-dom";

class Comment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
    };
  }

  componentDidMount() {}

  addComment = (e) => {
    e.preventDefault();

    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    const postId = this.props.postId;

    comment(userId, token, postId, { text: this.state.text }).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ text: "" });
        //dispatch fresh list of comments to parent component (SinglePost)
        this.props.updateComments(data.comments);
      }
    });
  };

  handleChange = (event) => {
    this.setState({ text: event.target.value });
  };

  render() {
    return (
      <div>
        <h3 className="mt-5 mb-5">Leave a comment...</h3>
        <form onSubmit={this.addComment}>
          <div className="form-group">
            <input
              type="text"
              onChange={this.handleChange}
              className="form-control"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default Comment;
