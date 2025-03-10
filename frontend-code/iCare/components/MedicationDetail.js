import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getApiUrl, ENDPOINTS } from "../config/api";

export default function MedicationDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { medicationName } = route.params; // 약품명을 route params로 받음

  const [drugInfo, setDrugInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDrugInfo = async () => {
      try {
        const response = await fetch(getApiUrl(ENDPOINTS.drugInfo), {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ drugName: medicationName })
        });

        const data = await response.json();

        if (data.type === "no_results") {
          Alert.alert("알림", data.message, [
            { text: "확인", onPress: () => navigation.goBack() }
          ]);
          return;
        }

        if (!response.ok) {
          throw new Error("약품 정보를 불러오는데 실패했습니다.");
        }

        if (data.type === "success") {
          setDrugInfo(data.data[0]);
        } else {
          setError("약품 정보를 불러오는데 실패했습니다.");
        }
      } catch (err) {
        setError("약품 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDrugInfo();
  }, [medicationName]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#016A4C" />
          <Text style={styles.loadingText}>
            약품 정보를 불러오고 있어요{"\n"}잠시만 기다려주세요
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !drugInfo) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#666666" />
          <Text style={styles.errorText}>
            {error || "약품 정보를 찾을 수 없습니다."}
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
            <MaterialIcons name="medical-services" size={24} color="#016A4C" />
            <Text style={styles.pageTitle}>약품 정보</Text>
          </View>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.medicationCard}>
            <View style={styles.medNameContainer}>
              <View style={styles.medIconContainer}>
                <MaterialIcons name="medication" size={24} color="#016A4C" />
              </View>
              <Text style={styles.medicationName}>{drugInfo.itemName}</Text>
            </View>
            <View style={styles.companyContainer}>
              <MaterialIcons name="business" size={20} color="#666666" />
              <Text style={styles.companyName}>{drugInfo.entpName}</Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <MaterialIcons name="check-circle" size={24} color="#016A4C" />
                <Text style={styles.cardTitle}>효능・효과</Text>
              </View>
              <Text style={styles.cardContent}>{drugInfo.efcyQesitm}</Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <MaterialIcons name="warning" size={24} color="#FF9500" />
                <Text style={[styles.cardTitle, { color: "#FF9500" }]}>복약 주의사항</Text>
              </View>
              <Text style={styles.cardContent}>{drugInfo.atpnQesitm}</Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <MaterialIcons name="inventory" size={24} color="#016A4C" />
                <Text style={styles.cardTitle}>보관방법</Text>
              </View>
              <Text style={styles.cardContent}>{drugInfo.depositMethodQesitm}</Text>
            </View>
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
  medicationCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  medNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16
  },
  medIconContainer: {
    backgroundColor: "#E8FEEE",
    padding: 12,
    borderRadius: 12
  },
  medicationName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#016A4C",
    flex: 1,
    lineHeight: 24
  },
  companyContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0"
  },
  companyName: {
    fontSize: 14,
    color: "#666666"
  },
  infoSection: {
    gap: 16
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0"
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#016A4C"
  },
  cardContent: {
    fontSize: 15,
    color: "#444444",
    lineHeight: 24
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff"
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24
  }
});
