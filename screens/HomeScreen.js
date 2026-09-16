import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { ProudctAssuranceComponent, getHostAppData, setProductScanTranslations } from 'react-native-syngenta-product-assurance';
import { useAuth } from './AuthContext';
import sampleConfig from '../config/sample';
import { Amplitude } from '@amplitude/react-native';
import LogoutButton from './logoutBtn';

const AMPLITUDE_KEY = '3f7592aa815db33dda046b052b39d527';
const amplitudeInstance = Amplitude.getInstance();
amplitudeInstance.init(AMPLITUDE_KEY).then(() => {
  console.log('Amplitude initialized');
}).catch((error) => {
  console.error('Error initializing Amplitude:', error);
});

const HomeScreen = () => {
  const { state: {
    countryCode = '',
    language = '',
    userData = {}, 
    appName,
  } = {} } = useAuth();

  // Safely access nested properties with default values
  const userProfile = userData?.userProfile || {};
  const firstName = userProfile?.firstName || '';
  const lastName = userProfile?.lastName || '';
  const mobileNo = userProfile?.mobileNo || '';
  const id = userProfile?.id || '';
  // use token from auth state if available, otherwise fall back to dummy
  const token = userData?.token;

  const credentials = {
    userName: `${firstName} ${lastName}`.trim(),
    userMail: mobileNo,
    role: {
      RoleName: appName === 'Sumridhi' ? 'Sumridhi' : 'Grower',
      RoleCode: appName === 'Sumridhi' ? 'SU' : 'GR',
    },
    id: id,
  };

  const productAssuranceObj = {
    appName: countryCode === `IN`? appName : `${appName}${countryCode || ''}`,
    lat: sampleConfig?.latitude || 0,
    lng: sampleConfig?.longitude || 0,
    tokenValue: token || '',
    credentials,
    country: countryCode || '',
    language: (language !== 'vn' ? language : 'vi') || '',
    appVersion: sampleConfig.getAppVersion() || '',
    isSalesForceUser: false,
    salesForceBaseURL: '',
    environment: sampleConfig.ENV || '',
    fonts:{}
  };

  const [hostDataSent, setHostDataSent] = useState(false);

  useEffect(() => {
    if (productAssuranceObj.tokenValue) {
      getHostAppData(productAssuranceObj);
      setProductScanTranslations(sampleConfig[language] || {});
      if (firstName && mobileNo) {
        amplitudeInstance.setUserId(firstName + mobileNo);
      }
      
      setTimeout(() => {
        setHostDataSent(true);
      }, 200);
    }
  }, []);

  return (
    <View style={styles.container}>
      {hostDataSent && productAssuranceObj.tokenValue && (
        <ProudctAssuranceComponent
          hostAppData={productAssuranceObj}
          closeProductAssurance={() => {}}
        />
      )}
      <LogoutButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;