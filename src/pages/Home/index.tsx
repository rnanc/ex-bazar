import React, { useEffect, useState } from "react";
import { Alert, View, StyleSheet, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export function Home(params:any) {
  const { navigate } = useNavigation();

  useEffect(() => {
    if (params === null) {
      navigate('Login')
    }
  },[])
  return (
    <View style={styles.container}>
      <Text>HOME BAZAR ARGO!</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => {navigate('Login')}}
        >
        <Text style={styles.texto}>Sign-Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button:{
    width: '80%',
    alignItems: 'center',
    backgroundColor: "#0000FF",
    height: 40,
    justifyContent: 'center',
    margin: 5,
    borderRadius: 50,
  },
  texto: {
    color: "#fff",
  }
});