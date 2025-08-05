import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Lấy IP khi chạy Expo (Expo Go sẽ có hostUri)
let localIp = null;
if (Constants.expoConfig?.hostUri) {
  localIp = Constants.expoConfig.hostUri.split(':')[0];
}

// Nếu không lấy được (trường hợp build APK hoặc chạy simulator không qua Expo)
if (!localIp) {
  if (Platform.OS === 'android') {
    // ✅ Nếu là Android thật → dùng IP LAN của máy tính
    // ✅ Nếu là emulator → vẫn dùng 10.0.2.2
    const isDevice = !__DEV__ || !process.env.EXPO_DEVTOOLS_LISTEN_ADDRESS;
    localIp = isDevice ? '192.168.1.24' : '10.0.2.2'; // 🔹 Đổi thành IP LAN thực tế của bạn
  } else {
    // iOS thật → dùng IP LAN, simulator → localhost
    const isDevice = !__DEV__;
    localIp = isDevice ? '192.168.1.24' : 'localhost'; // 🔹 Đổi thành IP LAN thực tế của bạn
  }
}

const PORT = process.env.PORT || 3000;

export const API_BASE_URL = `http://${localIp}:${PORT}`;
export const getPdfUrl = (relativePath) => `${API_BASE_URL}${relativePath}`;
