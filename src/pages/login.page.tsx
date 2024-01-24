import React, { useState } from 'react';
import axios from 'axios';
import db_dir from '../config/db';
import {SafeAreaView, StyleSheet, Text, View, Button, TextInput, Alert} from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

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
        <View style={{width : '100%', height : '100%', backgroundColor : 'white', flex : 1}}>
            <View>
                <Card style={styles.card}>
                    <View style={{alignSelf : 'center'}}><Icon name={'truck'} size={190} color={'white'}/></View>
                    <Text style={styles.title}>KELLER-CHECK</Text>
                </Card>
                
                <View style={{marginTop : 40 , width : '80%', alignSelf : 'center'}}>
                <TextInput 
                placeholder="USUARIO"
                onChangeText={handleUserChange}
                value={Data.user}
                placeholderTextColor={'grey'}
                style={{color : 'black'}}
                />

                <TextInput 
                placeholder="CONTRASEÑA"  
                onChangeText={handlePasswordChange}
                value={Data._Password}
                secureTextEntry
                placeholderTextColor={'grey'}
                style={{color : 'black'}}
                />
                
                <View style={styles.button}>
                    <Button title="INGRESAR" onPress={handleSubmit} color={'#063970'}/>
                </View>
                
                </View>
                
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        borderTopLeftRadius : 0,
        borderTopRightRadius : 0, 
        height : '50%',
        backgroundColor : '#063970'
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 20,
        color : 'white',
        alignSelf : 'center'
    },
    button: {
        backgroundColor : '#063970'
    },
});

export default LoginPage;