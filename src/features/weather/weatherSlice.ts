import type {PayloadAction} from '@reduxjs/toolkit'
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'

export interface WeatherState {
  city: string;
  degreeFormat: {
    name: string,
    value: string,
  }
  currentWeatherDegree?: number,
  weatherList?: any,
}

const initialState: WeatherState = {
  city: "",
  degreeFormat: {
    name: "Celsius",
    value: "metric"
  },
}

export const searchByCityName = createAsyncThunk(
  "weather/searchByCityName",
  async (city: string, thunkAPI) => {
    const {weather: {degreeFormat}} = thunkAPI.getState() as {weather: WeatherState}
    try {
      const currentWeather = await (await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ea0084c9353a0dbad0c04c8015726f5b&units=${degreeFormat.value}`)).json()
      const weatherList = await (await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=ea0084c9353a0dbad0c04c8015726f5b&units=${degreeFormat.value}`)).json()

      return {weatherList, currentWeather}
    } catch (e: any) {
      thunkAPI.rejectWithValue(e.message)
    }
  }
)

export const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    changeDegreeFormat: (state, action: PayloadAction<{name: string, value: string}>) => {
      return ({
        city: "",
        currentWeatherDegree: 0,
        weatherList: [],
        degreeFormat: {
          name: action.payload.name,
          value: action.payload.value,
        }
      })
    },
  },
  extraReducers: (builder) => {
    builder.addCase(searchByCityName.fulfilled, (state, action) => {
      let weatherList = {list: []}
      let currentWeather: Partial<{name: string, main: {temp: number}}> = {}

      if (action.payload) {
        currentWeather = action.payload.currentWeather
        weatherList = action.payload.weatherList
      }

      const {list} = weatherList

      const weatherListTransformed = list.map((item: any) => {
        return ({
          temp: item.main.temp,
          date: item.dt_txt,
        })
      })

      const finalList: any = {}

      weatherListTransformed.forEach((item: any) => {
        const day = new Date(item.date).getUTCDate();

        if (!finalList[day]) {
          finalList[day] = [
            {
              temp: item.temp,
              date: item.date.split(" ")[0],
              time: item.date.split(" ")[1].slice(0, 5),
            }
          ]
        } else {
          finalList[day].push({
            temp: item.temp,
            date: item.date.split(" ")[0],
            time: item.date.split(" ")[1].slice(0, 5),
          })
        }
      })

      const currentWeatherDegree = currentWeather.main?.temp
      const city = currentWeather.name as string

      return ({
        degreeFormat: state.degreeFormat,
        currentWeatherDegree,
        weatherList: finalList,
        city,
      })
    })
  }
})

export const {changeDegreeFormat} = weatherSlice.actions

export default weatherSlice.reducer