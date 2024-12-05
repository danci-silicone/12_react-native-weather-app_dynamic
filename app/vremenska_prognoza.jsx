import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useRouter } from 'expo-router';
import { useSearchParams } from 'expo-router';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';

const App = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    //sconst glob = useGlobalSearchParams();
    const local = useLocalSearchParams();

    //console.log(local.grad)
   
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
                /*const response = await fetch(
                    "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m"
                );*/
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${gradovi[local.grad].latitude}&longitude=${gradovi[local.grad].longitude}&hourly=temperature_2m`
                );
                const result = await response.json();
                setData(result.hourly.temperature_2m.map((temp, index) => ({
                    time: result.hourly.time[index],
                    temperature: temp,
                })));
            } catch (error) {
                console.error("Greška prilikom preuzimanja podataka:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTemperatureData();
    }, []);

    const manipulateDate = (item) => {
        let year = item.substring(0,4)
        let month = item.substring(5,7)
        let day = item.substring(8,10)
        let date = day + '.' + month + '.' + year

        return date
    }

    const manipulateTime = (time) => {
        let hour = time.substring(11,13) + ':' + '00'
        
        //let date = day + '.' + month + '.' + year

        return hour
    }

    // Renderovanje svakog reda
    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{manipulateDate(item.time)}</Text>
            <Text style={styles.cell}>{manipulateTime(item.time)}</Text>
            <Text style={styles.cell}>{item.temperature}°C</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            
            <Text style={styles.header}>{gradovi[local.grad].ime}</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.cell, styles.headerCell]}>Datum</Text>
                        <Text style={[styles.cell, styles.headerCell]}>Vrijeme</Text>
                        <Text style={[styles.cell, styles.headerCell]}>Temperatura</Text>
                    </View>
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#fff",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    tableHeader: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        paddingBottom: 5,
        marginBottom: 5,
    },
    row: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
        paddingVertical: 10,
    },
    cell: {
        flex: 1,
        textAlign: "center",
    },
    headerCell: {
        fontWeight: "bold",
        textTransform: "uppercase",
    },
});

export default App;
