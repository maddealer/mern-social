import React, { Component } from "react";
import { Link } from "react-router-dom";
import DefaultAvatar from "../images/avatar.png";

class ProfileTabs extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { following, followers } = this.props;
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
                      <p className="lead">{person.name}</p>
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
                      <p className="lead">{person.name}</p>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4">
            <h3 className="text-primary">Posts</h3>
            <hr />
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileTabs;
