import React, { useEffect, useState } from 'react';
import axios from 'axios';
import db_dir from '../../config/db';
import { Text, View, TextInput, Alert, ImageBackground, Modal, StyleSheet } from 'react-native';
import { UserInterface } from '../../interfaces/user';
import UserStorage from '../../storage/user';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../..';
import { EnterPage } from '../../components/Activity/enter.component';
import { Icon } from 'react-native-paper';
const back = require('../../assets/images/forest.jpg');


function LoginPage(navigator: any) {
    const { setUser, getType } = UserStorage();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [openl, setOpenl] = useState(false);
    const [Data, setData] = useState({
        user: '',
        _Password: ''
    });

    const session_is_save = async () => {
        const UL: number = await getType();
        if (UL == 3) {
            navigation.navigate('Entregador')
        } else if (UL == 2) {
            navigation.navigate('Guardia');
        } else {
            navigation.navigate('Home');
        }
    }

    useEffect(() => {
        session_is_save();
    }, [])



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

                    let UL: number = await getType();

                    if (UL == 3) {
                        navigation.navigate('Entregador')
                    } else if (UL == 2) {
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
        } finally {
            setData({ user : '', _Password : ''});
        }
    };


    return (
        <View style={styles.container}>
            {/* Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={openl}
                onRequestClose={() => { /* Handle close modal */ }}
            >
                <EnterPage />
            </Modal>

            {/* Contenido principal */}
            <View style={styles.contentContainer}>
                {/* Título */}
                <Text style={styles.title}>[ KELLER ]</Text>

                {/* Bienvenida */}
                <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeText}>Bienvenido!!</Text>
                    <Text style={styles.instructionsText}>Favor ingresa los datos de su usuario, para continuar.</Text>
                </View>

                {/* Campos de entrada */}
                <View style={styles.inputContainer}>
                    {/* Usuario */}
                    <View style={styles.inputWrapper}>
                        <Icon source="account" size={30} color="black" />
                        <TextInput
                            placeholder="USUARIO"
                            onChangeText={handleUserChange}
                            value={Data.user}
                            placeholderTextColor="grey"
                            style={styles.input}
                        />
                    </View>

                    {/* Contraseña */}
                    <View style={styles.inputWrapper}>
                        <Icon source="lock" size={30} color="black" />
                        <TextInput
                            placeholder="CONTRASEÑA"
                            onChangeText={handlePasswordChange}
                            value={Data._Password}
                            secureTextEntry
                            placeholderTextColor="grey"
                            style={styles.input}
                        />
                    </View>
                </View>

                {/* Botón de ingresar */}
                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                    <Text style={styles.buttonText}>INGRESAR</Text>
                </TouchableOpacity>
            </View>

            {/* Versión */}
            <Text style={styles.versionText}>V.0.0.13</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F6F7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        width: '90%',
        height: '90%',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius : 20
    },
    title: {
        fontSize: 60,
        fontWeight: '700',
        marginTop: 0,
        marginBottom: '15%',
        textAlign: 'center',
        color: 'black',
    },
    welcomeContainer: {
        marginBottom: 50,
    },
    welcomeText: {
        color: 'grey',
        fontWeight: '500',
        fontSize: 25,
        marginBottom: 5,
    },
    instructionsText: {
        color: 'grey',
        fontWeight: '500',
        fontSize: 15,
        textAlign: 'center',
    },
    inputContainer: {
        width: '70%',
        marginBottom: 30,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        color: 'black',
        fontSize: 15,
        textAlign: 'center',
    },
    button: {
        width: '70%',
        height: 40,
        backgroundColor: 'black',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
    },
    versionText: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        color: 'black',
        fontSize: 10,
    },
});

export default LoginPage