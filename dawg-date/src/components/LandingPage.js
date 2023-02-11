import React from 'react';

import NavBar from './NavBar.js';
import { NavLink, Navigate } from 'react-router-dom';

export default function LandingPage(props) {

  if (props.currentUser) { //if I'm signed in
    return <Navigate to="/profile" />
  }

	return (
    <main>
      <div className='landing'>
        <NavBar variant='landing' handleLoginCallback={props.handleLoginCallback} handleConnectionsCallback={props.handleConnectionsCallback} currentUser={props.currentUser} />
        <h1 className="welcome">Welcome to a <em>better</em> dating experience for University of Washington Students</h1>
        <NavLink className="create-account" to="/signin">Create account</NavLink>
      </div>

      <section className="about">
        <h2>About DawgDate</h2>
        <div className="about-container">
          <div className="about-card">
            <div className="card-image-bg">
              <img src="img/lock.png" className="about-image" alt="lock"/>
            </div>
            <p>DawgDate provides a secure platform exclusively for University of Washington students to safely meet eachother.</p>
          </div>
          <div className="about-card">
            <div className="card-image-bg">
              <img src="img/search.png" className="about-image" alt="magnifying glass"/>
            </div>
            <p>DawgDate is a platform that focuses on <em>you</em>. Save time and find others based on your own preferences.</p>
          </div>
        </div>
      </section>
    </main>
	)
}