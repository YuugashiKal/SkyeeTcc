// Configuração de mudança de cor dentro do diario

import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, PanResponder } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ColorPicker = ({ visible, onSelectColor, onClose }) => {
  const colorPalette = [
    '#000000', '#808080', '#C0C0C0', '#FFFFFF',
    '#800000', '#FF0000', '#808000', '#FFFF00',
    '#008000', '#00FF00', '#008080', '#00FFFF',
    '#000080', '#0000FF', '#800080', '#FF00FF',
  ];

  const [palettePosition, setPalettePosition] = useState({ x: 0 });
  const [layoutWidth, setLayoutWidth] = useState(0);

  const handleColorSelection = (color) => {
    onSelectColor(color);
    onClose();
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      const { dx } = gestureState;
      setPalettePosition((prevPosition) => {
        let newX = prevPosition.x + dx;
        const paletteWidth = (30 + 10) * colorPalette.length;
        const maxOffset = layoutWidth - paletteWidth;
        const extraDragSpace = 1000; 

        if (newX > extraDragSpace) newX = extraDragSpace;
        if (newX < maxOffset - extraDragSpace) newX = maxOffset - extraDragSpace;

        return { x: newX };
      });
    },
    onPanResponderRelease: (event, gestureState) => {
      const { dx } = gestureState;
      setPalettePosition((prevPosition) => {
        let newX = prevPosition.x + dx;
        const paletteWidth = (30 + 10) * colorPalette.length;
        const maxOffset = layoutWidth - paletteWidth;
        const extraDragSpace = 200;

        if (newX > extraDragSpace) newX = extraDragSpace;
        if (newX < maxOffset - extraDragSpace) newX = maxOffset - extraDragSpace;

        return { x: newX };
      });
    },
  });

  if (!visible) return null;

  return (
    <View style={styles.colorPickerContainer}>
      <View
        style={styles.backgroundRect}
        onLayout={(event) => setLayoutWidth(event.nativeEvent.layout.width)}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} />
          </TouchableOpacity>
        </View>
        <View
          style={[styles.colorPalette, { transform: [{ translateX: palettePosition.x }] }]}
          {...panResponder.panHandlers}
        >
          {colorPalette.map((color, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.colorOption, { backgroundColor: color }]}
              onPress={() => handleColorSelection(color)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  colorPickerContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  backgroundRect: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  header: {
    width: '100%',
    alignItems: 'flex-end',
  },
  colorPalette: {
    flexDirection: 'row',
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 5,
  },
  closeButton: {
    marginRight: 5,
    marginBottom: 5,
  },
});

export default ColorPicker;
