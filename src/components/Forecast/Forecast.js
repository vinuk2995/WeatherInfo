import React, { useState } from 'react';
import classes from './Forecast.module.css';

const Forecast = () => {

    let [city, setCity] = useState('');
    // let [unit, setUnit] = useState('imperial');
    let [responseObj, setResponseObj] = useState({});
    let [error, setError] = useState(false);

function getForecast(e) {
    e.preventDefault();

    if (city.length === 0) {
        console.log("city Length" , city)
        return setError("true");
    }

    setError(false);
    setResponseObj({});

    const cachedFetch = (url, options) => {
       let expiry = 600 //sec
       if (typeof options === 'number') {
          expiry = options;
          options = undefined;
        } else if (typeof options === 'object') {
          expiry = options.seconds || expiry;
        }
        let cacheKey = url;
        let cached = sessionStorage.getItem(cacheKey)
        let whenCached = sessionStorage.getItem(cacheKey + ':ts')
         
          if (cached !== null && whenCached !== null) {
          let age = (Date.now() - whenCached) / 1000;
          if (age && age < 1000000 && age > expiry ){
                    sessionStorage.removeItem(cacheKey)
                    sessionStorage.removeItem(cacheKey + ':ts')
                  }
                  else{
                      sessionStorage.removeItem(cacheKey)
                      sessionStorage.removeItem(cacheKey + ':ts')
                  }
         } 
       return fetch(url, options).then(response => {
          if (response.status === 200) {
            let ct = response.headers.get('Content-Type')
            if (ct && (ct.match(/application\/json/i) || ct.match(/text\//i))) {
            response.clone().text().then(content => {
                sessionStorage.setItem(cacheKey, content)
                sessionStorage.setItem(cacheKey + ':ts', Date.now())
              })
            }
          }
          return response;
        })
}

    
cachedFetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=094aa776d64c50d5b9e9043edd4ffd00`, {
        "method": "GET",
    })
    .then(response => response.json())
    .then(response => {
        if (response.cod !== 200) {
            throw new Error()
        }
        console.log("resp" ,response )
        setResponseObj(response);
        
    })
    .catch(err => {
        setError(true);
        console.log(err.message);
    });
}

    return (
        <div>
            <h2>Find Weather Information</h2>
            <form onSubmit={getForecast} autocomplete="on">
                <input
                    type="text"
                    placeholder="Enter City Name"
                    maxLength="50"
                    className={classes.textInput}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    />
           

                <button className={classes.Button} type="submit">Submit</button>
            </form>

             {error ? <p style={{color : "red"}} >Please Enter Valid City Name </p> : null}
             
             <div style={{display : "flex" , justifyContent : "space-around"}}>
            <h4>Country Name/Code : <span style={{color : "green"}}>{responseObj && responseObj.sys && responseObj.sys.country}</span></h4>    
            <h4>City Name : <span style={{color : "green"}}>{responseObj.name}</span></h4>
            <h4>Temperature Details : <span style={{color : "green"}}>{responseObj && responseObj.main && responseObj.main.temp}</span></h4>
            <h4>Weather Details : <span style={{color : "green"}}>{responseObj && responseObj.weather && responseObj.weather[0].description}</span></h4>
            </div>

        </div>
    )
}

export default Forecast;