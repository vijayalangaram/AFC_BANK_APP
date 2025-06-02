import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';

const HEADER_HEIGHT = 84;

const accounts = [
  {
    id: '1',
    name: 'Energy Capital Holdings',
    number: '7087187300405',
    currency: 'USD',
    debits: '$5,000,000',
    balance: '$20,003,000',
  },
  {
    id: '2',
    name: 'Hydro Carbon Finance',
    number: '7087187300465',
    currency: 'USD',
    debits: '$5,000,000',
    balance: '$16,023,000',
  },
  {
    id: '3',
    name: 'Africa Finance Ltd',
    number: '7087187300415',
    currency: 'USD',
    debits: '$5,000,000',
    balance: '$2,300,000', // corrected format
  },
  {
    id: '4',
    name: 'Energy Capital Holdings',
    number: '7087187300425',
    currency: 'USD',
    debits: '$5,000,000',
    balance: '$20,003,000',
  },
  {
    id: '3',
    name: 'Africa Finance Ltd',
    number: '7087187300415',
    currency: 'USD',
    debits: '$5,000,000',
    balance: '$2,300,000', // corrected format
  },
  {
    id: '4',
    name: 'Energy Capital Holdings',
    number: '7087187300425',
    currency: 'USD',
    debits: '$5,000,000',
    balance: '$20,003,000',
  },
  {
    id: '3',
    name: 'Africa Finance Ltd',
    number: '7087187300415',
    currency: 'USD',
    debits: '$5,000,000',
    balance: '$2,300,000', // corrected format
  },
  {
    id: '4',
    name: 'Energy Capital Holdings',
    number: '7087187300425',
    currency: 'USD',
    debits: '$5,000,000',
    balance: '$20,003,000',
  },
];

const AccountCard = ({ item }) => (
  <View style={styles.card}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.subtext}>{item.number}- ({item.currency})</Text>
        <Text style={styles.debitLabel}>Total Debits</Text>
        <Text style={styles.debitAmount}>{item.debits}</Text>
      </View>
      <View style={styles.balanceBox}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balance}>{item.balance}</Text>
      </View>
    </View>
  </View>
);

export default function PortfolioScreen() {
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#002A5C" />

      {/* Fixed Header */}
      <View style={[styles.fixedHeader, { paddingTop: statusBarHeight }]}>
        <TouchableOpacity><Text style={styles.menu}>☰</Text></TouchableOpacity>
        <View style={styles.profile}>
          <Text style={styles.signatory}>Signatory</Text>
          <Image source={require('./images.png')} style={styles.image} />
        </View> 
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.portfolioTitle}>Portfolio</Text>
        <FlatList
          data={accounts}
          renderItem={AccountCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  fixedHeader: {
    backgroundColor: '#002A5C',
    height: HEADER_HEIGHT,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  content: {
    flex: 1,
    paddingTop: 16,
  },

  menu: { fontSize: 24, color: 'white' },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  signatory: { marginRight: 8, fontWeight: 'bold', color: '#002A5C' },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  image: {
    width: 20,
    height: 13,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  portfolioTitle: { fontSize: 24, fontWeight: 'bold', margin: 16, color: '#002A5C' },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: 'bold', color: '#002A5C' },
  subtext: { color: '#333', marginVertical: 2 },
  debitLabel: { fontSize: 12, color: '#888', marginTop: 8 },
  debitAmount: { fontSize: 16, fontWeight: '600' },
  balanceBox: {
    backgroundColor: '#DFF6DF',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 130,
  },
  balanceLabel: { fontSize: 12, color: '#333' },
  balance: { fontSize: 16, fontWeight: 'bold', color: '#000' },
});
