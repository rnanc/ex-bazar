import { useEffect, useState } from "react";
import * as React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import {getDatabase, ref, onValue, set } from 'firebase/database';
import { ScrollView } from "react-native-gesture-handler";
import { Modal, Portal, Provider } from 'react-native-paper';

export function Home(params:any) {
  const { navigate } = useNavigation();
  const [id, setId] = useState('');
  const [products, setProducts] = useState([])
  const [user, setUser] = useState({})
  const db = getDatabase();
  const [visible, setVisible] = useState(false);

  const [nomeProduto, setNomeProduto] = useState()
  const [precoProduto, setPrecoProduto] = useState()
  const [fotoProduto, setFotoProduto] = useState('')

  const showModal = () => setVisible(!visible);

  const getLoggedUser = () => {
    const reference = ref(db, 'users/' + params.route.params.id);
    onValue(reference, (snapshot) => {
      setUser(snapshot.val())
    })
  }

  const getProducts = () => {
    const reference = ref(db, 'products/');
    onValue(reference, (snapshot) => {
    let arrayProducts = []
    arrayProducts = Object.keys(snapshot.val()).map(key => snapshot.val()[key])
    setProducts(arrayProducts)
    })
  }

  const newProduct = () => {
    const reference = ref(db, 'products/' + nomeProduto);
    set(reference,{ nome: nomeProduto, 
                    valor: precoProduto,
                    foto: fotoProduto,
                    vendedorId: user.uid,
                    contato: user.phone,
                    vendido: false })
  }

  const produtoVendido = (product) =>{
    const reference = ref(db, 'products/' + product.nome);
    set(reference,{ nome: product.nome, 
                    valor: product.valor,
                    foto: product.foto,
                    vendedorId: product.vendedorId,
                    contato: product.contato,
                    vendido: true })
  }

  useEffect(() => {
    if (params.route.params.id === null) {
     return navigate('Login')
    }
    setId(params.route.params.id)
    getLoggedUser()
    getProducts()
  },[])

  return ( 
    <Provider> 
      <ScrollView style={styles.container}>

        <TouchableOpacity 
          style={styles.buttonAdd}
          onPress={() => {showModal()}}
          >
          <Text style={styles.texto}>+</Text>
        </TouchableOpacity>

        {products.map(product =>
          <Card style={{width: "90%", margin: 16}}>
            <Card.Title title={product.nome}/>
            <Card.Content>
              <Paragraph>Valor: R$ {product.valor}</Paragraph>
              <Paragraph>Contato do vendedor: {product.contato}</Paragraph>
            </Card.Content>
            {product.foto == "" ?  <Card.Cover source={{ uri: 'data:image/png;base64,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' }} />
            : <Card.Cover source={{ uri: product.foto }} />}
            <Card.Actions>
              {product.vendido == true && <Button>Vendido</Button>}
              {product.vendedorId == id && <Button onPress={() => {produtoVendido(product)}}>Vendido?</Button>}
            </Card.Actions>
          </Card>
        )}

        <TouchableOpacity 
          style={styles.button}
          onPress={() => {navigate('Login')}}
          >
          <Text style={styles.texto}>Sign-Out</Text>
        </TouchableOpacity>

          <Portal>
            <Modal visible={visible} onDismiss={showModal} contentContainerStyle={styles.containerModal}>
            <TextInput 
              style={styles.input}
              placeholder="Nome do Produto"
              value={nomeProduto}
              onChangeText={text => {setNomeProduto(text)}}
            />

            <TextInput 
              style={styles.input}
              placeholder="Preço do Produto"
              value={precoProduto}
              onChangeText={text => {setPrecoProduto(text)}}
            />

            <TextInput 
              style={styles.input}
              placeholder="Link da Foto do Produto"
              value={fotoProduto}
              onChangeText={text => {setFotoProduto(text)}}
            />

            <TouchableOpacity 
              style={styles.button}
              onPress={() => {newProduct(), showModal()}}
              >
              <Text style={styles.texto}>Cadastrar novo produto</Text>
            </TouchableOpacity>
            </Modal>
          </Portal>

      </ScrollView>
      </Provider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    marginTop: 48
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  containerModal: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 8
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
    alignSelf: 'center'
  },
  buttonAdd:{
    width: '10%',
    alignItems: 'center',
    backgroundColor: "#0000FF",
    height: 40,
    justifyContent: 'center',
    margin: 5,
    borderRadius: 50,
    alignSelf: "flex-end"
  },
  texto: {
    color: "#fff",
  }
});