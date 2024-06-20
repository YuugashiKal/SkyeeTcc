import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, TouchableOpacity, StyleSheet, View, Dimensions, Alert, Keyboard, ScrollView, TextInput, Text } from 'react-native';
import { RichEditor } from 'react-native-pell-rich-editor';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Obter as dimensões da tela
const { height } = Dimensions.get('window');

export default function PageViewScreen({ route, navigation }) {
  const { id } = route.params; // Obter o ID da rota
  const [page, setPage] = useState(null); // Estado para armazenar a página atual
  const editorRef = useRef(null); // Referência para o RichEditor
  const [isKeyboardVisible, setKeyboardVisible] = useState(false); // Estado para rastrear a visibilidade do teclado
  const editorHeight = isKeyboardVisible ? 470 : height * 0.6; // Ajustar a altura do editor com base na visibilidade do teclado

  useEffect(() => {
    // Listeners para o teclado
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    loadPage(id); // Carrega a página atual ao iniciar

    return () => {
      // Remove os listeners do teclado ao desmontar o componente
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const loadPage = async (id) => {
    // Função para carregar uma página específica pelo ID
    try {
      const data = await AsyncStorage.getItem(id);
      const parsedData = JSON.parse(data);
      setPage(parsedData); // Define a página carregada no estado
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar a página.");
    }
  };

  const navigateToNextPage = async () => {
    // Carrega a próxima página e navega para ela
    try {
      const keys = await AsyncStorage.getAllKeys();
      const index = keys.findIndex((key) => key === id);
      const nextPageId = keys[index + 1];
      if (nextPageId) {
        navigation.replace('Pagina de Visualização', { id: nextPageId });
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar a próxima página.");
    }
  };

  const navigateToPreviousPage = async () => {
    // Carrega a página anterior e navega para ela
    try {
      const keys = await AsyncStorage.getAllKeys();
      const index = keys.findIndex((key) => key === id);
      const previousPageId = keys[index - 1];
      if (previousPageId) {
        navigation.replace('Pagina de Visualização', { id: previousPageId });
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar a página anterior.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {page && (
        <>
          <Text style={styles.creationDate}>{page.creationDate}</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="Digite o título aqui..."
            value={page.title}
            editable={false} // Torna o título não editável
          />
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
            <View style={styles.editorWrapper}>
              <RichEditor
                ref={editorRef}
                style={styles.richEditor}
                placeholder="Comece a escrever aqui..."
                initialContentHTML={page.content}
                disabled={true} // Desativa o editor
                editorStyle={{
                  contentCSSText: 'pointer-events: none;', // Impede a interação
                }}
              />
            </View>
          </ScrollView>
          <View style={styles.navigationButtons}>
            <TouchableOpacity onPress={navigateToPreviousPage}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToNextPage}>
              <Ionicons name="arrow-forward" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('Pagina de Edição', { id })}>
            <Ionicons name="create" size={24} color="white" />
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  editorWrapper: {
    flex: 1,
  },
  editorContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  richEditor: {
    minHeight: 100,
    borderWidth: 0,
    borderColor: '#000',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  creationDate: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 5,
  },
  titleInput: {
    fontSize: 18,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    margin: 10,
  },
  navigationButtons: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
  },
  editButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'blue',
    borderRadius: 25,
    padding: 10,
  },
});
