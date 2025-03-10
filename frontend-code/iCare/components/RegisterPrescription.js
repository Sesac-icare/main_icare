import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Camera as ExpoCamera } from "expo-camera";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiUrl, ENDPOINTS } from "../config/api";

export default function RegisterPrescription() {
  const navigation = useNavigation();
  const [childName, setChildName] = useState("");
  const [image, setImage] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [camera, setCamera] = useState(null);
  const [nameError, setNameError] = useState(false);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        setUserToken(token);
      } catch (error) {
        console.error("토큰 가져오기 실패:", error);
      }
    };
    getToken();
  }, []);

  // 카메라 권한 요청
  const requestCameraPermission = async () => {
    try {
      const { status } = await ExpoCamera.requestCameraPermissionsAsync();
      setCameraPermission(status === "granted");
      return status === "granted";
    } catch (error) {
      console.log("Camera permission error:", error);
      return false;
    }
  };

  // 이미지 선택
  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("갤러리 접근 권한이 필요합니다.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Image picker error:", error);
      alert("이미지를 선택하는 중 오류가 발생했습니다.");
    }
  };

  // 카메라 실행
  const takePicture = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      setShowCamera(true);
    } else {
      alert("카메라 권한이 필요합니다.");
    }
  };

  // 사진 촬영
  const handleCapture = async () => {
    if (!camera) return;

    try {
      setScanning(true);
      const photo = await camera.takePictureAsync({
        quality: 1
      });

      if (photo) {
        setImage(photo.uri);
        setShowCamera(false);
      }
    } catch (error) {
      console.log("Capture error:", error);
      alert("사진 촬영에 실패했습니다.");
    } finally {
      setScanning(false);
    }
  };

  // 등록하기
  const handleRegister = async () => {
    if (!childName.trim()) {
      setNameError(true);
      alert("자녀 이름을 입력해주세요.");
      return;
    }

    if (!image) {
      alert("이미지를 선택해주세요.");
      return;
    }

    try {
      setScanning(true);

      const formData = new FormData();
      formData.append("image", {
        uri: image,
        name: "prescription.jpg",
        type: "image/jpeg"
      });
      formData.append("child_name", childName);

      const response = await axios.post(
        getApiUrl(ENDPOINTS.prescriptions),
        formData,
        {
          headers: {
            Authorization: `Token ${userToken}`,
            "Content-Type": "multipart/form-data"
          },
          timeout: 30000,
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );

      if (response.data.success) {
        Alert.alert("등록 성공", "처방전이 성공적으로 등록되었습니다.", [
          {
            text: "확인",
            onPress: () =>
              navigation.navigate("DocumentStorage", {
                newPrescription: response.data.data
              })
          }
        ]);
      }
    } catch (error) {
      console.error("처방전 등록 에러:", error.response?.data || error.message);
      Alert.alert(
        "등록 실패",
        "처방전 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setScanning(false);
    }
  };

  if (showCamera) {
    return (
      <ExpoCamera
        style={styles.camera}
        type={ExpoCamera.Constants.Type.back}
        ref={(ref) => setCamera(ref)}
      >
        <SafeAreaView style={styles.cameraContainer}>
          <View style={styles.cameraHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCamera(false)}
            >
              <MaterialIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.cameraTitle}>처방전 스캔</Text>
          </View>

          <View style={styles.scanFrame}>
            <View style={styles.scanCorner} />
            <View style={[styles.scanCorner, { right: 0 }]} />
            <View style={[styles.scanCorner, { bottom: 0 }]} />
            <View style={[styles.scanCorner, { bottom: 0, right: 0 }]} />
          </View>

          <View style={styles.cameraFooter}>
            {scanning ? (
              <View style={styles.scanningIndicator}>
                <Text style={styles.scanningText}>스캔 중...</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.captureButton}
                onPress={handleCapture}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </ExpoCamera>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {scanning ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#016A4C" />
          <Text style={styles.loadingText}>
            처방전을 등록하고 있어요{"\n"}잠시만 기다려주세요
          </Text>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="chevron-left" size={32} color="#CCCCCC" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>약국봉투 등록</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.inputSection}>
              <Text style={styles.label}>자녀 이름</Text>
              <TextInput
                style={[
                  styles.input,
                  (nameError || (image && !childName.trim())) &&
                    styles.inputError
                ]}
                placeholder="이름을 입력해주세요"
                placeholderTextColor="#999"
                value={childName}
                onChangeText={(text) => {
                  setChildName(text);
                  setNameError(false);
                }}
              />
              {(nameError || (image && !childName.trim())) && (
                <Text style={styles.errorText}>자녀 이름을 입력해주세요</Text>
              )}
            </View>

            <View style={styles.imageContainer}>
              {image ? (
                <View style={styles.previewContainer}>
                  <Image source={{ uri: image }} style={styles.preview} />
                  <View style={styles.previewStatus}>
                    <View style={styles.statusBadge}>
                      <MaterialIcons
                        name="check-circle"
                        size={20}
                        color="#016A4C"
                      />
                      <Text style={styles.statusText}>스캔 완료</Text>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <MaterialIcons name="camera-alt" size={48} color="#CCCCCC" />
                  <Text style={styles.emptyText}>
                    문서를 평평한 곳에 놓고{"\n"}스캔해 주세요
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.bottomButtons}>
            {image ? (
              <>
                <TouchableOpacity
                  style={[styles.uploadButton, styles.resetButton]}
                  onPress={() => setImage(null)}
                >
                  <View style={styles.buttonContent}>
                    <MaterialIcons name="refresh" size={24} color="#016A4C" />
                    <Text style={styles.resetButtonText}>다시 선택하기</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleRegister}
                  disabled={!childName.trim() || !image}
                >
                  <View style={styles.buttonContent}>
                    <MaterialIcons name="add" size={24} color="#fff" />
                    <Text
                      style={[styles.buttonText, styles.buttonTextWithIcon]}
                    >
                      등록하기
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <View style={styles.buttonContent}>
                  <MaterialIcons name="photo-library" size={24} color="#fff" />
                  <Text style={[styles.buttonText, styles.buttonTextWithIcon]}>
                    사진첩에서 불러오기
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
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
    justifyContent: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
    position: "relative"
  },
  backButton: {
    position: "absolute",
    left: 20,
    zIndex: 1
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    textAlign: "center"
  },
  content: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f9fafb"
  },
  inputSection: {
    marginBottom: 24
  },
  label: {
    fontSize: 16,
    color: "#016A4C",
    marginBottom: 8,
    fontWeight: "600"
  },
  input: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#222",
    backgroundColor: "#fff"
  },
  imageContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 24
  },
  previewContainer: {
    flex: 1,
    position: "relative"
  },
  preview: {
    flex: 1,
    borderRadius: 12
  },
  previewStatus: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3
  },
  statusText: {
    color: "#016A4C",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4
  },
  camera: {
    flex: 1,
    backgroundColor: "#000"
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "transparent"
  },
  cameraHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.3)"
  },
  cameraTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600"
  },
  closeButton: {
    position: "absolute",
    left: 20,
    padding: 8,
    borderRadius: 20
  },
  scanFrame: {
    flex: 1,
    margin: 40,
    borderWidth: 1,
    borderColor: "#016A4C",
    borderStyle: "dashed"
  },
  scanCorner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: "#016A4C",
    borderWidth: 3
  },
  cameraFooter: {
    padding: 24,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center"
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center"
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff"
  },
  scanningIndicator: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: "rgba(1,106,76,0.8)"
  },
  scanningText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600"
  },
  bottomButtons: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    gap: 12
  },
  resetButton: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#E8E8E8"
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#016A4C",
    marginLeft: 8
  },
  uploadButton: {
    backgroundColor: "#016A4C",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff"
  },
  buttonTextWithIcon: {
    marginLeft: 8,
    marginRight: 8
  },
  inputError: {
    borderColor: "#FF4444"
  },
  errorText: {
    color: "#FF4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24
  }
});
