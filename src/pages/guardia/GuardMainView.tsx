import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import UserStorage from "../../storage/user";
import axios from "axios";
import db_dir from "../../config/db";
import LoadingModal from "../../components/Activity/activity.component";
import { IconButton } from "react-native-paper";
import ListComponentModal from "../../components/listComponents/list.component.modal";  
import { Picker } from "@react-native-picker/picker";
import { EnterPage } from "../../components/Activity/enter.component";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../..";
const image = require('../../assets/images/Select-pana.png');

interface dec_envio {
    id: number,
    declaracion_env: string,
    camion: string,
    usuario: string
}

interface Props {
    setpage: (value: number) => void;
}

export function MainGuardView(){
    const [ data, setData] = useState<dec_envio[]>([]);                                          // data to show in list
    const [ selectedValue, setSelectedValue] = useState<string>('1');                             // THIS IS NOT WORKING
    const [ selectedDecla, setSelectDeclar] = useState<number>(0);                               // this is to get the declaration in specific
    const [ showResumenChecked_List, setShowResumenChecked_List] = useState<boolean>(false);     // data to show the checked list
    const [ loading, setLoading] = useState(false);                                              // this is to update facturas data|
    const { closeSession, getUser } = UserStorage();
    const [ openl, setOpenl] = useState<boolean>(false);
    const [ user, setUser ] = useState<any>();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [ fastCheck_activate, setFastCheck_activate ] = useState<boolean>(false);

    useEffect(() => {
        get_data();
    }, [])

    const handler_session_close_entregador = async () => {
            Alert.alert(
                'Confirmar cierre de sesión',
                '¿Estás seguro de que deseas cerrar la sesión?, puede que tengas FACTURAS PENDIENTES',
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Aceptar',
                        onPress: async () => {

                            setOpenl(true);
                            let res = await closeSession();

                            if(res === true){
                                setOpenl(false);
                                navigation.navigate('Home');
                            }else{
                                setOpenl(false);
                                Alert.alert('ERROR AL CERRAR SESION')
                            }
                            
                        },
                    },
                ],
            );
        
    }

    const get_data = async () => {
        setLoading(true);
        let nombre =  await getUser();
        setUser(nombre);
        try {
            const valores = await axios.get(db_dir + '/decEnv/app/getDec_env');
            setData(valores.data.data);
        } catch (err) {
            console.log('error para obtener data: ', err);
        };
        setLoading(false);
    }

    const to_Close = () => {
        setShowResumenChecked_List(false);
    }

    const to_Open = () => {
        to_Close();
        setSelectDeclar(0);
        setShowResumenChecked_List(true);
    }

    const hadler_picker = async (value: any) => {
        if (value === '0') {
            handler_session_close_entregador();   

        }
        else {
            setSelectedValue(value);
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <LoadingModal visible={loading} message="ACTUALIZANDO FACTURAS" />

            <Modal
                animationType="fade"
                transparent={true}
                visible={openl}
                onRequestClose={() => { }}>
                <EnterPage />
            </Modal>


            <View style={{ backgroundColor: '#F0F3F4', height: '100%' }}>
                {
                    selectedValue == '1' &&
                    <View>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            backgroundColor: 'white',
                            margin: 10,
                            borderRadius: 7,
                            borderWidth: 1,
                            borderColor: 'white',
                            elevation : 10
                        }}>

                            <TouchableOpacity
                                style={
                                    {
                                        backgroundColor: 'white',
                                        left: 15,
                                        marginRight: 10,
                                        alignItems: 'center'

                                    }}
                                onPress={() => { get_data() }} >
                                <IconButton icon={'update'} size={25} iconColor="#00FF66" />
                            </TouchableOpacity>

                            <View style={styles.containePickerr}>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={selectedDecla}
                                        style={styles.picker}
                                        onValueChange={(itemValue) => { setSelectDeclar(itemValue); to_Close(); }} >
                                        <Picker.Item label="PRESIONE PARA SELECCIONAR DECLARACION DE ENVIO" value="0"
                                            style={
                                                {
                                                    fontSize: 12,
                                                    backgroundColor: 'white',
                                                    color: 'black'
                                                }} />
                                        {
                                            data.map((item) => (
                                                <Picker.Item
                                                    key={item.id}
                                                    label={`DECLARACION     ${item.declaracion_env}`}
                                                    value={item.id}
                                                    style={{ fontSize: 15, backgroundColor: 'white', color: 'black' }}
                                                />
                                            ))}
                                    </Picker>
                                </View>
                            </View>
                        </View>

                        {
                            selectedDecla == 0 ?
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={image} style={{ width: '60%', height: '60%', alignSelf: 'center', aspectRatio: 1 }} />
                                    <Text style={{ marginTop: 60, color: 'black', fontSize: 19 }}>DESPACHO DE FACTURAS</Text>
                                    <Text style={{ color: 'grey', fontSize: 15 }}>Buen día.</Text>
                                    <Text style={{ color: 'grey', fontSize: 15 }}>Solo despachar una sola declaracion de envio a la vez.</Text>
                                </View>
                                :
                                <View>
                                    <ListComponentModal dec_envio={selectedDecla} />
                                </View>
                        }

                    </View>
                }

            </View>

        </View>
    )
};

const styles = StyleSheet.create({
    container2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradientContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        overflow: 'hidden',
    },
    gradientCircle: {
        position: 'absolute',
        top: -50,
        left: -50,
        width: 300,
        height: 300,
        borderRadius: 150,
    },
    container: {
        flexDirection: 'column',
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 5,
        margin: 5,
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 5,
        marginVertical: 5,
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginVertical: 5,
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
    },
    cell: {
        flex: 1,
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        marginBottom: 20,
        color: 'black'
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    navbar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'black',
        paddingRight: 7,
        width: '100%',
        height: 60,
    },
    containePickerr: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pickerContainer: {
        width: '95%',
        backgroundColor: 'white',
        borderRadius: 7, // Borde redondeado
        overflow: 'hidden', // Recortar el contenido dentro del borde
        margin: 0
    },
    picker: {
        height: 'auto',
        color: 'black',
        backgroundColor: 'white'
    }
});



