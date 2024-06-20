import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { deleteDoc, doc } from 'firebase/firestore'; // Importa funções para deletar documentos no Firestore

import { auth, db } from '../Firebase/firebaseConfig'; // Importa a configuração do Firebase

export default function EmailVerification({ navigation }) {
  // Função para verificar se o e-mail foi verificado e navegar para a tela principal
  const handleNext = async () => {
    const user = auth.currentUser; // Obtém o usuário autenticado
    await user.reload(); // Recarrega os dados do usuário para garantir que estejam atualizados

    if (user.emailVerified) { // Verifica se o e-mail foi verificado
      navigation.navigate('Principal'); // Navega para a tela principal
    } else {
      Alert.alert('Erro', 'Por favor, verifique seu e-mail antes de continuar.'); // Alerta caso o e-mail não tenha sido verificado
    }
  };

  // Função para cancelar a criação da conta e deletar os dados do usuário
  const handleCancel = async () => {
    const user = auth.currentUser; // Obtém o usuário autenticado

    await deleteDoc(doc(db, 'psicologos', user.uid)); // Deleta o documento do psicólogo no Firestore
    await user.delete(); // Deleta a conta de usuário

    Alert.alert('Conta não finalizada', 'Sua conta foi removida.'); // Alerta informando que a conta foi removida
    navigation.navigate('Registrar'); // Navega para a tela de registro
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Verifique seu e-mail para continuar.</Text>
      <Button title="Próximo" onPress={handleNext} />
      <Button title="Cancelar" onPress={handleCancel} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0', 
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center', 
  },
});
