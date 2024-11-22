import {useSelector} from "react-redux";
import {RootState} from "../../app/store";
import styles from "./index.module.css"
import {useState} from "react";

const Index = () => {
  const weatherData = useSelector((state: RootState) => state.weather)

  const [chosenDay, setChosenDay] = useState('')

  console.log(weatherData.weatherList)

  if (!weatherData.city) return null

  return (
    <div style={styles}>
      <div>
        <div id="currentWeather">
          <h3>{weatherData.city}</h3>
          <p>{weatherData.currentWeatherDegree} {weatherData.degreeFormat.name}</p>
        </div>
      </div>
      {
        weatherData.weatherList
          ?
          <div id="weatherListParent">
            <div id="dayOptions">
              {
                Object.keys(weatherData.weatherList).map((key) => {
                  // @ts-ignore
                  const {date} = weatherData.weatherList[key][0]

                  return (
                    <div onClick={() => setChosenDay(key)}>
                      <p>{date}</p>
                    </div>
                  )
                })
              }
            </div>
            {
              chosenDay
                ?
                  <div style={{display: "flex", gap: "50px"}}>
                    {
                      weatherData.weatherList[chosenDay].map((item: {temp: number, date: string, time: string}) => (
                        <div style={{
                          border: "1px solid blueviolet",
                          height: "fit-content",
                          borderRadius: "16px",
                          textAlign: "center",
                          padding: "10px",
                        }}>
                          <p>{item.temp} {weatherData.degreeFormat.name}</p>
                          <p>{item.date}</p>
                          <p>{item.time}</p>
                        </div>
                      ))
                    }
                  </div>
                :
                null
            }
          </div>
          :
          null
      }
    </div>
  );
};

export default Index;