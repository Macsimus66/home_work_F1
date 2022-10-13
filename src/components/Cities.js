import React from "react";
import {CityBtn} from './CityBtn';
import '../App.css';

const Cities = (props) => {
  const handleDeleteBtnClick = (deleteBtn) => {
    props.onDeleteCityBtnClick(deleteBtn);
  }

  const {data, onCityClick, activeCityId} = props;

  return (
    <nav className="cities-wrapper">
      <h2 className="cities-wrapper__label">Выберите город</h2>
      <ul className="cities">
        {data.map(element =>
          <CityBtn 
            key={element.id}
            id={element.id}
            name={element.city}
            onCityClick={onCityClick}
            onDeleteCityBtnClick={handleDeleteBtnClick}
            activeCityId={activeCityId}
            />
        )}
      </ul>
    </nav>
  )

}


export {Cities};