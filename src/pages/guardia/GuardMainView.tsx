import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import UserStorage from "../../storage/user";
import axios from "axios";
import db_dir from "../../config/db";
import LoadingModal from "../../components/Activity/activity.component";
import { IconButton } from "react-native-paper";
import ListComponentModal from "../../components/listComponents/list.component.modal";                        // this is the component to show table of the declaraciones_env
import ListToTransito  from "../../components/modals/guardiaModals/LisToTransit.component";
import { Picker } from "@react-native-picker/picker";
import { EnterPage } from "../../components/Activity/enter.component";
import { ScannerConfig } from "../../components/Activity/ScannerConfig";
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

            <View>

                <View style={styles.navbar}>

                    <View style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignContent: 'center' }}>

                        <TouchableOpacity onPress={() => { hadler_picker('3')}} style={{ display :'flex', flexDirection : 'row'}}>
                            <IconButton icon={'shield-account-variant'} size={30} iconColor={ selectedValue == '3' ? 'white' : 'grey'} style={{ alignSelf: 'center' }}/>
                            <Text style={{color : 'white', alignSelf : 'center', margin : 10}}>{ user?.nombre }</Text>
                        </TouchableOpacity>
                        

                        <View style={
                            {
                                display: 'flex',
                                flexDirection: 'row',
                                width: 180,
                                justifyContent: 'space-around',
                                height: 45,
                                right: 60,
                                top: 5,
                                backgroundColor: '#383737',
                                padding: 15,
                                borderRadius: 60
                            }}>

                            <TouchableOpacity onPress={() => { hadler_picker('1') }}
                                style={
                                    {
                                        height: 30,
                                        padding: 3,
                                        width: 50,
                                        borderRadius: 60,
                                        alignSelf: 'center',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                        flexDirection: 'row',
                                        backgroundColor: selectedValue === '1' ? 'white' : '#424949', //#FF33FF
                                    }}>

                                <IconButton icon={'cube-scan'} size={25} iconColor={selectedValue === '1' ? "black" : '#7B7D7D'}
                                    style={{ alignSelf: 'center' }} />

                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { hadler_picker('2') }}
                                style={
                                    {
                                        height: 30,
                                        padding: 3,
                                        width: 50,
                                        borderRadius: 60,
                                        alignSelf: 'center',
                                        display: 'flex',
                                        alignContent: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                        backgroundColor: selectedValue === '2' ? 'white' : '#424949'
                                    }}>
                                <IconButton
                                    icon="text-box-check"
                                    size={25}
                                    iconColor={selectedValue === '2' ? 'black' : '#7B7D7D'}
                                    style={{ alignSelf: 'center' }}
                                />
                            </TouchableOpacity>

                        </View>

                        <View>
                            <TouchableOpacity
                                style={
                                    {
                                        backgroundColor: '#323232',
                                        borderRadius: 70,
                                        justifyContent: 'center',
                                        height: 40,
                                        width: 40,
                                        marginTop: 5,
                                        right: 15
                                    }
                                }
                                onPress={() => hadler_picker('0')} >
                                <IconButton icon={'logout'} size={17} iconColor="white" />
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>

            </View>


            <View style={{ backgroundColor: 'black', height: '100%' }}>
                {
                    selectedValue == '1' &&
                    <View>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            backgroundColor: '#323232',
                            margin: 10,
                            borderRadius: 7,
                            borderWidth: 1,
                            borderColor: 'white'
                        }}>

                            <TouchableOpacity
                                style={
                                    {
                                        backgroundColor: '#323232',
                                        left: 15,
                                        marginRight: 10,
                                        alignItems: 'center'

                                    }}
                                onPress={() => { get_data() }} >
                                <IconButton icon={'update'} size={25} iconColor="#00FF66" />
                            </TouchableOpacity>

                            {/* <TouchableOpacity
                                style={
                                    {
                                        backgroundColor: fastCheck_activate ? '#00FF66' : 'grey',
                                        left: 15,
                                        marginRight: 10,
                                        alignItems: 'center',
                                        width : 40,
                                        height : 40,
                                        alignSelf : 'center',
                                        justifyContent : 'center',
                                        borderRadius : 10
                                    }}
                                onPress={() => { setFastCheck_activate(!fastCheck_activate) }} >
                                <IconButton icon={'barcode'} size={25} iconColor="black" />
                            </TouchableOpacity> */}

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
                                                    backgroundColor: '#1a1a1a',
                                                    color: 'white'
                                                }} />
                                        {
                                            data.map((item) => (
                                                <Picker.Item
                                                    key={item.id}
                                                    label={`DECLARACION     ${item.declaracion_env}`}
                                                    value={item.id}
                                                    style={{ fontSize: 15, backgroundColor: '#323232', color: 'white' }}
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
                                    <Text style={{ marginTop: 60, color: 'white', fontSize: 19 }}>DESPACHO DE FACTURAS</Text>
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

                {
                    selectedValue === '2' && <ListToTransito />
                }
                {   selectedValue === '3' &&  <ScannerConfig />}
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
        backgroundColor: 'black',
        borderRadius: 7, // Borde redondeado
        overflow: 'hidden', // Recortar el contenido dentro del borde
        margin: 0
    },
    picker: {
        height: 'auto',
        color: 'white',
        backgroundColor: '#323232'
    }
});



