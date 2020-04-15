import React, {Component} from 'react';
import {SafeAreaView, View, StatusBar} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import {Input, Text, Button} from 'react-native-elements';
import axios from 'axios';
import WeatherCard from './components/WeatherCard';
import isEmptyObj from './utils/isEmptyObj';

import styles from './styles';

MaterialIcon.loadFont();

class App extends Component {
  constructor(props) {
    super(props);
    this.searchInput = React.createRef();
  }

  state = {
    city: '',
    currentWeather: {},
    previousCities: {},
  };

  async componentDidMount() {
    const {previousCities} = this.state;
    if (isEmptyObj(previousCities)) {
      try {
        const value = await AsyncStorage.getItem('citiesStorage');
        if (value !== null) {
          // eslint-disable-next-line react/no-did-mount-set-state
          this.setState({previousCities: JSON.parse(value)});
        }
      } catch (error) {
        console.log("Don't have a value on storage");
      }
    }
  }

  clearInput = () => {
    this.searchInput.current.clear();
  };

  handleInput = text => {
    this.setState({city: text});
  };

  searchCity = async () => {
    const {city, previousCities} = this.state;
    let response = null;
    try {
      response = await axios.get(
        // eslint-disable-next-line prettier/prettier
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=78591b229f05ac6f644db719fc46adf3`
      );
      this.setState({currentWeather: response.data});
    } catch (error) {
      console.log('Ups something went wrong!');
    }
    if (response.data) {
      let data = {...previousCities, [city]: response.data};
      const dataArray = Object.keys(data);
      if (dataArray.length > 5) {
        delete data[dataArray[0]];
      }
      this.setState({previousCities: data}, ()=> console.log('State: ', this.state.previousCities));
      try {
        await AsyncStorage.setItem('citiesStorage', JSON.stringify(data));
      } catch (error) {
        console.log('A problem happen saving storage');
      }
    }
  };

  render() {
    const {city, currentWeather, previousCities} = this.state;
    const cities = Object.keys(previousCities);
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text h1>Weather App</Text>
          </View>
          <View>
            <Input
              ref={this.searchInput}
              placeholder="Enter a City Name"
              onChangeText={this.handleInput}
              rightIcon={
                <MaterialIcon
                  value={city}
                  name="clear"
                  size={24}
                  color="black"
                  onPress={this.clearInput}
                />
              }
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Search"
              onPress={this.searchCity}
              buttonStyle={styles.searchButton}
            />
          </View>
          {!isEmptyObj(currentWeather) && (
            <WeatherCard
              city={currentWeather.name}
              temperature={currentWeather.main.temp}
              pressure={currentWeather.main.pressure}
              humidity={currentWeather.main.humidity}
              maxTemp={currentWeather.main.temp_max}
              minTemp={currentWeather.main.temp_min}
            />
          )}
          {cities.map(place => (
            <Text style={styles.citiesText}>{place}</Text>
          ))}
        </SafeAreaView>
      </>
    );
  }
}

export default App;
