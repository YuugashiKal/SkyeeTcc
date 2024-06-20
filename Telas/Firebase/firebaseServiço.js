// firebaseServiço.js
import { collection, getDocs, getDoc, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { deleteUser as deleteAuthUser } from 'firebase/auth';

import { db } from './firebaseConfig';

// Função para excluir documento do usuário no Firestore
export const deleteUserDoc = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
    console.log('Documento do usuário excluído com sucesso.');
  } catch (error) {
    console.error('Erro ao excluir documento do usuário:', error);
    throw error;
  }
};

// Função para excluir usuário no Firebase Authentication
export const deleteUser = async (user) => {
  try {
    await deleteAuthUser(user);
    console.log('Usuário excluído com sucesso no Firebase Authentication.');
  } catch (error) {
    console.error('Erro ao excluir usuário no Firebase Authentication:', error);
    throw error;
  }
};

// Função para obter dados do usuário pelo ID
export const getUserDataById = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error('Documento de usuário não encontrado no Firestore.');
    }
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error.message);
    throw error;
  }
};

// Função para verificar se o email já está cadastrado
export const checkIfEmailExists = async (email) => {
  try {
    const usersCollectionRef = collection(db, 'users');
    const snapshot = await getDocs(usersCollectionRef);
    const users = [];
    snapshot.forEach((doc) => {
      users.push(doc.data().email);
    });
    return users.includes(email);
  } catch (error) {
    console.error('Erro ao verificar email:', error);
    throw error;
  }
};

// Função para criar usuário no Firestore
export const createUser = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, userData);
    console.log('Usuário criado com sucesso:', userData);
    return userId;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
};
