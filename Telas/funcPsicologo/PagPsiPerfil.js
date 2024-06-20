import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, TouchableOpacity, StyleSheet, Image, TextInput, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Importa o ImagePicker para selecionar imagens da galeria
import { updateDoc, doc, deleteDoc } from 'firebase/firestore'; // Importa funções para atualizar e deletar documentos no Firestore

import { db, auth } from '../Firebase/firebaseConfig'; // Importa a configuração do Firebase

// Função para formatar a data no formato YYYY-MM-DD
const formatDate = (date) => {
  if (!(date instanceof Date)) return date; // Verifica se a data já está em formato string
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

export default function ProfileScreen({ route, navigation }) {
  const { psicologo } = route.params; // Obtém os dados do psicólogo passado como parâmetro na navegação

  // Estado para armazenar os dados do formulário
  const [form, setForm] = useState({
    nome: psicologo.nome,
    email: psicologo.email,
    telefone: psicologo.telefone,
    endereco: psicologo.endereco,
    crp: psicologo.crp,
    especialidade: psicologo.especialidade,
    genero: psicologo.genero,
    data_nascimento: formatDate(psicologo.data_nascimento.toDate()), // Converte a data para string
    biografia: psicologo.biografia,
    profileImage: psicologo.profileImage
  });

  // Solicita permissão para acessar a galeria de imagens quando o componente é montado
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Você precisa permitir o acesso à galeria de imagens para selecionar uma foto de perfil.');
      }
    })();
  }, []);

  // Função para selecionar uma imagem da galeria
  const handleSelectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setForm({
        ...form,
        profileImage: result.uri // Atualiza a imagem de perfil no estado do formulário
      });
    }
  };

  // Função para salvar as alterações no Firestore
  const handleSaveChanges = async () => {
    try {
      const user = auth.currentUser; // Obtém o usuário autenticado

      await updateDoc(doc(db, 'psicologos', user.uid), {
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        endereco: form.endereco,
        crp: form.crp,
        especialidade: form.especialidade,
        genero: form.genero,
        data_nascimento: new Date(form.data_nascimento), // Converte a string de volta para data
        biografia: form.biografia,
        profileImage: form.profileImage
      });

      Alert.alert('Alterações salvas com sucesso!');
    } catch (error) {
      Alert.alert('Erro ao salvar alterações', error.message);
    }
  };

  // Função para excluir a conta do psicólogo
  const handleDeleteAccount = async () => {
    try {
      const user = auth.currentUser; // Obtém o usuário autenticado

      await deleteDoc(doc(db, 'psicologos', user.uid)); // Deleta o documento do psicólogo no Firestore
      await user.delete(); // Deleta a conta de usuário

      Alert.alert('Conta excluída com sucesso!');
      navigation.navigate('Principal'); // Redireciona para a tela principal após a exclusão
    } catch (error) {
      Alert.alert('Erro ao excluir conta', error.message);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Perfil</Text>
        <TouchableOpacity onPress={handleSelectImage}>
          {form.profileImage ? (
            <Image source={{ uri: form.profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text>Selecionar Imagem</Text>
            </View>
          )}
        </TouchableOpacity>
        {Object.keys(form).map(key => (
          key !== 'profileImage' && (
            <TextInput
              key={key}
              style={styles.input}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              value={form[key]}
              onChangeText={value => setForm({ ...form, [key]: value })}
              keyboardType={key === 'data_nascimento' ? 'numeric' : 'default'}
            />
          )
        ))}
        <Button title="Salvar Alterações" onPress={handleSaveChanges} />
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteButtonText}>Excluir Conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
    width: '100%'
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 4,
    marginTop: 16,
    width: '100%',
    alignItems: 'center'
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
});
