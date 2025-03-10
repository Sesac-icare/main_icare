import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();
  const ICON_SIZE = 72;

  useEffect(() => {
    // 컴포넌트가 마운트될 때 아이콘 크기 초기화
    return () => {
      // 컴포넌트가 언마운트될 때 정리
    };
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("PharmacyList")}
          >
            <View style={styles.iconBox}>
              <MaterialIcons
                name="local-pharmacy"
                size={ICON_SIZE}
                color="#016A4C"
              />
            </View>
            <Text style={styles.buttonText}>약국 찾기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("HospitalList")}
          >
            <View style={styles.iconBox}>
              <MaterialIcons
                name="local-hospital"
                size={ICON_SIZE}
                color="#016A4C"
              />
            </View>
            <Text style={styles.buttonText}>병원 찾기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("ChatScreen")}
          >
            <View style={styles.iconBox}>
              <MaterialIcons name="chat" size={ICON_SIZE} color="#016A4C" />
            </View>
            <Text style={styles.buttonText}>아이케어봇</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff"
  },
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9fafb"
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 28,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2
  },
  iconBox: {
    width: 72,
    height: 72,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  buttonText: {
    marginLeft: 20,
    fontSize: 18,
    color: "#016A4C",
    fontWeight: "600"
  }
});
