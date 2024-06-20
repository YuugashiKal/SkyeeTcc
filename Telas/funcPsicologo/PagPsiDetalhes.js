import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';

export default function PsychologistDetailScreen({ route, navigation }) {
  const { psychologist } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes do Psicólogo</Text>
      <View style={styles.profileContainer}>
        <Image source={{ uri: psychologist.profileImage }} style={styles.profileImage} />
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.info}>{psychologist.nome}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Especialidade:</Text>
        <Text style={styles.info}>{psychologist.especialidade}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>CRP:</Text>
        <Text style={styles.info}>{psychologist.crp}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Endereço:</Text>
        <Text style={styles.info}>{psychologist.endereco}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Biografia:</Text>
        <Text style={styles.info}>{psychologist.biografia}</Text>
      </View>
      <View style={styles.contactContainer}>
        <Text style={styles.contactTitle}>Entre em contato:</Text>
        <Text style={styles.contactInfo}>Email: {psychologist.email}</Text>
        <Text style={styles.contactInfo}>Telefone: {psychologist.telefone}</Text>
      </View>
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff', // Azul claro
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#87ceeb', // Tom de azul claro
  },
  detailContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  info: {
    fontSize: 16,
    color: '#555',
  },
  contactContainer: {
    marginTop: 24,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
});
