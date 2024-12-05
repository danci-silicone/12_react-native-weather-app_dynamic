import { Link } from "expo-router";
import { Text, View, StyleSheet, ScrollView } from "react-native";

export default function Index() {
  const data = [
    { id: "0", city: "Ljubljana" },
    { id: "1", city: "Osijek" },
    { id: "2", city: "Rijeka" },
    { id: "3", city: "Sarajevo" },
    { id: "4", city: "Split" },
    { id: "5", city: "Zadar" },
    { id: "6", city: "Zagreb" }, 
  ];

  return (
    <ScrollView style={styles.tableContainer}>
      <View style={styles.tableHeader}>      
        <Text style={styles.cell}>Odaberi grad</Text>
      </View>

      {data.map((item) => (
        <View style={styles.tableRow} key={item.id}>        
      
          <Link href={`/vremenska_prognoza?grad=${item.id}`}>
            <Text style={styles.cell}>{item.city}</Text>
          </Link>
          <Link href={`/podaci?grad=${item.id}`}>
            <Text>Podaci</Text>
          </Link>
         
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    padding: 10,
    marginTop: 50,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableRow: {
    flexDirection: 'row', // Rasporedi elemente u jedan red
    alignItems: 'center', // Poravnaj sve unutar reda (vertikalno poravnanje)
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1, // Omogućuje ravnomjerno raspoređivanje prostora
    textAlign: 'center', // Centriraj tekst unutar ćelije
    padding: 10,
  },
  linkCell: {
    flex: 4, // Možemo povećati širinu za grad, ako želimo
    textAlign: 'left', // Lijevo poravnanje za grad
  },
});
