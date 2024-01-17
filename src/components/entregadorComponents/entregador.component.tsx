import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { DataTable, IconButton } from 'react-native-paper';
import { Facturas } from "../../interfaces/facturas";
import db_dir from "../../config/db";
import axios from "axios";
import { EntregaModal } from "../modals/entregadorModals/entregaModal.component";
import useFacturaStore from "../../storage/storage";
import LoadingModal from "../Activity/activity.component";
import BoxChecker from "../modals/guardiaModals/BoxChecker.component";

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#063970',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around', // Adjust as needed
        //marginVertical: 10,
        width: "100%",
        backgroundColor: '#063970',
    },
    SinCheck: {
        backgroundColor: '#E77F7F'
    },
    ConCkeck: {
        backgroundColor: '#F7DC6F'
    },
    IsSynchro: {
        backgroundColor: '#F7DC6F'
    },
    floatingButton: {
        backgroundColor: '#063970',
        width: 50,
        height: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        right: 10,
        elevation: 3, // Add shadow for Android
    },
});

function EntregadorListView<props>() {
    const [facturas, setFacturas] = useState<Facturas[]>([]);                                                   // set the facturas in the local array
    const [EntregarFact, serEntregarFact] = useState<Facturas | null>(null);                                    //
    const [modalVisible, setModalVisible] = useState(false);
    const { data, fetchData, updateFactura, updateSingFields, getAllEnTransitoFacts } = useFacturaStore();
    const [loading, setLoading] = useState(false);
    const [see, setSee] = useState(false);
    const [fact, setfact] = useState<Facturas>();

    const getEnTransitoFacts = async () => {
        try {
            setLoading(true);
            const data2 = await axios.get(db_dir + '/fact/getFacturasEnTransito');
            setFacturas(data2.data.data);
            if (facturas.length === data.length) {
                Alert.alert('SINCRONIZACION', 'La lista de facturas esta actualizada');
            } else {
                updateFactura(facturas);
            }
            setLoading(false);
        } catch (err) {
            Alert.alert('ERROR AL SINCRONIZAR', 'Es posible que no tenga conexion a internet, favor revisar la conexion en los ajustes del telefono.');
        }
    }

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const close = () => {
        setSee(false);
    }

    const BoxOrSing = (item: Facturas) => {
        if (item.hasSing) {
            Alert.alert('ERR', 'Factura ya validada')
        } else {
            if (item.is_check === undefined) {
                setSee(true);
            } else {
                dataToSend(item);
            }
        }
    }

    const dataToSend = (fact: Facturas) => {
        serEntregarFact(fact);
        openModal();
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        data.length > 0 ? (
            < View style={{ height: '100%' }}>
                <LoadingModal visible={loading} message="ESPERANDO FACTURAS" />
                <ScrollView>
                    <DataTable>
                        <DataTable.Header style={{ width: 'auto', backgroundColor: "#0C4C7A" }}>
                            <DataTable.Title>
                                <Text style={{ color: 'white' }}> CLIENTE</Text>
                            </DataTable.Title>
                            <DataTable.Title>
                                <Text style={{ color: 'white' }}>FACTURA</Text>
                            </DataTable.Title>
                            <DataTable.Title>
                                <Text style={{ color: 'white' }}>EMPAQUE</Text>
                            </DataTable.Title>
                            <DataTable.Title>
                                <Text style={{ color: 'white' }}>CAJAS</Text>
                            </DataTable.Title>
                            <DataTable.Title>
                                <Text style={{ color: 'white' }}>ESTADO</Text>
                            </DataTable.Title>
                        </DataTable.Header>
                        {
                            data.map((item: Facturas) => {
                                let valor;
                                if (item.hasSing === true) {
                                    valor = styles.IsSynchro;
                                } else if (item.is_check === true) {
                                    valor = styles.ConCkeck
                                } else if(item.is_check === undefined){
                                    valor = styles.SinCheck
                                }
                                return (
                                    <DataTable.Row key={item.id} onPress={() => { setfact(item); BoxOrSing(item); }} style={[valor]}>
                                        <DataTable.Cell>{item.cliente}</DataTable.Cell>
                                        <DataTable.Cell>{item.ref_factura}</DataTable.Cell>
                                        <DataTable.Cell>{item.lista_empaque}</DataTable.Cell>
                                        <DataTable.Cell>{item.cant_cajas}</DataTable.Cell>
                                        <DataTable.Cell>{item.state_name}</DataTable.Cell>
                                    </DataTable.Row>
                                )
                            })
                        }
                    </DataTable>
                    <TouchableOpacity style={styles.floatingButton} onPress={() => getEnTransitoFacts()}>
                        <Text>+</Text>
                    </TouchableOpacity>
                </ScrollView>

                <EntregaModal factura={EntregarFact} modalVisible={modalVisible} closeModal={closeModal} />
                <BoxChecker fact={fact} visible={see} close={close} tipe={1} />
            </View >)
            :
            (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => { getEnTransitoFacts() }}>
                        <Text style={styles.buttonText}>SINCRONIZAR DATOS</Text>
                    </TouchableOpacity>
                </View>
            )
    );
}

export default EntregadorListView;