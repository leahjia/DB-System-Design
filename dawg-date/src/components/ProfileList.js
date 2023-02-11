import React from 'react';
import { Link } from 'react-router-dom';


function ProfileCard(props) {

  const profileData = props.profileData;
  const userAge = function (date) {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }(profileData.birthdate);

  let heartColor = 'grey';
  
  if (props.currentUser.connections && Object.keys(props.currentUser.connections).includes(profileData.uid)) {
    heartColor = 'red';
  }

  const handleConnect = function (event) {
    const userString = event.currentTarget.getAttribute('user');
    if (props.variant === 'main') {
      props.sendRequest(userString);
    } else if (props.variant === 'incomingConnections') {
      props.acceptRequest(userString);
    } else if (props.variant === 'establishedConnections') {
      props.removeConnection(userString);
    }
    heartColor = 'red';
  }

  return (
    <div className="profile">
      <Link to={"/user/" + profileData.UWNetId}>
        <img src={profileData.img} alt={profileData.name} />
        <h2 className="profile-name">{profileData.name} | {userAge} ({profileData.pronouns})</h2>
      </Link>
      <p className="profile-description">{profileData.bio}</p>
      <button user={profileData.uid} className="btn like-button" onClick={handleConnect}>
        <span className="material-icons" style={{ color: heartColor }}>favorite</span>
      </button>
    </div>
  )
}

export function ProfileList(props) {

  const componentArray = props.profileData.map((profileObj) => {
    const component = (
      <ProfileCard
        profileData={profileObj}
        currentUser={props.currentUser}
        currentUserConnections={props.currentUserConnections}
        sendRequest={props.sendRequest}
        acceptRequest={props.acceptRequest}
        removeConnection={props.removeConnection}
        key={profileObj.UWNetId}
        variant={props.variant}
      />
    )
    return component;
  })

  return (
    <div className="row">
      {componentArray}
    </div>
  )
}