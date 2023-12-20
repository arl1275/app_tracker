import React, { useEffect, useState, useRef } from "react";
import styles_made from "../../../assets/stylescss";
import { Button, Text, View, TextInput, FlatList, StyleSheet, Modal, Alert, TouchableOpacity } from "react-native";
import { Facturas } from "../../../interfaces/facturas";
import axios from "axios";
import db_dir from "../../../config/db";
//test-imports
import { DataTable, Icon, IconButton } from 'react-native-paper';


interface FactsComponentProps {
    factura: Facturas[]; // Array of Factura objects
}

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
        borderRadius: 10,
        elevation: 5, // For Android shadow

    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Adjust as needed
        marginVertical: 10,
        width: "60%",
        backgroundColor: '#063970',
    },
    button: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#063970',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    Textplaces : {
        backgroundColor : 'white',
        display : 'flex',
        flexDirection : 'row',
        justifyContent: 'space-between',
    }
});


export const ListUnitModal: React.FC<{ factura: Facturas[] | null, modalVisible: boolean, closeModal: () => void }> = ({ factura, modalVisible, closeModal }) => {
    const [transportista, setTransportista] = useState<string | null>(null);
    const [camion, setCamion] = useState<string | null>(null);

    let values: number[] | undefined = factura?.map((item: any) => item.id);

    const FacturasToTransito = async () => {
        try {
            console.log("Response data:", values); // Successful response data
            const response = await axios.put(db_dir + '/entregas/toTransito', values);
        } catch (error) {
            console.error("Error:", error); // Log the error if the request fails
        }
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
                        {
                            factura.length > 0 ?
                                <View style={styles.modalContent}>

                                    <View>
                                        <Text style={{ color: 'black', textAlign: 'center' }}>INGRESE CAMION Y ENTREGADOR</Text>
                                        <View style={styles.Textplaces}>
                                            <TextInput placeholder="CODIGO DE EMPLEADO" placeholderTextColor="#9C9C9C" onChange={() => setTransportista} style={{ color: 'black' }} />
                                            <TextInput placeholder="CODIGO DE CAMION" placeholderTextColor="#9C9C9C" onChange={() => setCamion} style={{ color: 'black' }} />
                                        </View>
                                    </View>

                                    <DataTable>
                                        <DataTable.Header style={{ width: '90%' }}>
                                            <DataTable.Title>FACTURA</DataTable.Title>
                                            <DataTable.Title>CLIENTE</DataTable.Title>
                                            <DataTable.Title>CAJAS</DataTable.Title>
                                            <DataTable.Title>UNIDADES</DataTable.Title>
                                            <DataTable.Title>TRANSPORTISTA</DataTable.Title>
                                        </DataTable.Header>
                                        {
                                            factura.map((item) => (
                                                <DataTable.Row>
                                                    <DataTable.Cell>{item.ref_factura}</DataTable.Cell>
                                                    <DataTable.Cell>{item.cliente}</DataTable.Cell>
                                                    <DataTable.Cell>{item.cant_cajas}</DataTable.Cell>
                                                    <DataTable.Cell>{item.cant_unidades}</DataTable.Cell>
                                                    <DataTable.Cell>LOCAL</DataTable.Cell>
                                                </DataTable.Row>
                                            ))
                                        }

                                    </DataTable>

                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity style={styles.button} onPress={() => { closeModal(); }}>
                                            <Text style={styles.buttonText}>CERRAR</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.button} onPress={()=>{FacturasToTransito(); closeModal()}}>
                                            <Text style={styles.buttonText}>SIGUIENTE</Text>
                                        </TouchableOpacity>

                                    </View>

                                </View > :
                                <View style={styles.modalContent}>
                                    <Text style={{ color: 'black', textAlign: 'center' }}>FAVOR ESCANEE UNA FACTURA</Text>
                                    <Button title="CERRAR" onPress={closeModal} />
                                </View>
                        }
                    </View>
                </View>
            </View >
        </Modal >

    );
};




