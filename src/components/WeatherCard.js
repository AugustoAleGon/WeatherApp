import React from 'react';
import {View, Text} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

import styles from './WeatherCardStyles';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiYXVndXN0b2FsZWdvbiIsImEiOiJjazkxaThsZGQwMGNoM29scXJjcTFyNmJiIn0.1TOVAWLBWw-pey8RejyiyQ',
);

const WeatherCard = props => {
  return (
    <View>
      <Text style={styles.subtitles}>City: {props.city}</Text>
      <Text style={styles.subtitles}>Temperature: {props.temperature}</Text>
      <Text style={styles.subtitles}>Pressure: {props.pressure}</Text>
      <Text style={styles.subtitles}>Humidity: {props.humidity}</Text>
      <Text style={styles.subtitles}>Max temperature: {props.maxTemp}</Text>
      <Text style={styles.subtitles}>Min temperature: {props.minTemp}</Text>
      <MapboxGL.MapView style={styles.map} />
    </View>
  );
};

export default WeatherCard;
