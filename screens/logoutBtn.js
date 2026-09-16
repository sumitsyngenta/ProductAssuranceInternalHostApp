import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useAuth } from "./AuthContext";
import { useNavigation } from "@react-navigation/native";

const LogoutBtn = () => {
  const { logout } = useAuth();
  const navigation = useNavigation();
  const shologoutAlert = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => handleLogout() }
      ],
      { cancelable: false }
    );
  };

  const handleLogout = () => {
    logout(navigation);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.btn} onPress={shologoutAlert}>
        {'Logout'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    position: 'absolute',
    top: 40,
    right: 10,
  },
  btn: {
    backgroundColor: '#000',
    color: '#fff',
    height: 40,
    width: 40,
    borderRadius: 20,
    fontSize: 6,
    justifyContent: 'center',
    textAlign: 'center',
    lineHeight: 40,
  },
});

export default LogoutBtn;