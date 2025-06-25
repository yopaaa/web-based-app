import { AuthContext } from '@/components/authProvider';
import { useContext } from 'react';
import { Button, ScrollView, StyleSheet, Text } from 'react-native';


export default function TabTwoScreen() {
    const { logIn } = useContext(AuthContext)

    return (
        <ScrollView style={{ marginTop: 100, color: "white" }}>
            <Text style={{ marginTop: 0, color: "white" }}>Settiing Page</Text>
            <Button title='Login' onPress={logIn} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
});
