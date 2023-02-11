import React, {useEffect} from "react";

import { ProfileList } from "./ProfileList.js";
import NavBar from "./NavBar.js";

export default function ConnectionsPage(props) {
	const currentUser = props.currentUser;
  console.log(currentUser)

  let existingConnections = [];
  let incomingConnections = [];

  if (currentUser.connections) {
    existingConnections = props.profileData.filter((userProfile) => {
      // currentUser (from firebase) does not have a currentUserConnections prop
      if (Object.keys(currentUser.connections).includes(userProfile.uid)) {
        return true;
      } else {
        return false;
      }
    })
  }

  if (currentUser.receivedConnections) {
    incomingConnections = props.profileData.filter((userProfile) => {

      console.log("test" + Object.keys(currentUser.receivedConnections))
      if (Object.keys(currentUser.receivedConnections).includes(userProfile.uid)) {
        return true;
      } else {
        return false;
      }
    })
  }

	return (
		<div>
			<header className="navbar-bg">
				<NavBar />
			</header>
			<main>
        <div className="container">
          <div className="profile-list">
            <h1>Incoming Requests</h1>
            <ProfileList variant='incomingConnections' profileData={incomingConnections} currentUser={props.currentUser} acceptRequest={props.acceptRequest}/>
          </div>
          <div className="profile-list">
            <h1>My Connections</h1>
            <ProfileList variant='establishedConnections' profileData={existingConnections} currentUser={props.currentUser} currentUserConnections={props.currentUserConnections} removeConnection={props.removeConnection} />
          </div>
        </div>
			</main>
		</div>
	)

}