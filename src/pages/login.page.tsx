import React, { useState } from 'react';
import axios from 'axios';
import db_dir from '../config/db';
import {SafeAreaView, StyleSheet, Text, View, Button, TextInput, Alert} from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

interface LoginPageProps {
    props: ({}) => void;
  }

  export const LoginPage: React.FC<LoginPageProps> = ({ props }) => {
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
    
      const handleSubmit = async () => {
        try {

            if(Data._Password !== '' && Data._Password !== undefined && Data._Password != null && Data._Password !== '' &&
            Data.user !== '' && Data.user !== undefined && Data.user != null && Data.user !== ''){
                console.log('log in de: ', Data);
                const result = await axios.get(db_dir + '/usuarios/auth/app', {params : {
                    user : Data.user,
                    _password : Data._Password
                }});
    
                if(result.status === 200){
                    console.log('resulta do in : ', result.data);
                    props(result.data.data);
                }else{
                    Alert.alert('ERROR', 'usuario no valido para esta app');
                }

            }else{
                Alert.alert('ERROR', 'Favor llene todo los campos');
            }
            

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
                
                <View style={{marginTop : 40 , width : '50%', alignSelf : 'center'}}>
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
                    <Button title="INGRESAR" onPress={()=>{handleSubmit()}} color={'#063970'}/>
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
