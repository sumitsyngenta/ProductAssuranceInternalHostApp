import React, { createContext, useReducer, useContext } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';
import { graphQlService } from '../api/services/GraphQlService';
import { SEND_OTP_MSGBIRD, VALIDATE_OTP_MSGBIRD } from '../api/services/apiQueries';

// placeholder enums used in Sumridhi GraphQL requests
const MicroService = { UserService: 'UserService' };
const OtpType = { SEND: 'SEND' };

// Define Types
export const AUTH_TYPES = {
  SET_PHONE: 'SET_PHONE',
  SET_OTP: 'SET_OTP',
  SET_LOADING: 'SET_LOADING',
  SET_OTP_SENT: 'SET_OTP_SENT',
  SET_VERIFICATION_ID: 'SET_VERIFICATION_ID',
  SET_USER_DATA: 'SET_USER_DATA',
  RESET_AUTH: 'RESET_AUTH',
  SET_COUNTRY_CODE: 'SET_COUNTRY_CODE',
  SET_LANGUAGE: 'SET_LANGUAGE',
  SET_APP_NAME: 'SET_APP_NAME',
};


// Initial State
const initialState = {
  phoneNumber: '',
  otp: '',
  isOtpSent: false,
  verificationId: '',
  loading: false,
  userData: {
    token: null,
    userProfile: null,
    termsAndConditionsId: null,
    isNewUser: false
  },
  countryCode: 'IN',
  language: 'en',
  appName: 'Grower',
};


// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_TYPES.SET_PHONE:
      return { ...state, phoneNumber: action.payload };
    case AUTH_TYPES.SET_OTP:
      return { ...state, otp: action.payload };
    case AUTH_TYPES.SET_LOADING:
      return { ...state, loading: action.payload };
    case AUTH_TYPES.SET_OTP_SENT:
      return { ...state, isOtpSent: action.payload };
    case AUTH_TYPES.SET_VERIFICATION_ID:
      return { ...state, verificationId: action.payload };
    case AUTH_TYPES.SET_USER_DATA:
      return { ...state, userData: action.payload };
    case AUTH_TYPES.RESET_AUTH:
      return initialState;
    case AUTH_TYPES.SET_COUNTRY_CODE:
      return { ...state, countryCode: action.payload };
    case AUTH_TYPES.SET_LANGUAGE:
      return { ...state, language: action.payload };
    case AUTH_TYPES.SET_APP_NAME:
      return { ...state, appName: action.payload };
    default:
      return state;
  }
};

// Create Context
export const AuthContext = createContext();

// Create Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const BASE_URL = 'https://qa-in.api.cropwise-smallgrowers.syndpe.com/api/v2/login';
  const HEADERS = {
    'accept': '*/*',
    'country-code': 'VN',
    'language-code': 'en',
    'Content-Type': 'application/json'
  };

  const formatPhoneNumber = (number) => {
    const cleanNumber = number.replace(/\D/g, '');
    return state.appName === 'Sumridhi' ? `${cleanNumber}` : `84${cleanNumber}`;
  };

  const handleSendOtp = async () => {
    dispatch({ type: AUTH_TYPES.SET_LOADING, payload: true });
    const formattedPhone = formatPhoneNumber(state.phoneNumber);

    if (formattedPhone.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number.');
      dispatch({ type: AUTH_TYPES.SET_LOADING, payload: false });
      return;
    }
    await dispatch({ type: AUTH_TYPES.SET_PHONE, payload: formattedPhone });
    if (state.appName === 'Sumridhi') {
      await sendSumridhiOTP();
    } else {
      await sendGrowerOTP();
    }
  };

  const sendSumridhiOTP = async () => {
    const options = {
      query: SEND_OTP_MSGBIRD,
      microService: MicroService.UserService,
      variables: {
        phoneNumber: state.phoneNumber.toString(),
        countryCode: '+91',
        otpTyp: OtpType.SEND,
        identifier: '/gB2lSB1yi+R',
        proceedToLogin: false,
        deviceId: 'd38c70752e7abda2',
        languageId: 1,
      },
    }
    graphQlService.makeMutationRequest(options)
      .then((res) => {

        dispatch({ type: AUTH_TYPES.SET_LOADING, payload: false });
        const response = res?.data?.v3sendOtp;
        console.log('OTP Response:', res);
        if (response != null) {
          dispatch({ type: AUTH_TYPES.SET_LOADING, payload: false });
          if (response?.code === 'SR200') {
            dispatch({ type: AUTH_TYPES.SET_VERIFICATION_ID, payload: response?.resData?.id });
            dispatch({ type: AUTH_TYPES.SET_OTP_SENT, payload: true });
            Alert.alert(response.message);
          } else {
            Alert.alert('Error', response.message || 'Failed to send OTP');
          }
        } else {
          Alert.alert('Error', 'Failed to send OTP. No response received.');
        }
      })
      .catch((error) => {
        dispatch({ type: AUTH_TYPES.SET_LOADING, payload: false });
        Alert.alert('Error', 'Failed to send OTP. Unknown error occurred.');
        console.error(error);
      });
  };

  const sendGrowerOTP = async () => {
    try {

      const response = await fetch(`${BASE_URL}/sendOtp/${state.phoneNumber}`, {
        method: 'GET',
        headers: HEADERS,
      });

      const data = await response.json();

      if (data?.verificationId) {
        dispatch({ type: AUTH_TYPES.SET_VERIFICATION_ID, payload: data.verificationId });
        dispatch({ type: AUTH_TYPES.SET_OTP_SENT, payload: true });
        Alert.alert(data.message);
      } else {
        Alert.alert('Error', data.message || 'Failed to send OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
      console.error(error);
    } finally {
      dispatch({ type: AUTH_TYPES.SET_LOADING, payload: false });
    }
  };

  const handleVerifyOtp = async (navigation) => {
    if (state.appName === 'Sumridhi') {
      // Implement Sumridhi OTP verification logic here
      handleVerifyOtpSumridhi(navigation);
    } else {
      // Implement Grower OTP verification logic here
      handleVerifyOtpGrower(navigation);
    }

  };

  const handleVerifyOtpSumridhi = async (navigation) => {
    dispatch({ type: AUTH_TYPES.SET_LOADING, payload: true });
    graphQlService
      .makeMutationRequest({
        query: VALIDATE_OTP_MSGBIRD,
        microService: MicroService.UserService,
        variables: {
          phoneNumber: state.phoneNumber.toString(),
          countryCode: '+91',
          languageId: 1,
          otp: state.otp,
          ...({ smsId: state.verificationId ? state.verificationId : '' }),
        },
      })
      .then(async (res) => {
        dispatch({ type: AUTH_TYPES.SET_LOADING, payload: false });
        const response = res?.data?.v3validateOtp;
        console.log('OTP Validation Response:', response?.resData);
        if (response != null) {
          if (response?.code === 'SR200') {
            const userData = {
              token: response?.resData?.accessToken,
              userProfile: {
                firstName: response?.resData?.user?.name,
                lastName: '',
                mobileNo: response?.resData?.user?.mobileNumber,
                id: response?.resData?.user?.id,
                role: {
                  RoleName: 'Sumridhi',
                  RoleCode: 'MD'
                },
              },
            };
            await AsyncStorage.setItem('userToken', response?.resData?.accessToken);
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
            dispatch({ type: AUTH_TYPES.SET_USER_DATA, payload: userData });
            Alert.alert('Success', 'Login successful!');
            navigation.navigate('Home');
          } else {
            Alert.alert('Error', response.message || 'Invalid OTP');
          }
        } else {
          Alert.alert('Error', 'Failed to verify OTP. No response received.');
        }
      })
      .catch(err => {
        dispatch({ type: AUTH_TYPES.SET_LOADING, payload: false });
        Alert.alert('Error', 'Failed to verify OTP. Unknown error occurred.');
      })
      .finally(() => setVerifyingOtp(false));

  }

  const handleVerifyOtpGrower = async (navigation) => {
    try {
      dispatch({ type: AUTH_TYPES.SET_LOADING, payload: true });
      const formattedPhone = formatPhoneNumber(state.phoneNumber);
      console.log('Verifying OTP for phone:', formattedPhone, `${BASE_URL}/verifyOtp/${state.phoneNumber}?isForgotMpin=false`);
      const response = await fetch(`${BASE_URL}/verifyOtp/${state.phoneNumber}?isForgotMpin=false`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
          identifier: state.otp,
          verificationId: state.verificationId
        })
      });
      console.log('OTP Verification Response:', response);

      const data = await response.json();

      if (data?.userProfile) {
        const userData = {
          token: data.token,
          userProfile: data.userProfile,
          termsAndConditionsId: data.termsAndConditionsId,
          isNewUser: data.isNewUser
        };
        console.log('userData', userData);
        

        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        
        dispatch({ type: AUTH_TYPES.SET_USER_DATA, payload: userData });
        Alert.alert('Success', 'Login successful!');
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', data.message || 'Invalid OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
      console.error(error);
    } finally {
      dispatch({ type: AUTH_TYPES.SET_LOADING, payload: false });
    }
  };

  const logout = async (navigation) => {

    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      dispatch({ type: AUTH_TYPES.RESET_AUTH });
      navigation.navigate('AppChoice');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
      console.error(error);
    }
  }


  return (
    <AuthContext.Provider value={{
      state,
      dispatch,
      handleSendOtp,
      handleVerifyOtp,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook for using Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};