import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native'; 


const SummaryScreen = ({ route }) => {
   const navigation = useNavigation();

  // const route = useRoute();
  // const { account } = route.params;

  const account = route?.params?.account || {
    name: 'Energy Capital Holdings',
    number: '7087187300405',
    currency: 'USD',
    sector: 'Oil & Gas',
    credits: '$25,000,000',
    debits: '$5,000,000',
    interest: '$3000',
    balance: '$20,003,000',
  };

  const drawHistory = [
    {
      id: '1',
      date: '04/05/2025',
      code: 'DE25051509560793U',
      status: 'Pending',
      amount: '$120,000',
    },
    {
      id: '2',
      date: '04/05/2025',
      code: 'DE25051509560254U',
      status: 'Completed',
      amount: '$110,000',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-back-outline" size={20} color="#00205B" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{account.name}</Text>
        <Text style={styles.subText}>
          Account No <Text style={styles.linkText}>{account.number}</Text>
        </Text>

        <View style={styles.infoBox}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Currency</Text>
            <Text style={styles.infoValue}>US Dollar</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Currency Code</Text>
            <Text style={styles.infoValue}>{account.currency}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Sector Type</Text>
            <Text style={[styles.infoValue, { color: '#00205B' }]}>
              {account.sector}
            </Text>
          </View>
        </View>

        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Total Credits</Text>
          <Text style={styles.amount}>{account.credits}</Text>
        </View>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Total Debits</Text>
          <Text style={styles.amount}>{account.debits}</Text>
        </View>
        <View style={styles.amountRow}>
          <View>
            <Text style={styles.amountLabel}>Total Interest</Text>
            <Text style={styles.subTextSmall}>(1.5% Interest Rate)</Text>
          </View>
          <Text style={styles.amount}>{account.interest}</Text>
        </View>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Available Balance</Text>
          <Text style={styles.amount}>{account.balance}</Text>
        </View>

        {/* Draw History */}
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Draw History</Text>
          <Text style={styles.historySubtitle}>(Past 90 Days)</Text>
        </View>

        <View style={styles.searchRow}>
          <TouchableOpacity>
            <Icon name="search" size={20} color="#00205B" />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity>
              <Icon name="filter-outline" size={20} color="#00205B" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="download-outline" size={20} color="#00205B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* History list */}
        {drawHistory.map((item) => (
          <View key={item.id} style={styles.historyItem}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.code}>{item.code}</Text>
            <Text style={styles.status}>{item.status}</Text>
            <Text style={styles.amount}>{item.amount}</Text>
          </View>
        ))}

        {/* Bottom Tabs */}
        <View style={styles.tabBar}>
          <Tab label="Summary" active />
          {/* <Tab label="Instructions" /> */}
         <Tab label="Instructions" onPress={() => navigation.navigate('Instructions')} />
          <Tab label="Statement" />
          <Tab label="Limit Range" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


const Tab = ({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) => (
  <TouchableOpacity style={[styles.tab, active && styles.activeTab]} onPress={onPress}>
    <Icon
      name={
        label === 'Summary'
          ? 'grid-outline'
          : label === 'Instructions'
          ? 'document-text-outline'
          : label === 'Statement'
          ? 'document-outline'
          : 'options-outline'
      }
      size={20}
      color={active ? 'white' : '#00205B'}
    />
    <Text style={[styles.tabText, active && { color: 'white' }]}>{label}</Text>
  </TouchableOpacity>
);
 

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  backButton: { flexDirection: 'row', alignItems: 'center', margin: 16 },
  backText: { color: '#00205B', fontWeight: 'bold', marginLeft: 6 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#00205B', marginHorizontal: 16 },
  subText: { fontSize: 14, color: '#555', marginHorizontal: 16, marginBottom: 12 },
  linkText: { color: '#00205B' },
  subTextSmall: { fontSize: 12, color: '#555' },

  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    marginBottom: 12,
  },
  infoItem: { alignItems: 'center' },
  infoLabel: { fontSize: 12, color: '#555' },
  infoValue: { fontWeight: '600', marginTop: 4 },

  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    paddingVertical: 8,
  },
  amountLabel: { fontSize: 14, color: '#00205B' },
  amount: { fontWeight: 'bold', fontSize: 16, color: '#000' },

  historyHeader: { flexDirection: 'row', marginHorizontal: 16, marginTop: 20 },
  historyTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  historySubtitle: { marginLeft: 8, fontSize: 12, alignSelf: 'flex-end', color: '#555' },

  searchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  historyItem: {
    marginHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  date: { color: '#555', fontSize: 12 },
  code: { color: '#00205B', fontWeight: 'bold', fontSize: 14 },
  status: { color: '#a68100', marginTop: 2 },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#F8F9FA',
    marginTop: 30,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 6,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#00205B',
  },
  activeTab: {
    backgroundColor: '#00205B',
    borderRadius: 10,
    marginHorizontal: 4,
  },
});

export default SummaryScreen; 