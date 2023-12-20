import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { DataTable, IconButton } from 'react-native-paper';
import { Facturas } from "../../interfaces/facturas";
import db_dir from "../../config/db";
import axios from "axios";
import { EntregaModal } from "../modals/entregadorModals/entregaModal.component";
import useFacturaStore from "../../storage/storage";
import LoadingModal from "../Activity/activity.component";

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
        backgroundColor: '#BDEF74'
    },
});


function EntregadorListView<props>() {
    const [facturas, setFacturas] = useState<Facturas[]>([]);
    const [EntregarFact, serEntregarFact] = useState<Facturas | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [SyncroFlag, setSyncroFlag] = useState<boolean>(false);
    const { data, fetchData, updateFactura, updateSingFields, getAllEnTransitoFacts } = useFacturaStore();
    const test = useFacturaStore((e: any) => e.data);
    const [loading, setLoading] = useState(false);

    const getEnTransitoFacts = async () => {
        try {
            if (data.length === 0) { // verifica si los datos ya están sincronizados
                setLoading(true);
                const data2 = await axios.get(db_dir + '/fact/getFacturasEnTransito');
                setFacturas(data2.data.data);
                updateFactura(facturas);
                setSyncroFlag(true);
                setLoading(false);
            } else {
                getAllEnTransitoFacts();
            }

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

    const dataToSend = (fact: Facturas) => {
        if (fact.state_name === 'ENTREGADO') {
            Alert.alert('ERROR DE VALIDACION', 'No se puede abrir facturas ya entregadas')
        } else {
            serEntregarFact(fact);
            openModal();
        }
    }

    useEffect(() => {
        fetchData();
    }, [])


    return (
        data.length > 0 ? (
            < View >
                <LoadingModal visible={loading} message="ESPERANDO FACTURAS" />
                <ScrollView>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => { getEnTransitoFacts() }}>
                            <Text style={styles.buttonText}>SINCRONIZAR DATOS</Text>
                        </TouchableOpacity>
                    </View>

                    <DataTable>
                        <DataTable.Header style={{ width: 'auto', backgroundColor: "#063970" }}>
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
                                const valor = item.state_name === 'EN TRANSITO' ? styles.SinCheck : styles.ConCkeck;
                                return (
                                    <DataTable.Row key={item.id} onPress={() => dataToSend(item)} style={[valor]}>
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
                </ScrollView>

                <EntregaModal factura={EntregarFact} modalVisible={modalVisible} closeModal={closeModal} />

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