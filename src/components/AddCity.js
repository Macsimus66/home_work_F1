import React from "react";
import '../App.css';

const AddCity = (props) => {
  const handleChange = (e) => {
    e.preventDefault();
    props.onChange(e.target);
  }

  const handleSearchBtnClick = (e) => {
    props.onLocationClick(e);
  }

  const handleKeyDown = (e) => {
    props.onEnterKeyDown(e);
  }

  const handleLocationClick = (e) => {
    props.onLocationClick(e);
  }

  return (
    <div className="search-wrapper">
      <div className="search">
        <input 
          type="text" 
          className="search_input"
          onChange={handleChange}
          value={props.value}
          placeholder="Погода в вашем городе..."
          onKeyDown={handleKeyDown}
        />
        <button id="searchBtn" className="search_btn" onClick={handleSearchBtnClick}></button>
        <div className="search_location" onClick={handleLocationClick}>
          <img 
            className="search_location-img" 
            src="https://img.icons8.com/color/48/000000/gps-device.png" 
            alt='Моё местоположение'
            title='Моё местоположение'
          />
        </div>
		  </div>
    {props.searchErr === 'no value' && <div className="search-err-message"><span>Необходимо ввестиназвание города</span></div>}
    {props.searchErr === 'duplicate' && <div className="search-err-message"><span>Данный город уже был добавлен ранее</span></div>}
    </div>
  );
}

export {AddCity};
