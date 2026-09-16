import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AUTH_TYPES, useAuth } from './AuthContext';

const dummySumridhiToken = `170385b8-4d65-4bd3-8018-64b6bd942c7f`;
const dummyPriteshToken = `7oWfBCV=zbzeQNgaXGerYwwf3gQ!dInGG3LEES2s2wKnawONwKevUCC-m2DR!YE4J9IXGx9FQrHwfp12KNloHaU0UqrjvxCvrjq5vmbjokL71qEGj9kqqCC/2=NZKqBFp5-ESP49Wjgnp2vfmupwgw2DOzdYq6cC=yrCQi5yO3rg-vCgIf?EW=iunXPT6vh3i92xK5cLc/1fYReVkTpdmyENfwALZVg8PbOLFCF8Oq4gg19dShXj00GUfiZWxeW1`;

const AppChoiceScreen: React.FC = () => {
  const navigation = useNavigation();
  const { dispatch } = useAuth();

  const chooseApp = (name: string) => {
    dispatch({ type: AUTH_TYPES.SET_APP_NAME, payload: name });
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Button title="Grower" onPress={() => chooseApp('Grower')} />
        <Text />
      <Button title="Samriddhi" onPress={() => chooseApp('Sumridhi')} />
    </View>
  );
};

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center' } });

export default AppChoiceScreen;