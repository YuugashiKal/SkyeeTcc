import React, { useState, useEffect } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions
} from 'react-native';
import Gif from 'react-native-gif';
import Icon from 'react-native-vector-icons/FontAwesome';

import Chatbot from './funcChatbot/PagChatbot';


const { height } = Dimensions.get('window');

const gifList = [
  require('./assets/aniSkyee1.gif'),
  require('./assets/aniSkyee2.gif'),
  require('./assets/aniSkyee3.gif')
];

const gifDurations = [4000, 4000, 2000]; // Durações dos GIFs em milissegundos

const specialGif = require('./assets/aniSkyee3.gif');
const specialStopGif = require('./assets/stopSkyee.gif');

export default function Pet({ navigation }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [currentGifIndex, setCurrentGifIndex] = useState(0);
  const [currentGif, setCurrentGif] = useState(gifList[0]);

  const toggleChat = () => {
    setChatOpen(!chatOpen); //Alterar entre chat aberto ou fechado
  };

  useEffect(() => { //intervalo entre animações do pet
    const interval = setInterval(() => {
      const nextIndex = Math.floor(Math.random() * gifList.length);
      if (nextIndex !== currentGifIndex) {
        setCurrentGifIndex(nextIndex);
        setCurrentGif(gifList[nextIndex]);
      }
    }, gifDurations[currentGifIndex]);

    return () => clearInterval(interval);
  }, [currentGifIndex]);

  const getGifStyle = () => { //coletar estilo para cada gif especifico
    if (currentGif === specialGif || currentGif === specialStopGif) {
      return styles.specialLogo;
    }
    return styles.Logo;
  };

  return (
    <KeyboardAvoidingView style={[styles.background, { height: height }]} behavior="padding">
      <ImageBackground style={styles.cenario} source={require('./assets/cenario.png')}>
        <View style={styles.menu}>
          <Text style={styles.menuText}>Menu</Text>
        </View>
        <View style={styles.topRightButton}>
          <TouchableOpacity onPress={() => navigation.navigate('ConfigUser')}>
            <Icon name="bars" size={30} color="#000" />
          </TouchableOpacity>
        </View>


        {/* Design circular pra animação do Pet */}
        <View style={styles.containerLogo}>
          <View style={styles.containerLogo2}>
            <View style={styles.containerLogo3}>
              <Gif
                source={specialStopGif}
                style={[getGifStyle(), styles.absolute]}
              />
              <Gif
                source={currentGif}
                style={getGifStyle()}
              />
            </View>
          </View>
        </View>

        {/* View para esconder a separação entre containerLogo e containerIcon */}
        <View style={styles.containerLogoCover} />

        {/* estrutura para separar botões para funções do App */}
        <View style={styles.containerIcon}>
          <View style={styles.containerIcon2}>

            <TouchableOpacity style={styles.btnFunction2} onPress={toggleChat}>
              <View style={styles.btnFunction}>
                <Image style={styles.buttonImage} source={require('./assets/iconChat.png')} />
              </View>
              {chatOpen && <Chatbot maxHeight={height - 100} setChatOpen={setChatOpen} />}
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnFunction2} onPress={() => navigation.navigate('Diario')}>
              <View style={styles.btnFunction}>
                <Image style={styles.buttonImage} source={require('./assets/iconDiario.png')} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnFunction2} onPress={() => { navigation.navigate('Principal') }}>
              <View style={styles.btnFunction}>
                <Image style={styles.buttonImage} source={require('./assets/iconProfissional.png')} />
              </View>
            </TouchableOpacity>

          </View>
        </View>

      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  menu: {
    backgroundColor: '#C6F4E6',
    width: 130,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 100,
    marginTop: 50,
  },
  menuText: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cenario: {
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundColor: '#ACE2D2',
    width: '100%',
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  Logo: {
    flex: 0,
    width: 900,
    height: 900,
  },
  specialLogo: {
    flex: 0,
    width: 1000,
    height: 1000,
  },
  absolute: {
    position: 'absolute',
    flex: 0,
    width: 1000,
    height: 1000,
  },
  containerLogo: {
    marginTop: 70,
    width: 450,
    height: 450,
    borderRadius: 1000,
    backgroundColor: 'white',
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  containerLogo2: {
    width: 380,
    height: 380,
    borderRadius: 1000,
    backgroundColor: '#FFCD86',
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  containerLogo3: {
    width: 362,
    height: 362,
    borderRadius: 1000,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  containerIcon: {
    width: "100%",
    height: 180,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -12,
    backgroundColor: 'white',
    position: "relative",
    borderTopWidth: 2,
  },
  containerIcon2: {
    width: 360,
    height: 135,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ACE2D2',
    position: "relative",
    borderRadius: 20,
    borderWidth: 2,
  },
  btnFunction: {
    backgroundColor: '#ACE2D2',
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    margin: 4,
    borderColor: '#000000',
    borderRadius: 20,
  },
  btnFunction2: {
    backgroundColor: 'white',
    width: 105,
    height: 105,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    margin: 4,
    borderColor: '#000000',
    borderRadius: 20,
  },
  buttonImage: {
    width: 70,
    height: 70,
  },
  containerLogoCover: {
    position: 'absolute',
    top: -10,
    height: 5,
    width: 100,
    backgroundColor: 'white',
    position: 'relative',
    bottom: 0,
    zIndex: 1,
  },
    topRightButton: {
      position: 'absolute',
      top: 50,
      right: 20,
      zIndex: 2,
    },  
});
