import React from "react";
import { useParams, Navigate } from 'react-router-dom';


import NavBar from "./NavBar.js";

export default function OtherProfilePage(props) {
  const currentUser = props.currentUser;
	const personNetId = useParams().UWNetId;

  if (currentUser.UWNetId === personNetId) {
    <Navigate to="/profile" />
  }

  const person = props.profileData.filter((userProfile) => {
    return personNetId === userProfile.UWNetId
	})[0];
  if (person === undefined) {
    <Navigate to="/home" />
  }

	return (
    <div>
      <header className="navbar-bg">
        <NavBar />
      </header>
      <div className="snippet-body">
        <div className="row py-5 px-4">
          <div className="col-md-5 mx-auto">
            <div className="bg-white shadow rounded overflow-hidden">
              <div className="px-4 pt-0 pb-4 cover">
                <div className="media align-items-end profile-head">
                  <div className="profile mr-3">
                    <img src={person.img} alt={person.name} width="130px" className="rounded mb-2 img-thumbnail"/>
                  </div>{" "}
                  <div className="media-body mb-5 text-white">
                    <h4 className="mt-0 mb-0">{person.name}</h4>
                    <p className="small mb-4"></p>
                  </div>
                </div>
              </div>
              <div className="bg-light p-4 d-flex justify-content-end text-center">
                <ul className="list-inline mb-0">
                  <li className="list-inline-item">
                    <h5 className="font-weight-bold mb-0 d-block">{person.pronouns}</h5>
                    <small className="text-muted">Pronouns</small>
                  </li>
                </ul>
              </div>
              <div className="px-4 py-3">
                <h5 className="mb-0">About</h5>
                <div className="p-4 rounded shadow-sm bg-light">
                  <p className="font-italic mb-0">Birthday: {person.birthdate}</p>
                  <p className="font-italic mb-0">Major: {person.major}</p>
                  <p className="font-italic mb-0">Hometown: {person.hometown}</p>
                </div>
                <div className="mb-0">
                  <h5>Bio</h5>
                  <p className="font-italic mb-0">{person.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}