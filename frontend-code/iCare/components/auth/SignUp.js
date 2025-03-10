import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  ScrollView,
  Modal,
  Button
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as Location from "expo-location";
import { getApiUrl, ENDPOINTS } from "../../config/api";

export default function SignUp() {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [showConfirmIcon, setShowConfirmIcon] = useState(false);
  const [termAgreed, setTermAgreed] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const handleSignUp = async () => {
    try {
      if (!username || !email || !password || !passwordCheck) {
        alert("모든 필드를 입력해주세요.");
        return;
      }

      if (passwordMismatch) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }

      if (!termAgreed) {
        alert("고유식별정보 수집 및 이용에 동의해주세요.");
        return;
      }

      const signUpData = {
        username,
        email,
        password,
        passwordCheck,
        term_agreed: termAgreed,
        latitude: userLocation ? userLocation.coords.latitude : null,
        longitude: userLocation ? userLocation.coords.longitude : null
      };

      console.log("회원가입 요청 데이터:", signUpData);

      const response = await axios.post(
        getApiUrl("/users/register/"),
        signUpData
      );

      // 응답 데이터 확인
      console.log("회원가입 응답:", response.data);

      // 회원가입 성공 조건 수정
      if (response.status === 201 || response.status === 200) {
        alert("회원가입이 완료되었습니다. 로그인해주세요.");
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("회원가입 실패:", error);
      if (error.response?.status === 400) {
        if (error.response.data.email) {
          alert("이미 사용 중인 이메일입니다.");
        } else if (error.response.data.password) {
          alert("비밀번호가 일치하지 않습니다.");
        } else {
          alert(error.response.data.message || "회원가입에 실패했습니다.");
        }
      } else {
        alert("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  const handleAgree = () => {
    setTermAgreed(true);
    setShowModal(false);
  };

  // 비밀번호 확인 입력 시 일치 여부 체크
  const checkPasswordMatch = (text) => {
    setPasswordCheck(text);
    setPasswordMismatch(password !== text);
    setShowConfirmIcon(text.length > 0);
  };

  // 이메일 입력 핸들러 수정
  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        console.log("사용자 위치 정보:", {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
        setUserLocation(location);
        setLocationPermission(true);
        setShowLocationModal(false);
      }
    } catch (error) {
      console.error("위치 권한 요청 실패:", error);
    }
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
            source={require("../../assets/HeaderGreenLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.inputSection}>
            <Text style={styles.label}>이름</Text>
            <TextInput
              style={styles.input}
              placeholder="이름을 입력해주세요"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              style={styles.input}
              placeholder="이메일을 입력해주세요"
              placeholderTextColor="#999"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 입력해주세요"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordCheck) {
                  setPasswordMismatch(password !== text);
                }
              }}
            />
            <Text style={styles.helperText}>
              영문, 숫자를 포함한 8자 이상의 비밀번호를 입력해주세요
            </Text>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>비밀번호 확인</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="비밀번호를 다시 한 번 입력해주세요"
                placeholderTextColor="#999"
                secureTextEntry
                value={passwordCheck}
                onChangeText={checkPasswordMatch}
              />
              {showConfirmIcon && (
                <MaterialIcons
                  name={passwordMismatch ? "error" : "check-circle"}
                  size={20}
                  color={passwordMismatch ? "#E53935" : "#016A4C"}
                  style={styles.errorIcon}
                />
              )}
            </View>
            {passwordMismatch && (
              <Text style={styles.errorText}>
                비밀번호가 일치하지 않습니다.
              </Text>
            )}
          </View>

          <View style={styles.inputSection}>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setTermAgreed(!termAgreed)}
              >
                <MaterialIcons
                  name={termAgreed ? "check-box" : "check-box-outline-blank"}
                  size={24}
                  color="#016A4C"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowTermsModal(true)}>
                <Text style={styles.checkboxLabel}>
                  고유식별정보 수집 및 이용에 동의합니다
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setShowLocationModal(true)}
              >
                <MaterialIcons
                  name={
                    locationPermission ? "check-box" : "check-box-outline-blank"
                  }
                  size={24}
                  color="#016A4C"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowLocationModal(true)}>
                <Text style={styles.checkboxLabel}>
                  위치 정보 수집 및 이용에 동의합니다
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>회원가입</Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal visible={showModal} transparent={true} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  고유식별정보의 수집 및 이용 동의
                </Text>
                <TouchableOpacity
                  onPress={() => setShowModal(false)}
                  style={styles.closeButton}
                >
                  <MaterialIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <Text style={styles.modalText}>
                  • 주민등록번호는 아이케어에서 의료법시행령 제42조의2(민감정보
                  및 고유식별정보의 처리)에 근거하여 처리하고 있으며, 그 외
                  목적으로 처리 및 이용하고 있지 않습니다.
                </Text>
                <Text style={styles.modalText}>
                  • 회원님의 휴대폰에만 저장하며, 아이케어에서는 별도로 보관하지
                  않습니다.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.agreeButton}
                onPress={handleAgree}
              >
                <Text style={styles.agreeButtonText}>동의하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showTermsModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  고유식별정보의 수집 및 이용 동의
                </Text>
                <TouchableOpacity
                  onPress={() => setShowTermsModal(false)}
                  style={styles.closeButton}
                >
                  <MaterialIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSubTitle}>수집 및 이용 목적</Text>
                  <Text style={styles.modalText}>
                    • 주민등록번호는 아이케어에서 의료법시행령
                    제42조의2(민감정보 및 고유식별정보의 처리)에 근거하여
                    처리하고 있으며, 그 외 목적으로 처리 및 이용하고 있지
                    않습니다.
                  </Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSubTitle}>보관 방침</Text>
                  <Text style={styles.modalText}>
                    • 회원님의 휴대폰에만 저장하며, 아이케어에서는 별도로
                    보관하지 않습니다.
                  </Text>
                </View>
              </ScrollView>
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowTermsModal(false)}
                >
                  <Text style={styles.modalButtonTextCancel}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonConfirm]}
                  onPress={() => {
                    setTermAgreed(true);
                    setShowTermsModal(false);
                  }}
                >
                  <Text style={styles.modalButtonTextConfirm}>동의하기</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showLocationModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  위치 정보 수집 및 이용 동의
                </Text>
                <TouchableOpacity
                  onPress={() => setShowLocationModal(false)}
                  style={styles.closeButton}
                >
                  <MaterialIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSubTitle}>수집 및 이용 목적</Text>
                  <Text style={styles.modalText}>
                    • 사용자의 위치를 기반으로 한 서비스 제공
                  </Text>
                  <Text style={styles.modalText}>
                    • 근처 의료 기관 정보 제공
                  </Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSubTitle}>
                    수집하는 위치정보 항목
                  </Text>
                  <Text style={styles.modalText}>• 위도, 경도 정보</Text>
                </View>
              </ScrollView>
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowLocationModal(false)}
                >
                  <Text style={styles.modalButtonTextCancel}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonConfirm]}
                  onPress={requestLocationPermission}
                >
                  <Text style={styles.modalButtonTextConfirm}>동의하기</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
    position: "relative"
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center"
  },
  backButton: {
    position: "absolute",
    left: 20,
    padding: 4
  },
  logo: {
    width: 48,
    height: 48
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 40
  },
  inputWrapper: {
    padding: 20,
    marginTop: 40 // 상단 여백 추가
  },
  inputSection: {
    marginBottom: 20
  },
  label: {
    fontSize: 14,
    color: "#016A4C",
    marginBottom: 8,
    fontWeight: "600"
  },
  input: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#222222"
  },
  signUpButton: {
    backgroundColor: "#016A4C",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 40,
    alignItems: "center"
  },
  signUpButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600"
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end"
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: "50%",
    maxHeight: "80%"
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0"
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#016A4C"
  },
  closeButton: {
    padding: 4
  },
  modalBody: {
    flex: 1
  },
  modalSection: {
    marginVertical: 15
  },
  modalSubTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10
  },
  modalText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#666"
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0"
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center"
  },
  modalButtonConfirm: {
    backgroundColor: "#016A4C"
  },
  modalButtonTextCancel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600"
  },
  modalButtonTextConfirm: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600"
  },
  agreeButton: {
    backgroundColor: "#016A4C",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20
  },
  agreeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  },
  passwordInputContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center"
  },
  passwordInput: {
    flex: 1
  },
  errorIcon: {
    position: "absolute",
    right: 12
  },
  errorText: {
    color: "#E53935",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  checkbox: {
    marginRight: 8
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#666"
  },
  inputError: {
    borderColor: "#FF4444"
  },
  helperText: {
    color: "#666666",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4
  }
});
