import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, PanResponder, FlatList, ActivityIndicator, Keyboard, Animated } from 'react-native';
import axios from "axios";
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ChatBubble from "./PagChatBubble"; // Importa o componente ChatBubble

const Chatbot = ({ maxHeight, setChatOpen }) => {
  const [chat, setChat] = useState([]); // Estado para armazenar o histórico de conversas
  const [userInput, setUserInput] = useState(""); // Estado para armazenar a entrada do usuário
  const [loading, setLoading] = useState(false); // Estado para indicar se a aplicação está carregando
  const [error, setError] = useState(null); // Estado para armazenar erros
  const [expanded, setExpanded] = useState(true); // Inicialmente expandido
  const [keyboardOpen, setKeyboardOpen] = useState(false); // Estado para indicar se o teclado está aberto
 

  const API_KEY = "AIzaSyD8bpG1j4EAgfiuleBipqLhSxKFbPbq7Ts"; // Chave da API do Google

  const scrollViewRef = useRef(null); // Ref para o ScrollView
  const flatListRef = useRef(null); // Ref para o FlatList

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const savedChat = await AsyncStorage.getItem('chatHistory');
        if (savedChat) {
          setChat(JSON.parse(savedChat));
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    };

    loadChatHistory();
  }, []);

  const saveChatHistory = async (newChat) => {
    try {
      await AsyncStorage.setItem('chatHistory', JSON.stringify(newChat));
      setChat(newChat); // Atualiza o estado `chat` após salvar no AsyncStorage
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  };

  const clearChatHistory = async () => {
    try {
      // Limpa o histórico de conversas no AsyncStorage
      await AsyncStorage.removeItem('chatHistory');
      
      // Cria uma mensagem inicial para reiniciar a conversa
      const initialMessage = {
        id: new Date().getTime().toString(), // ID único para a nova mensagem
        role: "model", // Papel do modelo (ou outro papel apropriado)
        parts: [{ text: "Olá 🦊, sou Skyee, a raposa cheia de alegria 😄, positividade 😀 e brincadeiras 😃! Estou aqui para espalhar diversão 🤪🦊 e animação em nossa conversa." }], // Mensagem inicial para o usuário
      };
  
      // Atualiza o estado `chat` com a nova conversa inicial
      setChat([initialMessage]);
      
      // Salva a nova conversa no AsyncStorage
      saveChatHistory([initialMessage]);
      
    } catch (error) {
      console.error('Failed to clear chat history:', error);
    }
  };

  const handleUserInput = async () => {
    if (loading) return; // Evita envio de mensagens durante o carregamento
  
    // Modifica a entrada do usuário para incorporar a persona da raposa
    const modifiedUserInput = `${userInput} .[aja como uma raposa chamada Skyee, amigavel, brincalhona, gentil e engraçada que fala portugues do brasil, quero que a conversa seja natural (Não saia do personagem e use emojes de raposa)]`;
  
    // Adiciona a entrada do usuário modificada ao histórico de conversas
    const newMessage = {
      id: new Date().getTime().toString(), // Unique ID
      role: "user",
      parts: [{ text: userInput }], // Mantém a entrada original do usuário no histórico
    };
  
    const updatedChat = [...chat, newMessage];
    setChat(updatedChat); // Atualiza o estado `chat` imediatamente
    saveChatHistory(updatedChat); // Salva o histórico de conversas atualizado
  
    setLoading(true); // Define o estado de carregamento como verdadeiro
  
    try {
      // Envia a mensagem modificada do usuário para a API
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${API_KEY}`,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: modifiedUserInput }], // Envia a entrada do usuário modificada como conteúdo, incluindo a persona da raposa
            },
            ...updatedChat.map(({ role, parts }) => ({ role, parts })), // Adiciona o histórico de conversas atualizado como parte dos conteúdos
          ],
        }
      );
  
      console.log("Gemini Pro API Response:", response.data); // Registra a resposta da API no console
  
      const modelResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || ""; // Extrai a resposta do modelo da resposta da API, se existir, caso contrário, define como uma string vazia.
  
      if (modelResponse) {
        // Se houver uma resposta do modelo
        // Adiciona a resposta do modelo ao histórico de conversas
        const updatedChatWithModel = [
          ...updatedChat,
          {
            id: new Date().getTime().toString(), // Unique ID
            role: "model",
            parts: [{ text: modelResponse }],
          },
        ];
  
        setChat(updatedChatWithModel); // Define o estado de conversa com a resposta do modelo atualizada
        saveChatHistory(updatedChatWithModel);
        setUserInput(""); // Limpa a entrada do usuário
      }
    } catch (error) {
      // Verifica se o erro é específico para muitas requisições (status 429)
      if (error.response && error.response.status === 429) {
        // Adicionar a lógica para exibir um alerta ao usuário no chat
        setChat([
          ...updatedChat,
          {
            id: new Date().getTime().toString(),
            role: "model",
            parts: [{ text: "Não entendi sua mensagem, poderia repetir?" }],
          },
        ]);
        saveChatHistory([
          ...updatedChat,
          {
            id: new Date().getTime().toString(),
            role: "model",
            parts: [{ text: "Não entendi sua mensagem, poderia repetir?" }],
          },
        ]);
      } else {
        // Outros erros podem ser tratados aqui, sem imprimir no console
        // Por exemplo, você pode salvar esses erros em um registro de erros ou ignorá-los silenciosamente.
      }
    } finally {
      setLoading(false); // Marca o estado de carregamento como falso
  
      // Role para a última mensagem após atualizar o estado do chat
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }
  };
  

  const renderChatItem = ({ item, index }) => (
    <ChatBubble
      key={item.id || index.toString()} // Defina a chave como a 'id' do item ou o índice do item como string
      role={item.role}
      text={item.parts[0].text}
      onSpeech={() => handleSpeech(item.parts[0].text)}
    />
  );

  const pushPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          setExpanded(false); // Movimento para baixo, recolher
        } else {
          setExpanded(true); // Movimento para cima, expandir
        }
      },
    })
  ).current;

  const inputContainerPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: () => false,
    })
  ).current;

  const chatHeight = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true }); // Segue a ultima mensagem enviada
    }
  }, [chat]);

  useEffect(() => {
    Animated.timing(chatHeight, {
      toValue: expanded ? 600 : 160,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [expanded]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setExpanded(false); // Quando o teclado é exibido, o container de mensagem fica reduzido
        setKeyboardOpen(true);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Modal
        isVisible={true}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={500}
        animationOutTiming={500}
        backdropTransitionInTiming={500}
        backdropTransitionOutTiming={500}
        onBackdropPress={() => setChatOpen(false)}
        style={[styles.modal]}
      >
        <View style={[styles.push, { marginLeft: 'auto' }]} {...pushPanResponder.panHandlers}>
          <View style={styles.iconPushContainer}>
            <View style={styles.iconPush} />
            <View style={styles.iconPush} />
            <View style={styles.iconPush} />
          </View>
        </View>

        {/* Área do histórico de mensagens */}
        <Animated.View style={[styles.messageContainer, { height: chatHeight }]}>
          {/* Área dos botões de função */}
          <View style={styles.inputContainerUp} {...inputContainerPanResponder.panHandlers}>
            <TouchableOpacity style={[styles.upLeftButton]} onPress={() => clearChatHistory(false)}>
              <Image style={styles.buttonUp} source={require('../assets/iconConfig.png')} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.upRightButton, { marginLeft: 'auto' }]} onPress={() => setChatOpen(false)}>
              <Image style={styles.buttonUp} source={require('../assets/iconFechar.png')} />
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef} // Ref para o FlatList
            data={chat}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageContent}
            onContentSizeChange={() => scrollViewRef.current && scrollViewRef.current.scrollToEnd({ animated: true })} // Role para a última mensagem ao alterar o conteúdo do FlatList
          />

          {loading && <ActivityIndicator style={styles.loading} color="#333" />}
          {error && <Text style={styles.error}>{error}</Text>}
          {/* Área do campo de entrada de texto */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input} // Estilo da entrada de texto
              placeholder="Digite sua mensagem..." // Texto de espaço reservado
              placeholderTextColor="#aaa" // Cor do texto de espaço reservado
              value={userInput} //Valor da entrada de texto
              onChangeText={setUserInput} // Função de manipulação de texto ao alterar a entrada de texto
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleUserInput}>
              <Image style={styles.buttonImage} source={require('../assets/iconEnviar.png')} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
    transparent: true
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 30,
    width: '95%',
    alignSelf: 'center',
    borderWidth: 2,
    marginBottom: 1,
    bottom: 0,
  },
  messageContent: {
    flexGrow: 1,
  },
  message: {
    padding: 8,
    marginVertical: 4,
    borderRadius: 10,
  },
  messageText: {
    padding: 8,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
    borderWidth: 2,
    Height: 10,
    borderRadius: 100,
    backgroundColor: 'white',
  },
  inputContainerUp: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    height: 20,
    paddingHorizontal: 10,
    marginVertical: 8,
    fontSize: 15,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#ACE2D2',
    borderRadius: 100,
    height: 35,
    width: 35,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  push: {
    marginRight: 300,
    height: 45,
    width: 60,
    backgroundColor: 'white',
    borderRadius: 13,
    alignSelf: 'left',
    borderWidth: 2,
    marginBottom: -15,
    position: 'relative',
  },
  iconPushContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  iconPush: {
    height: 11,
    width: 11,
    backgroundColor: '#FFD395',
    borderWidth: 2,
    borderRadius: 100,
    marginTop: 10,
  },
  upLeftButton: {
    borderRadius: 100,
    height: 25,
    width: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upRightButton: {
    borderRadius: 100,
    height: 25,
    width: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonImage: {
    width: 26,
    height: 25,
    marginLeft: 4,
  },
  buttonUp: {
    maxHeight: 25,
    maxWidth: 25,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  loading: {
    marginRight: 8,
  },
});

export default Chatbot;