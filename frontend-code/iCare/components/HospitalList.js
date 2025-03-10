import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  Linking
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiUrl, ENDPOINTS } from "../config/api";

export default function HospitalList() {
  const navigation = useNavigation();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("nearby");
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    fetchHospitals();
  }, [filterType]);

  const fetchHospitals = async () => {
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

      const endpoint = filterType === "open" ? "open" : "nearby";
      const response = await axios.get(
        getApiUrl(ENDPOINTS.hospitalList(endpoint)),
        {
          headers: {
            Authorization: `Token ${userToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.results) {
        setHospitals(response.data.results);
      }
    } catch (error) {
      console.error("병원 목록 가져오기 실패:", error);
      Alert.alert("오류", "병원 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSelect = (type) => {
    setFilterType(type);
    setIsFilterVisible(false);
  };

  const handleCall = (phoneNumber) => {
    if (!phoneNumber) {
      Alert.alert("알림", "전화번호 정보가 없습니다.");
      return;
    }

    // 전화번호에서 특수문자 제거
    const tel = phoneNumber.replace(/[^0-9]/g, "");

    Linking.canOpenURL(`tel:${tel}`)
      .then((supported) => {
        if (!supported) {
          Alert.alert("알림", "전화걸기가 지원되지 않는 기기입니다.");
        } else {
          return Linking.openURL(`tel:${tel}`);
        }
      })
      .catch((err) => {
        Alert.alert("오류", "전화 연결 중 문제가 발생했습니다.");
      });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#016A4C" />
          <Text style={styles.loadingText}>
            가까운 병원을 찾고 있어요{"\n"}잠시만 기다려주세요
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
            <MaterialIcons name="local-hospital" size={24} color="#016A4C" />
            <Text style={styles.pageTitle}>병원찾기</Text>
          </View>
          <View>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setIsFilterVisible(!isFilterVisible)}
            >
              <Text style={styles.filterText}>
                {filterType === "nearby" ? "가까운 순" : "영업중"}
              </Text>
              <MaterialIcons
                name={
                  isFilterVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"
                }
                size={24}
                color="#666666"
              />
            </TouchableOpacity>

            {isFilterVisible && (
              <View style={styles.filterDropdown}>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    filterType === "nearby" && styles.filterOptionSelected
                  ]}
                  onPress={() => handleFilterSelect("nearby")}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      filterType === "nearby" && styles.filterOptionTextSelected
                    ]}
                  >
                    가까운 순
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    filterType === "open" && styles.filterOptionSelected
                  ]}
                  onPress={() => handleFilterSelect("open")}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      filterType === "open" && styles.filterOptionTextSelected
                    ]}
                  >
                    영업중
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <ScrollView style={styles.listContainer}>
          {hospitals.map((hospital) => (
            <TouchableOpacity
              key={hospital.id}
              style={styles.hospitalItem}
              onPress={() => handleCall(hospital.phone)}
            >
              <View style={styles.typeLabel}>
                <Text style={styles.typeText}>{hospital.hospital_type}</Text>
              </View>
              <Text style={styles.hospitalName}>{hospital.name}</Text>
              <Text style={styles.statusText}>
                <Text
                  style={
                    hospital.state === "영업중"
                      ? styles.openStatus
                      : styles.closedStatus
                  }
                >
                  {hospital.state}
                </Text>
                <Text style={styles.statusDivider}> | </Text>
                {hospital.weekday_hours?.mon?.start &&
                hospital.weekday_hours?.mon?.end
                  ? `${hospital.weekday_hours.mon.start} ~ ${hospital.weekday_hours.mon.end}`
                  : "전화로 문의해주세요"}
                <Text style={styles.statusDivider}> | </Text>
                {hospital.distance.toFixed(1)}km
              </Text>
              <View style={styles.addressContainer}>
                <MaterialIcons
                  name="location-on"
                  size={16}
                  color="#666"
                  style={styles.addressIcon}
                />
                <Text style={styles.addressText}>주소: {hospital.address}</Text>
              </View>
              <View style={styles.telContainer}>
                <MaterialIcons name="phone" size={16} color="#016A4C" />
                <Text style={styles.telText}>
                  <Text style={styles.telLabel}>전화: </Text>
                  <Text style={styles.telNumber}>{hospital.phone}</Text>
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          <Text style={styles.sourceText}>제공: 건강보험심사평가원</Text>
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
    flex: 1,
    backgroundColor: "#f9fafb"
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
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
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
    fontWeight: "bold",
    color: "#016A4C"
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
  filterDropdown: {
    position: "absolute",
    top: "100%",
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 4,
    width: 120,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 1000
  },
  filterOption: {
    padding: 12,
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
  },
  listContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9fafb"
  },
  hospitalItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  typeLabel: {
    backgroundColor: "#E8FEEE",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 8
  },
  typeText: {
    color: "#016A4C",
    fontSize: 14,
    fontWeight: "600"
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222222",
    marginBottom: 8
  },
  openStatus: {
    color: "#016A4C",
    fontWeight: "600"
  },
  closedStatus: {
    color: "#E53935",
    fontWeight: "600"
  },
  statusDivider: {
    color: "#CCCCCC"
  },
  statusText: {
    color: "#666",
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    paddingRight: 8
  },
  addressIcon: {
    marginTop: 2,
    marginRight: 4
  },
  addressText: {
    color: "#666",
    fontSize: 14,
    flex: 1,
    lineHeight: 20
  },
  telContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  telText: {
    fontSize: 14,
    flex: 1
  },
  telLabel: {
    color: "#016A4C",
    fontWeight: "600"
  },
  telNumber: {
    color: "#016A4C",
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
  phoneLink: {
    color: "#016A4C",
    textDecorationLine: "underline"
  },
  sourceText: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
    marginTop: 8,
    marginBottom: 16,
    marginRight: 16,
    fontStyle: "italic"
  }
});
