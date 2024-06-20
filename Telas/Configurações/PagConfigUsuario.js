import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { getAuth, deleteUser, signOut } from 'firebase/auth';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../Firebase/firebaseConfig'; // ajuste o caminho conforme necessário

const ConfigUser = ({ navigation }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [user.uid]);

  const calculateAge = (birthdate) => {
    const birthYear = parseInt(birthdate.split('/')[2], 10);
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Inicio');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao sair da conta.');
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              await deleteUser(user);
              await deleteDoc(doc(db, 'users', user.uid));
              navigation.navigate('Inicio');
            } catch (error) {
              console.error(error);
              Alert.alert('Erro', 'Falha ao excluir a conta.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScrollView>
    <ImageBackground style={styles.background} source={require('../assets/cenario.png')}>
      
        <View style={styles.menu}>
          <Text style={styles.menuText}>Configurações do Usuário</Text>
        </View>
        {userData && (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoria}>Nome:</Text>
            <Text style={styles.input}>{userData.name}</Text>

            <Text style={styles.categoria}>Data de Nascimento:</Text>
            <Text style={styles.input}>{userData.birthdate}</Text>

            <Text style={styles.categoria}>Idade:</Text>
            <Text style={styles.input}>{calculateAge(userData.birthdate)} anos</Text>

            <Text style={styles.categoria}>Email:</Text>
            <Text style={styles.input}>{userData.email}</Text>
            
          </View>
        )}
        <View style={styles.containerIcon}>
          <TouchableOpacity style={styles.btnAction} onPress={handleSignOut}>
            <Text style={styles.actionText}>Sair da Conta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnAction} onPress={handleDeleteAccount}>
            <Text style={styles.actionText}>Excluir Conta</Text>
          </TouchableOpacity>
        </View>
     
    </ImageBackground>
    </ScrollView>
  );
}

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
    alignItems: 'center',
    marginBottom: 20,
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
    paddingVertical: 10,
    textAlign: 'left',
  },
  containerIcon: {
    width: "100%",
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: 2,
    paddingTop: 20,
    paddingBottom: 40,
  },
  background: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },
  btnAction: {
    backgroundColor: '#C6F4E6',
    width: 200,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginTop: 55,
    borderColor: '#000000',
    borderRadius: 100,
  },
  actionText: {
    color: '#000000',
    fontSize: 20,
  },
});

export default ConfigUser;
