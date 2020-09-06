import React, { Component } from "react";
import { Link } from "react-router-dom";
import DefaultAvatar from "../images/avatar.png";
import Moment from "react-moment";

class ProfileTabs extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { following, followers, posts } = this.props;
    console.log(this.props);
    return (
      <div>
        <div className="row">
          <div className="col-md-4">
            <h3 className="text-primary">Followers</h3>
            <hr />
            {followers.map((person, i) => (
              <div key={i}>
                <div>
                  <Link to={`/user/${person._id}`}>
                    <img
                      style={{ borderRadius: "50%", border: "1px solid grey" }}
                      height="25px"
                      width="25px"
                      onError={(i) => (i.target.src = `${DefaultAvatar}`)}
                      src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                      className="float-left mr-2"
                      alt={person.name}
                    />
                    <div>
                      <p>{person.name}</p>
                      {/* <p className="lead">{JSON.stringify(followers)}</p> */}
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4">
            <h3 className="text-primary">Following</h3>
            <hr />
            {following.map((person, i) => (
              <div key={i}>
                <div>
                  <Link to={`/user/${person._id}`}>
                    <img
                      style={{ borderRadius: "50%", border: "1px solid grey" }}
                      height="25px"
                      width="25px"
                      onError={(i) => (i.target.src = `${DefaultAvatar}`)}
                      src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                      className="float-left mr-2"
                      alt={person.name}
                    />
                    <div>
                      <p>{person.name}</p>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4">
            <h3 className="text-primary">Posts</h3>
            <hr />
            <div
              className="overflow-auto"
              style={{ height: "150px", overflowY: "scroll" }}
            >
              {posts.map((post, i) => (
                <div key={i}>
                  <div>
                    <p className="font-italic mark">
                      <Link to={`/post/${post._id}`}>
                        {post.title}{" "}
                        {/* <p className="lead">{JSON.stringify(followers)}</p> */}
                      </Link>
                      <Moment fromNow>{post.created}</Moment>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileTabs;
