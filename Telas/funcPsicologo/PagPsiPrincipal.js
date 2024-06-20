// screens/PagEntrar.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View>
      <Text>Você é psicólogo?</Text>
      <Button
        title="Entrar"
        color="limegreen"
        onPress={() => navigation.navigate('Entrar')}
      />
        <Button
        title="Registrar"
        color="limegreen"
        onPress={() => navigation.navigate('Registrar')}
      />
      <Button
        title="Ver Psicólogos Registrados"
        color="green"
        onPress={() => navigation.navigate('Lista')}
      />
    </View>
  );
}
