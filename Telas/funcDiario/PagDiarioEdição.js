import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, TouchableOpacity, StyleSheet, View, Dimensions, Alert, Keyboard, KeyboardAvoidingView, Platform, findNodeHandle, TextInput, Text } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { WebView } from 'react-native-webview';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ColorPicker from './FunçõesEdição/BarraCores';
import FontSizeAdjustmentBar from './FunçõesEdição/AjustarFonte';
 

const { height } = Dimensions.get('window');

export default function App({route}) {
  const editorRef = useRef(null);
  const editorRef1 = useRef();

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const editorHeight = isKeyboardVisible ? 470 : height * 0.6;
  const [isTextColorPickerVisible, setTextColorPickerVisible] = useState(false);
  const [isBackgroundColorPickerVisible, setBackgroundColorPickerVisible] = useState(false);
  const [selectedFontSize, setSelectedFontSize] = useState(3); // Valor padrão 3, que corresponde a ~12px
  const [showFontSizeAdjustment, setShowFontSizeAdjustment] = useState(false);
  const [content, setContent] = useState(''); // Estado para o conteúdo do editor
  const [title, setTitle] = useState(''); // Estado para o título do texto
  const [creationDate, setCreationDate] = useState(''); // Estado para a data de criação do texto

  useEffect(() => {
    
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    loadContent(); // Carrega o conteúdo ao iniciar

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);


  //Salvar o texto
  const saveContent = async () => {
    if (!title.trim()) {
      // Verifica se o título está vazio
      Alert.alert("Erro", "Por favor, insira um título para o texto.");
      return;
    }
    try {
      const id = route.params?.id || new Date().getTime().toString(); // Gera um ID único ou usa o ID passado pela rota
      const date = route.params?.creationDate || new Date().toLocaleString(); // Usa a data passada pela rota ou gera uma nova
      const data = { id, title, content, creationDate: date }; // Cria um objeto com os dados do texto
      await AsyncStorage.setItem(id, JSON.stringify(data)); // Salva os dados no AsyncStorage
      Alert.alert("Sucesso", "O conteúdo foi salvo."); // Exibe um alerta de sucesso
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar o conteúdo."); // Exibe um alerta de erro
    }
  };

  //Carregar o texto
  const loadContent = async () => {
    try {
      const id = route.params?.id; // Obtém o ID passado pela rota
      if (id) {
        const data = await AsyncStorage.getItem(id); // Obtém os dados do texto pelo ID
        if (data) {
          const parsedData = JSON.parse(data); // Converte os dados para JSON
          setTitle(parsedData.title); // Define o título
          setContent(parsedData.content); // Define o conteúdo
          setCreationDate(parsedData.creationDate); // Define a data de criação
        }
      } else {
        setCreationDate(new Date().toLocaleString()); // Define a data de criação como a data atual
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar o conteúdo."); // Exibe um alerta de erro
    }
  };



  // Função para converter uma imagem para base64
const convertToBase64 = async (uri) => {
  // Lê o arquivo da URI fornecida e o codifica em base64
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  // Retorna a string base64 com o prefixo correto para uma imagem JPEG
  return `data:image/jpeg;base64,${base64}`;
};

// Função para lidar com a inserção de uma imagem
const handleInsertImage = async () => {
  console.log("Botão de inserir imagem clicado");

  // Solicita permissão para acessar a biblioteca de mídia
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  // Verifica se a permissão foi concedida
  if (!permissionResult.granted) {
    Alert.alert("Permissão necessária", "Precisamos da permissão para acessar suas fotos.");
    return;
  }

  // Abre o seletor de imagens
  const pickerResult = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images, // Permite apenas imagens
    quality: 1, // Define a qualidade da imagem selecionada
  });

  // Verifica se o usuário não cancelou a seleção de imagem
  if (!pickerResult.cancelled) {
    // Converte a URI da imagem selecionada para base64
    const base64Image = await convertToBase64(pickerResult.assets[0].uri);
    console.log("Imagem selecionada:", base64Image);

    // Insere a imagem no editor de texto
    editorRef.current?.insertImage(base64Image);
  }
};

  

  // Função para alterar a cor do texto
const handleTextColorChange = (color) => {
  // Usa o comando execCommand para alterar a cor do texto no editor
  editorRef.current?.commandDOM(`document.execCommand('foreColor', false, '${color}')`);
  // Fecha o seletor de cores do texto
  setTextColorPickerVisible(false);
};

// Função para alterar a cor de fundo do texto
const handleBackgroundColorChange = (color) => {
  // Usa o comando execCommand para alterar a cor de fundo do texto no editor
  editorRef.current?.commandDOM(`document.execCommand('hiliteColor', false, '${color}')`);
  // Fecha o seletor de cores de fundo
  setBackgroundColorPickerVisible(false);
};

// Função para alterar o tamanho da fonte
const handleFontSizeChange = (size) => {
  // Atualiza o estado com o tamanho da fonte selecionado
  setSelectedFontSize(size);
  // Usa o comando execCommand para alterar o tamanho da fonte no editor
  editorRef.current?.commandDOM(`document.execCommand('fontSize', false, '${size}')`);
};

// Função para exibir o ajuste de tamanho da fonte
const handleFont = () => {
  // Define o estado para mostrar o ajuste de tamanho da fonte
  setShowFontSizeAdjustment(true);
};

// Função para fechar o ajuste de tamanho da fonte
const handleCloseFontSizeAdjustment = () => {
  // Define o estado para esconder o ajuste de tamanho da fonte
  setShowFontSizeAdjustment(false);
};



  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.creationDate}>{creationDate}</Text>
      <TextInput
        style={styles.titleInput}
        placeholder="Digite o título aqui..."
        value={title}
        onChangeText={setTitle}
      />
      <View style={styles.editorContainer}>
      <RichEditor
        ref={editorRef}
        style={[styles.richEditor, { height: editorHeight }]}
        placeholder="Comece a escrever aqui..."
        useContainer={false}
        onChange={setContent}
        initialContentHTML={content}
      />
        <View style={styles.toolbarContainer}>
          <RichToolbar
            editor={editorRef}
            actions={[
              actions.insertImage, // Permite inserir uma imagem no editor.
              actions.setBold, // Permite definir o texto como negrito.
              actions.setItalic, // Permite definir o texto como itálico.
              actions.setUnderline, // Permite definir o texto sublinhado.
              actions.setStrikethrough, // Permite definir o texto com tachado (riscado).
              actions.setBackgroundColor, // Permite definir a cor de fundo do texto.
              actions.setTextColor, // Permite definir a cor do texto.
              actions.fontSize, // Permite definir o tamanho da fonte.
              
              actions.alignLeft, // Alinha o texto à esquerda.
              actions.alignCenter, // Alinha o texto ao centro.
              actions.alignRight, // Alinha o texto à direita.
              actions.alignFull, // Alinha o texto justificado.
              actions.insertBulletsList, // Insere uma lista com marcadores.
              actions.insertOrderedList, // Insere uma lista ordenada.
              actions.checkboxList, // Insere uma lista de verificação.
              actions.undo, // Desfaz a última ação realizada no editor.
              actions.redo, // Refaz a última ação desfeita no editor.
              actions.heading1, // Permite definir o texto como cabeçalho de nível 1.
              actions.heading2, // Permite definir o texto como cabeçalho de nível 2.
              actions.insertLink,
              
              actions.blockquote, // Permite criar um bloco de citação no texto.
              actions.setSubscript, // Permite definir o texto como subscrito.
              
  
            ]} //Aqui adiciona os Icones e alguns faz que chame a função como Imagem, Fonte, Cor
            iconMap={{
              [actions.insertImage]: ({ tintColor }) => (
                <Icon name="image" color={tintColor} size={24} onPress={handleInsertImage} />
              ),
              [actions.setBold]: ({ tintColor }) => <Icon name="format-bold" color={tintColor} size={24} />,
              [actions.setItalic]: ({ tintColor }) => <Icon name="format-italic" color={tintColor} size={24} />,
              [actions.setUnderline]: ({ tintColor }) => <Icon name="format-underline" color={tintColor} size={24} />,
              [actions.setSubscript]: ({ tintColor }) => (<Icon name="format-subscript" color={tintColor} size={24} />),
              [actions.setStrikethrough]: ({ tintColor }) => (<Icon name="format-strikethrough" color={tintColor} size={24} />),
              [actions.setBackgroundColor]: ({ tintColor }) => (<Icon name="format-color-highlight" color={tintColor} size={24} onPress={() => setBackgroundColorPickerVisible(true)} />), // Ícone para definir a cor de fundo do texto.
              [actions.setTextColor]: ({ tintColor }) => (<Icon name="format-color-text" color={tintColor} size={24} onPress={() => setTextColorPickerVisible(true)}/>),
              [actions.fontSize]: ({ tintColor }) => (<Icon name="format-size" color={tintColor} size={24} onPress={handleFont}/>),
              [actions.heading1]: ({ tintColor }) => <Icon name="format-header-1" color={tintColor} size={24} />,
              [actions.heading2]: ({ tintColor }) => <Icon name="format-header-2" color={tintColor} size={24} />,
              
              [actions.alignLeft]: ({ tintColor }) => (<Icon name="format-align-left" color={tintColor} size={24} />),
              [actions.alignCenter]: ({ tintColor }) => (<Icon name="format-align-center" color={tintColor} size={24} /> ),
              [actions.alignRight]: ({ tintColor }) => (<Icon name="format-align-right" color={tintColor} size={24} />),
              [actions.alignFull]: ({ tintColor }) => (<Icon name="format-align-justify" color={tintColor} size={24} />),
              [actions.insertBulletsList]: ({ tintColor }) => (<Icon name="format-list-bulleted" color={tintColor} size={24} />),
              [actions.insertOrderedList]: ({ tintColor }) => (<Icon name="format-list-numbered" color={tintColor} size={24} />),
              [actions.checkboxList]: ({ tintColor }) => (<Icon name="checkbox-multiple-marked-outline" color={tintColor} size={24} />),
              [actions.undo]: ({ tintColor }) => (<Icon name="undo" color={tintColor} size={24} />),
              [actions.redo]: ({ tintColor }) => (<Icon name="redo" color={tintColor} size={24} />),
        
              

            }}
          />
          
        </View>
      <ColorPicker
        visible={isTextColorPickerVisible}
        onSelectColor={handleTextColorChange}
        onClose={() => setTextColorPickerVisible(false)}
      />
      <ColorPicker
        visible={isBackgroundColorPickerVisible}
        onSelectColor={handleBackgroundColorChange}
        onClose={() => setBackgroundColorPickerVisible(false)}
      />

{showFontSizeAdjustment && (
        <View style={styles.fontSizeAdjustmentContainer}>
          <FontSizeAdjustmentBar
            currentSize={selectedFontSize}
            onChange={handleFontSizeChange}
            editorRef1={editorRef1}
          />
          <TouchableOpacity style={styles.closeButton} onPress={handleCloseFontSizeAdjustment}>
            <Icon name="close" size={24} />
          </TouchableOpacity>
        </View>
      )}
      </View>
      
      <TouchableOpacity style={styles.saveButton} onPress={saveContent}>
        <Icon name="content-save" color="#fff" size={24} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  editorContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  richEditor: {
    flex: 1,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  toolbarContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    elevation: 2,
  },

  fontSizeAdjustmentContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    marginLeft: 10,
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
  saveButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
