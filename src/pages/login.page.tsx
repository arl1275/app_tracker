import React, { useEffect, useState } from 'react';
import axios from 'axios';
import db_dir from '../config/db';
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import LoadingModal from '../components/Activity/activity.component';
import { UserInterface } from '../interfaces/user';
import UserStorage from '../storage/user';
import isConnectedToInternet from '../utils/network_conn';

interface props{
    setpage : (value : number) => void;
}

export const LoginPage : React.FC<props> = ({setpage}) => {
    const { data, setUser, getType } = UserStorage();
    //const [isconn, setIsconn] = useState(isConnectedToInternet());
    const [openl, setOpenl] = useState(false);
    const [Data, setData] = useState({
        user: '',
        _Password: ''
    });

    const handleUserChange = (text: string) => {
        setData({ ...Data, user: text }); // Update _user in the state with input text
    };

    const handlePasswordChange = (text: string) => {
        setData({ ...Data, _Password: text }); // Update _password in the state with input text
    };

    const handleSubmit = async () => {
        try {
            setOpenl(true);
            if (Data._Password !== '' && Data._Password !== undefined && Data._Password != null && Data._Password !== '' &&
                Data.user !== '' && Data.user !== undefined && Data.user != null && Data.user !== '') {
  
                const result = await axios.get(db_dir + '/usuarios/auth/app', {
                    params: {
                        user: Data.user,
                        _password: Data._Password
                    }
                });
                console.log('LA RESPUESTA DEL SERVIDOR FUE : ', result.status, result);
                if (result.status === 200) {
                    const user : UserInterface = result.data.data;
                    console.log('usuario from bk : ', user);
                    await setUser(user);
                    setpage( await getType());
                   
                }else{
                    Alert.alert('ERROR RED', 'No se pudo conectar a la red')
                }
               
            } else {
                Alert.alert('ERROR', 'Favor llene todo los campos');
            }

            setOpenl(false);
        } catch (err) {
            Alert.alert('ERROR', 'ingrese El usuario correcto');
            setOpenl(false);
        }
    };


    return (
        <View style={{ width: '100%', height: '100%', backgroundColor: 'white', flex: 1 }}>
            <LoadingModal visible={openl}  message='CARGANDO'/>
            <View>
                <View>
                    {/* <View style={{ alignSelf: 'center' }}><Icon name={'truck'} size={190} color={'white'} /></View> */}
                    <Text style={styles.title}>KELLER CHECK</Text>
                </View>

                <View style={{ marginTop: '20%', width: '70%', alignSelf: 'center' }}>
                    <TextInput
                        placeholder="USUARIO"
                        onChangeText={handleUserChange}
                        value={Data.user}
                        placeholderTextColor={'grey'}
                        style={{ color: 'black', fontSize : 25, borderBottomWidth: 1, borderBottomColor: 'grey' }}
                    />

                    <TextInput
                        placeholder="CONTRASEÑA"
                        onChangeText={handlePasswordChange}
                        value={Data._Password}
                        secureTextEntry
                        placeholderTextColor={'grey'}
                        style={{ color: 'black', fontSize : 25,  borderBottomWidth: 1, borderBottomColor: 'grey', marginTop : 30}}
                    />

                    <View style={styles.button}>
                        <Button title="INGRESAR" onPress={() => { handleSubmit() }} color={'#063970'} />
                    </View>

                </View>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 35,
        fontWeight: 'bold',
        marginTop: '30%',
        color: 'black',
        alignSelf: 'center'
    },
    button: {
        marginTop : '10%',
        backgroundColor: '#063970'
        
    },
});
