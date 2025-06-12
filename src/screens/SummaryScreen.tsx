import React, { useEffect, useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FlatList,
  Image,
  StatusBar,
  Platform,
  ActivityIndicator
} from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getCardDisplayDetails, withdrawlhistory } from '../api/auth';

const HEADER_HEIGHT = 84;

const SummaryScreen = ({ route }) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [accountData, setAccountData] = useState<any>(null);
  const [withdrawalHistory, setWithdrawalHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

  useEffect(() => {
    const fetchAccountId = async () => {
      try {
        const storedAccountId = await AsyncStorage.getItem('accountId');
        console.log("Retrieved accountId:", storedAccountId);
        setAccountId(storedAccountId);
        if (storedAccountId) {
          fetchAccountData(storedAccountId);
          fetchWithdrawalHistory(storedAccountId);
        }
      } catch (err) {
        console.error("Failed to fetch accountId:", err);
        setError(err);
        setLoading(false);
      }
    };
    fetchAccountId();
  }, []);

  const fetchAccountData = async (accountNumber: string) => {
    try {
      const response = await getCardDisplayDetails(accountNumber);
      // const response = await fetch(
      //   `https://afc-backend-02.azurewebsites.net/api/v1/account/card-display-details?accountNumber=${accountNumber}`
      // );
      // const data = await response.json();
      if (response.data.success) {
        setAccountData(response.data.data);
      } else {
        setError(new Error(data.message));
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawalHistory = async (accountNumber: string) => {
    try {
      // Get current date and date 90 days ago
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 90);

      // Format dates as YYYY/MM/DD
      const formatDate = (date: Date) => {
        return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
      };

      const response = await withdrawlhistory(accountNumber, formatDate(startDate), formatDate(endDate));
      // const response = await fetch(
      //   `https://afc-backend-02.azurewebsites.net/api/v1/withdraw-instruction/withdrawl-history-filter?accountNumber=${accountNumber}&startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`
      // );
      if (response.data.success) {
        setWithdrawalHistory(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch withdrawal history:", err);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#002A5C" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading account data</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#002A5C" />
      {/* Fixed Header */}
      <View style={[styles.fixedHeader, { paddingTop: statusBarHeight }]}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Text style={styles.menu}>☰</Text>
        </TouchableOpacity>
        <View style={styles.profile}>
          <Text style={styles.signatory}>Signatory</Text>
          <Image source={require('./images.png')} style={styles.image} />
        </View>
      </View>

      <View style={styles.contentContainer}>
        <ScrollView style={styles.scrollView}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back-outline" size={20} color="#00205B" />
            <Text style={styles.backText}> Back </Text>
          </TouchableOpacity>

          <Text style={styles.title}>{accountData?.accountName || 'Account'}</Text>
          <Text style={styles.subText}>
            Account No <Text style={styles.linkText}>{accountData?.id || 'N/A'}</Text>
          </Text>

          <View style={styles.infoBox}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Currency</Text>
              <Text style={styles.infoValue}>{accountData?.currencyValue || 'N/A'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Currency Code</Text>
              <Text style={styles.infoValue}>{accountData?.currencyValue || 'N/A'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Country</Text>
              <Text style={[styles.infoValue, { color: '#00205B' }]}>
                {accountData?.countryName || 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Total Credits</Text>
            <Text style={styles.amount}>{accountData?.totalCredits?.toFixed(2) || '0.00'} {accountData?.currencyValue}</Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Total Debits</Text>
            <Text style={styles.amount}>{accountData?.totalDebits?.toFixed(2) || '0.00'} {accountData?.currencyValue}</Text>
          </View>
          <View style={styles.amountRow}>
            <View>
              <Text style={styles.amountLabel}>Total Interest</Text>
              <Text style={styles.subTextSmall}>({accountData?.interestRate?.toFixed(2)}% Interest Rate)</Text>
            </View>
            <Text style={styles.amount}>{accountData?.totalInterest?.toFixed(2) || '0.00'} {accountData?.currencyValue}</Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Ledger Balance</Text>
            <Text style={styles.amount}>{accountData?.ledgerBalance?.toFixed(2) || '0.00'} {accountData?.currencyValue}</Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Available Balance</Text>
            <Text style={styles.amount}>{accountData?.availableBalance?.toFixed(2) || '0.00'} {accountData?.currencyValue}</Text>
          </View>

          {/* Draw History */}
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Withdrawal History</Text>
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
          {withdrawalHistory.length > 0 ? (
            withdrawalHistory.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.date}>{item.date}</Text>
                <Text style={styles.code}>{item.txnReferenceId}</Text>
                <Text style={[styles.status,
                item.status === 'Pending' ? styles.pendingStatus :
                  item.status === 'Completed' ? styles.completedStatus :
                    styles.otherStatus]}>
                  {item.status}
                </Text>
                <Text style={styles.amount}>{item.amount.toFixed(2)} {item.currencyValue}</Text>
              </View>
            ))
          ) : (
            <View style={styles.noHistoryContainer}>
              <Text style={styles.noHistoryText}>No withdrawal history found</Text>
            </View>
          )}

          {/* Spacer to prevent content from being hidden behind tabs */}
          <View style={styles.spacer} />
        </ScrollView>
      </View>

      {/* Bottom Tabs - moved outside ScrollView */}
      <View style={styles.tabBar}>
        <Tab label="Summary" active />
        <Tab label="Instructions" onPress={() => navigation.navigate('Instructions')} />
        <Tab label="Statement" onPress={() => navigation.navigate('Statement')} />
        <Tab label="Limit Range" />
      </View>
    </SafeAreaView>
  );
};

const Tab = ({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) => (
  <TouchableOpacity
    style={[styles.tab, active && styles.activeTab]}
    onPress={onPress}
    activeOpacity={0.7}
  >
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
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  fixedHeader: {
    backgroundColor: '#002A5C',
    height: HEADER_HEIGHT,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menu: {
    fontSize: 24,
    color: 'white'
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  signatory: {
    marginRight: 8,
    fontWeight: 'bold',
    color: '#002A5C'
  },
  image: {
    width: 20,
    height: 13,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16
  },
  backText: {
    color: '#00205B',
    fontWeight: 'bold',
    marginLeft: 6
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00205B',
    marginHorizontal: 16
  },
  subText: {
    fontSize: 14,
    color: '#555',
    marginHorizontal: 16,
    marginBottom: 12
  },
  linkText: {
    color: '#00205B'
  },
  subTextSmall: {
    fontSize: 12,
    color: '#555'
  },
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
  infoItem: {
    alignItems: 'center'
  },
  infoLabel: {
    fontSize: 12,
    color: '#555'
  },
  infoValue: {
    fontWeight: '600',
    marginTop: 4
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    paddingVertical: 8,
  },
  amountLabel: {
    fontSize: 14,
    color: '#00205B'
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000'
  },
  historyHeader: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000'
  },
  historySubtitle: {
    marginLeft: 8,
    fontSize: 12,
    alignSelf: 'flex-end',
    color: '#555'
  },
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
  date: {
    color: '#555',
    fontSize: 12
  },
  code: {
    color: '#00205B',
    fontWeight: 'bold',
    fontSize: 14
  },
  status: {
    marginTop: 2,
    fontWeight: 'bold',
  },
  pendingStatus: {
    color: '#FFA500', // Orange for pending
  },
  completedStatus: {
    color: '#008000', // Green for completed
  },
  otherStatus: {
    color: '#00205B', // Default color
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#F8F9FA',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  noHistoryContainer: {
    marginHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  noHistoryText: {
    color: '#555',
  },
  spacer: {
    height: 70, // Add space at the bottom to prevent content from being hidden behind tabs
  },
});

export default SummaryScreen; 