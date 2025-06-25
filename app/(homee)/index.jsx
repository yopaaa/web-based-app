import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { CurvedBottomBarExpo } from 'react-native-curved-bottom-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Account from './Account';
import Home from './Home';
import Settings from './Settings';
import StatsScreen from './StatsScreen';

const screens = {
  home: <Home />,
  analytics: <StatsScreen />,
  albums: <Account />,
  settings: <Settings />,
};

export default function App() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const renderTabBar = ({ routeName, selectedTab, navigate }) => {

    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}

        // style={[styles.tabbarItem]}
        style={[styles.tabbarItem, { marginBottom: insets.bottom / 2 }]}
      >
        <Ionicons
          name={routeName}
          size={28}
          color={routeName === selectedTab ? '#00BFFF' : 'gray'}
          onPress={() => navigate(routeName)}
        />
      </TouchableOpacity>
    );
  };

  return (
    <CurvedBottomBarExpo.Navigator
      screenOptions={{ headerShown: false }}
      type="DOWN"
      height={100}
      circleWidth={60}
      bgColor="white"
      initialRouteName="home"
      renderCircle={({ selectedTab, navigate }) => (
        <TouchableOpacity
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundColor: '#00BFFF',
            justifyContent: 'center',
            alignItems: 'center',
            bottom: 15,
          }}
          onPress={() => router.navigate("transaction/TransactionForm")}
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      )}
      tabBar={renderTabBar}
    >
      <CurvedBottomBarExpo.Screen name="home" position="LEFT" component={() => screens.home} />
      <CurvedBottomBarExpo.Screen name="analytics" position="LEFT" component={() => screens.analytics} />
      <CurvedBottomBarExpo.Screen name="albums" position="RIGHT" component={() => screens.albums} />
      <CurvedBottomBarExpo.Screen name="settings" position="RIGHT" component={() => screens.settings} />
    </CurvedBottomBarExpo.Navigator>
  );
}

export const styles = StyleSheet.create({
  tabbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})




