import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { ProudctAssuranceComponent, getHostAppData, setProductScanTranslations } from 'react-native-syngenta-product-assurance';
import { useAuth } from './AuthContext';
import sampleConfig from '../config/sample';
import { Amplitude } from '@amplitude/react-native';
const AMPLITUDE_KEY = '3f7592aa815db33dda046b052b39d527';
const amplitudeInstance = Amplitude.getInstance();
amplitudeInstance.init(AMPLITUDE_KEY).then(() => {
  console.log('Amplitude initialized');
}).catch((error) => {
  console.error('Error initializing Amplitude:', error);
});



const HomeScreen = () => {
  const { state: {
    phoneNumber,
    otp,
    isOtpSent,
    verificationId,
    loading,
    countryCode,
    language,
    userData: {
      token,
      userProfile: {
        firstName,
        countryId,
        lastName,
        mobileNo,
        id
      },
    }
  } } = useAuth();
  const credentials = {
    userName: `${firstName} ${lastName}`,
    userMail: mobileNo,
    role: {
      RoleName: 'Grower',
      RoleCode: 'GR'
    },
    id: id,
  };
  const productAssuranceObj = {
    appName: `Grower${countryCode}`,
    lat: sampleConfig?.latitude,
    lng: sampleConfig?.longitude,
    tokenValue: token,
    credentials,
    country: countryCode,
    language: language,
    appVersion: sampleConfig.getAppVersion(),
    isSalesForceUser: false,
    salesForceBaseURL: '',
    environment: sampleConfig.ENV
  };

  const [hostDataSent, setHostDataSent] = useState(false);

  useEffect(() => {
    getHostAppData(productAssuranceObj);
    setProductScanTranslations(sampleConfig[language]);
    amplitudeInstance.setUserId(firstName+mobileNo);
    
    setTimeout(() => {
      setHostDataSent(true);
    }, 200);
  }, []);

  return (
    <View style={styles.container}>
      {hostDataSent && <ProudctAssuranceComponent 
      hostAppData={productAssuranceObj}
      closeProductAssurance={() => {}} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
  },
});

export default HomeScreen;
