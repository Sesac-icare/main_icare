import React from "react";
import styled from "styled-components/native";
import { View, StyleSheet, Text } from "react-native";
import { Header, Contents, Footer } from "./components/Layout";
// import EventButton from "./components/EventButton";
// import EventInput from "./components/EventInput";

const iCare = () => {
  return (
    <View style={StyleSheet.container}>
      <Header />
      <Contents />
      <Footer />
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff"
  },
  title: {
    fontSize: 30
  }
});

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

const App = () => {
  return <Container></Container>;
};

export default App;
