import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet, SafeAreaView, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Header from "./components/Header";
import Contents from "./components/Contents";
import Splash from "./components/Splash";
import HospitalList from "./components/HospitalList";
import PharmacyList from "./components/PharmacyList";
import MyPage from "./components/MyPage";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
import DocumentStorage from "./components/DocumentStorage";
import RegisterPrescription from "./components/RegisterPrescription";
import { Camera as ExpoCamera } from "expo-camera";
import ChatScreen from "./components/ChatScreen";
import PrescriptionDetail from "./components/PrescriptionDetail";
import MedicationDetail from "./components/MedicationDetail";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Header />
        <Contents />
      </View>
    </SafeAreaView>
  );
};

// 마이페이지용 Stack Navigator 생성
const MyPageStack = createNativeStackNavigator();

function MyPageStackScreen() {
  return (
    <MyPageStack.Navigator screenOptions={{ headerShown: false }}>
      <MyPageStack.Screen name="MyPageMain" component={MyPage} />
      <MyPageStack.Screen name="DocumentStorage" component={DocumentStorage} />
      <MyPageStack.Screen
        name="PrescriptionDetail"
        component={PrescriptionDetail}
      />
      <MyPageStack.Screen
        name="MedicationDetail"
        component={MedicationDetail}
      />
      <MyPageStack.Screen
        name="RegisterPrescription"
        component={RegisterPrescription}
      />
    </MyPageStack.Navigator>
  );
}

// TabNavigator 수정
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          borderTopWidth: 1,
          borderTopColor: "#f0f0f0",
          paddingBottom: 20,
          paddingTop: 10,
          height: 80
        },
        tabBarActiveTintColor: "#016a4c",
        tabBarInactiveTintColor: "#CCCCCC",
        tabBarLabelStyle: {
          paddingBottom: 8,
          fontSize: 12,
          fontWeight: "500",
          marginTop: -4
        },
        tabBarIconStyle: {
          marginTop: -4
        }
      }}
    >
      <Tab.Screen
        name="홈"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={28} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="채팅"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="forum" size={28} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="마이페이지"
        component={MyPageStackScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={28} color={color} />
          ),
          tabBarStyle: {
            height: 60,
            borderTopWidth: 1,
            borderTopColor: "#f0f0f0",
            paddingBottom: 20,
            paddingTop: 10,
            height: 80
          },
          tabBarActiveTintColor: "#016a4c",
          tabBarInactiveTintColor: "#CCCCCC",
          tabBarLabelStyle: {
            paddingBottom: 8,
            fontSize: 12,
            fontWeight: "500",
            marginTop: -4
          },
          tabBarIconStyle: {
            marginTop: -4
          }
        }}
      />
    </Tab.Navigator>
  );
}

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 3초 후에 스플래시 화면 숨기기
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Splash />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="HospitalList" component={HospitalList} />
        <Stack.Screen name="PharmacyList" component={PharmacyList} />
        <Stack.Screen
          name="RegisterPrescription"
          component={RegisterPrescription}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  container: {
    flex: 1,
    backgroundColor: "#f9fafb"
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    backgroundColor: "#f0f0f0",
    padding: 14,
    borderRadius: 9,
    marginBottom: 9,
    alignItems: "center"
  },
  buttonText: {
    fontSize: 18,
    color: "green",
    fontFamily: "NotoSansKR"
  },
  camera: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center"
  }
});

export default App;
