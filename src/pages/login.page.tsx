import React, { useEffect, useState } from 'react';
import axios from 'axios';
import db_dir from '../config/db';
import { StyleSheet, Text, View, Button, TextInput, Alert, Image } from 'react-native';
import LoadingModal from '../components/Activity/activity.component';
import { UserInterface } from '../interfaces/user';
import UserStorage from '../storage/user';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity } from 'react-native';

const image = require('../assets/images/logo_app.png')


interface props {
    setpage: (value: number) => void;
}

export const LoginPage: React.FC<props> = ({ setpage }) => {
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
                    const user: UserInterface = result.data.data;
                    console.log('usuario from bk : ', user);
                    await setUser(user);
                    setpage(await getType());

                } else {
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
        <View style={{ flex: 1 }}>
            <LinearGradient colors={['#1C2833', '#34495E']} locations={[0.7, 1]} >
                <LoadingModal visible={openl} message='CARGANDO' />

                <View style={{ width: '100%', height: '100%' }}>
                    <View>
                        <View style={{ margin: '10%', display: 'flex', flexDirection: 'row', alignSelf: 'center' }}>
                            <Image source={image} style={{ width: '30%', height: '30%', alignSelf: 'center', aspectRatio: 1 }} />
                            <Text style={styles.title}>KELLER CHECK</Text>
                        </View>

                        <View style={{ marginTop: 1, width: '70%', alignSelf: 'center' }}>
                            <TextInput
                                placeholder="USUARIO"
                                onChangeText={handleUserChange}
                                value={Data.user}
                                placeholderTextColor={'white'}
                                style={{ color: 'white', fontSize: 20, backgroundColor: '#2C3E50' }}
                            />

                            <TextInput
                                placeholder="CONTRASEÑA"
                                onChangeText={handlePasswordChange}
                                value={Data._Password}
                                secureTextEntry
                                placeholderTextColor={'white'}
                                style={{ marginTop: 20, color: 'white', fontSize: 20, backgroundColor: '#2C3E50' }}
                            />

                            <View style={{ marginTop: 25 }}>
                                <TouchableOpacity onPress={() =>{ handleSubmit() }} style={{ backgroundColor: '#33FFCC', height: '33%' }}>
                                    <Text style={{ color: '#000033', fontSize: 30, fontWeight: '700', alignSelf: 'center' }}>INGRESAR</Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                    </View>
                </View>
            </ LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 35,
        marginLeft: '7%',
        color: 'white',
        alignSelf: 'center'
    }
});
