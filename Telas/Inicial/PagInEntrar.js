// Login.js

import React, { useState} from 'react';
import { View, TextInput, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, ImageBackground } from 'react-native';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from "firebase/auth";

import { getUserDataById } from '../Firebase/firebaseServiço'; // Importe a função getUserDataById do firebaseService

const Login = ({ setLoading, setUser, setUserData, navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingState, setLoadingState] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    setLoadingState(true);
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Verifica se o email do usuário está verificado
      if (!user.emailVerified) {
        Alert.alert(
          'Email não verificado',
          'Seu email ainda não foi verificado. Por favor, verifique seu email para continuar.',
          [
            {
              text: 'Cancelar',
              onPress: () => {
                setLoadingState(false);
                setLoading(false);
              },
              style: 'cancel',
            },
            {
              text: 'Mandar Link',
              onPress: async () => {
                try {
                  await sendEmailVerification(auth.currentUser);
                  Alert.alert('Link enviado', `Um email de verificação foi enviado para ${user.email}`);
                } catch (error) {
                  console.error(error);
                  Alert.alert('Erro', 'Erro ao enviar o link de verificação. Por favor, tente novamente mais tarde.');
                }
                setLoadingState(false);
                setLoading(false);
              },
            },
            {
              text: 'Próximo',
              onPress: () => {
                setLoadingState(false);
                setLoading(false);
              },
            },
          ],
          { cancelable: false }
        );
        return;
      }
  
      setUser(user);
      
      // Busca e define os dados do usuário no estado global
      const userData = await getUserDataById(user.uid);
      setUserData(userData);
  
      setLoadingState(false);
      // Exibe mensagem de boas-vindas após o login bem-sucedido
      Alert.alert('Bem-vindo!', `Olá ${userData.name}`);
  
      // Navega para a tela Pet
      navigation.navigate('Pet');
    } catch (error) {
      setLoadingState(false);
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Usuário não encontrado', 'Email não registrado.');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Senha incorreta', 'A senha informada está incorreta.');
      } else if (error.code === 'auth/invalid-email' || error.code === 'auth/invalid-login-credentials') {
        Alert.alert('Email ou senha inválido', 'Por favor, insira um email válido. Se esqueceu a senha, utilize a opção "Esqueci a Senha".');
      } else if (error.code === 'auth/missing-email') {
        Alert.alert('Email vazio', 'Por favor, insira um email.');
      } else {
        console.error(error);
        Alert.alert('Erro', 'Erro ao realizar login. Por favor, tente novamente mais tarde.');
      }
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const auth = getAuth();
    try {
      if (email) {
        await sendPasswordResetEmail(auth, email);
        Alert.alert('Email de redefinição de senha enviado', 'Verifique sua caixa de entrada para redefinir sua senha.');
      } else {
        Alert.alert('Email inválido', 'Por favor, insira um email válido.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ImageBackground style={styles.background} source={require('../assets/cenario.png')}>
      <View style={styles.menu}>
        <Text style={styles.menuText}>Entrando na Conta</Text>
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoria}>Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
        />
        <Text style={styles.categoria}>Senha:</Text>
        <TextInput
          style={styles.input}
          placeholder="Senha"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />
        <TouchableOpacity style={styles.atalhoInput} onPress={handleForgotPassword} disabled={loadingState}>
          <Text style={styles.atalho}>Esqueci a Senha</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.containerIcon}>
        <TouchableOpacity style={styles.btnSubmit} onPress={handleSignIn}>
          <Text style={styles.submitText}>Entrar</Text>
        </TouchableOpacity>
        {loadingState && <ActivityIndicator size="small" color="#0000ff" />}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  menu: {
    backgroundColor: '#C6F4E6',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 100,
    paddingHorizontal: 10,
    marginBottom: 40,
  },
  menuText: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  categoryContainer: {
    width: '100%',
    marginBottom: 10,
    alignItems: 'center',
  },
  containerIcon: {
    width: "100%",
    height: 280,
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: 2,
    bottom: -200,
  },
  background: {
    backgroundSize: 'cover',
    alignItems: 'center',
    paddingTop: 50,
  },
  categoria: {
    width: 280,
    textAlign: 'left',
    color: '#000000',
    fontSize: 20,
  },
  input: {
    height: 40,
    borderRadius: 80,
    width: '80%',
    backgroundColor: 'white',
    color: 'black',
    borderWidth: 2,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  btnSubmit: {
    backgroundColor: '#C6F4E6',
    width: 300,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginTop: 35,
    borderColor: '#000000',
    borderRadius: 100,
    marginBottom: 10,
  },
  submitText: {
    color: '#000000',
    fontSize: 20,
  },
  atalhoInput: {
    marginTop: 30,
  },
  atalho: {
    color: 'orange',
    fontSize: 18,
    textDecorationLine: 'underline',
    fontWeight: '700',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default Login;
