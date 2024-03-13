import React, { useEffect, useState, useRef } from "react";
import { Text, View, TextInput, FlatList, StyleSheet, Modal, Alert, TouchableOpacity, ScrollView } from "react-native";
import { Facturas } from "../../../interfaces/facturas";
import axios from "axios";
import db_dir from "../../../config/db";
import { DataTable } from 'react-native-paper';
import useGuardList from "../../../storage/gaurdMemory";

export const ListToTransito: React.FC<{ modalVisible: boolean, closeModal: () => void }> = ({ modalVisible, closeModal }) => {
    const [transportista, setTransportista] = useState<string>('');        // save the data of the Entregador
    const [camion, setCamion] = useState<string>('');                      // save the data of the Camion
    const [listFact, setListFact] = useState<Facturas[]>([]);              // this is to show locally
    const { GetIsCheckedFacts, updateIsInTransit } = useGuardList();       // this is to get the checked facts
    const inputRef = useRef<TextInput>(null);                              // this is to check the camion and entregador 
    const [Value_, setValue_] = useState('');                              // this is used as well to check camion and entregador
    const [encabezado, setEncabezado ] = useState<any>();                  // this got the header of one declaracion de envio

    useEffect(() => {
        setListFact(GetIsCheckedFacts());
        if (listFact.length <= 0 && modalVisible === true) {
            Alert.alert('ENVIO A TRANSITO', ' No tiene facturas revisadas o ya envio las facturas a transito');
        }else{
            get_encabezado();
        }
    }, [modalVisible]);

    const get_encabezado = async () =>{
        let params_ : number = listFact[0].id_dec_env;

        const enca = await axios.get(db_dir + '/decEnv/app/getEncabezado', { params : {id_dec_env : params_}});
        setEncabezado(enca.data.data)
        console.log(encabezado);
    }


    const FacturasToTransito = async () => {
        try {
            if (!camion || !transportista) {

                Alert.alert('ERROR DATOS', 'Favor escanee tanto el camion como el Entregador para validar la salida de la factura.');

            } else {

                let body: number[] = listFact.map((item) => item.factura_id);
                
                const response = await axios.put(db_dir + '/facturas/toTransito', body);

                if (response.status === 200) {
                    listFact.forEach((factura) => {
                        updateIsInTransit(factura.factura_id);
                    });
                    Alert.alert('SE ENVIO A TRANSITO', 'Se enviaron las facturas a transito');
                } else {
                    Alert.alert('ERROR', 'No se pudo enviar las facturas a transito');
                }
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleBarcodeScan = () => {
        let t = Value_;
        if (t.length > 0) {
            if (listFact) {

                if ( encabezado[0].placa === t ) { //  listFact.some(item => item.placa === t)
                    setCamion(t);
                    Alert.alert('CAMION ESCANEADO');
                    setValue_('');

                } else if ( encabezado[0].cod_empleado.toString() === t) { // listFact.some(item => item.nombre === t)
                    setTransportista(t);
                    Alert.alert('ENTREGADOR ESCANEADO');
                    setValue_('');

                } else {
                    Alert.alert('NO PERTENECE A ESTA DECLARACION DE ENVIO');
                    setValue_('');
                }

            } else {
                Alert.alert('NO PERTENECE A ESTA DECLARACION DE ENVIO');
                setValue_('');
            }
        }
    };

    if (listFact.length === 0) {
        if (modalVisible) {
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
                                    
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 1, marginLeft : 10}}>
                                            <Text style={{color : 'white'}}>{listFact[0].placa}</Text>
                                        </View>
                                        <View style={{ flex: 1, marginRight : 10 }}>
                                            <Text style={{color : 'white'}}>{listFact[0].nombre}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.Textplaces}>
                                        <View style={{ flexDirection: 'row', margin: 5 }}>
                                            <TextInput
                                                ref={inputRef}
                                                style={{ color: 'black', borderColor: 'grey' }}
                                                value={Value_}
                                                onChangeText={(text) => setValue_(text)}
                                                onSubmitEditing={handleBarcodeScan}
                                                placeholderTextColor={'white'}
                                                placeholder="ESCANEE CAMION Y ENTREGADOR"
                                                autoFocus
                                                onBlur={() => inputRef.current?.focus()}
                                            />
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
                                    <ScrollView>
                                    {
                                        listFact.map((item) => (
                                            <DataTable.Row key={item.factura_id}>
                                                <DataTable.Cell>{item.factura}</DataTable.Cell>
                                                <DataTable.Cell>{item.clientenombre}</DataTable.Cell>
                                                <DataTable.Cell>{item.cant_cajas}</DataTable.Cell>
                                                <DataTable.Cell>{item.cant_unidades}</DataTable.Cell>
                                            </DataTable.Row>
                                        ))
                                    }
                                    </ScrollView>

                                    <DataTable.Row style={{ backgroundColor: '#5499C7' }}>
                                        <DataTable.Cell><Text style={{ color: 'white' }}>totales</Text></DataTable.Cell>
                                        <DataTable.Cell>-</DataTable.Cell>
                                        <DataTable.Cell><Text style={{ color: 'white' }}>{listFact.reduce((total, factura) => total + factura.cant_cajas, 0)}</Text></DataTable.Cell>
                                        <DataTable.Cell><Text style={{ color: 'white' }}>{listFact.reduce((total, factura) => total + factura.cant_unidades, 0)}</Text></DataTable.Cell>
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
