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
        display : "flex",
        marginVertical: 'auto',
        alignSelf : 'flex-end',
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
        backgroundColor: '#28B463'
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

    useEffect(()=>{
        fetchData();
    },[see])

    const getEnTransitoFacts = async () => {
        try {
            setLoading(true);
            const data2 = await axios.get(db_dir + '/facturas/getEnTransFact');
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
            // if (item.is_check === undefined) {
            //     setSee(true);
            // } else {
                dataToSend(item);
            
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
        <View>{
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
                                let valor = item.is_check != true ? '#F5B7B1': item.is_Sinchro === true ? '#A9DFBF': '#F9E79F' ;
                                return (
                                    <DataTable.Row key={item.factura_id} onPress={() => { setfact(item); BoxOrSing(item); }} style={{ backgroundColor: valor }}>
                                        <DataTable.Cell>{item.clientenombre}</DataTable.Cell>
                                        <DataTable.Cell>{item.factura}</DataTable.Cell>
                                        <DataTable.Cell>{item.lista_empaque}</DataTable.Cell>
                                        <DataTable.Cell>{item.cant_cajas}</DataTable.Cell>
                                        <DataTable.Cell>{item.state === null ? 'data' : 'PENDIENTE'}</DataTable.Cell>
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
                {/* <BoxChecker fact={fact} visible={see} close={close} tipe={1} /> */}
            </View >)
            :
            (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => { getEnTransitoFacts() }}>
                        <Text style={styles.buttonText}>SINCRONIZAR DATOS</Text>
                    </TouchableOpacity>
                </View>
            )
            }</View>
    );

}

export default EntregadorListView;