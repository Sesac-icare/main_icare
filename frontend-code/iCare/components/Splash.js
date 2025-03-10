import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

export default function Splash() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/iCareLogo.jpg")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.footer}>
        <Text style={styles.title}>iCare</Text>
        <Text style={styles.subtitle}>
          아이를 위한 24시간 병원 및 약국 찾기
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#016a4c",
    justifyContent: "center"
  },
  logoContainer: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    alignItems: "center"
  },
  logo: {
    width: 200,
    height: 200
  },
  footer: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: "center"
  },
  title: {
    fontSize: 36,
    color: "#12b67a",
    marginBottom: 8,
    fontFamily: "NotoSansKR",
    fontWeight: "bold"
  },
  subtitle: {
    fontSize: 18,
    color: "white",
    opacity: 0.8,
    fontFamily: "NotoSansKR",
    fontWeight: "400"
  }
});
