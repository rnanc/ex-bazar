import React, { useState } from "react";
import { Alert, View, StyleSheet, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../../services/api";
import {getDatabase, ref, set } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

export function Login(params:any) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [phone, setPhone] = useState('');
  const { navigate } = useNavigation();

  const returnError = (erro: string) => {
    let returnString
    switch (true) {
      case erro.includes("email-already-in-use"):
        returnString = "Email já cadastrado"
        break;
    
      case erro.includes("weak-password"):
        returnString = "Password tem que ter no mínimo 6 caracteres"
        break;
    
      case erro.includes("invalid-email"):
        returnString = "Email inválido"
        break;
      
      case erro.includes("wrong-password") ||erro.includes("user-not-found"):
        returnString = "Email ou senha inválidos"
        break;
        
      default:
        console.log(erro)
        returnString = "Erro na aplicação"
        break;
    }
    return returnString
  }


 async function createUser() {
   await createUserWithEmailAndPassword(auth, email, senha)
   .then((response)=>{
    const db = getDatabase();
    const reference = ref(db, 'users/' + response.user.uid);
    reference.key
    set(reference, {
      nome,
      phone,
      uid: response.user.uid
    });
    console.log(response)
    Alert.alert(`User: ${JSON.stringify(response.user)}`);
   })
   .catch((erro)=>{
    Alert.alert(returnError(erro.message))
   });
 }

 async function loginUser() {
  await signInWithEmailAndPassword(auth, email, senha)
  .then((response)=>{
    navigate('Home', {id: response.user.uid})
  //  Alert.alert(`Usuario logado: ${JSON.stringify(response.user)}`);
  })
  .catch((erro)=>{
    Alert.alert(returnError(erro.message));
  });
}



  return (
    <View style={styles.container}>
      <Text>BAZAR ARGO!</Text>
      <TextInput 
        style={styles.input}
        placeholder="e-mail"
        value={email}
        onChangeText={text => {setEmail(text)}}
      />
      <TextInput 
        style={styles.input}
        placeholder="senha"
        secureTextEntry={true}
        value={senha}
        onChangeText={text => {setSenha(text)}}
      />
       <TextInput 
        style={styles.input}
        placeholder="nome"
        value={nome}
        onChangeText={text => {setNome(text)}}
      /> 
      <TextInput 
        style={styles.input}
        placeholder="phone"
        value={phone}
        onChangeText={text => {setPhone(text)}}
      />
      <TouchableOpacity 
        style={styles.button}
        onPress={ value => {createUser()} }
        >
        <Text style={styles.texto}>Cadastrar</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button}
        onPress={ value => {loginUser()} }
        >
        <Text style={styles.texto}>Logar no sistema</Text>
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
  input: {
    width: '80%',
    height: 40,
    borderColor: "#1010FF",
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
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