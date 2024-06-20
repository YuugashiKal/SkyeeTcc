import React, {useState, useEffect} from 'react';
import {
  View, 
  Image, 
  TouchableOpacity, 
  Text, 
  StyleSheet,
  ImageBackground
} from 'react-native';

export default function Inicio({navigation}) {

  return (
  <ImageBackground style={styles.cenario} source={require('../assets/cenario.png')}>
  <View style={styles.background}>
    <Text style={styles.nomeApp}>Skyee</Text>
        <View style={styles.containerLogo}>
          <View style={styles.containerLogo2}>
          <View style={styles.containerLogo3}>
            <Image
              source={require('../assets/logoSkyee.png')} //Logo dentro dos circulos
              style={styles.Logo}
            />
          </View>
          </View>
        </View>

    <View style={styles.container}>
    <View style={styles.containerIcon}> 
      <TouchableOpacity style={styles.btnSubmit}  onPress={() => { navigation.navigate('LoginUser') }}>
        <Text style={styles.submitText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnSubmit} onPress={() => { navigation.navigate('Cadastro') }}>
        <Text style={styles.submitText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>

    </View>
  </View>
  </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background:{
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    width: '100%',
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cenario:{
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
     width: '100%',
     height: '100%',
     flex:1,
     alignItems: 'center',
     justifyContent: 'center'
  },
  Logo:{
    flex: 1,
    width: 270,
    height: 270,
  },
  containerLogo: {
    marginTop: 10,
    width: 350,
    height: 350,
    borderRadius: 1000,
    backgroundColor: 'white',
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  containerLogo2: {
    width: 280,
    height: 280,
    borderRadius: 1000,
    backgroundColor: '#FFCD86',
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    zIndex: 1,
  },
  containerLogo3: {
    width: 262,
    height: 262,
    borderRadius: 1000,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    overflow: 'hidden',
  },
  containerIcon: {
    position: "absolute",
    width: "100%",
    height: 422,
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: 2,
    marginTop: 10,
  },
  container:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  btnSubmit:{
    backgroundColor: '#C6F4E6',
    width: 247,
    height: 77,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginTop: 55,
    borderColor: '#000000',
    borderRadius: 100,
  },
  submitText:{
    color: '#000000',
    fontSize: 40,
  },
  nomeApp:{
    color: '#FFF',
    fontSize: 70,
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    marginTop: 20,
    position: 'relative',
  },
  containerLogoCover: {
    position: 'absolute',
    top: -32,
    height: 50,
    width: 195,
    backgroundColor: 'white',
    position: 'relative',
    bottom: 0,
    zIndex: 1,
  },
});