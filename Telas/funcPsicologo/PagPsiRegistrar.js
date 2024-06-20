import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';

import { db, auth } from '../Firebase/firebaseConfig';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    endereco: '',
    cpf: '',
    crp: '',
    especialidade: '',
    genero: '',
    data_nascimento: '',
    biografia: '',
    profileImage: null
  });

  const handleInputChange = (name, value) => {
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSelectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setForm({
        ...form,
        profileImage: result.assets[0].uri
      });
    }
  };

  const isFormValid = () => {
    const { nome, email, senha, telefone, endereco, cpf, crp, especialidade, genero, data_nascimento, biografia } = form;

    if (!nome || nome.length > 50) return { valid: false, message: 'Nome inválido ou muito longo!' };
    if (!email || !email.includes('@')) return { valid: false, message: 'Email inválido!' };
    if (!senha || senha.length < 6 || senha.length > 20) return { valid: false, message: 'Senha deve ter entre 6 e 20 caracteres!' };
    if (!telefone || telefone.length < 10) return { valid: false, message: 'Telefone inválido!' };
    if (!endereco || endereco.length > 100) return { valid: false, message: 'Endereço muito longo!' };
    if (!cpf || cpf.length !== 11) return { valid: false, message: 'CPF deve ter 11 dígitos!' };
    if (!crp || crp.length > 15) return { valid: false, message: 'CRP inválido ou muito longo!' };
    if (!especialidade || especialidade.length > 50) return { valid: false, message: 'Especialidade muito longa!' };
    if (!genero) return { valid: false, message: 'Gênero inválido!' };
    if (!data_nascimento || !/^\d{4}-\d{2}-\d{2}$/.test(data_nascimento)) return { valid: false, message: 'Data de nascimento inválida! Use o formato AAAA-MM-DD.' };
    if (biografia.length > 200) return { valid: false, message: 'Biografia muito longa!' };

    return { valid: true };
  };

  const handleRegister = async () => {
    try {
      const { email, senha, cpf, data_nascimento, ...otherFormFields } = form;

      const validation = isFormValid();
      if (!validation.valid) {
        Alert.alert('Erro', validation.message);
        return;
      }

      // Verifica se o CPF já está em uso
      const q = query(collection(db, 'psicologos'), where('cpf', '==', cpf));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        Alert.alert('Erro', 'CPF já está em uso!');
        return;
      }

      // Cria o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // Envia o e-mail de verificação
      await sendEmailVerification(user);

      // Salva os dados do psicólogo no Firestore usando o UID do usuário
      await setDoc(doc(db, 'psicologos', user.uid), {
        ...otherFormFields,
        cpf,
        data_nascimento: new Date(data_nascimento), // Armazena a data de nascimento como tipo Date
        userId: user.uid,
        email: user.email
      });

      Alert.alert('Cadastro realizado com sucesso! Por favor, verifique seu e-mail.');
      navigation.navigate('EmailVerification');  // Redireciona para a tela de verificação de e-mail
    } catch (error) {
      Alert.alert('Erro ao cadastrar', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={handleSelectImage}>
        {form.profileImage ? (
          <Image source={{ uri: form.profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Text>Selecionar Imagem</Text>
          </View>
        )}
      </TouchableOpacity>
      <TextInput
        placeholder="Nome"
        value={form.nome}
        onChangeText={value => handleInputChange('nome', value)}
        style={styles.input}
        maxLength={50}  // Limite de caracteres
      />
      <TextInput
        placeholder="CRP"
        value={form.crp}
        onChangeText={value => handleInputChange('crp', value)}
        style={styles.input}
        maxLength={15}  // Limite de caracteres
      />
      <TextInput
        placeholder="CPF"
        value={form.cpf}
        onChangeText={value => handleInputChange('cpf', value)}
        style={styles.input}
        maxLength={11}  // Limite de caracteres para CPF
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Email"
        value={form.email}
        onChangeText={value => handleInputChange('email', value)}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Senha"
        value={form.senha}
        onChangeText={value => handleInputChange('senha', value)}
        style={styles.input}
        secureTextEntry
        maxLength={20}  // Limite de caracteres
      />
      <TextInput
        placeholder="Telefone"
        value={form.telefone}
        onChangeText={value => handleInputChange('telefone', value)}
        style={styles.input}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Endereço"
        value={form.endereco}
        onChangeText={value => handleInputChange('endereco', value)}
        style={styles.input}
        maxLength={100}  // Limite de caracteres
      />
      <TextInput
        placeholder="Especialidade"
        value={form.especialidade}
        onChangeText={value => handleInputChange('especialidade', value)}
        style={styles.input}
        maxLength={50}  // Limite de caracteres
      />
      <Picker
        selectedValue={form.genero}
        style={styles.input}
        onValueChange={value => handleInputChange('genero', value)}
      >
        <Picker.Item label="Masculino" value="masculino" />
        <Picker.Item label="Feminino" value="feminino" />
        <Picker.Item label="Indefinido" value="indefinido" />
      </Picker>
      <TextInput
        placeholder="Data de Nascimento (AAAA-MM-DD)"
        value={form.data_nascimento}
        onChangeText={value => handleInputChange('data_nascimento', value)}
        style={styles.input}
      />
      <TextInput
        placeholder="Biografia"
        value={form.biografia}
        onChangeText={value => handleInputChange('biografia', value)}
        style={styles.input}
        maxLength={200}  // Limite de caracteres
      />
      <Button title="Cadastrar" onPress={handleRegister} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#fff'
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  }
});
