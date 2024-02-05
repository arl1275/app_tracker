import React, { useEffect, useState, useRef } from "react";
import { Button, Text, View, TextInput, FlatList, StyleSheet, Modal, Alert, TouchableOpacity } from "react-native";
import { Facturas } from "../../../interfaces/facturas";
import axios, { all } from "axios";
import db_dir from "../../../config/db";
import { QRUScaner } from "../../camara/camScam.component";
import { DataTable, Icon, IconButton } from 'react-native-paper';
import useGuardList from "../../../storage/gaurdMemory";


interface FactsComponentProps {
    factura: Facturas[]; // Array of Factura objects
}

export const ListToTransito: React.FC<{ modalVisible: boolean, closeModal: () => void }> = ({ modalVisible, closeModal }) => {
    const [transportista, setTransportista] = useState<string>('');        // save the data of the Entregador
    const [camion, setCamion] = useState<string>('');                      // save the data of the Camion
    const [visble, setModalVisibleCam] = useState(false);                           // to open modal to scam truck
    const [visbleU, setModalVisibleUser] = useState(false);                         // to open moadal of the camera to scam user
    const [listFact, setListFact] = useState<Facturas[]>([]);                       // this is to show locally
    const { GetIsCheckedFacts, updateIsInTransit } = useGuardList();                                   // this is to get the checked facts

    useEffect(() => {
        setListFact(GetIsCheckedFacts());
        if(listFact.length <= 0 && modalVisible === true){
            Alert.alert('ENVIO A TRANSITO',' No tiene facturas revisadas o ya envio las facturas a transito');
        }
    }, [modalVisible]);

    const FacturasToTransito = async () => {
        try {
            if (camion === null || camion === '' || transportista === null || transportista === '') {
                Alert.alert('ERROR DATOS', 'Favor escanee tanto el camion como el Entregador para validar la salida de la factura.')
            } else {

                let body : Facturas[]= listFact.filter((item) => item.factura);
                let req_body = body.map((item) => item.factura)

                const response = await axios.put(db_dir + '/facturas/toTransito', req_body);

                 if (response.status === 200) {
                    for (let i = 0; i < listFact.length; i++) {
                        updateIsInTransit(listFact[i].factura_id);
                    }
                     Alert.alert('SE ENVIO A TRANSITO', 'Se enviaron las facturas a transito');
                 } else if (response.status != 200) {
                     Alert.alert('ERROR', 'No se pudo enviar las facturas a transito');
                 }

            }
        } catch (error) {
            console.error("Error:", error); // Log the error if the request fails
        }
    }

    const onVisibleCam = () => {
        setModalVisibleCam(true);
    }

    const toCloseCam = () => {
        setModalVisibleCam(false);
    }

    const onVisibleU = () => {
        setModalVisibleUser(true);
    }

    const toCloseU = () => {
        setModalVisibleUser(false);
    }

    const sum_cajas = () => {
        return listFact.reduce((total, factura) => total + factura.cant_cajas, 0);
    }

    const sum_unidades = () => {
        return listFact.reduce((total, factura) => total + factura.cant_unidades, 0);
    }

    if (listFact.length === 0) {
        if(modalVisible){
            Alert.alert('SIN FACTURAS REVISADAS');
            closeModal();
        }
    } else {
        return (
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
                <View style={styles.modalOverlay}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={styles.centeredView}>
                            <View></View>
                            <View style={styles.modalContent}>

                                <View style={{ backgroundColor: '#063970' }}>
                                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 25, margin: 10 }}>ENVIO A TRANSITO</Text>

                                    <View style={styles.Textplaces}>
                                        <View style={{ flexDirection: 'row', margin: 5 }}>
                                            <IconButton icon={'camera'} size={20} iconColor="white" onPress={() => { onVisibleU() }} />

                                            <TextInput 
                                                placeholder={transportista != null ? listFact[0].nombre : 'USUARIO'}
                                                placeholderTextColor="#9C9C9C"
                                                //value={transportista}
                                                onChange={() => setTransportista}
                                                style={{ color: 'white' }} />

                                        </View>
                                        <View style={{ flexDirection: 'row', margin: 5 }}>
                                            <IconButton icon={'camera'} size={20} iconColor="white" onPress={() => { onVisibleCam() }} />
                                            <TextInput 
                                                placeholder={camion != null ? listFact[0].placa : 'CAMION'}
                                                value = {camion}
                                                placeholderTextColor="#9C9C9C"
                                                onChange={() => setCamion}
                                                style={{ color: 'white' }} />
                                        </View>
                                    </View>
                                </View>

                                <DataTable>
                                    <DataTable.Header style={{ width: '95%', backgroundColor: 'white' }}>
                                        <DataTable.Title><Text style={{ color: 'black' }}>FACTURA</Text></DataTable.Title>
                                        <DataTable.Title><Text style={{ color: 'black' }}>CLIENTE</Text></DataTable.Title>
                                        <DataTable.Title><Text style={{ color: 'black' }}>CAJAS</Text></DataTable.Title>
                                        <DataTable.Title><Text style={{ color: 'black' }}>UNIDADES</Text></DataTable.Title>
                                    </DataTable.Header>
                                    {
                                        listFact.map((item) => (
                                            <DataTable.Row>
                                                <DataTable.Cell>{item.factura}</DataTable.Cell>
                                                <DataTable.Cell>{item.clientenombre}</DataTable.Cell>
                                                <DataTable.Cell>{item.cant_cajas}</DataTable.Cell>
                                                <DataTable.Cell>{item.cant_unidades}</DataTable.Cell>
                                            </DataTable.Row>
                                        ))
                                    }

                                    <DataTable.Row style={{ backgroundColor: '#5499C7' }}>
                                        <DataTable.Cell><Text style={{ color: 'white' }}>totales</Text></DataTable.Cell>
                                        <DataTable.Cell>-</DataTable.Cell>
                                        <DataTable.Cell><Text style={{ color: 'white' }}>{sum_cajas()}</Text></DataTable.Cell>
                                        <DataTable.Cell><Text style={{ color: 'white' }}>{sum_unidades()}</Text></DataTable.Cell>
                                    </DataTable.Row>

                                </DataTable>

                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.button} onPress={() => { setCamion(''); setTransportista(''); closeModal(); }}>
                                        <Text style={styles.buttonText}>CERRAR</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button} onPress={() => { FacturasToTransito(); closeModal() }}>
                                        <Text style={styles.buttonText}>FINALIZAR</Text>
                                    </TouchableOpacity>
                                </View>

                            </View >
                        </View>
                    </View>


                    <QRUScaner close={toCloseCam} visible={visble} ReturnText={setCamion} />
                    <QRUScaner close={toCloseU} visible={visbleU} ReturnText={setTransportista} />
                </View >
            </Modal >

        );
    }
};


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent black
    },
    modalContent: {
        zIndex: 1, // Ensure the content is above the overlay
        padding: 0,
        backgroundColor: 'white',
        borderRadius: 0,
        elevation: 5, // For Android shadow

    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Adjust as needed
        //marginVertical: 10,
        width: "auto",
        backgroundColor: '#063970',
    },
    button: {
        padding: 10,
        borderRadius: 0,
        backgroundColor: '#063970',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    Textplaces: {
        backgroundColor: '#063970',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});
