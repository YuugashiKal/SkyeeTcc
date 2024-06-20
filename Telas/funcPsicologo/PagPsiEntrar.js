// screens/PagEntrar.js

import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from 'firebase/auth';

import { db, auth } from '../Firebase/firebaseConfig';  // Importe a configuração do Firebase

export default function LoginScreen({ navigation }) {
  const [identifier, setIdentifier] = useState(''); // Estado para armazenar o identificador (e-mail ou CPF)
  const [password, setPassword] = useState(''); // Estado para armazenar a senha
  const [resendVerification, setResendVerification] = useState(false); // Estado para controle de reenvio de verificação
  const [currentUser, setCurrentUser] = useState(null); // Estado para armazenar o usuário atual

    // Hook de efeito para monitorar mudanças de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      if (user && !user.emailVerified) {
        setResendVerification(true);
      } else {
        setResendVerification(false);
      }
    });
    return () => unsubscribe();
  }, []);
  // Função para lidar com o login
  const handleLogin = async () => {
    try {
      let email = identifier;
      let psicologoData = null;

      // Se o identificador não for um email, assume-se que é um CPF
      if (!identifier.includes('@')) {
        const q = query(collection(db, 'psicologos'), where('cpf', '==', identifier));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          Alert.alert('Erro', 'CPF não encontrado!');
          return;
        }

        const userData = querySnapshot.docs[0].data();
        email = userData.email;
        psicologoData = userData;
      }

      // Autentica com email e senha
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Verifica se o e-mail foi verificado
      if (!user.emailVerified) {
        setResendVerification(true);
        Alert.alert('Erro', 'Por favor, verifique seu e-mail para continuar.');
        return;
      }

      if (!psicologoData) {
        // Se os dados do psicólogo ainda não foram obtidos, busque-os agora
        const docRef = query(collection(db, 'psicologos'), where('email', '==', email));
        const docSnapshot = await getDocs(docRef);

        if (!docSnapshot.empty) {
          psicologoData = docSnapshot.docs[0].data();
        }
      }

      Alert.alert('Login realizado com sucesso!');
      navigation.navigate('Perfil', { psicologo: psicologoData });  // Navegar para a tela de perfil com os dados do psicólogo
    } catch (error) {
      Alert.alert('Erro ao entrar', error.message);
    }
  };
// Função para reenviar o e-mail de verificação
  const handleResendVerification = async () => {
    try {
      if (currentUser) {
        await sendEmailVerification(currentUser);
        Alert.alert('E-mail de verificação reenviado!');
      } else {
        Alert.alert('Erro', 'Nenhum usuário logado encontrado.');
      }
    } catch (error) {
      Alert.alert('Erro ao reenviar e-mail de verificação', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={identifier}
        onChangeText={setIdentifier}
        placeholder="Email ou CPF"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button title="Entrar" onPress={handleLogin} color="#3498db" />
      {resendVerification && (
        <View style={styles.verificationContainer}>
          <Text>Por favor, verifique seu e-mail para continuar.</Text>
          <Button title="Reenviar e-mail de verificação" onPress={handleResendVerification} color="#e74c3c" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  verificationContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
});
