import { ActivityIndicator, Image, StatusBar, StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';

const CustomWebView = () => {
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
    <View style={{ flex: 1, paddingTop: StatusBar.currentHeight || 0 }}>
      <WebView
        source={{ uri: 'https://yopaaa.xyz/kalkuraid/' }}
        style={{ flex: 1 }} // <== penting!
        startInLoadingState
        renderLoading={renderLoading}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled={true} // ini penting!
        thirdPartyCookiesEnabled={true}
      />
    </View>

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
    backgroundColor: '#005f88',
    paddingTop: StatusBar.currentHeight || 0,
  },
  logo: {
    width: 180,
    height: 180,
  },
});
