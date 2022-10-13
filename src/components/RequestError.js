import React from "react";
import '../App.css';

const RequestError = (props) => {
  const errStatus =+props.errStatus;
  const errGeo = props.errGeo;
  const activeCity = props.activeCity;

  return (
    <div className="weather-display">
      <div className="weather-display__error">
        <h2>ошибка</h2>
        {
          (errStatus >= 400 && errStatus < 500) && 
          <p>
            Ошибка {errStatus} (Not Found).Город <span className="weather-display__error-city"></span> не найден в базе<br/>
            Попробуйте ввести название на английском или попробуйте изменить поисковый запрос
          </p>
        }
        {
          (errStatus >= 500 && errStatus < 600) &&
          <p>Ошибка на стороне сервера, ошибка {errStatus}. Попробуем позже.</p>
        }
        {
          errGeo &&
          <p>
            Произошла ошибка при запросе данных о местоположений.<br/>
            Попробуем повторить позже или можем ввести название города
            в строку поиска.<br/><hr/>
            Ошибка: {errGeo.code}. {errGeo.message}
          </p>
        }
      </div>
    </div>
  )
}


export {RequestError};
