"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [advocates, setAdvocates] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredAdvocates, setFilteredAdvocates] = useState([]);

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  useEffect(() => {
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.includes(searchValue) ||
        advocate.lastName.includes(searchValue) ||
        advocate.city.includes(searchValue) ||
        advocate.degree.includes(searchValue) ||
        advocate.specialties.includes(searchValue) ||
        advocate.yearsOfExperience.toString().includes(searchValue)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  }, [searchValue]);

  // const onChange = (e) => {
  //   const searchTerm = e.target.value;
  //   document.getElementById("search-term").innerHTML = searchTerm;

  //   console.log("filtering advocates...");
  //   const filteredAdvocates = advocates.filter((advocate) => {
  //     return (
  //       advocate.firstName.includes(searchTerm) ||
  //       advocate.lastName.includes(searchTerm) ||
  //       advocate.city.includes(searchTerm) ||
  //       advocate.degree.includes(searchTerm) ||
  //       advocate.specialties.includes(searchTerm) ||
  //       advocate.yearsOfExperience.toString().includes(searchTerm)
  //     );
  //   });

  //   setFilteredAdvocates(filteredAdvocates);
  // };

  const onClick = () => {
    // console.log(advocates);
    setSearchValue("")
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input style={{ border: "1px solid black" }} onChange={e => setSearchValue(e.target.value)} />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <th>First Name</th>
          <th>Last Name</th>
          <th>City</th>
          <th>Degree</th>
          <th>Specialties</th>
          <th>Years of Experience</th>
          <th>Phone Number</th>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate) => {
            return (
              <tr>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s) => (
                    <div>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
