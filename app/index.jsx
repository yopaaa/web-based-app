import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const CustomWebView = () => {
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      {/* Ganti dengan logo kamu */}
      <Image
        source={require('@/assets/images/icon.png')} // pastikan path dan file sesuai
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 16 }} />
    </View>
  );

  return (
    <WebView
      source={{ uri: 'https://github.com/yopaaa' }}
      startInLoadingState
      renderLoading={renderLoading}
      javaScriptEnabled
      domStorageEnabled
    />
  );
};

export default CustomWebView;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff', // atau warna branding kamu
  },
  logo: {
    width: 120,
    height: 120,
  },
});
