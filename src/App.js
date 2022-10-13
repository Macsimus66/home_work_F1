import React from "react";
import { Cities } from "./components/Cities";
import { WeatherDisplay } from "./components/WeatherDisplay";
import { AddCity } from "./components/AddCity";
import { Loader } from "./components/Loader";
import { RequestError } from "./components/RequestError";
import './App.css'



class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleCityClick = this.handleCityClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSearchBtnClick = this.handleSearchBtnClick.bind(this);
    this.handleDeleteCityBtnClick = this.handleDeleteCityBtnClick.bind(this);
    this.handleLocationClick = this.handleLocationClick.bind(this);
    this.validate = this.validate.bind(this);
    this.fetchDataByGeo = this.fetchDataByGeo.bind(this);
    this.geoLocation = this.geoLocation.bind(this);

    this.state = {
      cities: localStorage.getItem('cities') ? JSON.parse( localStorage.getItem('cities') ) : [],
      activeCityId: null,
      value: '',
      searchErr: '',
      weatherDataByGeo: null,
      loading: false,
      errGeo: null
    }
  }

  fetchDataByGeo(latitude, longitude) {    
    const APPID = 'ef598dd48091a3a2eb6a63ef6c4d75b2';
    const URL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + 
          latitude + '&lon=' + longitude + `&units=metric&lang=ru&APPID=${APPID}`;

    this.setState({loading: true});

    fetch(URL).then(response => {
      if (response.ok) {
        return response.json(); 
      } else {
        throw response.status;
      }
    })
    .then(data => {
      this.setState({
        weatherDataByGeo: data,
        loading: false
      });
    })
    .catch(err => {
      console.warn('Данные не были получены, ошибка: ' + err);
    })
  }

  geoLocation() {
    if("geolocation" in  navigator){
      const geo_options = {
        enableHighAccuracy: true, 
        maximumAge        : 0, 
        timeout           : 27000
      };

      const geo_success = (position) => {
        console.log(position.coords);
        this.fetchDataByGeo(position.coords.latitude, position.coords.longitude)
      }

      const geo_err = (err) => {
        console.log(err.code, err.message);
        this.setState({errGeo: err});
      }
      
      navigator.geolocation.getCurrentPosition(geo_success, geo_err, geo_options);

    } else {
      alert('Геолакация не поддерживается вашим браузером.'
            + 'Используйте другой браузер или обновите ваш браузер до последней версии.' )
    }
  }
 
  validate(value) {
    const {cities} = this.state;
    if (!value) return 'no value';

    if(cities) {
      for (let i = 0; i < cities.length; i++) {
        if (cities[i].city === value.trim()) return 'duplicate';
      }
    }
    
    return 'true';
  }

  handleCityClick(activeCity) {
    this.setState({activeCityId: activeCity.id, errGeo: null, searchErr: ''});
  }

  handleInputChange(input) {
    this.setState({value: input.value});
  }

  handleSearchBtnClick(event) {
    if (event.key === 'Enter' || event.target.id === 'searchBtn') {
      const {cities, value} = this.state;
      const validValue = value.slice(0,1).toUpperCase() + value.slice(1).toLowerCase();
      const validateResult = this.validate(validValue);
      const citiesClone = cities.slice();
      
      //если введеные в данные в поиск валидны, то формируем объект, который пушим в клон массива городов и изменяем состояние компонента
      if (validateResult === 'true') {
        const newCity = {
          id: cities.length > 0 ? cities[cities.length-1].id + 1 : 1,
          city: validValue
        }

        citiesClone.push(newCity);
        localStorage.setItem('cities', JSON.stringify(citiesClone));
        
        this.setState({
          cities: JSON.parse( localStorage.getItem('cities') ),
          activeCityId: newCity.id, 
          value: '',
          searchErr: '',
          errGeo: null
        });
      } else if (validateResult === 'duplicate') {
        this.setState({value: '', searchErr: 'duplicate', errGeo: null});
      } else {
        this.setState({searchErr: 'no value', errGeo: null});
      }
    }
  }

  handleDeleteCityBtnClick(deleteBtn) {
    const {cities} = this.state;
    const citiesClone = cities.slice();
    
    for (let i = 0; i < citiesClone.length; i++) {
      if (citiesClone[i].id === +deleteBtn.id) {
        citiesClone.splice(i, 1);
        localStorage.setItem('cities', JSON.stringify(citiesClone))
      }
    }
    
    this.setState({
      activeCityId: deleteBtn.id - 1,
      cities: JSON.parse( localStorage.getItem('cities') )
    });
  }

  handleLocationClick(e) {
    const {errGeo} = this.state;

    errGeo && this.setState({errGeo: null});
    this.geoLocation();
  }

  componentDidMount() {
    if (!localStorage.getItem('cities')) {
      alert(
        `Для корректной работы приложения необходимо дать разрешение на доступ к геоданным.`
       )
    }

    this.geoLocation();
  }

  componentDidUpdate(prevProps, prevState) {
    const {cities, weatherDataByGeo} = this.state;

    if (prevState.weatherDataByGeo !== weatherDataByGeo) {
      let duplicate = false;

    
      for (let i = 0; i < cities.length; i++) {
        if (cities[i].city === weatherDataByGeo.name) {
          duplicate = true;
          this.setState({activeCityId: cities[i].id});
        }
      }

      if (!duplicate) {
        const citiesClone = cities.slice();
        const newCity = {
          id: cities.length > 0 ? cities[cities.length-1].id + 1 : 1,
          city: weatherDataByGeo.name
        }

        citiesClone.push(newCity);
        localStorage.setItem('cities', JSON.stringify(citiesClone));

        this.setState({
          cities: JSON.parse( localStorage.getItem('cities') ),
          activeCityId: newCity.id
        })
      }
      
    }

  }

  render() {
    const {cities, activeCityId, value, searchErr} = this.state;
    const {weatherDataByGeo, loading, errGeo} = this.state;
    let activeCity;
    
    cities.length && cities.forEach((item) => item.id === +activeCityId ? activeCity = item.city : '')

    return (
      <React.Fragment>
        <header className="header">
          <h1 className="header__name">Прогноз погоды</h1>
        </header>
        <hr className="header__line"></hr>
        <main className="main-wrapper">
          <AddCity  
            value={value}
            onChange={this.handleInputChange}
            onClick={this.handleSearchBtnClick}
            searchErr={searchErr}
            onEnterKeyDown={this.handleSearchBtnClick}
            onLocationClick={this.handleLocationClick}
          />
          <div className='main-info'>
            <Cities 
              data={cities} 
              onCityClick={this.handleCityClick} 
              activeCityId={activeCityId}
              onDeleteCityBtnClick={this.handleDeleteCityBtnClick}
            />
            {
              !loading && !errGeo && (activeCityId || weatherDataByGeo ? 
              <WeatherDisplay activeCity={activeCity} weatherDataByGeo={weatherDataByGeo}/> : 
              <div className="weather-display">
                <p className="weather-display__loader">Выберите город</p>
              </div>)
            }
            { loading && <Loader /> }
            { errGeo && <RequestError errGeo={errGeo}/>}
            <script src="https://unpkg.com/react-yandex-maps/dist/production/react-yandex-maps.umd.js"></script>
          </div>
        </main>
      </React.Fragment>
    )
  }
}

export default App;

