import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiUrl, ENDPOINTS } from '../config/api';

export default function Contents() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (!userToken) return;

      const response = await axios.get(
        getApiUrl(ENDPOINTS.profile),
        {
          headers: {
            Authorization: `Token ${userToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.username) {
        setUserName(response.data.username);
      }
    } catch (error) {
      console.error("프로필 정보 가져오기 실패:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleGreen}>{userName}</Text>
          <Text style={styles.title}>님, 반가워요!</Text>
        </View>
        <Text style={styles.subtitle}>
          아이를 위한 24시간 병원 및 약국 찾기를 이용해보세요.
        </Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("HospitalList");
        }}
      >
        <View style={styles.buttonContent}>
          <MaterialIcons
            name="local-hospital"
            size={24}
            color="#016a4c"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>병원 찾기</Text>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color="#CCCCCC"
            style={styles.arrowIcon}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("PharmacyList");
        }}
      >
        <View style={styles.buttonContent}>
          <MaterialIcons
            name="location-on"
            size={24}
            color="#016a4c"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>약국 찾기</Text>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color="#CCCCCC"
            style={styles.arrowIcon}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 20
  },
  titleWrapper: {
    marginTop: 20,
    marginBottom: 40
  },
  titleContainer: {
    flexDirection: "row",
    marginBottom: 10,
    flexWrap: "nowrap",
    alignItems: "center"
  },
  titleGreen: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#016a4c"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black"
  },
  subtitle: {
    fontSize: 16,
    color: "#999999"
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 80,
    width: "100%",
    borderRadius: 10,
    marginBottom: 30,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 30
  },
  buttonIcon: {
    transform: [{ scale: 2 }],
    marginLeft: 0
  },
  buttonText: {
    fontSize: 18,
    color: "#016a4c",
    fontWeight: "900",
    flex: 1,
    textAlign: "center",
    marginLeft: 0
  },
  arrowIcon: {
    transform: [{ scale: 2 }],
    marginLeft: "auto"
  }
});
