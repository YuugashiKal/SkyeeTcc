import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, TextInput, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DiaryFilterScreen = ({ navigation }) => {
  const [pages, setPages] = useState([]); // Estado para armazenar as páginas
  const [selectMode, setSelectMode] = useState(false); // Estado para controlar o modo de seleção
  const [selectedItems, setSelectedItems] = useState([]); // Estado para armazenar os itens selecionados
  const [searchQuery, setSearchQuery] = useState(''); // Estado para armazenar a consulta de pesquisa

  useEffect(() => {
    // Carregar páginas ao focar na tela
    const unsubscribe = navigation.addListener('focus', () => {
      loadPages();
    });

    return unsubscribe;
  }, [navigation]);

  const loadPages = async () => {
    try {
      // Carregar páginas do AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);

      // Parse e filtrar as páginas válidas
      const parsedItems = items
        .map((item) => {
          try {
            const parsedItem = JSON.parse(item[1]);
            parsedItem.id = item[0]; // Garantir que o ID seja definido corretamente
            return parsedItem;
          } catch (e) {
            return null;
          }
        })
        .filter(item => item && item.title && item.content && item.creationDate);

      setPages(parsedItems); // Definir as páginas no estado
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar as páginas.");
    }
  };

  const handleAddPage = () => {
    // Navegar para a tela de adição de página
    navigation.navigate('Pagina de Edição');
  };

  const handleViewPage = (id) => {
    // Navegar para a tela de visualização de página
    navigation.navigate('Pagina de Visualização', { id });
  };

  const handleDeletePage = async () => {
    try {
      // Excluir páginas selecionadas do AsyncStorage
      await AsyncStorage.multiRemove(selectedItems);
      setSelectMode(false);
      setSelectedItems([]);
      loadPages(); // Recarregar páginas após exclusão
      Alert.alert("Sucesso", "Páginas selecionadas foram excluídas.");
    } catch (error) {
      Alert.alert("Erro", "Falha ao excluir as páginas.");
    }
  };

  const handleDeleteAllPages = async () => {
    try {
      // Excluir todas as páginas do AsyncStorage
      await AsyncStorage.clear();
      setSelectMode(false);
      setSelectedItems([]);
      loadPages(); // Recarregar páginas após exclusão
      Alert.alert("Sucesso", "Todos os textos foram excluídos.");
    } catch (error) {
      Alert.alert("Erro", "Falha ao excluir os textos.");
    }
  };

  const toggleSelectMode = () => {
    // Alternar entre o modo de seleção
    setSelectMode(!selectMode);
    setSelectedItems([]);
  };

  const toggleSelection = (id) => {
    // Alternar seleção de um item
    const newSelectedItems = selectedItems.includes(id)
      ? selectedItems.filter(item => item !== id)
      : [...selectedItems, id];
    setSelectedItems(newSelectedItems);
  };

  const renderPage = ({ item }) => (
    // Renderizar um item de página na lista
    <TouchableOpacity
      style={[styles.pageItem, selectMode && { backgroundColor: selectedItems.includes(item.id) ? '#ccc' : '#f0f0f0' }]}
      onPress={() => selectMode ? toggleSelection(item.id) : handleViewPage(item.id)}
    >
      <Text numberOfLines={1} style={styles.pageText}>
        {item.title || 'Sem título'} - {item.creationDate}
      </Text>
    </TouchableOpacity>
  );

  const filterPages = () => {
    // Verificar se a consulta de pesquisa está vazia
    if (!searchQuery.trim()) {
      // Se estiver vazia, retornar todas as páginas
      return pages;
    }
  
    // Filtrar páginas com base na consulta de pesquisa
    return pages.filter(page => {
      const titleMatch = page.title.toLowerCase().includes(searchQuery.toLowerCase());
      const dateMatch = page.creationDate.toLowerCase().includes(searchQuery.toLowerCase());
      return titleMatch || dateMatch;
    });
  };

  return (
    <ImageBackground style={styles.background} source={require('../assets/cenario.png')}>
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close" size={20} color="black" style={{ marginRight: 10 }} />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar por título ou data..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <View style={styles.listView3}>
        <View style={styles.listView2}>
        <View style={styles.listView1}>
        {filterPages().length === 0 ? (
          <Text style={styles.noPagesText}>Nenhum texto correspondente encontrado.</Text>
        ) : (
          <FlatList
            data={filterPages()}
            keyExtractor={(item) => item.id}
            renderItem={renderPage}
            contentContainerStyle={styles.list}
          />
        )}
        </View>
        </View>
        </View>
      </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddPage}>
            <Ionicons name="add" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.selectButton} onPress={toggleSelectMode}>
            <Text style={styles.selectButtonText}>{selectMode ? 'Cancelar' : 'Selecionar'}</Text>
          </TouchableOpacity>
          {selectMode && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePage}>
              <Text style={styles.deleteButtonText}>Excluir Selecionados</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.deleteAllButton} onPress={handleDeleteAllPages}>
            <Text style={styles.deleteAllButtonText}>Excluir Todos</Text>
          </TouchableOpacity>
        </View>
      
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 5,
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 30,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: '#000',
  },
  list: {
    flexGrow: 1,
  },
  listView1: {
    backgroundColor: '#FFECD1',
    padding: 5,
    borderRadius: 30,
    height: 520,
    width: 320,
    borderColor: 'black',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listView2: {
    backgroundColor: '#FFE4BF',
    padding: 5,
    borderRadius: 40,
    height: 540,
    width: 340,
    borderColor: 'black',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listView3: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 50,
    height: 560,
    width: 360,
    borderColor: 'black',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 2,
  },
  pageText: {
    fontSize: 16,
    color: '#333',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: 'black',
    borderTopWidth: 2,
    height: 70,
  },
  addButton: {
    backgroundColor: '#A4D9C9',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 2,
    height: 50,
    width: 50,
  },
  selectButton: {
    backgroundColor: '#FFC107',
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 2,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 2,
  },
  deleteButtonText: {
    color: '#fff',
  },
  deleteAllButton: {
    backgroundColor: '#F44336',
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 2,
  },
  deleteAllButtonText: {
    color: '#fff',
  },
  noPagesText: {
    marginTop: 20,
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
});

export default DiaryFilterScreen;