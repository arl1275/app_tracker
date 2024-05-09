import React, { useEffect, useState } from 'react';
import axios from 'axios';
import db_dir from '../../config/db';
import { Text, View, TextInput, Alert, ImageBackground, Modal } from 'react-native';
import { UserInterface } from '../../interfaces/user';
import UserStorage from '../../storage/user';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../..';
import { EnterPage } from '../../components/Activity/enter.component';


function LoginPage( navigator : any ) {
    const { setUser, getType } = UserStorage();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [openl, setOpenl] = useState(false);
    const [Data, setData] = useState({
        user: '',
        _Password: ''
    });

    const session_is_save = async () => {
        const UL : number = await getType();
        if(UL == 3){
          navigation.navigate('Entregador')
        }else if( UL == 2){
          navigation.navigate('Guardia');
        }else{
            navigation.navigate('Home');
        }
    }
    
    useEffect(()=> {
        session_is_save();
    },[])
    


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
                
                if (result.status === 200) {
                    const user: UserInterface = result.data.data;
                    await setUser(user);

                    let UL : number = await getType();

                    if(UL == 3){
                        navigation.navigate('Entregador')
                    }else if( UL == 2){
                        navigation.navigate('Guardia');
                    }
                    
                    
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
        }finally{
            Data._Password = '';
            Data.user = '';   
        }
    };


    return (
        <View style={{ flex: 1 }}>
            

                <LinearGradient colors={['rgba(0,0,0,0.01)', 'black']} locations={[0.04, 0.6]}>

                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={openl}
                        onRequestClose={() => { }}>
                        <EnterPage />
                    </Modal> 

                    <View style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>
                        <View>
                            <View style={{ marginTop: 25, display: 'flex', flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 70, fontWeight: 700, top : 50 }}>[ KELLER ]</Text>
                            </View>

                            <View style={{ marginTop: 120, width: '70%', alignSelf: 'center', marginBottom: 30 }}>
                                <Text style={{ color: 'white', fontWeight: 500, fontSize: 40, marginBottom: 5 }}>Bienvenido!!</Text>
                                <Text style={{ color: 'grey', fontWeight: 500, fontSize: 15, marginTop : 40 }}>Favor ingresa los datos de su usuario, para continuar.</Text>
                            </View>

                            <View style={{ marginTop: 1, width: '70%', alignSelf: 'center' }}>
                                <TextInput
                                    placeholder="USUARIO"
                                    onChangeText={handleUserChange}
                                    value={Data.user}
                                    placeholderTextColor={'grey'}
                                    style={{
                                        color: 'white',
                                        fontSize: 15,
                                        backgroundColor: 'black',//'#0D151E',
                                        borderRadius: 50,
                                        borderWidth: 1,
                                        borderColor: 'grey',
                                        marginBottom: 30,
                                        textAlign: 'center'
                                    }}
                                />

                                <TextInput
                                    placeholder="CONTRASEÑA"
                                    onChangeText={handlePasswordChange}
                                    value={Data._Password}
                                    secureTextEntry
                                    placeholderTextColor={'grey'}
                                    style={{
                                        color: 'white',
                                        fontSize: 15,
                                        backgroundColor: 'black',
                                        borderRadius: 50,
                                        borderWidth: 1,
                                        borderColor: 'grey',
                                        textAlign: 'center'
                                    }}
                                />

                                <View style={{ borderBottomWidth: 2, borderBottomColor: 'grey', marginTop: 40 }} />

                            </View>

                            <View style={{ marginTop: 40 }}>
                                <TouchableOpacity onPress={() => { handleSubmit() }}>
                                    <Text style={{
                                        color: 'white',
                                        alignSelf: 'center',
                                        fontSize: 20,
                                        width: '70%',
                                        height: 40,
                                        backgroundColor: 'grey',
                                        borderRadius: 50,
                                        borderColor: 'white',
                                        borderWidth : 1.5,
                                        textAlign: 'center',
                                        fontWeight: 700,
                                        textAlignVertical: 'center'
                                    }}>INGRESAR</Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                        <Text style={{ color: 'white', fontSize: 10, position: 'absolute', bottom: 0, right: 10 }}>V.0.0.12</Text>

                    </View>

                </ LinearGradient>

        </View >
    )
}

export default LoginPage
