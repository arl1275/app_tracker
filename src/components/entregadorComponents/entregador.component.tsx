import React, { useState, useEffect } from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
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
import UserStorage from "../../storage/user";

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#A3E4D7',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'row'
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginLeft: 15
    },
    buttonContainer: {
        display: "flex",
        marginVertical: '50%',
        alignSelf: 'center',
        width: "50%"
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

interface FacturaProps {
    id_fact: number;
    fact: string;
}

function EntregadorListView() {
    const [facturas, setFacturas] = useState<Facturas[]>([]);                                                   // set the facturas in the local array
    const [EntregarFact, serEntregarFact] = useState<Facturas | null>(null);                                    //
    const [modalVisible, setModalVisible] = useState(false);
    const { data, fetchData, updateFactura, updateSingFields, getAllEnTransitoFacts } = useFacturaStore();
    const [loading, setLoading] = useState(false);
    const [see, setSee] = useState(false);
    const [fact_, setfact] = useState<Facturas>();
    const { fetchData_ } = boxChequerStorage();
    const { getUser } = UserStorage();

    useEffect(() => {
        fetchData();
    }, [])

    //THIS FUNCTION IS TO SYNCRO THE FACTURAS;
    const getEnTransitoFacts = async () => {
        try {

            setLoading(true);
            const id_user = await getUser();
            const data2 = await axios.get(db_dir + '/facturas/getEnTransFact', {params : {id : id_user.id_user}});
            
            if (data2.data.data.length > 0) {
                setFacturas(data2.data.data);
                if (facturas.length === data.length) {
                    Alert.alert('SINCRONIZACION', 'La lista de facturas esta actualizada');
                } else {
                    updateFactura(facturas);
                }
                if (facturas.length > 0) {
                    syncroBoxes();
                }
                setLoading(false);
            }else{
                setLoading(false);
                Alert.alert('NO HAY FACTURAS A SINCRONIZAR PARA ESTE USUARIO');
            }

        } catch (err) {
            console.log('ERROR AL SINCRONIZAR FACTURAS ENTREGADOR : ', err);
            Alert.alert('ERROR AL SINCRONIZAR', 'Es posible que no tenga conexion a internet, favor revisar la conexion en los ajustes del telefono.');
        }
    }

    //THIS FUNCTION IS TO SYNCRO THE BOXES THAT ARE PART OF THE FACTURAS;
    const syncroBoxes = async () => {
        try {
            let props_cajas_facturas: FacturaProps[] = [];

            if (facturas.length > 0) {
                if (facturas.length > 0) {

                    for (let i = 0; i < facturas.length; i++) {
                        const element: Facturas = facturas[i];
                        let val = {
                            id_fact: element.factura_id,
                            fact: element.factura
                        }
                        props_cajas_facturas.push(val);
                    }
                }
            }

            const val = await axios.get(db_dir + '/facturas/app/getCajasOneFact', { params: { data: props_cajas_facturas } }).then(e => e.data);
            const valores: box_to_check[] = val.data;
            fetchData_(valores);
        } catch (err) {
            console.log('Error fetching data:', err);
        }
    };

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
            return '#73C6B6';
        } else if (item.state_name === 'SINCRONIZADO') {
            return '#85C1E9';
        } else if (item.state_name === 'ENTREGADO') {
            return '#FAD7A0';
        } else {
            return '#F5B7B1';
        }
    }

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
                                    <Text style={{ color: 'white' }}>UNIDADES</Text>
                                </DataTable.Title>
                                <DataTable.Title>
                                    <Text style={{ color: 'white' }}>ESTADO</Text>
                                </DataTable.Title>
                            </DataTable.Header>
                            {
                                data.map((item: Facturas) => {
                                    let valor = color_choose(item);
                                    return (
                                        <DataTable.Row key={item.factura_id} onPress={() => { setfact(item); BoxOrSing(item); }} style={{ backgroundColor: valor }}>
                                            <DataTable.Cell>{item.clientenombre}</DataTable.Cell>
                                            <DataTable.Cell>{item.factura}</DataTable.Cell>
                                            <DataTable.Cell>{item.lista_empaque}</DataTable.Cell>
                                            <DataTable.Cell style={{ alignSelf: 'center' }}>{item.cant_cajas}</DataTable.Cell>
                                            <DataTable.Cell style={{ alignSelf: 'center' }}>{item.cant_unidades}</DataTable.Cell>
                                            <DataTable.Cell>{item.state_name === undefined ? 'PENDIENTE' : item.state_name}</DataTable.Cell>
                                        </DataTable.Row>
                                    )
                                })
                            }
                        </DataTable>
                        {/* <TouchableOpacity style={styles.floatingButton} onPress={() => { getEnTransitoFacts(); }}>
                            <Text>+</Text>
                        </TouchableOpacity> */}
                    </ScrollView>

                    <EntregaModal factura={EntregarFact} modalVisible={modalVisible} closeModal={closeModal} />
                    <BoxChecker_ent visible={see} close={close} tipe={1} fact={fact_} />
                </View >)
                :
                (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => { getEnTransitoFacts(); }}>
                            <Icon name="refresh" size={30} />
                            <Text style={styles.buttonText}>SINCRONIZAR DATOS</Text>
                        </TouchableOpacity>
                    </View>
                )
        }</View>
    );

}

export default EntregadorListView;