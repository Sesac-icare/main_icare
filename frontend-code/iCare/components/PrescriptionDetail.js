import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { getApiUrl, ENDPOINTS } from "../config/api";

export default function PrescriptionDetail({ route }) {
  const navigation = useNavigation();
  const { prescriptionId } = route.params;
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptionDetail();
  }, [prescriptionId]);

  const fetchPrescriptionDetail = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (!userToken) {
        Alert.alert("오류", "로그인이 필요합니다.");
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }]
        });
        return;
      }

      const response = await axios.get(
        getApiUrl(ENDPOINTS.prescriptionDetail(prescriptionId)),
        {
          headers: {
            Authorization: `Token ${userToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.success && response.data.data) {
        const { data } = response.data;
        setPrescription({
          childName: data.child_name,
          pharmacyName: data.pharmacy_info.name,
          address: data.pharmacy_info.address,
          date: new Date(data.prescription_date)
            .toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit"
            })
            .replace(/\. /g, "."),
          price: data.total_amount,
          medicines: data.medicines.map((med) => ({
            name: med.name,
            dosage: `${med.dosage}정, ${med.frequency}회, ${med.duration}일`,
            details: "..."
          }))
        });
      }
    } catch (error) {
      console.error("처방전 상세 정보 가져오기 실패:", error);
      if (error.response?.status === 401) {
        Alert.alert("오류", "인증이 만료되었습니다. 다시 로그인해주세요.");
        await AsyncStorage.removeItem("userToken");
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }]
        });
      } else {
        Alert.alert("오류", "처방전 정보를 불러오는데 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInfoPress = async (medName) => {
    try {
      const response = await fetch(getApiUrl(ENDPOINTS.drugInfo), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ drugName: medName })
      });
      if (!response.ok) {
        throw new Error("API 호출 실패");
      }
      const data = await response.json();
      navigation.navigate("MedicationDetail", {
        medicationName: medName,
        drugData: data
      });
    } catch (error) {
      console.error("정보 가져오기 실패:", error);
      Alert.alert("오류", "약품 정보를 불러오는데 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  if (!prescription) {
    return (
      <View style={styles.errorContainer}>
        <Text>처방전 정보를 불러올 수 없습니다.</Text>
      </View>
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
            <MaterialIcons name="medication" size={24} color="#016A4C" />
            <Text style={styles.pageTitle}>조제 약 정보</Text>
          </View>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <View style={styles.nameTag}>
                <MaterialIcons name="person" size={16} color="#016A4C" />
                <Text style={styles.nameText}>{prescription.childName}</Text>
              </View>
              <Text style={styles.date}>{prescription.date}</Text>
            </View>

            <View style={styles.pharmacyInfo}>
              <View style={styles.infoRow}>
                <MaterialIcons
                  name="local-pharmacy"
                  size={20}
                  color="#016A4C"
                />
                <Text style={styles.pharmacyName}>
                  {prescription.pharmacyName}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="location-on" size={20} color="#666666" />
                <Text style={styles.address}>{prescription.address}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="payment" size={20} color="#666666" />
                <Text style={styles.price}>{prescription.price}원</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionTitle}>
            <MaterialIcons name="medical-services" size={20} color="#016A4C" />
            <Text style={styles.sectionText}>처방 약품 목록</Text>
          </View>

          <View style={styles.medicationList}>
            {prescription.medicines.map((med, index) => (
              <View key={index} style={styles.medicationItem}>
                <View style={styles.medHeader}>
                  <Text style={styles.medName}>{med.name}</Text>
                  <TouchableOpacity
                    style={styles.infoButton}
                    onPress={() => handleInfoPress(med.name)}
                  >
                    <MaterialIcons
                      name="info-outline"
                      size={16}
                      color="#016A4C"
                    />
                    <Text style={styles.infoButtonText}>정보 보기</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.dosageContainer}>
                  <MaterialIcons name="schedule" size={16} color="#666666" />
                  <Text style={styles.dosage}>{med.dosage}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
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
  subHeader: {
    flexDirection: "row",
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
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9fafb"
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  cardHeader: {
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
  nameText: {
    color: "#016A4C",
    fontSize: 14,
    fontWeight: "600"
  },
  pharmacyInfo: {
    gap: 12
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  pharmacyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#016A4C"
  },
  address: {
    fontSize: 14,
    color: "#666666",
    flex: 1
  },
  date: {
    fontSize: 14,
    color: "#666666"
  },
  price: {
    fontSize: 14,
    color: "#666666"
  },
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16
  },
  sectionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#016A4C"
  },
  medicationList: {
    gap: 12
  },
  medicationItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  medHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  medName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222222"
  },
  infoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8FEEE",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4
  },
  infoButtonText: {
    color: "#016A4C",
    fontSize: 13,
    fontWeight: "500"
  },
  dosageContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  dosage: {
    fontSize: 14,
    color: "#666666"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
