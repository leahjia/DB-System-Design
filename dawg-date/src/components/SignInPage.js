import React from 'react';

import { Navigate, useNavigate } from 'react-router-dom';
// import Dropdown from 'react-bootstrap/Dropdown';

import { getAuth, EmailAuthProvider, GoogleAuthProvider, onAuthStateChanged, deleteUser } from 'firebase/auth';
import { ref, getDatabase, set as firebaseSet } from 'firebase/database'
import { StyledFirebaseAuth } from 'react-firebaseui';
import NavBar from './NavBar.js';

export default function SignInPage(props) {
  const currentUser = props.currentUser;

  const auth = getAuth();

  const uiConfigObj = {
    signInOptions: [ 
      { provider: EmailAuthProvider.PROVIDER_ID, requireDisplayName: true }, 
      { provider: GoogleAuthProvider.PROVIDER_ID }
    ],
    signInFlow: 'popup',
    callbacks: {
      signInSuccessWithAuthResult: () => false
    },
    credentialHelper: 'none'
  }

  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      if (firebaseUser.metadata.creationTime === firebaseUser.metadata.lastSignInTime) {
        const email = firebaseUser.email;
        const domain = email.split('@')[1];
        if (domain.toLowerCase() !== 'uw.edu') {
          auth.signOut();
          deleteUser(firebaseUser).then(() => {
            console.log('not UW student');
          })
          props.setCurrentUser(null);
          return <Navigate to="/" />
        } else {
          const UWNetId = firebaseUser.email.split('@')[0];
          const newUser = {
            "UWNetId": UWNetId,
            "name": firebaseUser.displayName, 
            "gender": "", 
            "pronouns": "", 
            "bio": "", 
            "birthdate": "", 
            "hometown": "", 
            "img": "https://firebasestorage.googleapis.com/v0/b/dawgdate-info340-project.appspot.com/o/userImages%2Fprofile-default.jpeg?alt=media&token=b7faaab6-b29b-4003-b447-b4b6f9c4644b",
            "major": "", 
            "profile-pic": "",
            "uid": firebaseUser.uid
          }
          const db = getDatabase();
          firebaseSet(ref(db, 'userData/' +firebaseUser.uid), newUser);
          props.setCurrentUser(firebaseUser);
          return <Navigate to="/edit" />
        }
      }
    } else {
      console.log("logged out");
      props.setCurrentUser(null);
    }
  })//array is list of variables that will cause this to rerun if changed

  if (currentUser) { //if I'm signed in
    return <Navigate to="/profile" />
  }

  return (
    <div>
      <NavBar variant="signin" />
      <div className="card bg-light">
        <div className="container card-body">
          <StyledFirebaseAuth firebaseAuth={auth} uiConfig={uiConfigObj} />
        </div>
      </div>
    </div>

  )
}