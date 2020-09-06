import React, { Component } from "react";
import { singlePost, remove, like, unlike } from "./apiPost";
import Moment from "react-moment";
import DefaultPost from "../images/manicure.png";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "./../auth/index";
//only icons imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/fontawesome-free-regular";

export default class Singlepost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: "",
      user: {},
      redirectToHome: false,
      redirectToSignin: false,
      like: false,
      likes: 0,
    };
  }

  checkLike = (likes) => {
    const userId = isAuthenticated() && isAuthenticated().user._id;
    const match = likes.indexOf(userId) !== -1;
    return match;
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;
    singlePost(postId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          post: data,
          user: data.postedBy,
          likes: data.likes.length,
          like: this.checkLike(data.likes),
        });
      }
    });
  }

  deletePost = () => {
    const postId = this.props.match.params.postId;
    const token = isAuthenticated().token;

    remove(postId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ redirectToHome: true });
      }
    });
  };

  deleteConfirmed = () => {
    let answer = window.confirm("Are you sure you want to delete this post?");

    if (answer) {
      this.deletePost();
    }
  };

  likeToogle = () => {
    if (!isAuthenticated()) {
      this.setState({ redirectToSignin: true });
      return false;
    }

    let callApi = this.state.like ? unlike : like;
    const userId = isAuthenticated().user._id;
    const postId = this.state.post._id;
    const token = isAuthenticated().token;

    callApi(userId, token, postId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          like: !this.state.like,
          likes: data.likes.length,
        });
      }
    });
  };

  renderPost = (post, user) => {
    const { like, likes } = this.state;

    return (
      <div className="card-body" style={{ alignContent: "center" }}>
        <img
          src={post.photo}
          alt={post.title}
          onError={(i) => {
            i.target.src = `${DefaultPost}`;
          }}
          className="img-thumbnail mb-3 img-responsive"
          style={{ height: "auto", width: "100%" }}
        />
        {like ? (
          <h5 className="float-right" onClick={this.likeToogle}>
            <FontAwesomeIcon icon={solidHeart} style={{ color: "#d93fd6" }} />{" "}
            {likes} Like
          </h5>
        ) : (
          <h5 className="float-right" onClick={this.likeToogle}>
            <FontAwesomeIcon icon={regularHeart} style={{ color: "#d93fd6" }} />{" "}
            {likes} Like
          </h5>
        )}
        <h5 className="card-title">{post.title}</h5>
        <p className="card-text">{post.body}</p>
        <br />
        <p className="font-italic mark">
          Posted by <Link to={`/user/${user._id}`}>{user.name} </Link>
          <Moment fromNow>{post.created}</Moment>
        </p>
        <div className="d-inline-block">
          <Link to={`/`} className="btn btn-raised btn-primary btn-sn mr-5">
            Back to Posts
          </Link>

          {isAuthenticated().user &&
            isAuthenticated().user._id === post.postedBy._id && (
              <>
                {" "}
                <Link
                  to={`/post/edit/${post._id}`}
                  className="btn btn-raised btn-warning btn-sn mr-5"
                >
                  Update Post
                </Link>
                <button
                  onClick={this.deleteConfirmed}
                  className="btn btn-raised btn-danger float-right"
                >
                  Delete
                </button>
              </>
            )}
        </div>
      </div>
    );
  };

  render() {
    const { post, user, redirectToHome, redirectToSignin } = this.state;

    if (redirectToHome) {
      return <Redirect to={`/`} />;
    } else if (redirectToSignin) {
      return <Redirect to={`/signin`} />;
    }

    return (
      <div className="container">
        {!post ? (
          <div className="jumbotron text-center">Loading...</div>
        ) : (
          <div className="row" style={{ alignContent: "center" }}>
            <div className="col-md-7 offset-md-2">
              <h3
                className="display-3 mt-5 mb-5"
                style={{ alignContent: "center" }}
              >
                {post.title}
              </h3>
              {this.renderPost(post, user)}
            </div>
          </div>
        )}
      </div>
    );
  }
}
