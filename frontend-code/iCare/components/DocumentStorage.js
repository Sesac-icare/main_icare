import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Platform,
  Alert,
  FlatList,
  ActivityIndicator
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DocumentStorage({ route }) {
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortByDate, setSortByDate] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

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

  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get(
        "http://172.16.217.175:8000/prescriptions/list/",
        {
          headers: {
            Authorization: `Token ${userToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.results) {
        const formattedPrescriptions = response.data.results.map((item) => ({
          documentId: item.prescription_number,
          prescriptionId: item.prescription_id,
          childName: item.child_name,
          date: new Date(item.prescription_date)
            .toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit"
            })
            .replace(/\. /g, "."),
          pharmacyName: item.pharmacy_name,
          pharmacyAddress: item.pharmacy_address,
          totalAmount: item.total_amount,
          duration: item.duration,
          endDate: item.end_date,
          createdAt: new Date(item.created_at)
        }));

        setPrescriptions(formattedPrescriptions);
      }
    } catch (error) {
      console.error("처방전 목록 가져오기 실패:", error);
      if (error.response?.status === 401) {
        Alert.alert("오류", "인증이 만료되었습니다. 다시 로그인해주세요.");
        await AsyncStorage.removeItem("userToken");
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }]
        });
      } else {
        Alert.alert("오류", "처방전 목록을 불러오는데 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptionsByDate = async () => {
    try {
      const response = await axios.get(
        "http://172.16.217.175:8000/prescriptions/by-date/",
        {
          headers: {
            Authorization: `Token ${userToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.results) {
        const formattedPrescriptions = response.data.results.map((item) => ({
          documentId: item.prescription_number,
          prescriptionId: item.prescription_id,
          childName: item.child_name,
          date: new Date(item.prescription_date)
            .toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit"
            })
            .replace(/\. /g, "."),
          pharmacyName: item.pharmacy_name,
          pharmacyAddress: item.pharmacy_address,
          totalAmount: item.total_amount,
          duration: item.duration,
          endDate: item.end_date,
          createdAt: new Date(item.created_at)
        }));

        setPrescriptions(formattedPrescriptions);
        setSortByDate(true);
      }
    } catch (error) {
      console.error("처방전 정렬 실패:", error);
      if (error.response?.status === 401) {
        Alert.alert("오류", "인증이 만료되었습니다. 다시 로그인해주세요.");
        await AsyncStorage.removeItem("userToken");
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }]
        });
      } else {
        Alert.alert("오류", "처방전 목록을 불러오는데 실패했습니다.");
      }
    }
  };

  const handleSort = () => {
    if (!sortByDate) {
      fetchPrescriptionsByDate();
    } else {
      fetchPrescriptions();
      setSortByDate(false);
    }
  };

  useEffect(() => {
    if (userToken) {
      fetchPrescriptions();
    }
  }, [userToken]);

  useEffect(() => {
    if (route.params?.newPrescription && userToken) {
      fetchPrescriptions();
    }
  }, [route.params?.newPrescription]);

  const handleDelete = (prescription) => {
    console.log("삭제할 처방전 ID:", prescription.prescriptionId);
    setSelectedPrescription(prescription);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (!selectedPrescription?.prescriptionId) {
        Alert.alert("오류", "처방전 ID를 찾을 수 없습니다.");
        return;
      }

      const response = await axios.delete(
        `http://172.16.217.175:8000/prescriptions/${selectedPrescription.prescriptionId}/`,
        {
          headers: {
            Authorization: `Token ${userToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 204 || response.status === 200) {
        setShowDeleteModal(false);
        setSelectedPrescription(null);
        setSortByDate(false);
        await fetchPrescriptions();
        Alert.alert("알림", "처방전이 삭제되었습니다.");
      }
    } catch (error) {
      console.error("처방전 삭제 실패:", error.response || error);
      if (error.response?.status === 401) {
        Alert.alert("오류", "인증이 만료되었습니다. 다시 로그인해주세요.");
        await AsyncStorage.removeItem("userToken");
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }]
        });
      } else {
        Alert.alert(
          "오류",
          "처방전 삭제에 실패했습니다.\n네트워크 연결을 확인해주세요."
        );
      }
      setShowDeleteModal(false);
      setSelectedPrescription(null);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      key={item.documentId}
      style={styles.prescriptionItem}
      onPress={() =>
        navigation.navigate("PrescriptionDetail", {
          prescriptionId: item.prescriptionId
        })
      }
    >
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <View style={styles.nameTag}>
            <MaterialIcons name="person" size={16} color="#016A4C" />
            <Text style={styles.childName}>{item.childName}</Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item)}
          >
            <MaterialIcons name="delete-outline" size={20} color="#FF4444" />
          </TouchableOpacity>
        </View>

        <View style={styles.itemDetails}>
          <View style={styles.detailRow}>
            <MaterialIcons name="event" size={16} color="#666666" />
            <Text style={styles.date}>{item.date}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="local-pharmacy" size={16} color="#016A4C" />
            <Text style={styles.pharmacyName}>{item.pharmacyName}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="schedule" size={16} color="#666666" />
            <Text style={styles.duration}>
              {item.duration
                ? `${item.duration}일 복용 | ${item.endDate} 까지`
                : item.endDate}
            </Text>
          </View>
        </View>

        <View style={styles.itemFooter}>
          <Text style={styles.viewDetail}>자세히 보기</Text>
          <MaterialIcons name="chevron-right" size={20} color="#016A4C" />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#016A4C" />
          <Text style={styles.loadingText}>
            서류를 불러오고 있어요{"\n"}잠시만 기다려주세요
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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

        <View style={styles.subHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.pageTitle}>서류보관함</Text>
          </View>
          {prescriptions.length > 0 && (
            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setIsFilterVisible(!isFilterVisible)}
              >
                <Text style={styles.filterText}>
                  {sortByDate ? "최신순" : "기본순"}
                </Text>
                <MaterialIcons
                  name={
                    isFilterVisible
                      ? "keyboard-arrow-up"
                      : "keyboard-arrow-down"
                  }
                  size={24}
                  color="#016A4C"
                />
              </TouchableOpacity>

              {isFilterVisible && (
                <View style={styles.filterDropdown}>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      !sortByDate && styles.filterOptionSelected
                    ]}
                    onPress={() => {
                      handleSort();
                      setIsFilterVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        !sortByDate && styles.filterOptionTextSelected
                      ]}
                    >
                      기본순
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      sortByDate && styles.filterOptionSelected
                    ]}
                    onPress={() => {
                      handleSort();
                      setIsFilterVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        sortByDate && styles.filterOptionTextSelected
                      ]}
                    >
                      최신순
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>

        {prescriptions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="description" size={80} color="#CCCCCC" />
            </View>
            <Text style={styles.emptyText}>
              약국봉투를 등록하고{"\n"}
              처방전을 관리해보세요
            </Text>
            <Text style={styles.subText}>채팅으로도 등록할 수 있습니다.</Text>
          </View>
        ) : (
          <FlatList
            data={prescriptions}
            renderItem={renderItem}
            keyExtractor={(item) => item.documentId}
            contentContainerStyle={[styles.content, { paddingBottom: 80 }]}
          />
        )}

        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("RegisterPrescription")}
          >
            <MaterialIcons name="medication" size={24} color="#fff" />
            <Text style={styles.addButtonText}>약국봉투 등록하기</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={showImageModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowImageModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowImageModal(false)}
              >
                <MaterialIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <Image
              source={{ uri: selectedImage }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          </View>
        </Modal>

        <Modal
          visible={showDeleteModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDeleteModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.deleteModalContent}>
              <Text style={styles.deleteModalTitle}>
                처방전을 삭제하시겠습니까?
              </Text>
              <Text style={styles.deleteModalSubtitle}>
                삭제된 처방전은 복구할 수 없습니다.
              </Text>
              <View style={styles.deleteModalButtons}>
                <TouchableOpacity
                  style={[styles.deleteModalButton, styles.cancelButton]}
                  onPress={() => setShowDeleteModal(false)}
                >
                  <Text style={styles.cancelButtonText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.deleteModalButton, styles.confirmButton]}
                  onPress={confirmDelete}
                >
                  <Text style={styles.confirmButtonText}>삭제</Text>
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
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#222"
  },
  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0"
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#016A4C"
  },
  filterContainer: {
    position: "relative"
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4
  },
  filterText: {
    fontSize: 14,
    color: "#016A4C",
    fontWeight: "600"
  },
  filterTextActive: {
    color: "#016A4C"
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: "#f9fafb"
  },
  content: {
    padding: 20,
    backgroundColor: "#f9fafb"
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 40,
    margin: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: "#E8FEEE",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24
  },
  emptyText: {
    fontSize: 20,
    color: "#333",
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 12,
    fontWeight: "600"
  },
  subText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginBottom: 40
  },
  bottomButtonContainer: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0"
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#016A4C",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8
  },
  prescriptionItem: {
    backgroundColor: "#fff",
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  itemContent: {
    padding: 16
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16
  },
  nameTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8FEEE",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6
  },
  childName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#016A4C"
  },
  itemDetails: {
    gap: 12
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  date: {
    fontSize: 15,
    color: "#666666"
  },
  pharmacyName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#016A4C"
  },
  duration: {
    fontSize: 14,
    color: "#666666"
  },
  itemFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0"
  },
  viewDetail: {
    fontSize: 14,
    color: "#016A4C",
    fontWeight: "500",
    marginRight: 4
  },
  deleteButton: {
    padding: 8,
    backgroundColor: "#FFF2F2",
    borderRadius: 8
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000"
  },
  modalHeader: {
    padding: 20,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1
  },
  closeButton: {
    padding: 8
  },
  modalImage: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  deleteModalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8
  },
  deleteModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8
  },
  deleteModalSubtitle: {
    fontSize: 15,
    color: "#666",
    marginBottom: 24,
    textAlign: "center"
  },
  deleteModalButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%"
  },
  deleteModalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center"
  },
  cancelButton: {
    backgroundColor: "#f5f5f5"
  },
  confirmButton: {
    backgroundColor: "#FF4444"
  },
  cancelButtonText: {
    color: "#444",
    fontSize: 16,
    fontWeight: "600"
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
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
  },
  filterDropdown: {
    position: "absolute",
    top: "100%",
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 8,
    width: 120,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 1000
  },
  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0"
  },
  filterOptionSelected: {
    backgroundColor: "#E8FEEE"
  },
  filterOptionText: {
    fontSize: 14,
    color: "#666666"
  },
  filterOptionTextSelected: {
    color: "#016A4C",
    fontWeight: "600"
  }
});
