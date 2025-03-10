import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiUrl, ENDPOINTS } from "../config/api";

export default function MyPage() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    Alert.alert(
      "로그아웃",
      "로그아웃 하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel"
        },
        {
          text: "로그아웃",
          onPress: async () => {
            try {
              // 저장된 토큰 가져오기
              const userToken = await AsyncStorage.getItem("userToken");

              if (!userToken) {
                Alert.alert("오류", "로그인 정보가 없습니다.");
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Login" }]
                });
                return;
              }

              const response = await axios.post(
                getApiUrl("/users/logout/"),
                {},
                {
                  headers: {
                    Authorization: `Token ${userToken}`,
                    "Content-Type": "application/json"
                  }
                }
              );

              // 로그아웃 성공
              await AsyncStorage.removeItem("userToken");
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }]
              });
            } catch (error) {
              console.error("Logout error:", error.response?.data);

              if (error.response) {
                // 서버가 응답한 경우
                if (error.response.status === 401) {
                  Alert.alert("오류", "인증이 만료되었습니다.");
                } else {
                  Alert.alert("오류", "로그아웃 처리 중 오류가 발생했습니다.");
                }
                // 어떤 에러가 발생하더라도 로컬 토큰은 제거하고 로그인 화면으로 이동
                await AsyncStorage.removeItem("userToken");
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Login" }]
                });
              } else if (error.request) {
                // 요청은 보냈지만 응답을 받지 못한 경우
                Alert.alert(
                  "오류",
                  "서버와 통신할 수 없습니다. 인터넷 연결을 확인해주세요."
                );
              } else {
                // 요청 설정 중 에러가 발생한 경우
                Alert.alert("오류", "로그아웃 중 오류가 발생했습니다.");
              }
            }
          },
          style: "destructive"
        }
      ],
      { cancelable: false }
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "회원 탈퇴",
      "정말로 탈퇴하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel"
        },
        {
          text: "탈퇴",
          onPress: async () => {
            try {
              // 저장된 토큰 가져오기
              const userToken = await AsyncStorage.getItem("userToken");

              if (!userToken) {
                Alert.alert("오류", "로그인 정보가 없습니다.");
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Login" }]
                });
                return;
              }

              const response = await axios.delete(getApiUrl("/users/delete/"), {
                headers: {
                  Authorization: `Token ${userToken}`,
                  "Content-Type": "application/json"
                }
              });

              // 회원탈퇴 성공
              await AsyncStorage.removeItem("userToken");
              await AsyncStorage.removeItem("userInfo");

              Alert.alert("알림", "회원 탈퇴가 완료되었습니다.", [
                {
                  text: "확인",
                  onPress: () => {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "Login" }]
                    });
                  }
                }
              ]);
            } catch (error) {
              console.error("Delete account error:", error.response?.data);

              if (error.response) {
                if (error.response.status === 401) {
                  Alert.alert("오류", "인증이 만료되었습니다.");
                  // 인증 만료 시 로그인 화면으로 이동
                  await AsyncStorage.removeItem("userToken");
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Login" }]
                  });
                } else {
                  Alert.alert("오류", "회원 탈퇴 처리 중 오류가 발생했습니다.");
                }
              } else if (error.request) {
                Alert.alert(
                  "오류",
                  "서버와 통신할 수 없습니다. 인터넷 연결을 확인해주세요."
                );
              } else {
                Alert.alert("오류", "회원 탈퇴 중 오류가 발생했습니다.");
              }
            }
          },
          style: "destructive"
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="chevron-left" size={32} color="#CCCCCC" />
          </TouchableOpacity>
          <Image
            source={require("../assets/HeaderGreenLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.content}>
          <TouchableOpacity
            style={styles.buttonCard}
            onPress={() => navigation.navigate("DocumentStorage")}
          >
            <View style={styles.buttonContent}>
              <MaterialIcons
                name="medical-services"
                size={48}
                color="#016A4C"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>서류 보관함</Text>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color="#CCCCCC"
                style={styles.arrowIcon}
              />
            </View>
          </TouchableOpacity>

          <View style={{ flex: 1 }} />

          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={styles.menuText}>로그아웃</Text>
              <MaterialIcons name="chevron-right" size={24} color="#CCCCCC" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, { borderBottomWidth: 0 }]}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.menuText}>회원탈퇴</Text>
              <MaterialIcons name="chevron-right" size={24} color="#CCCCCC" />
            </TouchableOpacity>
          </View>
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
    flex: 1,
    backgroundColor: "#fff"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff"
  },
  backButton: {
    padding: 4,
    position: "absolute",
    left: 20,
    zIndex: 1
  },
  logo: {
    width: 48,
    height: 48,
    marginLeft: "auto",
    marginRight: "auto"
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9fafb"
  },
  buttonCard: {
    backgroundColor: "#fff",
    paddingVertical: 70,
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
    marginLeft: 0
  },
  buttonText: {
    fontSize: 18,
    color: "#016A4C",
    fontWeight: "900",
    flex: 1,
    textAlign: "center",
    marginLeft: 0
  },
  arrowIcon: {
    marginLeft: "auto"
  },
  menuSection: {
    marginTop: "auto",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0"
  },
  menuText: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "500"
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    marginTop: "auto"
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#E53935",
    fontWeight: "500"
  }
});
