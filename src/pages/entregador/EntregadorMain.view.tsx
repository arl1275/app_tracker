import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert, Modal, Image } from 'react-native';
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
const box = require('../../assets/images/Select-pana.png')

export function EntregadorIndexView() {
    const { data } = useFacturaStore();


    // const handler_session_close_entregador = async () => {
    //     if (await isConnectedToInternet()) {
    //         Alert.alert(
    //             'Confirmar cierre de sesión',
    //             '¿Estás seguro de que deseas cerrar la sesión?, puede que tengas FACTURAS PENDIENTES',
    //             [
    //                 {
    //                     text: 'Cancelar',
    //                     style: 'cancel',
    //                 },
    //                 {
    //                     text: 'Aceptar',
    //                     onPress: async () => {

    //                         if (await closeSession()) {
    //                             setOpenl(true);
    //                             const facturaSynchronized = await deleteAllfacts();
    //                             const boxes_delete = await closeBoxes();

    //                             if (facturaSynchronized == true && boxes_delete == true) {
    //                                 console.log('Se cerró la sesión');
    //                                 setOpenl(false);
    //                                 navigation.navigate('Home');
    //                             } else {
    //                                 console.log('No se cerró la sesión porque no hay facturas sincronizadas');
    //                                 setOpenl(false);
    //                                 Alert.alert('NO SE CERRÓ LA SESIÓN: HAY FACTURAS SIN SINCRONIZAR');
    //                             }
    //                         }

    //                     },
    //                 },
    //             ],
    //         );
    //     } else {
    //         setOpenl(false);
    //         Alert.alert(
    //             'Error',
    //             'No se puede cerrar la sesión porque no estás conectado a la red empresarial.',
    //         );
    //     }
    // }


    return (
        <View style={{ height : '90%'}}>
            {
                data.length > 0 ?
                    <View>
                        <EntregadorListView />
                    </View>
                    : 
                    <View style={{ position : 'relative', top : '30%', alignItems : 'center'}}>
                        <Text style={{ alignSelf: 'center', color: 'grey' }}>SIN FACTURAS SINCRONIZADAS</Text>
                        <Image source={box} style={{ width: 300, height: 300 }} />
                    </View>
            }


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