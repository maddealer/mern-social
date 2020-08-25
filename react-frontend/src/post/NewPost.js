import React, { Component } from "react";
import { isAuthenticated } from "./../auth/index";
import { create } from "./apiPost";
import { Redirect } from "react-router-dom";
import DefaultAvatar from "../images/avatar.png";

class NewPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      body: "",
      photo: "",
      error: "",
      user: {},
      fileSize: 0,
      loading: false,
      redirectToProfile: false,
    };
  }

  componentDidMount() {
    this.postData = new FormData();
    this.setState({ user: isAuthenticated().user });
  }

  isValid = () => {
    const { title, body, fileSize } = this.state;

    if (fileSize > 1000000) {
      this.setState({ error: "File size should be less then 1MB!" });
      return false;
    }

    if (title.length === 0 || body.length === 0) {
      this.setState({ error: "All fields are required!", loading: false });
      return false;
    }

    return true;
  };

  handleChange = (name) => (event) => {
    this.setState({ error: "" });
    const value = name === "photo" ? event.target.files[0] : event.target.value;

    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    // if (fileSize > 1000000) {
    //   this.setState({ error: "File size should be less then 1MB!" });
    //   return false;
    // }
    this.postData.set(name, value);
    this.setState({
      [name]: value,
      fileSize,
    });
    //console.log(fileSize);
  };

  clickSubmit = (e) => {
    e.preventDefault();

    if (this.isValid()) {
      this.setState({ loading: true });
      //console.log(user);
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;

      create(userId, token, this.postData).then((data) => {
        if (data.error) {
          this.setState({ error: data.error, loading: false });
        } else {
          this.setState({
            loading: false,
            title: "",
            body: "",
            photo: "",
            redirectToProfile: true,
          });
          console.log("New Post: ", data);
        }
      });
    }
  };

  newPostForm = (title, body) => {
    return (
      <form>
        <div className="form-group">
          <label className="text-muted">Post Photo</label>
          <input
            onChange={this.handleChange("photo")}
            type="file"
            accept="image/*"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Title</label>
          <input
            onChange={this.handleChange("title")}
            type="text"
            className="form-control"
            value={title}
          />
        </div>

        <div className="form-group">
          <label className="text-muted">Body</label>
          <textarea
            onChange={this.handleChange("body")}
            type="text"
            className="form-control"
            value={body}
          />
        </div>

        <button
          onClick={this.clickSubmit}
          className="btn btn-raised btn-primary"
        >
          Create Post
        </button>
      </form>
    );
  };

  render() {
    const {
      title,
      body,
      photo,
      user,
      redirectToProfile,
      error,
      loading,
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${user._id}`} />;
    }

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Create a new post</h2>
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>
        {loading ? <div className="jumbotron text-center">Loading...</div> : ""}

        {this.newPostForm(title, body)}
      </div>
    );
  }
}

export default NewPost;
