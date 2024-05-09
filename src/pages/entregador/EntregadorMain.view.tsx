import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { VistadeSync } from "../../components/entregadorComponents/ToSync.components";
import { Picker } from "@react-native-picker/picker";
import isConnectedToInternet from "../../utils/network_conn";
import UserStorage from "../../storage/user";
import useFacturaStore from "../../storage/storage";
import boxChequerStorage from "../../storage/checkBoxes";
import EntregadorListView from "../../components/entregadorComponents/entregador.component";
import { Blankpage } from "../../components/Activity/blankPage.component";
import { ScannerConfig } from "../../components/Activity/ScannerConfig";
import { EnterPage } from "../../components/Activity/enter.component";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../..";

export function EntregadorIndexView() {
    const [ page, setPage] = useState('none');
    const { data, closeSession, getUser } = UserStorage();
    const { deleteAllfacts } = useFacturaStore();
    const { closeBoxes } = boxChequerStorage();
    const [ selectedValue, setSelectedValue] = useState('1');
    const [ openl, setOpenl] = useState<boolean>(false);
    const [ user, setUser] = useState<any>();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const handler_session_close_entregador = async () => {
        if (await isConnectedToInternet()) {
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

                            if (await closeSession()) {
                                setOpenl(true);
                                const facturaSynchronized = await deleteAllfacts();
                                const boxes_delete = await closeBoxes();

                                if (facturaSynchronized == true && boxes_delete == true) {
                                    console.log('Se cerró la sesión');
                                    setOpenl(false);
                                    navigation.navigate('Home');
                                } else {
                                    console.log('No se cerró la sesión porque no hay facturas sincronizadas');
                                    setOpenl(false);
                                    Alert.alert('NO SE CERRÓ LA SESIÓN: HAY FACTURAS SIN SINCRONIZAR');
                                }
                            }

                        },
                    },
                ],
            );
        } else {
            setOpenl(false);
            Alert.alert(
                'Error',
                'No se puede cerrar la sesión porque no estás conectado a la red empresarial.',
            );
        }
    }

    const handlerPicker = async (value: any) => {
        if (value === '0') {
            if (data.cod_empleado != 0) {
                handler_session_close_entregador();
            }
        } else if (value == '2') {
            setPage('barra');
            setSelectedValue('2');
        } else {
            setSelectedValue(value);
        }
    };

    return (
        <View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={openl}
                onRequestClose={() => { }}>
                <EnterPage />
            </Modal>

            <View style={[styles.navbar, { borderBottomColor: page === 'none' ? 'white' : (page === 'lista' ? '#00FF66' : (page === 'sync' ? '#00FFFF' : 'white')) }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <View style={{ width: 200, display: 'flex', flexDirection: 'row' }}>

                        <IconButton icon={'account-tie'} size={25} iconColor="white" />
                        <Text style={{ color: 'white', alignSelf : 'center', marginRight : 40 }}>{data.nombre}</Text>
                        <View style={{ borderRightWidth: 1, borderRightColor: 'white', height: 20, alignSelf: 'center' }} />

                        <Picker
                            selectedValue={selectedValue}
                            style={{ height: 50, width: 150, color: 'white', left: 0 }}
                            onValueChange={(itemValue) => handlerPicker(itemValue)}
                        >
                            <Picker.Item label={'INICIO'} value="1" />
                            <Picker.Item label='CONFIGURAR ESCANER' value="2" />
                            <Picker.Item label="CERRAR SESSION" value="0" />

                        </Picker>
                    </View>

                    <View style={{ width: 100, right: 9 }}>
                        {selectedValue === '1' && (
                            <View>
                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

                                    <TouchableOpacity onPress={() => { setPage('lista') }} >
                                        <IconButton icon={'file-document'} size={20} iconColor={page === 'lista' ? "#00FF66" : "white"} />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => { setPage('sync') }}>
                                        <IconButton icon={'progress-upload'} size={20} iconColor={page === 'sync' ? "#00FFFF" : "white"} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                        }
                    </View>

                </View>
            </View>

            {/* AQUI SE MUESTRA LA PAGINA */}
            <View>
                {selectedValue == '1' && (page === 'lista' ? <EntregadorListView /> : page === 'sync' ? <VistadeSync /> : <Blankpage />)}
                {selectedValue == '2' && (page === 'barra' && <ScannerConfig />)}
            </View>

        </View>


    )
}

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        backgroundColor: 'black',
        padding: 0,
        borderBottomWidth: 1
    },
    button: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#063970',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        margin: 10,
        textAlign: 'center'
    },
});