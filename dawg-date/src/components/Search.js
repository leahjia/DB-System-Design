import React, { useState } from "react";

export default function Search(props) {
    const [genderSelect, setSelect] = useState('')
    const [majorSelect, setSelect2] = useState('')
    const [hometownSelect, setSelect3] = useState('')
    
    const handleSelect = (event) => {
        const val = event.target.value
        const type = event.currentTarget.id
        setSelect(val)
        props.applyFilterCallback(genderSelect, majorSelect, hometownSelect)
    }

    const handleSelect2 = (event) => {
      const val = event.target.value
      const type = event.currentTarget.id
      setSelect2(val)
      props.applyFilterCallback(genderSelect, majorSelect, hometownSelect)
    }

    const handleSelect3 = (event) => {
      const val = event.target.value
      const type = event.currentTarget.id
      setSelect3(val)
      props.applyFilterCallback(genderSelect, majorSelect, hometownSelect)
    }

  const applyFilters = () => {
    const filters = {
      gender: genderSelect,
      major: majorSelect,
      hometown: hometownSelect,
    };
    props.applyFilterCallback(filters);
  };

    const uniMajors = [...new Set(props.profileData.map(p => p.major))]
    const majorElems = uniMajors.map((major) => {
        return <option key={major} value={major}>{major}</option>
    })
    const uniGenders = [...new Set(props.profileData.map(p => p.gender))]
    const genderElems = uniGenders.map((gender) => {
        return <option key={gender} value={gender}>{gender}</option>
    })
    const uniHometowns = [...new Set(props.profileData.map(p => p.hometown))]
    const hometownElems = uniHometowns.map((hometown) => {
        return <option key={hometown} value={hometown}>{hometown}</option>
    })

    const handleChange = (event) => {
        props.applySearchCallback(event.target.value)
    }

    return (
      <section className="search-container">
        <form className="search-bar">
          <input type="search" id="search-input" placeholder="Search profile names here" onChange={handleChange} />
        </form>
        <div className="filter-group">
          <select id="majorSelect" className="filter" aria-label="major-filter" value={majorSelect} onChange={handleSelect2} >
            <option value="" >Major</option>{majorElems}
          </select>
          <select id="genderSelect" className="filter" aria-label="gender-filter" value={genderSelect} onChange={handleSelect} >
            <option value="" >Gender</option>{genderElems}
          </select>
          <select id="hometownSelect" className="filter" aria-label="hometown-filter" value={hometownSelect} onChange={handleSelect3}>
            <option value="" >Area</option>{hometownElems}
          </select>
          <button classname='btn btn-primary' onClick={applyFilters}> Search</button>
        </div>
      </section>
    )
}