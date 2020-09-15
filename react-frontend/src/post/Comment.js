import React, { Component } from "react";
import { comment, uncomment } from "./apiPost";
import { isAuthenticated } from "./../auth/index";
import { Link } from "react-router-dom";
import DefaultAvatar from "../images/avatar.png";
import Moment from "react-moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faHeart as solidHeart,
  faTrash,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

class Comment extends Component {
  state = {
    text: "",
    error: "",
    pageNumber: 1,
    postNumber: 5,
    commentsArr: [...this.props.comments],
  };

  componentDidMount() {}

  deleteComment = (comment) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    const postId = this.props.postId;

    uncomment(userId, token, postId, comment).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        //dispatch fresh list of comments to parent component (SinglePost)
        this.props.updateComments(data.comments);
        this.setState({ commentsArr: [...data.comments] });
      }
    });
  };

  deleteConfirmed = (comment) => {
    let answer = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (answer) {
      this.deleteComment(comment);
    }
  };

  isValid = () => {
    const { text } = this.state;
    if (!text.length > 0 || text.length > 150) {
      this.setState({
        error: "Comment should not be empty and less then 150 characters long!",
      });
      return false;
    }
    return true;
  };

  addComment = (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      this.setState({ error: "Please signin to leave a comment!" });
      return false;
    }

    if (this.isValid()) {
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
          this.setState({ commentsArr: [...data.comments], pageNumber: 1 });
        }
      });
    }
  };

  handlePrev = () => {
    if (this.state.pageNumber === 1) return;
    this.setState({
      pageNumber: this.state.pageNumber - 1,
      commentsArr: [...this.props.comments],
    });
  };
  handleNext = () => {
    if (
      this.state.pageNumber * this.state.postNumber >
      this.props.comments.length - 1
    )
      return;
    this.setState({
      pageNumber: this.state.pageNumber + 1,
      commentsArr: [...this.props.comments],
    });
  };

  handleChange = (event) => {
    this.setState({ error: "" });
    this.setState({ text: event.target.value });
  };

  render() {
    const { comments } = this.props;
    const { error, pageNumber, postNumber, commentsArr } = this.state;

    const currentPageNumber = pageNumber * postNumber - postNumber;
    const paginatedPosts = commentsArr.splice(currentPageNumber, postNumber);
    return (
      <div>
        <h3 className="mt-5 mb-5">Leave a comment...</h3>
        <form onSubmit={this.addComment}>
          <div className="form-group">
            <input
              type="text"
              onChange={this.handleChange}
              className="form-control"
              value={this.state.text}
              placeholder="Leave a comment..."
            />
            <button className="btn-raised btn-success mt-2">comment</button>
          </div>
        </form>
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>
        <hr />

        <div className="col-md-12">
          <h3 className="text-primary">{comments.length} Comments</h3>
          <hr />
          {paginatedPosts.map((comment, i) => (
            <div key={i}>
              <div>
                <Link to={`/user/${comment.postedBy._id}`}>
                  <img
                    style={{ borderRadius: "50%", border: "1px solid grey" }}
                    height="25px"
                    width="25px"
                    onError={(i) => (i.target.src = `${DefaultAvatar}`)}
                    src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                    className="float-left mr-2"
                    alt={comment.postedBy.name}
                  />
                  <div>
                    <p>{comment.postedBy.name}</p>
                  </div>
                </Link>
                <p>{comment.text}</p>
              </div>

              <p className="font-italic mark">
                {/* Posted by{" "}
                <Link to={`/user/${comment.postedBy._id}`}>
                  {comment.postedBy.name}{" "}
                </Link> */}
                <Moment fromNow>{comment.created}</Moment>

                <span>
                  {isAuthenticated().user &&
                    isAuthenticated().user._id === comment.postedBy._id && (
                      <>
                        {" "}
                        <span
                          onClick={() => {
                            this.deleteConfirmed(comment);
                          }}
                          className="float-right"
                          style={{ cursor: "pointer" }}
                        >
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            color={"orange"}
                            size={"lg"}
                          />
                        </span>
                      </>
                    )}
                </span>
              </p>
            </div>
          ))}
          <div>Page {pageNumber} </div>
          <div>
            <button
              className="btn btn-raised btn-warning mr-5 mt-5 mb-5"
              onClick={this.handlePrev}
            >
              prev
            </button>
            <button
              className="btn btn-raised btn-success mt-5 mb-5"
              onClick={this.handleNext}
            >
              next
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Comment;
