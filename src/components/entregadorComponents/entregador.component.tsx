import React, { useState, useEffect } from "react";
import { IconButton } from 'react-native-paper';
import { Text, View, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { DataTable } from 'react-native-paper';
import { Facturas } from "../../interfaces/facturas";
import db_dir from "../../config/db";
import axios from "axios";
import { EntregaModal } from "../modals/entregadorModals/entregaModal.component";
import useFacturaStore from "../../storage/storage";
import LoadingModal from "../Activity/activity.component";
import boxChequerStorage from "../../storage/checkBoxes";
import { box_to_check } from "../../interfaces/box";
import BoxChecker_ent from "../modals/entregadorModals/BoxChequerEnt.component";
import { Dimensions } from "react-native";
const widthScreen = Dimensions.get('window').width;
import UserStorage from "../../storage/user";

const styles = StyleSheet.create({
    tableHeader: {
        width: '95%',
        backgroundColor: "black",
        marginBottom: 5,
        marginTop: 5,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 10,
        elevation: 10,
        alignSelf: 'center',
        height: '7%'
    },
    tableRow: {
        backgroundColor: "white",
        width: '95%',
        alignSelf: 'center'
    }
});


function EntregadorListView() {
    const [facturas, setFacturas] = useState<Facturas[]>([]);
    const [EntregarFact, serEntregarFact] = useState<Facturas | null>(null);                                    //
    const [modalVisible, setModalVisible] = useState(false);
    const [see, setSee] = useState(false);
    const [fact_, setfact] = useState<Facturas>();
    const { data, fetchData, updateFactura } = useFacturaStore();

    useEffect(() => {
        const fetchDataInterval = setInterval(() => {
            fetchData();
        }, 3000);

        return () => {
            clearInterval(fetchDataInterval);
        };
    }, []);


    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const close = () => {
        setSee(false);
    }

    //THIS IS TO OPEN THE BOXCHER OR THE FACTURA VALIDATOR
    const BoxOrSing = (item: Facturas) => {
        if (item.is_check != true && fact_ !== null) {
            setSee(true);
        } else {
            if (item.hasSing === true) {
                Alert.alert('FACTURA YA FIRMADA');

            } else if (item.is_Sinchro) {
                Alert.alert('FACTURA YA SINCRONIZADA');
            } else {
                dataToSend(item);
            }
        }
    }

    //THIS IS TO SAVE THE FACTURAS THAT WERE VALIDADED
    const dataToSend = (fact: Facturas) => {
        serEntregarFact(fact);
        openModal();
    }

    const color_choose = (item: Facturas) => {
        if (item.state_name === 'FIRMADO') {
            return '#33CCFF';
        } else if (item.state_name === 'SINCRONIZADO') {
            return '#00FFFF';
        } else if (item.state_name === 'ENTREGADO') {
            return '#FFFF33';
        } else {
            return '0';
        }
    }

    return (
        <View style={{ backgroundColor: 'white' }}>
            {
                data.length > 0 && (
                    <View style={{ height: '100%' }}>
                        <DataTable>
                            <DataTable.Header style={styles.tableHeader}>
                                <DataTable.Title><Text style={{ color: 'white', fontSize: widthScreen * 0.02 }}>CLIENTE</Text></DataTable.Title>
                                <DataTable.Title><Text style={{ color: 'white', fontSize: widthScreen * 0.02 }}>FACTURA</Text></DataTable.Title>
                                <DataTable.Title><Text style={{ color: 'white', fontSize: widthScreen * 0.02 }}>EMPAQUE</Text></DataTable.Title>
                                <DataTable.Title><Text style={{ color: 'white', fontSize: widthScreen * 0.02 }}>CAJAS</Text></DataTable.Title>
                                <DataTable.Title><Text style={{ color: 'white', fontSize: widthScreen * 0.02 }}>UNIDADES</Text></DataTable.Title>
                                <DataTable.Title><Text style={{ color: 'white', fontSize: widthScreen * 0.02 }}>ESTADO</Text></DataTable.Title>
                            </DataTable.Header>
                            <ScrollView>
                                {
                                    data.map((item: Facturas) => {
                                        let valor = color_choose(item);
                                        return (
                                            <DataTable.Row  key={item.factura_id} onPress={() => { setfact(item); BoxOrSing(item); }} 
                                            style={[ styles.tableRow , { borderRightWidth : 4, borderRightColor : valor }]}>
                                                <DataTable.Cell><Text style={{ fontSize: widthScreen * 0.02, fontWeight: '400', color: 'black', width : '95%' , margin: '5%'}}>{item.clientenombre}</Text></DataTable.Cell>
                                                <DataTable.Cell><Text style={{ fontSize: widthScreen * 0.02, fontWeight: '400', color: 'black',}}>{item.factura}</Text></DataTable.Cell>
                                                <DataTable.Cell><Text style={{ fontSize: widthScreen * 0.02, fontWeight: '400', color: 'black', margin: '5%' }}>{item.lista_empaque}</Text></DataTable.Cell>
                                                <DataTable.Cell><Text style={{ fontSize: widthScreen * 0.02, fontWeight: '400', color: 'black', margin: '5%' }}>{item.cant_cajas}</Text></DataTable.Cell>
                                                <DataTable.Cell><Text style={{ fontSize: widthScreen * 0.02, fontWeight: '400', color: 'black', margin: '5%' }}>{item.cant_unidades}</Text></DataTable.Cell>
                                                <DataTable.Cell><Text style={{ fontSize: widthScreen * 0.02, fontWeight: 'bold', color: 'black' }}>{item.state_name === undefined ? 'PENDIENTE' : item.state_name}</Text></DataTable.Cell>
                                            </DataTable.Row>
                                        )
                                    })
                                }
                            </ScrollView>
                        </DataTable>


                        <EntregaModal factura={EntregarFact} modalVisible={modalVisible} closeModal={closeModal} />
                        <BoxChecker_ent visible={see} close={close} tipe={1} fact={fact_} />

                    </View >)
            }</View>
    );

}

export default EntregadorListView;