// Configuração de mudança de fonte e tamanho dentro do diario

import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';

const FontSizeAdjustmentBar = ({ currentSize, onChange }) => {
  const [fontSize, setFontSize] = useState(currentSize.toString());
  

  useEffect(() => {
    setFontSize(currentSize.toString());
  }, [currentSize]);

  const handleDecrease = () => {
    const newSize = Math.max(parseInt(fontSize) - 1, 1);
    setFontSize(newSize.toString());
    onChange(newSize);
  };

  const handleIncrease = () => {
    const newSize = Math.min(parseInt(fontSize) + 1, 7);
    setFontSize(newSize.toString());
    onChange(newSize);
  };

  

  return (
    <View style={styles.container}>

        <View style={styles.panel}>
          <Button title="−" onPress={handleDecrease} />
          <TextInput
            style={styles.input}
            value={fontSize}
            editable={false}
          />
          <Button title="+" onPress={handleIncrease} />
        </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleText: {
    backgroundColor: 'lightgray',
    padding: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  panel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    minWidth: 50,
    textAlign: 'center',
  },
});

export default FontSizeAdjustmentBar;
