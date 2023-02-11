import React, { useEffect, useState } from "react";
import { getDatabase, onValue, ref as dbRef, set as firebaseSet } from 'firebase/database';
import { sanitize } from 'dompurify';

export default function EditForm(props) {
  const currentUser = props.currentUser
  const [name, setName] = useState(currentUser.name);
  const [hometown, setHometown] = useState(currentUser.hometown);
  const [birthdate, setBirthdate] = useState(currentUser.birthdate);
  const [major, setMajor] = useState(currentUser.major);
  const [about, setAbout] = useState(currentUser.about);
  const [bio, setBio] = useState(currentUser.bio);
  const [pronouns, setPronouns] = useState(currentUser.pronouns);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("handlesubmig: ", currentUser.uid)
    const aboutRef = dbRef(getDatabase(), "userData/" + currentUser.uid + "/" + "about")
    firebaseSet(aboutRef, about);
    const bioRef = dbRef(getDatabase(), "userData/" + currentUser.uid + "/" + "bio")
    firebaseSet(bioRef, bio);
    const nameRef = dbRef(getDatabase(), "userData/" + currentUser.uid + "/" + "name")
    firebaseSet(nameRef, name);
    const hometownRef = dbRef(getDatabase(), "userData/" + currentUser.uid + "/" + "hometown")
    firebaseSet(hometownRef, hometown);
    const birthdateRef = dbRef(getDatabase(), "userData/" + currentUser.uid + "/" + "birthdate")
    firebaseSet(birthdateRef, birthdate);
    const majorRef = dbRef(getDatabase(), "userData/" + currentUser.uid + "/" + "major")
    firebaseSet(majorRef, major);
    const pronounsRef = dbRef(getDatabase(), "userData/" + currentUser.uid + "/" + "pronouns")
    firebaseSet(pronounsRef, pronouns);
    setEditing(false);
  }
  // const displayInformation = () => {
  //   const db = getDatabase(); //"the database"
  //   const bio = dbRef(db, 'allMessages');
  // }
  const [editing, setEditing] = useState(false)
  const handleEdit = async (e) => {
    setEditing(true);
  }
  const handleCancel = async (event) => {
    setEditing(false);
  }
  useEffect(() => {

    const aboutRef = dbRef(getDatabase(), "userData/" + currentUser.uid + "/" + "about");
    const nameRef = dbRef(getDatabase(), "userData/" + currentUser.uid + "/" + "name");
    const hometownRef = dbRef(getDatabase(), "userData/" + currentUser.uid + "/" + "hometown");
    const birthdateRef = dbRef(getDatabase(), "userData/" + currentUser.uid + "/birthdate");
    const majorRef = dbRef(getDatabase(), "userData/" + currentUser.uid + "/major");
    const pronounsRef = dbRef(getDatabase(), "userData/" + currentUser.uid + "/" + "pronouns");
    const bioRef = dbRef(getDatabase(), "userData/" + currentUser.uid + "/" + "bio");

    //when db value changes
    const offFunctionAbout = onValue(aboutRef, (snapshot) => { setAbout(snapshot.val()) })
    const offFunctionName = onValue(nameRef, (snapshot) => { setName(snapshot.val()) })
    const offFunctionHome = onValue(hometownRef, (snapshot) => { setHometown(snapshot.val()) })
    const offFunctionBirth = onValue(birthdateRef, (snapshot) => { setBirthdate(snapshot.val()) })
    const offFunctionMajor = onValue(majorRef, (snapshot) => { setMajor(snapshot.val()) })
    const offFunctionPron = onValue(pronounsRef, (snapshot) => { setPronouns(snapshot.val()) })
    const offFunctionBio = onValue(bioRef, (snapshot) => { setBio(snapshot.val()) })

    function cleanup() {
      console.log("component is being removed");
      //when the component goes away, we turn off the listener
      offFunctionAbout();
      offFunctionName();
      offFunctionHome();
      offFunctionBirth();
      offFunctionMajor();
      offFunctionPron();
      offFunctionBio();
    }
    return cleanup; //return instructions on how to turn off lights
  }, [])


  return (
    <div>
      <button className="btn btn-sm btn-success me-2" onClick={handleEdit}>Edit Profile</button>
      <form onSubmit={handleSubmit}>
        {editing ? (
          <>
            <button className="btn btn-sm btn-secondary me-2" onClick={(e) => handleCancel(e)}>Cancel</button>
            <button className="btn btn-sm btn-primary me-2" onClick={(e) => handleSubmit(e)}>Update</button>
            <h5 className="mb-0">About</h5>
            <div className="p-4 rounded shadow-sm bg-light">
              <>
                <input
                  className="font-italic m-3 mb-5 block px-4"
                  type="text"
                  placeholder="Add your introduction here"
                  value={about}
                  onChange={(e) => setAbout(sanitize(e.target.value))}
                ></input>
              </>
            </div>
            <div className="form-group">
              <h5>Pronouns:</h5>
              <input
                type="text"
                className="font-italic m-3 mb-5 block px-4"
                value={pronouns}
                onChange={(e) => setPronouns(sanitize(e.target.value))}
              />
            </div>
            <div className="mb-0">
              <h5>Bio</h5>
              <input
                className="font-italic m-3 mb-5 block px-4"
                type="text"
                placeholder="Add your bio here"
                value={bio}
                onChange={(e) => setBio(sanitize(e.target.value))} ></input>
            </div>
            <div className="form-group">
              <h5>Name:</h5>
              <input
                type="text"
                className="font-italic m-3 mb-5 block px-4"
                value={name}
                onChange={(e) => setName(sanitize(e.target.value))}
              />
            </div>
            <div className="form-group">
              <h5>Hometown:</h5>
              <input
                type="text"
                className="font-italic m-3 mb-5 block px-4"
                value={hometown}
                onChange={(e) => setHometown(sanitize(e.target.value))}
              />
            </div>
            <div className="form-group">
              <h5>Birthdate:</h5>
              <input
                type="text"
                className="font-italic m-3 mb-5 block px-4"
                value={birthdate}
                onChange={(e) => setBirthdate(sanitize(e.target.value))}
              />
            </div>
            <div className="form-group">
              <h5>Major:</h5>
              <input
                type="text"
                className="font-italic m-3 mb-5 block px-4"
                value={major}
                onChange={(e) => setMajor(sanitize(e.target.value))}
              />
            </div>
            <button className="btn btn-sm btn-secondary me-2" onClick={(e) => handleCancel(e)}>Cancel</button>
            <button className="btn btn-sm btn-primary me-2" onClick={(e) => handleSubmit(e)}>Update</button>
          </>

        ) : (
          <>
            <h5 className="mb-0">About</h5>
            <div className="p-4 rounded shadow-sm bg-light">
              <p className="font-italic mb-0" align="left">{"About me: " + (about !== "" ? about : "No introductions yet")}</p>
              <p className="font-italic mb-0" align="left">{"hometown: " + (hometown !== "" ? hometown : "Not edited yet")}</p>
              <p className="font-italic mb-0" align="left">{"birthdate: " + (birthdate !== "" ? birthdate : "Not edited yet")}</p>
              <p className="font-italic mb-0" align="left">{"major: " + (major !== "" ? major : "Not edited yet")}</p>
            </div>
            <div className="mb-0">
              <h5>Bio</h5>
              <p className="font-italic mb-0">{bio !== "" ? bio : "No Bio yet"}</p>
            </div>
          </>
        )}
      </form>

    </div>
  );
}
