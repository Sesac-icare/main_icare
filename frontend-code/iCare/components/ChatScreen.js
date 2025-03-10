import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  Animated
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiUrl, ENDPOINTS } from "../config/api";

export default function ChatScreen() {
  const navigation = useNavigation();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "안녕하세요! 저는 아이케어봇이에요. 😊\n아이의 건강과 관련된 정보를 도와드릴게요."
    }
  ]);
  const scrollViewRef = useRef();
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [loadingDots, setLoadingDots] = useState("");
  const [userToken, setUserToken] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const loadingDotsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setLoadingDots((prev) => (prev.length >= 3 ? "" : prev + "."));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // 토큰 가져오기
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

  // 로딩 애니메이션 효과
  useEffect(() => {
    if (isGenerating) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(loadingDotsAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
          }),
          Animated.timing(loadingDotsAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true
          })
        ])
      ).start();
    } else {
      loadingDotsAnim.setValue(0);
    }
  }, [isGenerating]);

  const handlePharmacySearch = async () => {
    if (!userToken) {
      Alert.alert("오류", "로그인이 필요한 서비스입니다.");
      return;
    }

    // 사용자 메시지 추가
    const userMessage = {
      type: "user",
      text: "근처 약국 찾아줘"
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      setIsGenerating(true);
      setLoadingMessage("근처 약국을 찾고 있어요");

      const response = await axios.post(
        getApiUrl(ENDPOINTS.chat),
        {
          message: "근처 약국 찾아줘",
          session_id: `session_${Date.now()}`
        },
        {
          headers: {
            Authorization: `Token ${userToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("서버 응답:", response.data);

      // multi 타입 응답 처리
      if (response.data.type === "multi" && response.data.responses) {
        // 각 응답을 순차적으로 처리
        for (const resp of response.data.responses) {
          // 데이터 확인을 위한 로그
          if (resp.type === "hospital_list" || resp.type === "pharmacy_list") {
            console.log("리스트 데이터:", JSON.stringify(resp.data, null, 2));
          }

          // chat 타입이 아닌 경우에만 메시지 표시
          if (resp.type !== "chat" && resp.start_message) {
            setMessages((prev) => [
              ...prev,
              {
                type: "bot",
                text: resp.start_message
              }
            ]);
          }

          // 리스트 데이터가 있는 경우 표시
          if (
            (resp.type === "pharmacy_list" || resp.type === "hospital_list") &&
            resp.data
          ) {
            // Array 데이터 처리
            const formattedData = resp.data.map((item) => ({
              ...item,
              opening_time: parseInt(item.opening_time),
              closing_time: parseInt(item.closing_time)
            }));
            console.log(
              "포매팅된 데이터:",
              JSON.stringify(formattedData, null, 2)
            );
            setMessages((prev) => [
              ...prev,
              {
                type: resp.type,
                data: formattedData
              }
            ]);
          }

          // end_message 표시
          if (resp.type !== "chat" && resp.end_message) {
            setMessages((prev) => [
              ...prev,
              {
                type: "bot",
                text: resp.end_message
              }
            ]);
          }
        }
        return;
      }

      // 검색 결과 없음 처리
      if (response.data.type === "no_results") {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: response.data.start_message
          }
        ]);
        if (response.data.end_message) {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              text: response.data.end_message
            }
          ]);
        }
        return;
      }
    } catch (error) {
      console.error("API 호출 오류:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "죄송합니다. 약국 검색 중 오류가 발생했습니다."
        }
      ]);
    } finally {
      setIsGenerating(false);
      setLoadingMessage("");
    }
  };

  const handleHospitalSearch = async () => {
    if (!userToken) {
      Alert.alert("오류", "로그인이 필요한 서비스입니다.");
      return;
    }

    // 사용자 메시지 추가
    const userMessage = {
      type: "user",
      text: "근처 병원 찾아줘"
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      setIsGenerating(true);
      setLoadingMessage("근처 병원을 찾고 있어요");

      const response = await axios.post(
        getApiUrl(ENDPOINTS.chat),
        {
          message: "근처 병원 찾아줘",
          session_id: `session_${Date.now()}`
        },
        {
          headers: {
            Authorization: `Token ${userToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("서버 응답:", response.data);

      // multi 타입 응답 처리
      if (response.data.type === "multi" && response.data.responses) {
        // 각 응답을 순차적으로 처리
        for (const resp of response.data.responses) {
          // 데이터 확인을 위한 로그
          if (resp.type === "hospital_list" || resp.type === "pharmacy_list") {
            console.log("리스트 데이터:", JSON.stringify(resp.data, null, 2));
          }

          // chat 타입이 아닌 경우에만 메시지 표시
          if (resp.type !== "chat" && resp.start_message) {
            setMessages((prev) => [
              ...prev,
              {
                type: "bot",
                text: resp.start_message
              }
            ]);
          }

          // 리스트 데이터가 있는 경우 표시
          if (resp.type === "pharmacy_list" || resp.type === "hospital_list") {
            setMessages((prev) => [
              ...prev,
              {
                type: resp.type,
                data: resp.data
              }
            ]);
          }

          // end_message 표시
          if (resp.type !== "chat" && resp.end_message) {
            setMessages((prev) => [
              ...prev,
              {
                type: "bot",
                text: resp.end_message
              }
            ]);
          }
        }
        return;
      }

      // 검색 결과 없음 처리
      if (response.data.type === "no_results") {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: response.data.start_message
          }
        ]);
        if (response.data.end_message) {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              text: response.data.end_message
            }
          ]);
        }
        return;
      }
    } catch (error) {
      console.error("API 호출 오류:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "죄송합니다. 병원 검색 중 오류가 발생했습니다."
        }
      ]);
    } finally {
      setIsGenerating(false);
      setLoadingMessage("");
    }
  };

  const handlePrescriptionUpload = () => {
    navigation.navigate("RegisterPrescription");
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      type: "user",
      text: message
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsGenerating(true);
    setLoadingMessage("답변을 생성하고 있어요\n잠시만 기다려주세요");

    try {
      const response = await axios.post(
        getApiUrl(ENDPOINTS.chat),
        {
          message: message,
          session_id: `session_${Date.now()}`
        },
        {
          headers: {
            Authorization: `Token ${userToken}`,
            "Content-Type": "application/json"
          },
          timeout: 30000 // 30초 타임아웃 설정
        }
      );

      console.log("서버 응답 데이터:", response.data);

      if (response.data.type === "pharmacy_list") {
        // start_message 표시
        if (response.data.start_message) {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              text: response.data.start_message
            }
          ]);
        }

        // 약국 리스트 메시지
        const pharmacyListMessage = {
          type: "pharmacy_list",
          data: response.data.data
        };
        setMessages((prev) => [...prev, pharmacyListMessage]);

        // end_message 표시
        if (response.data.end_message) {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              text: response.data.end_message
            }
          ]);
        }
        return;
      }

      // data 처리 (병원 리스트인 경우)
      if (response.data.type === "hospital_list") {
        // start_message 표시
        if (response.data.start_message) {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              text: response.data.start_message
            }
          ]);
        }

        // 병원 리스트 메시지
        const hospitalListMessage = {
          type: "hospital_list",
          data: response.data.data
        };
        setMessages((prev) => [...prev, hospitalListMessage]);

        // end_message 표시
        if (response.data.end_message) {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              text: response.data.end_message
            }
          ]);
        }
        return;
      }

      // start_message 표시
      if (response.data.start_message && response.data.start_message.trim()) {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: response.data.start_message
          }
        ]);
      }

      // end_message 표시
      if (response.data.end_message && response.data.end_message.trim()) {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: response.data.end_message
          }
        ]);
      }
    } catch (error) {
      console.error("API 호출 오류:", error);

      // 타임아웃 에러 처리
      if (error.code === "ECONNABORTED") {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: "죄송합니다. 응답 시간이 길어지고 있습니다.\n잠시 후 다시 시도해주세요."
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: "죄송합니다. 답변을 생성하는 중 오류가 발생했습니다.\n다시 시도해주세요."
          }
        ]);
      }
    } finally {
      setIsGenerating(false);
      setLoadingMessage("");
    }
  };

  const startRecording = async () => {
    try {
      // 이전 녹음 객체가 있다면 정리
      if (recording) {
        await recording.stopAndUnloadAsync();
        setRecording(null);
      }

      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert("권한 필요", "음성 인식을 위해 마이크 권한이 필요합니다.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true
      });

      // 녹음 시작 시 사용자 메시지 추가
      setMessages((prev) => [
        ...prev,
        {
          type: "user",
          text: "🎤 음성 메시지 녹음 중..."
        }
      ]);

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync({
        android: {
          extension: ".wav",
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000
        },
        ios: {
          extension: ".wav",
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCM: true,
          audioFormat: Audio.RECORDING_OPTION_IOS_AUDIO_FORMAT_LINEARPCM
        }
      });

      await newRecording.startAsync();
      setRecording(newRecording);
      setIsRecording(true);
    } catch (error) {
      console.error("녹음 시작 오류:", error);
      Alert.alert("오류", "녹음을 시작할 수 없습니다.");
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;
      if (!userToken) {
        Alert.alert("오류", "로그인이 필요한 서비스입니다.");
        return;
      }

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      // 녹음 객체 정리
      setRecording(null);
      setIsRecording(false);

      // 녹음 중 메시지를 "음성 메시지 변환 중..."으로 변경
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          type: "user",
          text: "음성 메시지 변환 중..."
        }
      ]);

      try {
        setIsGenerating(true);
        setLoadingMessage("음성을 인식하고 있어요");

        const formData = new FormData();
        formData.append("audio", {
          uri: uri,
          type: "audio/wav",
          name: "audio.wav"
        });
        formData.append("session_id", `session_${Date.now()}`);
        formData.append("need_voice", "true");

        const response = await axios.post(getApiUrl(ENDPOINTS.chat), formData, {
          headers: {
            Authorization: `Token ${userToken}`,
            "Content-Type": "multipart/form-data"
          }
        });

        console.log("음성 인식 응답:", response.data);

        // 사용자의 음성 메시지를 채팅창에 추가
        if (response.data.input_text) {
          // "음성 메시지 변환 중..." 메시지를 실제 변환된 텍스트로 교체
          setMessages((prev) => [
            ...prev.slice(0, -1),
            {
              type: "user",
              text: response.data.input_text
            }
          ]);
        }

        // 음성 응답 재생
        if (response.data.audio) {
          const sound = new Audio.Sound();
          await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            allowsRecordingIOS: false,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false
          });

          await sound.loadAsync({
            uri: `data:${response.data.audio_type};base64,${response.data.audio}`
          });

          await sound.setVolumeAsync(1.0);
          await sound.playAsync();
        }

        // 서버 응답 메시지 처리
        if (
          response.data.type === "pharmacy_list" ||
          response.data.type === "hospital_list"
        ) {
          // start_message 표시
          if (response.data.start_message) {
            setMessages((prev) => [
              ...prev,
              {
                type: "bot",
                text: response.data.start_message
              }
            ]);
          }

          // 리스트 메시지
          const listMessage = {
            type: response.data.type,
            data: response.data.data
          };
          setMessages((prev) => [...prev, listMessage]);

          // end_message 표시
          if (response.data.end_message) {
            setMessages((prev) => [
              ...prev,
              {
                type: "bot",
                text: response.data.end_message
              }
            ]);
          }
        } else {
          // 일반 응답 메시지
          const botMessage = {
            type: "bot",
            text: response.data.start_message
          };
          setMessages((prev) => [...prev, botMessage]);
        }
      } catch (error) {
        console.error("음성 인식 오류:", error);
        const errorMessage = {
          type: "bot",
          text: "음성 인식 중 오류가 발생했습니다. 다시 시도해주세요."
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsGenerating(false);
        setLoadingMessage("");
      }
    } catch (error) {
      console.error("녹음 중지 오류:", error);
      Alert.alert("오류", "녹음을 중지할 수 없습니다.");
    }
  };

  // 시간 포매팅 함수 추가
  const formatTime = (time) => {
    if (!time) return "";

    // 숫자가 아닌 경우 처리
    if (typeof time !== "number") {
      time = parseInt(time);
    }

    const timeStr = time.toString().padStart(4, "0");
    const hours = timeStr.slice(0, -2);
    const minutes = timeStr.slice(-2);
    return `${hours}:${minutes}`;
  };

  const renderHospitalItem = (hospital) => {
    return (
      <View style={styles.hospitalItem}>
        <View style={styles.hospitalHeader}>
          <View style={styles.typeLabel}>
            <Text style={styles.typeText}>{hospital.hospital_type}</Text>
          </View>
        </View>

        <Text style={styles.hospitalName}>{hospital.name}</Text>

        <View style={styles.infoContainer}>
          <MaterialIcons name="location-on" size={16} color="#666" />
          <Text style={styles.infoText}>{hospital.address}</Text>
        </View>

        <View style={styles.infoContainer}>
          <MaterialIcons name="phone" size={16} color="#666" />
          <Text style={styles.infoText}>{hospital.phone}</Text>
        </View>

        <View style={styles.infoContainer}>
          <MaterialIcons name="schedule" size={16} color="#666" />
          <Text style={styles.infoText}>
            {formatTime(hospital.opening_time)} ~{" "}
            {formatTime(hospital.closing_time)}
          </Text>
        </View>

        <View style={styles.distanceContainer}>
          <Text style={styles.distanceText}>{hospital.distance}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <SafeAreaView style={styles.safe}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Image
            source={require("../assets/HeaderGreenLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* 타이틀
        <View style={styles.titleContainer}>
          <Text style={styles.title}>아이케어봇</Text>
        </View> */}

        <ScrollView
          style={styles.chatContainer}
          ref={scrollViewRef}
          onContentSizeChange={() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }}
        >
          {/* 메시지 목록 */}
          {messages.map((msg, index) => (
            <View key={index}>
              {msg.type === "bot" && (
                <Text style={styles.botName}>아이케어봇</Text>
              )}
              {msg.type === "pharmacy_list" ? (
                <View style={styles.listContainer}>
                  {msg.data.map((pharmacy, idx) => (
                    <View key={idx} style={styles.hospitalItem}>
                      <View style={styles.hospitalHeader}>
                        <View style={styles.typeLabel}>
                          <Text style={styles.typeText}>약국</Text>
                        </View>
                      </View>
                      <Text style={styles.hospitalName}>
                        {pharmacy["약국명"]}
                      </Text>
                      <View style={styles.infoContainer}>
                        <MaterialIcons
                          name="location-on"
                          size={16}
                          color="#666"
                        />
                        <Text style={styles.infoText}>{pharmacy["주소"]}</Text>
                      </View>
                      <View style={styles.infoContainer}>
                        <MaterialIcons name="schedule" size={16} color="#666" />
                        <Text style={styles.infoText}>
                          {pharmacy["영업 시간"]}
                        </Text>
                      </View>
                      <View style={styles.infoContainer}>
                        <MaterialIcons name="phone" size={16} color="#666" />
                        <Text style={styles.infoText}>{pharmacy["전화"]}</Text>
                      </View>
                      <View style={styles.distanceContainer}>
                        <Text style={styles.distanceText}>
                          {pharmacy["거리"]}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : msg.type === "hospital_list" ? (
                <View style={styles.listContainer}>
                  {msg.data.map((hospital, idx) => (
                    <View key={idx} style={styles.hospitalItem}>
                      <View style={styles.hospitalHeader}>
                        <View style={styles.typeLabel}>
                          <Text style={styles.typeText}>
                            {hospital.hospital_type}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.hospitalName}>{hospital.name}</Text>
                      <View style={styles.infoContainer}>
                        <MaterialIcons
                          name="location-on"
                          size={16}
                          color="#666"
                        />
                        <Text style={styles.infoText}>{hospital.address}</Text>
                      </View>
                      <View style={styles.infoContainer}>
                        <MaterialIcons name="schedule" size={16} color="#666" />
                        <Text style={styles.infoText}>
                          {formatTime(hospital.opening_time)} ~{" "}
                          {formatTime(hospital.closing_time)}
                        </Text>
                      </View>
                      <View style={styles.infoContainer}>
                        <MaterialIcons name="phone" size={16} color="#666" />
                        <Text style={styles.infoText}>{hospital.phone}</Text>
                      </View>
                      <View style={styles.distanceContainer}>
                        <Text style={styles.distanceText}>
                          {hospital.distance}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View
                  style={[
                    styles.messageContainer,
                    msg.type === "user"
                      ? styles.userContainer
                      : styles.botContainer
                  ]}
                >
                  <View
                    style={
                      msg.type === "user" ? styles.userBubble : styles.botBubble
                    }
                  >
                    <Text
                      style={
                        msg.type === "user"
                          ? styles.whiteText
                          : styles.messageText
                      }
                    >
                      {msg.text}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          ))}

          {/* 응답 생성 중일 때 표시되는 로딩 메시지 */}
          {isGenerating && (
            <View>
              <Text style={styles.botName}>아이케어봇</Text>
              <View style={[styles.messageContainer, styles.botContainer]}>
                <View style={[styles.botBubble, styles.loadingBubble]}>
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>{loadingMessage}</Text>
                    <Animated.Text
                      style={[
                        styles.loadingDots,
                        {
                          opacity: loadingDotsAnim,
                          transform: [
                            {
                              translateY: loadingDotsAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -3]
                              })
                            }
                          ]
                        }
                      ]}
                    >
                      ...
                    </Animated.Text>
                    <MaterialIcons
                      name="pending"
                      size={18}
                      color="#016A4C"
                      style={styles.loadingIcon}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* 버튼 그룹 */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.whiteButton}
              onPress={handlePharmacySearch}
            >
              <Text style={styles.buttonText}>약국 찾기 💊</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.whiteButton}
              onPress={handleHospitalSearch}
            >
              <Text style={styles.buttonText}>병원 찾기 🏥</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.whiteButton, styles.wideButton]}
              onPress={handlePrescriptionUpload}
            >
              <Text style={styles.buttonText}>약 봉투 등록 ➕</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* 입력창 */}
        <View style={styles.inputOuterContainer}>
          <View
            style={[
              styles.inputContainer,
              isRecording && styles.inputContainerRecording
            ]}
          >
            <TouchableOpacity
              style={styles.voiceButton}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <MaterialIcons
                name={isRecording ? "mic-off" : "mic"}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="메시지를 입력해주세요."
                placeholderTextColor="#999"
                value={isRecording ? `음성 입력 중${loadingDots}` : message}
                onChangeText={setMessage}
                multiline
                editable={!isRecording}
              />
            </View>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
            >
              <MaterialIcons name="send" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0"
  },
  logo: {
    width: 48,
    height: 48,
    marginLeft: "auto",
    marginRight: "auto"
  },
  chatContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff"
  },
  grayBox: {
    backgroundColor: "#F5F5F5",
    padding: 14,
    paddingHorizontal: 16,
    borderRadius: 20,
    maxWidth: "auto",
    alignSelf: "flex-start",
    marginBottom: 16,
    marginLeft: 4,
    marginRight: 48
  },
  greenBox: {
    backgroundColor: "#00B386",
    padding: 12,
    paddingHorizontal: 14,
    borderRadius: 20,
    maxWidth: "65%",
    alignSelf: "flex-end",
    marginBottom: 12,
    marginRight: 8,
    marginLeft: 48
  },
  messageText: {
    fontSize: 15,
    color: "#222",
    lineHeight: 22,
    flexShrink: 1
  },
  whiteText: {
    fontSize: 14,
    color: "#fff",
    lineHeight: 20,
    flexShrink: 1
  },
  botName: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
    marginLeft: 8,
    fontWeight: "500"
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
    paddingHorizontal: 4
  },
  whiteButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  buttonText: {
    fontSize: 14,
    color: "#016A4C",
    textAlign: "center",
    fontWeight: "600"
  },
  wideButton: {
    marginTop: 4,
    width: "auto",
    alignSelf: "flex-start"
  },
  inputOuterContainer: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: Platform.OS === "ios" ? 8 : 8
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 6
  },
  inputContainerRecording: {
    backgroundColor: "#E8F5F0" // 옅은 초록색
  },
  voiceButton: {
    marginRight: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center"
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: 4
  },
  input: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 16,
    color: "#222",
    maxHeight: 100
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#016a4c",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4
  },
  listContainer: {
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16
  },
  hospitalItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  hospitalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  typeLabel: {
    backgroundColor: "#E8F5E9",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12
  },
  typeText: {
    color: "#016A4C",
    fontSize: 13,
    fontWeight: "600"
  },
  hospitalName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6
  },
  infoText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#666",
    flex: 1 // 긴 텍스트 자동 줄바꿈
  },
  distanceContainer: {
    marginTop: 4,
    alignItems: "flex-end"
  },
  distanceText: {
    fontSize: 13,
    color: "#016A4C",
    fontWeight: "500"
  },
  messageContainer: {
    marginBottom: 20 // 메시지 간격 증가
  },
  userContainer: {
    alignSelf: "flex-end"
  },
  botContainer: {
    alignSelf: "flex-start"
  },
  userBubble: {
    backgroundColor: "#00B386",
    padding: 12,
    paddingHorizontal: 14,
    borderRadius: 20,
    maxWidth: "65%",
    marginBottom: 12,
    marginRight: 8,
    marginLeft: 48
  },
  botBubble: {
    backgroundColor: "#F5F5F5",
    padding: 14,
    paddingHorizontal: 16,
    borderRadius: 20,
    maxWidth: "auto",
    marginBottom: 16,
    marginLeft: 4,
    marginRight: 48
  },
  loadingBubble: {
    backgroundColor: "#E8FEEE",
    borderWidth: 1,
    borderColor: "#016A4C20"
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  loadingText: {
    color: "#016A4C",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 22
  },
  loadingDots: {
    color: "#016A4C",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: -2 // 텍스트와 수직 정렬을 맞추기 위해
  },
  loadingIcon: {
    marginLeft: 8
  },
  pharmacyItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  pharmacyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  pharmacyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222"
  },
  stateLabel: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12
  },
  openState: {
    backgroundColor: "#E8F5E9"
  },
  closedState: {
    backgroundColor: "#FFEBEE"
  },
  stateText: {
    fontSize: 12,
    fontWeight: "600"
  },
  openStateText: {
    color: "#016A4C"
  },
  closedStateText: {
    color: "#D32F2F"
  },
  sourceText: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
    marginTop: 8,
    fontStyle: "italic"
  }
});
