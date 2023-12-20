import React from 'react';
import type { PropsWithChildren } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    Button, 
    TextInput
} from 'react-native';

function LoginPage() {
    return (
        <SafeAreaView>
            <View style={styles.card}>
                <Text style={styles.title}>LOG IN</Text>


                <TextInput placeholder="USUARIO"/>
                <TextInput placeholder="CONTRASENIA"/>

                <Button title="Submit" />
            </View>

        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        margin: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    content: {
        fontSize: 16,
    },
});

export default LoginPage;