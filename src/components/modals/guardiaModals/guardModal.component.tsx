import React, { useEffect, useState, useRef } from "react";
import styles_made from "../../../assets/stylescss";
import { Button, Text, View, TextInput, FlatList, StyleSheet, Modal, Alert, TouchableOpacity } from "react-native";
import { Facturas } from "../../../interfaces/facturas";
import axios from "axios";
import db_dir from "../../../config/db";
import { QRUScaner } from "../../camara/camScam.component";
import { DataTable, Icon, IconButton } from 'react-native-paper';


interface FactsComponentProps {
    factura: Facturas[]; // Array of Factura objects
}


export const ListUnitModal: React.FC<{ factura: Facturas[] | null, modalVisible: boolean, closeModal: () => void }> = ({ factura, modalVisible, closeModal }) => {
    const [transportista, setTransportista] = useState<string | null>(null);        // save the data of the Entregador
    const [camion, setCamion] = useState<string | null>(null);                      // save the data of the Camion
    const [visble, setModalVisibleCam] = useState(false);
    const [visbleU, setModalVisibleUser] = useState(false);

    let values: number[] | undefined = factura?.map((item: any) => item.id);

    const FacturasToTransito = async () => {
        try {
            if (camion === null || camion === '' || transportista === null || transportista === '') {
                Alert.alert('ERRO DATOS', 'Favor escanee tanto el camion como el Entregador para validar la salida de la factura.')
            } else {
                console.log("Response data:", values); // Successful response data
                const response = await axios.put(db_dir + '/entregas/toTransito', values);
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

    if (!factura) {
        return (null)
    }

    return (

        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
            <View style={styles.modalOverlay}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.centeredView}>
                        <View></View>
                        <View style={styles.modalContent}>

                            <View>

                                <Text style={{
                                    color: 'black',
                                    textAlign: 'center',
                                    fontSize: 25,
                                    marginBottom : 8
                                }}>INGRESE CAMION Y ENTREGADOR</Text>


                                <View style={styles.Textplaces}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <IconButton icon={'camera'} size={20} iconColor="black" onPress={() => { onVisibleU() }} />
                                        <TextInput placeholder={transportista != null  ? factura[0].nombre : 'INGRESE USUARIO'}
                                            placeholderTextColor="#9C9C9C"
                                            onChange={() => setTransportista}
                                            style={{ color: 'black' }} />
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <IconButton icon={'camera'} size={20} iconColor="black" onPress={() => { onVisibleCam() }} />
                                        <TextInput placeholder={camion != null ? factura[0].placa : 'INGRESE CAMION'}
                                            placeholderTextColor="#9C9C9C"
                                            onChange={() => setCamion}
                                            style={{ color: 'black' }} />
                                    </View>
                                </View>
                            </View>

                            <DataTable>
                                <DataTable.Header style={{ width: '90%' }}>
                                    <DataTable.Title>FACTURA</DataTable.Title>
                                    <DataTable.Title>CLIENTE</DataTable.Title>
                                    <DataTable.Title>CAJAS</DataTable.Title>
                                    <DataTable.Title>UNIDADES</DataTable.Title>
                                    {/* <DataTable.Title>TRANSPORTISTA</DataTable.Title> */}
                                </DataTable.Header>
                                {
                                    factura.map((item) => (
                                        <DataTable.Row>
                                            <DataTable.Cell>{item.ref_factura}</DataTable.Cell>
                                            <DataTable.Cell>{item.cliente}</DataTable.Cell>
                                            <DataTable.Cell>{item.cant_cajas}</DataTable.Cell>
                                            <DataTable.Cell>{item.cant_unidades}</DataTable.Cell>
                                            {/* <DataTable.Cell>LOCAL</DataTable.Cell> */}
                                        </DataTable.Row>
                                    ))
                                }

                            </DataTable>

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.button} onPress={() => {setCamion(null); setTransportista(null); closeModal();}}>
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
    },
    modalContent: {
        zIndex: 1, // Ensure the content is above the overlay
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 0,
        elevation: 5, // For Android shadow

    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Adjust as needed
        marginVertical: 10,
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
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});





