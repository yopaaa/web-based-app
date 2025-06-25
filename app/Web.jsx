// import CookieManager from '@react-native-cookies/cookies';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';

const CustomWebView = () => {
  const handleLoadEnd = () => {
    // CookieManager.get('https://kalkuraid-production.up.railway.app').then(cookies => {
    //   console.log('Cookies:', cookies);
    // });
  };

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <Image
        source={require('@/assets/images/adaptive-icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 16 }} />
    </View>
  );

  return (
    <WebView
      source={{ uri: 'https://kalkuraid-production.up.railway.app/' }}
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

export default CustomWebView;

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#39C7FD',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
