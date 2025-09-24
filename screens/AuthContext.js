import React, { createContext, useReducer, useContext } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';

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
  language: 'en'
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
    return cleanNumber.startsWith('84') ? cleanNumber : `84${cleanNumber}`;
  };

  const handleSendOtp = async () => {
    try {
      dispatch({ type: AUTH_TYPES.SET_LOADING, payload: true });
      const formattedPhone = formatPhoneNumber(state.phoneNumber);
      
      if (formattedPhone.length < 12) {
        Alert.alert('Invalid Phone', 'Please enter a valid phone number.');
        return;
      }

      const response = await fetch(`${BASE_URL}/sendOtp/${formattedPhone}`, {
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
    try {
      dispatch({ type: AUTH_TYPES.SET_LOADING, payload: true });
      const formattedPhone = formatPhoneNumber(state.phoneNumber);

      const response = await fetch(`${BASE_URL}/verifyOtp/${formattedPhone}?isForgotMpin=false`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
          identifier: state.otp,
          verificationId: state.verificationId
        })
      });

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

  return (
    <AuthContext.Provider value={{
      state,
      dispatch,
      handleSendOtp,
      handleVerifyOtp
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