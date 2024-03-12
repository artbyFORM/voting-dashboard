"use client";

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

const SettingsPage = () => {
  const [selectedOption, setSelectedOption] = useState('1');

  //fetch the column number from local storage and set the dropdown to that value
  useEffect(() => {
   const getUserInfoFromLocalStorage = () => {
       const storedUserInfo = localStorage.getItem('userInfo');
       return storedUserInfo ? JSON.parse(storedUserInfo) : null;
   };
   const colNum = getUserInfoFromLocalStorage().colNumber;
   setSelectedOption(colNum);
  }, []);  

  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value)
    const setUserInfoInLocalStorage = (userInfo: { colNumber: number; colLetter: string; }) => {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    };

    const colNumber = parseInt(event.target.value) - 1;
    const colLetter = String.fromCharCode(71 + colNumber);

    const userInfo = {
      colNumber: colNumber,
      colLetter: colLetter
    };

    setUserInfoInLocalStorage(userInfo);
  }

  return (
    <div>
      <select value={selectedOption} onChange={handleDropdownChange}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
      </select>

      <Link href="/api/auth/signin">Sign In</Link>
    </div>
  )
}

export default SettingsPage