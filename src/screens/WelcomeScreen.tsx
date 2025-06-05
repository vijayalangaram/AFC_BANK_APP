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
  Platform, ScrollView, ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

const HEADER_HEIGHT = 84;


const getCurrencySymbol = (currencyCode) => {
  const currencySymbols = {
    // North America
    USD: '$',    // US Dollar
    CAD: 'C$',   // Canadian Dollar
    MXN: 'MX$',  // Mexican Peso

    // South America
    BRL: 'R$',   // Brazilian Real
    ARS: '$',    // Argentine Peso
    CLP: 'CLP$', // Chilean Peso
    COP: 'COL$', // Colombian Peso
    PEN: 'S/',   // Peruvian Sol

    // Europe
    EUR: '€',    // Euro
    GBP: '£',    // British Pound
    CHF: 'CHF',  // Swiss Franc
    NOK: 'kr',   // Norwegian Krone
    SEK: 'kr',   // Swedish Krona
    DKK: 'kr',   // Danish Krone
    RUB: '₽',    // Russian Ruble
    TRY: '₺',    // Turkish Lira
    PLN: 'zł',   // Polish Zloty
    HUF: 'Ft',   // Hungarian Forint
    CZK: 'Kč',   // Czech Koruna

    // Middle East
    AED: 'د.إ',  // UAE Dirham
    SAR: '﷼',    // Saudi Riyal
    QAR: '﷼',    // Qatari Riyal
    ILS: '₪',    // Israeli Shekel
    EGP: '£',    // Egyptian Pound
    IRR: '﷼',    // Iranian Rial
    IQD: 'ع.د',  // Iraqi Dinar

    // Africa
    ZAR: 'R',    // South African Rand
    NGN: '₦',    // Nigerian Naira
    KES: 'KSh',  // Kenyan Shilling
    ETB: 'Br',   // Ethiopian Birr
    GHS: 'GH₵',  // Ghanaian Cedi
    MAD: 'د.م.', // Moroccan Dirham
    DZD: 'د.ج',  // Algerian Dinar
    TND: 'د.ت',  // Tunisian Dinar

    // Africa
    XAF: 'FCFA',  // Central African CFA franc
    XOF: 'CFA',   // West African CFA franc
    XPF: '₣',     // CFP franc   
    UGX: 'USh',   // Ugandan Shilling
    RWF: 'RF',    // Rwandan Franc
    MWK: 'MK',    // Malawian Kwacha
    ZMW: 'ZK',    // Zambian Kwacha
    MZN: 'MTn',   // Mozambican Metical
    AOA: 'Kz',    // Angolan Kwanza
    BIF: 'FBu',   // Burundian Franc
    CDF: 'FC',    // Congolese Franc
    DJF: 'Fdj',   // Djiboutian Franc
    ERN: 'Nfk',   // Eritrean Nakfa
    GMD: 'D',     // Gambian Dalasi
    GNF: 'FG',    // Guinean Franc
    LRD: 'L$',    // Liberian Dollar
    LSL: 'L',     // Lesotho Loti
    LYD: 'ل.د',   // Libyan Dinar
    MGA: 'Ar',    // Malagasy Ariary
    MRO: 'UM',    // Mauritanian Ouguiya (pre-2018)
    MRU: 'UM',    // Mauritanian Ouguiya
    MUR: '₨',     // Mauritian Rupee
    SCR: '₨',     // Seychellois Rupee
    SDG: '£',     // Sudanese Pound
    SHP: '£',     // Saint Helena Pound
    SOS: 'Sh',    // Somali Shilling
    SSP: '£',     // South Sudanese Pound
    SZL: 'L',     // Swazi Lilangeni
    TZS: 'TSh',   // Tanzanian Shilling
    ZWL: 'Z$',    // Zimbabwean Dollar

    // North America (additional)
    BZD: 'BZ$',   // Belize Dollar
    BSD: 'B$',    // Bahamian Dollar
    BMD: 'BD$',   // Bermudian Dollar
    KYD: 'CI$',   // Cayman Islands Dollar
    CRC: '₡',     // Costa Rican Colon
    HTG: 'G',     // Haitian Gourde
    JMD: 'J$',    // Jamaican Dollar
    NIO: 'C$',    // Nicaraguan Cordoba
    PAB: 'B/.',   // Panamanian Balboa
    TTD: 'TT$',   // Trinidad and Tobago Dollar

    // South America (additional)
    BOB: 'Bs.',   // Bolivian Boliviano
    GYD: 'G$',    // Guyanese Dollar
    PYG: '₲',     // Paraguayan Guarani
    SRD: '$',     // Surinamese Dollar
    UYU: '$U',    // Uruguayan Peso
    VEF: 'Bs.',   // Venezuelan Bolivar
    VES: 'Bs.S',  // Venezuelan Bolivar Soberano

    // Asia (additional)
    AMD: '֏',     // Armenian Dram
    AZN: '₼',     // Azerbaijani Manat
    BHD: '.د.ب',  // Bahraini Dinar
    BTN: 'Nu.',   // Bhutanese Ngultrum
    KHR: '៛',     // Cambodian Riel
    FJD: 'FJ$',   // Fijian Dollar
    GEL: '₾',     // Georgian Lari
    HKD: 'HK$',   // Hong Kong Dollar
    JOD: 'د.ا',   // Jordanian Dinar
    KZT: '₸',     // Kazakhstani Tenge
    KWD: 'د.ك',   // Kuwaiti Dinar
    KGS: 'с',     // Kyrgyzstani Som
    LAK: '₭',     // Lao Kip
    LBP: 'ل.ل',   // Lebanese Pound
    MNT: '₮',     // Mongolian Tugrik
    MMK: 'K',     // Myanmar Kyat
    NPR: '₨',     // Nepalese Rupee
    OMR: 'ر.ع.',  // Omani Rial
    PGK: 'K',     // Papua New Guinean Kina
    RSD: 'дин',   // Serbian Dinar
    SYP: '£',     // Syrian Pound
    TWD: 'NT$',   // New Taiwan Dollar
    TMT: 'T',     // Turkmenistani Manat
    UZS: 'сўм',   // Uzbekistani Som
    YER: '﷼',     // Yemeni Rial

    // Europe (additional)
    ALL: 'L',     // Albanian Lek
    BAM: 'KM',    // Bosnia-Herzegovina Convertible Mark
    BGN: 'лв',    // Bulgarian Lev
    HRK: 'kn',    // Croatian Kuna
    ISK: 'kr',    // Icelandic Króna
    MDL: 'L',     // Moldovan Leu
    MKD: 'ден',   // Macedonian Denar
    RON: 'lei',   // Romanian Leu
    UAH: '₴',     // Ukrainian Hryvnia

    // Oceania (additional)
    TOP: 'T$',    // Tongan Pa'anga
    WST: 'WS$',   // Samoan Tala
    SBD: 'SI$',   // Solomon Islands Dollar
    VUV: 'VT',    // Vanuatu Vatu

    // Cryptocurrencies (additional)
    LTC: 'Ł',     // Litecoin
    BCH: 'BCH',   // Bitcoin Cash
    XLM: 'XLM',   // Stellar Lumen
    USDT: '₮',    // Tether
    ADA: '₳',     // Cardano
    DOGE: 'Ð',    // Dogecoin

    // Asia
    CNY: '¥',    // Chinese Yuan
    JPY: '¥',    // Japanese Yen
    INR: '₹',    // Indian Rupee
    KRW: '₩',    // South Korean Won
    SGD: 'S$',   // Singapore Dollar
    MYR: 'RM',   // Malaysian Ringgit
    THB: '฿',    // Thai Baht
    VND: '₫',    // Vietnamese Dong
    IDR: 'Rp',   // Indonesian Rupiah
    PHP: '₱',    // Philippine Peso
    PKR: '₨',    // Pakistani Rupee
    BDT: '৳',    // Bangladeshi Taka
    LKR: 'Rs',   // Sri Lankan Rupee
    AFN: '؋',    // Afghan Afghani

    // Oceania
    AUD: 'A$',   // Australian Dollar
    NZD: 'NZ$',  // New Zealand Dollar 

    // Special cases and cryptocurrencies
    BTC: '₿',    // Bitcoin
    ETH: 'Ξ',    // Ethereum
    XRP: 'XRP',  // Ripple

    // CFA Francs
    XAF: 'FCFA',  // Central African CFA franc
    XOF: 'CFA',   // West African CFA franc 
  };

  // Return the symbol if found, otherwise return the currency code
  return currencySymbols[currencyCode] || currencyCode;
};

// Enhanced formatting function

// Enhanced formatting function with RTL support
const formatCurrency = (currencyType, amount) => {
  const symbol = getCurrencySymbol(currencyType);

  // Format number with western-style commas
  let formattedAmount;
  try {
    formattedAmount = parseFloat(amount).toLocaleString('en-US');
  } catch (e) {
    formattedAmount = amount.toString();
  }
  // Right-to-left currencies (Arabic, etc.)
  const rtlCurrencies = [
    'AED', 'SAR', 'QAR', 'IRR', 'IQD', 'AFN',
    'OMR', 'YER', 'JOD', 'LBP', 'SYP', 'LYD',
    'DZD', 'TND', 'MAD', 'SDG', 'SSP', 'SHP'
  ];

  if (rtlCurrencies.includes(currencyType)) {
    return `${formattedAmount} ${symbol}`;
  }
  // Special cases where symbol comes after
  const suffixSymbols = ['XAF', 'XOF', 'XPF'];
  if (suffixSymbols.includes(currencyType)) {
    return `${symbol} ${formattedAmount}`;
  }
  return `${symbol} ${formattedAmount}`;
};

const AccountCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View style={styles.accountInfo}>
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
          {item.countryName}
        </Text>
        <Text style={styles.subtext}>{item.accountId}- ({item.currencyType})</Text>
        <Text style={styles.debitLabel}>Total Debits</Text>
        {/* <Text style={styles.debitAmount}>{item.totalDebits}</Text> */}
        <Text style={styles.debitAmount}>
          {formatCurrency(item.currencyType, item.totalDebits)}
        </Text>
        {/* <Text style={styles.debitAmount}>
          {getCurrencySymbol(item.currencyType)} {item.totalDebits}
        </Text> */}
      </View>
      <View style={styles.balanceBox}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        {/* <Text style={styles.balance}> {item.availableBalance}</Text> */}
        <Text style={styles.balance}>
          {formatCurrency(item.currencyType, item.availableBalance)}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);


export default function PortfolioScreen() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [isLoading, setIsLoading] = useState<boolean>(false); // Add loading state

  useEffect(() => {
    setIsLoading(true);
    const getData = async () => {
      try {
        const res = await fetchAccountSummary();
        console.log(res, "res")
        setAccounts(res.data.data || []);
        setIsLoading(false)
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


      {/* Loading indicator */}
      {isLoading && (
        <ActivityIndicator
          size="large"
          color="#0071CF"
          style={styles.loader}
        />
      )}

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.portfolioTitle}>Portfolio.</Text>
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
  loader: {
    marginVertical: 20,
  },
  accountInfo: {
    flex: 1,
    marginRight: 10,
  },
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
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002A5C',
    marginBottom: 4,
  },
  subtext: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  debitLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  debitAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002A5C',
  },
  balanceBox: {
    backgroundColor: '#DFF6DF',
    padding: 10,
    borderRadius: 10,
    alignItems: 'flex-end',
    minWidth: 120,
    maxWidth: 140,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
  },
  balance: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
