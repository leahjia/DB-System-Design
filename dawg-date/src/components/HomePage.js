import React, { useState } from "react";
import NavBar from './NavBar.js';
import Search from './Search.js';
import { ProfileList } from './ProfileList.js';

export default function HomePage(props) {
  const currentUser = props.currentUser;
  const [input, setInput] = useState('')
  const [genderSelect, setSelect] = useState('')
  const [majorSelect, setSelect2] = useState('')
  const [hometownSelect, setSelect3] = useState('')

  function applyFilter(c1, c2, c3) {
    setSelect(c1)
    setSelect2(c2)
    setSelect3(c3)
  }

  let displayedData = props.profileData.filter(t => {
    // currentUser(from firebase) does not have a currentUserConnections prop
    if (currentUser.uid === t.uid) {
      return false;
    } else if (currentUser.connections && Object.keys(currentUser.connections).includes(t.uid)) {
      return false;
    } else if (t.major !== majorSelect) {
      return false
    } else if (t.gender !== genderSelect) {
      return false
    } else if (t.hometown === hometownSelect) {
      return false
    } else return true
  })

  function applySearch(i) {
    setInput(i)
    displayedData = props.profileData.filter(t => {
      return i === t.name
    })
  }

  return (
    <div>
      <header className="navbar-bg">
        <NavBar />
      </header>
      <main>
        <Search profileData={props.profileData} applyFilterCallback={applyFilter} applySearchCallback={applySearch} />
        <div className="profile-list">
          <h1>People You Might Know</h1>
          <ProfileList variant='main' profileData={displayedData} currentUser={props.currentUser} currentUserConnections={props.currentUserConnections} sendRequest={props.sendRequest} />
        </div>
      </main>
    </div>
  )

}