import React, { Component } from "react";
import { isAuthenticated } from "./../auth/index";
import { read, update, updateUser } from "./apiUser";
import { Redirect } from "react-router-dom";
import DefaultAvatar from "../images/avatar.png";

class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      name: "",
      email: "",
      password: "",
      redirectToProfile: false,
      error: "",
      loading: false,
      fileSize: 0,
      about: "",
    };
  }

  init = (userId) => {
    const token = isAuthenticated().token;
    read(userId, token).then((data) => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          about: data.about,
        });
      }
    });
  };

  componentDidMount() {
    this.userData = new FormData();

    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  isValid = () => {
    const { name, email, password, fileSize } = this.state;

    if (fileSize > 1000000) {
      this.setState({ error: "File size should be less then 1MB!" });
      return false;
    }

    if (name.length === 0) {
      this.setState({ error: "Name is required!", loading: false });
      return false;
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this.setState({ error: "A valid email i required!", loading: false });
      return false;
    }
    if (password.length >= 1 && password.length <= 5) {
      this.setState({
        error: "Password must be at least 6 characters long!",
        loading: false,
      });
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
    this.userData.set(name, value);
    this.setState({
      [name]: value,
      fileSize,
    });
    console.log(fileSize);
  };

  clickSubmit = (e) => {
    e.preventDefault();

    if (this.isValid()) {
      this.setState({ loading: true });
      //console.log(user);
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;

      update(userId, token, this.userData).then((data) => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          updateUser(data, () => {
            this.setState({
              redirectToProfile: true,
            });
          });
        }
      });
    }
  };

  signupForm = (name, email, password, about) => {
    return (
      <form>
        <div className="form-group">
          <label className="text-muted">Profile Photo</label>
          <input
            onChange={this.handleChange("photo")}
            type="file"
            accept="image/*"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Name</label>
          <input
            onChange={this.handleChange("name")}
            type="text"
            className="form-control"
            value={name}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Email</label>
          <input
            onChange={this.handleChange("email")}
            type="email"
            className="form-control"
            value={email}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">About</label>
          <textarea
            onChange={this.handleChange("about")}
            type="text"
            className="form-control"
            value={about}
          />
        </div>

        <div className="form-group">
          <label className="text-muted">Password</label>
          <input
            onChange={this.handleChange("password")}
            type="password"
            className="form-control"
            value={password}
          />
        </div>
        <button
          onClick={this.clickSubmit}
          className="btn btn-raised btn-primary"
        >
          Update
        </button>
      </form>
    );
  };

  render() {
    const {
      name,
      email,
      password,
      id,
      redirectToProfile,
      error,
      loading,
      about,
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }

    const photoUrl = id
      ? `${
          process.env.REACT_APP_API_URL
        }/user/photo/${id}?${new Date().getTime()}`
      : DefaultAvatar;

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Edit Profile</h2>
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>
        {loading ? <div className="jumbotron text-center">Loading...</div> : ""}

        <img
          src={photoUrl}
          onError={(i) => (i.target.src = `${DefaultAvatar}`)}
          alt={name}
          className="rounded-circle z-depth-2 mx-auto d-block"
          width="200px"
          height="200px"
        />

        {this.signupForm(name, email, password, about)}
      </div>
    );
  }
}

export default EditProfile;