import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Svg, Line, Circle, Path } from 'react-native-svg'; // Dodajemo Path
import * as d3 from 'd3';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';

const TemperatureChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const local = useLocalSearchParams();

  const gradovi = [
    { ime: "Ljubljana", latitude: 46.05, longitude: 14.51 },
    { ime: "Osijek", latitude: 45.1, longitude: 18.6 },
    { ime: "Rijeka", latitude: 45.33, longitude: 14.44 },
    { ime: "Sarajevo", latitude: 43.84, longitude: 18.36 },
    { ime: "Split", latitude: 43.51, longitude: 16.44 },
    { ime: "Zadar", latitude: 44.12, longitude: 15.23 },
    { ime: "Zagreb", latitude: 45.81, longitude: 15.98 }

];

  // API poziv za Open Meteo
  useEffect(() => {
    const fetchTemperatureData = async () => {
      try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${gradovi[local.grad].latitude}&longitude=${gradovi[local.grad].longitude}&hourly=temperature_2m`
        );
        const result = await response.json();
        setData(
          result.hourly.temperature_2m.map((temp, index) => ({
            time: result.hourly.time[index],
            temperature: temp,
          }))
        );
      } catch (error) {
        console.error('Greška prilikom preuzimanja podataka:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemperatureData();
  }, []);

  // Ako podaci još nisu učitani, prikaži učitavanje
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Dimenzije grafa
  const width = 320;
  const height = 200;
  const margin = 20;

  // Skale za X i Y os
  const xScale = d3.scaleTime()
    .domain([new Date(data[0].time), new Date(data[data.length - 1].time)]) // Raspon vremena
    .range([margin, width - margin]);

  const yScale = d3.scaleLinear()
    .domain([Math.min(...data.map(d => d.temperature)), Math.max(...data.map(d => d.temperature))]) // Raspon temperatura
    .range([height - margin, margin]);

  // Linija koja spaja sve točke
  const lineGenerator = d3.line()
    .x(d => xScale(new Date(d.time))) // X pozicija temelji se na vremenu
    .y(d => yScale(d.temperature)) // Y pozicija temelji se na temperaturi

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Temperature Over Time</Text>
      <Svg width={width} height={height}>
        {/* Dodajemo liniju koja povezuje sve točke */}
        <Path d={lineGenerator(data)} fill="none" stroke="steelblue" strokeWidth={2} />
        
        {/* Dodavanje točaka */}
        {data.map((d, index) => (
          <Circle
            key={index}
            cx={xScale(new Date(d.time))}
            cy={yScale(d.temperature)}
            r="3"
            fill="red"
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default TemperatureChart;
