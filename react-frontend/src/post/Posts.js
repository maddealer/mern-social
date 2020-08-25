import React, { Component } from "react";
import { list } from "./apiPost";
import Moment from "react-moment";
import DefaultAvatar from "../images/avatar.png";
import { Link } from "react-router-dom";

class Posts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
    };
  }

  componentDidMount() {
    list().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    });
  }

  renderPosts = (posts) => {
    return (
      <div className="row">
        {posts.map((post, i) => {
          const posterId = post.postedBy._id;
          const posterName = post.postedBy.name;
          return (
            <div className="card col-md-4" key={i}>
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.body.substring(0, 15)}...</p>
                <br />
                <p className="font-italic mark">
                  Posted by <Link to={`/user/${posterId}`}>{posterName} </Link>
                  <Moment fromNow>{post.created}</Moment>
                </p>
                <Link
                  to={`/posts/${post._id}`}
                  className="btn btn-raised btn-primary btn-sn"
                >
                  Read more.....
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { posts } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Recent Posts</h2>
        {this.renderPosts(posts)}
      </div>
    );
  }
}

export default Posts;
