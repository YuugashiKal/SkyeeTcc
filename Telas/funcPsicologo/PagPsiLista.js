import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

import { db } from '../Firebase/firebaseConfig';

export default function PsychologistsListScreen({ navigation }) {
  const [psychologists, setPsychologists] = useState([]); // Estado para armazenar a lista de psicólogos
  const [searchText, setSearchText] = useState(''); // Estado para armazenar o texto de pesquisa

  // Hook useEffect para buscar dados dos psicólogos no Firestore quando o componente é montado
  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        // Consulta para buscar a coleção de psicólogos ordenada pelo nome
        let psychologistsQuery = query(collection(db, 'psicologos'), orderBy('nome'));

        // Obtém os documentos da consulta
        const querySnapshot = await getDocs(psychologistsQuery);
        // Mapeia os documentos para um array de objetos contendo os dados e o ID do documento
        const psychologistsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPsychologists(psychologistsData); // Atualiza o estado com os dados dos psicólogos
      } catch (error) {
        console.error('Error fetching psychologists:', error); // Lida com erros na consulta
      }
    };

    fetchPsychologists();
  }, []);

  // Filtra a lista de psicólogos com base no texto de pesquisa
  const filteredPsychologists = psychologists.filter(psychologist => {
    const searchLower = searchText.toLowerCase(); // Converte o texto de pesquisa para minúsculas
    return (
      psychologist.nome.toLowerCase().includes(searchLower) || // Verifica se o nome inclui o texto de pesquisa
      psychologist.crp.toLowerCase().includes(searchLower) // Verifica se o CRP inclui o texto de pesquisa
    );
  });

  // Renderiza cada item da lista de psicólogos
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Detalhes', { psychologist: item })}>
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.nome}</Text>
          <Text style={styles.specialty}>{item.especialidade}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Psicólogos</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Pesquisar por nome ou CRP"
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={filteredPsychologists} // Dados a serem renderizados na lista
        renderItem={renderItem} // Função para renderizar cada item
        keyExtractor={item => item.id} // Função para extrair a chave de cada item
        style={styles.list}
        contentContainerStyle={styles.listContentContainer} // Estilo para o container da lista
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  list: {
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: 16, // Espaço para a rolagem suave
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'black',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  specialty: {
    fontSize: 16,
    color: '#555',
  },
});
