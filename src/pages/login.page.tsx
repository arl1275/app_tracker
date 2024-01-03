import React, { useState } from 'react';
import axios from 'axios';
import db_dir from '../config/db';
import {SafeAreaView, StyleSheet, Text, View, Button, TextInput, Alert} from 'react-native';

function LoginPage() {
    const [Data, setData] = useState({
        user : '',
        _Password : ''
    });

    const handleUserChange = (text : string) => {
        setData({ ...Data, user: text }); // Update _user in the state with input text
      };
    
      const handlePasswordChange = (text : string) => {
        setData({ ...Data, _Password: text }); // Update _password in the state with input text
      };
    
      const handleSubmit = () => {
        console.log('Submitted User:', Data.user);
        console.log('Submitted Password:', Data._Password);
        try {
            const res = axios.get(db_dir + '/user/auth/app', {params : {
                user : Data.user,
                _Password : Data._Password
            }});
            console.log('valores de res : ', res);
        } catch (err) {
            Alert.alert('ERROR', 'Problemas para enviar usuario, favor revisar su conexion a internet');
            console.log('problema al enviar usuario : ', err)
        }
      };


    return (
        <View style={{width : '100%', height : '100%', backgroundColor : '#3B59CC'}}>
            <View>

                <Text style={styles.title}>ARBAITER APP</Text>

                <TextInput 
                placeholder="USUARIO"
                onChangeText={handleUserChange}
                value={Data.user}
                placeholderTextColor={'black'}
                />

                <TextInput 
                placeholder="CONTRASENIA"  
                onChangeText={handlePasswordChange}
                value={Data._Password}
                secureTextEntry
                placeholderTextColor={'black'}
                />

                <Button title="Submit" onPress={handleSubmit}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#3B59CC',
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
        color : 'white',
        alignSelf : 'center'
    },
    content: {
        fontSize: 16,
    },
});

export default LoginPage;