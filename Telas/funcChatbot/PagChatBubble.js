import React from "react";
import { View, Text, StyleSheet } from "react-native";

/*
O componente ChatBubble é responsável por renderizar uma única bolha de chat na interface do usuário.
- role: indica o papel da bolha de chat (usuário ou modelo).
- text: o texto a ser exibido dentro da bolha de chat..*/
const ChatBubble = ({ role, text }) => {
  return (
      <View
          style={[
              styles.chatItem,
              role === "user" ? styles.userChatItem : styles.modelChatItem,
          ]}
          >
          <Text style={styles.chatText}>{text}</Text>
      </View>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    marginBottom: 10, // Margem inferior da bolha de chat
    padding: 10, // Preenchimento da bolha de chat
    borderRadius: 10, // Bordas arredondadas da bolha de chat
    maxWidth: "70%", // Largura máxima da bolha de chat
    position: "relative",
  },
  userChatItem: {
    alignSelf: "flex-end", // Alinha a bolha de chat do usuário à direita
    backgroundColor: "#E1FCF4", // Cor de fundo da bolha de chat do usuário
    borderWidth: 2,
    borderRadius: 15,
  },
  modelChatItem: {
    alignSelf: "flex-start", // Alinha a bolha de chat do modelo à esquerda
    backgroundColor: "#FFF3E2", // Cor de fundo da bolha de chat do modelo
    borderWidth: 2,
    borderRadius: 15,
  },
  chatText: {
    fontSize: 16, // Tamanho da fonte do texto da bolha de chat
    color: "#000000", // Cor do texto da bolha de chat
  },
});

export default ChatBubble; // Exporta o componente ChatBubble
