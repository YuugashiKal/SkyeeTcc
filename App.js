//App.js
import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { doc, getDoc} from "firebase/firestore";

import Pet from './Telas/Pet';

import Inicio from './Telas/Inicial/PagInInicio';
import Login from './Telas/Inicial/PagInEntrar';
import Cadastro from './Telas/Inicial/PagInCadastro';

import ConfigUser from './Telas/Configurações/PagConfigUsuario';

import DiaryFilterScreen from './Telas/funcDiario/PagDiarioFiltro';
import PageViewScreen from './Telas/funcDiario/PagDiarioVisualização';
import PageEditScreen from './Telas/funcDiario/PagDiarioEdição';

import PagPrincipal from './Telas/funcPsicologo/PagPsiPrincipal';
import PagRegistrar from './Telas/funcPsicologo/PagPsiRegistrar';
import PagEntrar from './Telas/funcPsicologo/PagPsiEntrar';
import PagPerfil from './Telas/funcPsicologo/PagPsiPerfil';
import PagPsiLista from './Telas/funcPsicologo/PagPsiLista';
import PagPsiDetalhes from './Telas/funcPsicologo/PagPsiDetalhes';
import EmailVerification from './Telas/funcPsicologo/PagPsiEmailVerifica';

import { db, auth } from './Telas/Firebase/firebaseConfig';
export default function App() {
  const [user, setUser] = useState(null);      // Estado para armazenar informações do usuário autenticado
  const [userData, setUserData] = useState(null);  // Estado para armazenar os dados específicos do usuário (como perfil, por exemplo)
  const [loading, setLoading] = useState(false);  // Estado para controlar o estado de carregamento durante a autenticação ou outras operações assíncronas

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);  // Define o estado do usuário com o usuário autenticado
        const docRef = doc(db, "users", user.uid);  // Referência ao documento do usuário no Firestore
        const docSnap = await getDoc(docRef);  // Obtém o snapshot do documento do Firestore
        if (docSnap.exists()) {
          setUserData(docSnap.data());  // Define os dados do usuário com base nos dados recuperados do Firestore
        }
      } else {
        setUser(null);  // Se não houver usuário autenticado, define o estado do usuário como null
        setUserData(null);  // Define os dados do usuário como null
      }
    });
    // Função de cleanup: unsubscribe da função de observação do estado de autenticação ao desmontar o componente
    return () => unsubscribe();
  }, []);  // O array vazio indica que este useEffect é executado apenas uma vez, equivalente ao componentDidMount
  
  const Stack = createStackNavigator();  // Define o StackNavigator para gerenciar a navegação entre telas

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicio">
        <Stack.Screen name="Pet" component={Pet} options={{ headerShown: false }} />
        <Stack.Screen name="Inicio" component={Inicio} options={{ headerShown: false }} />
        <Stack.Screen name="LoginUser" options={{ headerShown: false }}>
          {props => <Login {...props} setLoading={setLoading} setUser={setUser} setUserData={setUserData} db={db} />}
        </Stack.Screen>
        <Stack.Screen name="Cadastro" options={{ headerShown: false }}>
          {props => <Cadastro {...props} setLoading={setLoading} db={db} />}
        </Stack.Screen>
        <Stack.Screen name="ConfigUser" component={ConfigUser} />
        <Stack.Screen name="Diario" component={DiaryFilterScreen} />
        <Stack.Screen name="Pagina de Visualização" component={PageViewScreen} />
        <Stack.Screen name="Pagina de Edição" component={PageEditScreen} />
        <Stack.Screen name="Principal" component={PagPrincipal} />
        <Stack.Screen name="Registrar" component={PagRegistrar} />
        <Stack.Screen name="Entrar" component={PagEntrar} />
        <Stack.Screen name="Perfil" component={PagPerfil} />
        <Stack.Screen name="Lista" component={PagPsiLista} />
        <Stack.Screen name="Detalhes" component={PagPsiDetalhes} />
        <Stack.Screen name="EmailVerification" component={EmailVerification} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}