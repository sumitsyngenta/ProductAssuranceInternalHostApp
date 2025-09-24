import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from './AuthContext';
import { AUTH_TYPES } from './AuthContext';
const countryOptions = [
    { label: 'India', value: 'IN', prefix: '+91' },
    { label: 'Vietnam', value: 'VN', prefix: '+84' }
];

const languageOptions = [
    { label: 'English', value: 'en' },
    { label: 'Vietnamese', value: 'vn' }
];
const LoginScreen = ({ navigation }) => {
  const { state, dispatch, handleSendOtp, handleVerifyOtp } = useAuth();

  const getPrefix = () => {
    const country = countryOptions.find(c => c.value === state.countryCode);
    return country ? country.prefix : '+84';
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    ><Text style={styles.title}>Login with Phone</Text>
      
      {/* Country and Language Selectors */}
      <View style={styles.selectorsContainer}><View style={styles.selectorWrapper}><Text style={styles.label}>Country</Text><View style={styles.pickerContainer}><Picker
              selectedValue={state.countryCode}
              style={styles.picker}
              onValueChange={(value) => 
                dispatch({ type: AUTH_TYPES.SET_COUNTRY_CODE, payload: value })
              }
            >
              {countryOptions.map((country) => (
                <Picker.Item 
                  key={country.value} 
                  label={country.label} 
                  value={country.value} 
                />
              ))}
            </Picker></View></View><View style={styles.selectorWrapper}><Text style={styles.label}>Language</Text><View style={styles.pickerContainer}><Picker
              selectedValue={state.language}
              style={styles.picker}
              onValueChange={(value) => 
                dispatch({ type: AUTH_TYPES.SET_LANGUAGE, payload: value })
              }
            >
              {languageOptions.map((lang) => (
                <Picker.Item 
                  key={lang.value} 
                  label={lang.label} 
                  value={lang.value} 
                />
              ))}
            </Picker></View></View></View>

      {!state.isOtpSent ? (
        <View><Text style={styles.label}>Enter Phone Number</Text><View style={styles.phoneContainer}><Text style={styles.prefix}>{getPrefix()}</Text><TextInput
              style={styles.phoneInput}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={state.phoneNumber}
              onChangeText={(text) => dispatch({ type: AUTH_TYPES.SET_PHONE, payload: text })}
              maxLength={11}
              editable={!state.loading}
            /></View><Button
            title={state.loading ? "Sending..." : "Send OTP"}
            onPress={handleSendOtp}
            disabled={state.loading}
          /></View>
      ) : (
        <View><TextInput
            style={styles.input}
            placeholder="Enter OTP"
            keyboardType="number-pad"
            value={state.otp}
            onChangeText={(text) => dispatch({ type: AUTH_TYPES.SET_OTP, payload: text })}
            maxLength={6}
            editable={!state.loading}
          /><Button
            title={state.loading ? "Verifying..." : "Verify OTP"}
            onPress={() => handleVerifyOtp(navigation)}
            disabled={state.loading}
          /></View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333'
  },
  selectorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  selectorWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    width: '100%',
    color: '#333'
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333'
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  prefix: {
    fontSize: 16,
    marginRight: 10,
    color: '#555'
  },
  phoneInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    color: '#333'
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    color: '#333'
  },
});

export default LoginScreen;