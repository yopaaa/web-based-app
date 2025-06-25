import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';

const CustomWebViews = () => {
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      {/* Ganti dengan logo kamu */}
      <Image
        source={require('@/assets/images/adaptive-icon.png')} // pastikan path dan file sesuai
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 16, height: 100, width: 100 }} />
    </View>
  );

  return (
      <WebView
       style={{ paddingTop: 50 }}
        source={{ uri: 'https://github.com/yopaaa' }}
        startInLoadingState
        renderLoading={renderLoading}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled={true} // ini penting!
      onLoadEnd={handleLoadEnd} // ambil cookie saat load selesai
      thirdPartyCookiesEnabled={true}
      />
  );
};

export default CustomWebViews;

const styles = StyleSheet.create({
  loadingContainer: {
    position: "absolute",
    height: "100%",
    width: "100%",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#39C7FD', // atau warna branding kamu
  },
  logo: {
    width: 200,
    height: 200,
  },
});
