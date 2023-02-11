import React from "react";
import { Link, NavLink } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";

export default function NavBar(props) {

  let navLinks;

  const handleLogOut = function (event) {
    signOut(getAuth())
  }

  if (props.variant === 'landing') {
    navLinks = (
      <ul>
        <li><NavLink className="nav-link" to="/signin">LOGIN</NavLink></li>
      </ul>
    )
  } else if (props.variant === 'signin') {
    navLinks = <ul></ul>
  } else {
    navLinks = (
      <ul>
        <li><NavLink
          className={"nav-link " + (({ isActive }) => isActive ? "active" : undefined)}
          to="/home">HOME</NavLink></li>
        <li><NavLink
          className={"nav-link " + (({ isActive }) => isActive ? "active" : undefined)}
          to="/connections">CONNECTIONS</NavLink></li>
        <li><NavLink
          className={"nav-link " + (({ isActive }) => isActive ? "active" : undefined)}
          to="/profile">MY PROFILE</NavLink></li>
        <li><NavLink onClick={handleLogOut}
          className={"nav-link " + (({ isActive }) => isActive ? "active" : undefined)}
          to="/">LOG OUT</NavLink></li>
      </ul>
    )
  }


  return (
    <nav>
      <div className="navbar">
        <Link to="/home">
          <img src="/img/logo.png" alt="logo" className="logo" />
          <h1 style={{display: 'inline', marginLeft: '1rem'}}className="name">DawgDate</h1>
        </Link>
        {navLinks}
      </div>
    </nav>
  )
}