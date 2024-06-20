import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet, ImageBackground, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

import { createUser, deleteUser, deleteUserDoc } from '../Firebase/firebaseServiço'; //Importe as funções apropriadas do firebaseService
import { auth } from '../Firebase/firebaseConfig';

const Cadastro = ({ navigation }) => {
  // Estados para armazenar os dados do formulário e o estado de carregamento
  const [email, setEmail] = useState(''); // Estado para o email
  const [password, setPassword] = useState(''); // Estado para a senha
  const [name, setName] = useState(''); // Estado para o nome
  const [birthdate, setBirthdate] = useState(''); // Estado para a data de nascimento
  const [loadingState, setLoadingState] = useState(false); // Estado para controlar o estado de carregamento

    // Função para lidar com o cadastro de um novo usuário
  const handleSignUp = async () => {
    setLoadingState(true);

    // Verifica se todos os campos obrigatórios foram preenchidos
  if (!name || !birthdate || !email || !password) {
    Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos obrigatórios.');
    setLoadingState(false);
    return;
  }

  // Verifica se a idade é maior que 10 anos
  const isOverTenYears = calculateAge(birthdate) > 10;

  if (!isOverTenYears) {
    Alert.alert('Idade inválida', 'Você deve ter mais de 10 anos para criar uma conta.');
    return;
  }

    try {
      const userData = {
        email: email,
        name: name,
        birthdate: birthdate
      };

        // Validação da senha
        if (!isValidPassword(password)) {
          Alert.alert('Senha inválida', 'A senha deve ter no mínimo 8 caracteres e conter letras maiúsculas, letras minúsculas, números e símbolos.');
          setLoadingState(false);
          return;
        }

      // Cria o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Envia o email de verificação
      await sendEmailVerification(user);


       // Mostra o alerta inicial
       showVerificationAlert(user);

      // Cria o documento do usuário no Firestore
      await createUser(user.uid, userData);


      // Limpa os campos do formulário após o cadastro
      setEmail('');
      setPassword('');
      setName('');
      setBirthdate('');
    } catch (error) {
      setLoadingState(false);
       // Trata diferentes tipos de erros
    if (error.code === 'auth/email-already-in-use') {
      Alert.alert('Erro ao cadastrar usuário', 'O email fornecido já está em uso. Por favor, use outro email.');
    } else if (error.code === 'auth/invalid-email') {
      Alert.alert('Erro ao cadastrar usuário', 'O email fornecido é inválido. Por favor, forneça um email válido.');
    } else if (error.code === 'auth/operation-not-allowed') {
      Alert.alert('Erro ao cadastrar usuário', 'A operação de cadastro não é permitida. Por favor, entre em contato com o suporte.');
    } else if (error.code === 'auth/missing-email') {
      Alert.alert('Erro ao cadastrar usuário', 'O email esta vazio. Por favor, forneça um email válido.');
    } else {
      console.error('Erro ao cadastrar usuário:', error);
      Alert.alert('Erro ao cadastrar usuário', 'Por favor, tente novamente mais tarde.');
    }
  }
  };

   // Função para deletar a conta do usuário
  const deleteAccount = async (user) => {
    try {
      // Excluir documento do usuário no Firestore
      await deleteUserDoc(user.uid);
  
      // Excluir usuário no Firebase Authentication
      await deleteUser(user);
  
      Alert.alert('Conta excluída', 'A conta e os dados foram apagados.');
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      Alert.alert('Erro ao excluir conta', 'Por favor, tente novamente mais tarde.');
    }
  };

// Função para mostrar o alerta de verificação de email
  const showVerificationAlert = async (user) => {
    try {
      await user.reload(); // Atualiza os dados do usuário para garantir que o email de verificação seja refletido
      if (user.emailVerified) {
        // Email verificado, navega para a próxima tela
        navigation.navigate('LoginUser');
      } else {
        // Email não verificado, mostra o alerta novamente
        Alert.alert(
          'Verifique seu email',
          `Um email de verificação foi enviado para ${email}. Finalize o cadastro verificando seu email.`,
          [
            {
              text: 'Cancelar',
              onPress: () => {
                // Aqui você pode apagar a conta do usuário e seus dados
                deleteAccount(user);
              },
              style: 'cancel'
            },
            {
              text: 'Pronto',
              onPress: () => {
                // Ao pressionar "Pronto", chama novamente a função showVerificationAlert para verificar o email
                showVerificationAlert(user);
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Erro ao verificar email de usuário:', error);
    }
  };
// Função para validar se a senha atende aos critérios estabelecidos
  function isValidPassword(password) {
    if (password.length < 8) return false; // Retorna falso se a senha tiver menos de 8 caracteres
    // Verifica se a senha contém pelo menos uma letra maiúscula, uma letra minúscula, um número e um símbolo
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    return hasUpperCase && hasLowerCase && hasDigit && hasSymbol;// Retorna verdadeiro se todos os critérios forem atendidos
  }; 

    // Função para formatar a entrada da data de nascimento e aplicar validações adicionais
    const handleChangeBirthdate = (input) => {
      // Remove todos os caracteres não numéricos
      const cleaned = input.replace(/\D/g, '');
      // Aplica a máscara "dd/mm/aaaa"
      let formatted = '';
      // Verifica e formata o dia
      if (cleaned.length > 0) {
        formatted = cleaned.slice(0, 2); // Pega os dois primeiros caracteres (dia)
        if (formatted === '00') {
          formatted = ''; // Se o dia for "00", limpa o campo
        } else if (parseInt(formatted, 10) > 31) {
          formatted = formatted.slice(0, 1); // Se o dia for maior que 31, limita a um dígito
        }
      }
      // Verifica e formata o mês
      if (cleaned.length > 2) {
        formatted += '/' + cleaned.slice(2, 4); // Adiciona o mês após o dia formatado
        const month = parseInt(formatted.slice(3, 5), 10); // Obtém o valor do mês
        if (formatted.slice(3, 5) === '00') {
          formatted = formatted.slice(0, 3); // Se o mês for "00", limpa o campo
        } else if (month > 12) {
          formatted = formatted.slice(0, 3); // Se o mês for maior que 12, limita a dois dígitos
        }
      }
      // Verifica e formata o ano
      if (cleaned.length > 4) {
        formatted += '/' + cleaned.slice(4, 8); // Adiciona o ano após o mês formatado
      }
      // Atualiza o estado com o texto formatado
      setBirthdate(formatted);
    };

    // Retorna a idade com base na data de nascimento fornecida
  const calculateAge = (birthdate) => {
    if (!birthdate) return null; // Retorna nulo se a data de nascimento estiver vazia

    // Extrai o ano de nascimento da string no formato "dd/mm/aaaa"
    const birthYear = parseInt(birthdate.substring(6, 10), 10);
    const currentYear = new Date().getFullYear();

    // Calcula a idade
    const age = currentYear - birthYear;

    return age;
  };
    


  return (
    <ImageBackground style={styles.background} source={require('../assets/cenario.png')}>
      <View style={styles.menu}>
        <Text style={styles.menuText}>Realizando Cadastro</Text>
      </View>

      <View style={styles.categoryContainer}>
        <Text style={styles.categoria}>Nome:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          onChangeText={setName}
          value={name}
        />

        <Text style={styles.categoria}>Data de Nascimento:</Text>
        <TextInput
          style={styles.input}
          placeholder="dd/mm/aaaa"
          onChangeText={(text) => handleChangeBirthdate(text)}
          value={birthdate}
          keyboardType="numeric"
          maxLength={10} // Limita o número máximo de caracteres
        />

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

        <TouchableOpacity style={styles.atalhoInput} onPress={() => { navigation.navigate('LoginUser') }}>
          <Text style={styles.atalho}>Já possuo cadastro</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.containerIcon}>
        <TouchableOpacity style={styles.btnSubmit} onPress={handleSignUp}>
          <Text style={styles.submitText}>Criar</Text>
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
      height: 180,
      alignItems: 'center',
      backgroundColor: 'white',
      borderTopWidth: 2,
      bottom: -80,
    },
    background:{
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
    btnSubmit:{
      backgroundColor: '#C6F4E6',
      width: 200,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      marginTop: 35,
      borderColor: '#000000',
      borderRadius: 100,
    },
    submitText:{
      color: '#000000',
      fontSize: 40,
    },
    atalhoInput:{
      marginTop: 30,
    },
    atalho:{
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

export default Cadastro;
