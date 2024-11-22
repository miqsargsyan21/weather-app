import styles from "./index.module.css"
import {useDispatch} from "react-redux";
import {useState} from "react";
import {searchByCityName, changeDegreeFormat} from "../../features/weather/weatherSlice";
import {AppDispatch} from "../../app/store";

const Index = () => {
  const [city, setCity] = useState("")
  const dispatch = useDispatch<AppDispatch>()

  const handleSearch = () => {
    if (city) {
      dispatch(searchByCityName(city))
    }
  }

  return (
    <header style={styles}>
      <div>
        <input type="text" placeholder="Type city name here..." onChange={(e) => setCity(e.target.value)}/>
        <button type="submit" onClick={handleSearch}>Search</button>
      </div>
      <div id="secondChild">
        <button className="choiceButton" onClick={() => dispatch(changeDegreeFormat({name: "Celsius", value: "metric"}))}>°C</button>
        <button className="choiceButton" onClick={() => dispatch(changeDegreeFormat({name: "Fahrenheit", value: "imperial"}))}>°F</button>
      </div>
    </header>
  );
};

export default Index;