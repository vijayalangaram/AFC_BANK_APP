import React, { useEffect, useState } from 'react';
import { fetchAccountSummary } from '../api/account';
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
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

const HEADER_HEIGHT = 84;

const AccountCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View>    
        <Text
          style={styles.name}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.countryName}
        </Text>

        <Text style={styles.subtext}>{item.accountId}- ({item.currencyType})</Text>
        <Text style={styles.debitLabel}>Total Debits</Text>
        <Text style={styles.debitAmount}>{item.totalDebits}</Text>
      </View>
      <View style={styles.balanceBox}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balance}>{item.availableBalance}</Text>
      </View>
    </View>
  </TouchableOpacity>
);


export default function PortfolioScreen() {
  const [accounts, setAccounts] = useState([]);

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
  const navigation = useNavigation<DrawerNavigationProp<any>>();


  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetchAccountSummary();
        console.log(res, "res")
        setAccounts(res.data.data || []);
      } catch (err) {
        console.error('Fetch error', err);
      }
    };

    getData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#002A5C" />

      {/* Fixed Header */}
      <View style={[styles.fixedHeader, { paddingTop: statusBarHeight }]}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Text style={styles.menu}>☰</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity><Text style={styles.menu}>☰</Text></TouchableOpacity> */}
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
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <AccountCard
              item={item}
              onPress={() => navigation.navigate('SummaryScreen', { account: item })}
            />
          )}
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
