import { View, Text, Dimensions, Alert, ScrollView, Image, TouchableOpacity, StyleSheet, Modal, Button } from "react-native";
import { useState, useEffect } from 'react';
import useFacturaStore from "../../storage/storage";
import { Facturas } from "../../interfaces/facturas";
import { DataTable, Icon, IconButton } from "react-native-paper";
import db_dir from "../../config/db";
import axios from "axios";
import LoadingModal from "../Activity/activity.component";
const box = require('../../assets/images/team_work.png');
const screenwidth = Dimensions.get('screen').width


export function VistadeSync() {
    const { getStorageEntregado, updateSynchro, getAllNOTsynchroFacts } = useFacturaStore();
    const [ dataEntregas , setDataEntregas ] = useState<Facturas[]>([]);
    const [ loading , setLoading ] = useState(false);
    const [ label , setLabel ] = useState<String>('');

    useEffect(() => {
        getData();
    }, []);

    const setSynchro = async (arreglo: Facturas[]) => {
        for (let i = 0; i < arreglo.length; i++) {
            await updateSynchro(arreglo[i].factura_id);
        }
    }

    const SentToValidate = async () => {
        if (dataEntregas) {
            try {
                setLoading(true);
                const data = await getAllNOTsynchroFacts();
                //console.log('fact to validate: ', data);
                if (data.length > 0) {

                    const response = await axios.put(db_dir + '/facturas/SubirFotosFact', data);

                    if (response.status === 200) {
                        setSynchro(data);
                        setLoading(false);
                        Alert.alert('SINCRONIZADO', 'Se ha sincronizado correctamente.')
                    } else {
                        Alert.alert('error', 'no se pudo sincronizar');
                    }

                } else {
                    setLoading(false);
                    Alert.alert('NO SE OBTUBIERON DATOS');
                }

            } catch (error) {
                setLoading(false);
                console.error('Error sending data:', error);
                Alert.alert('ERROR', 'No se pudo enviar los datos');
            }
        } else {
            Alert.alert('ERROR', 'NO HAY VALORES PARA ENVIAR');
        }
    };

    const getData = async () => {
        setLoading(true);
        try {
            const Data: Facturas[] | string = await getStorageEntregado();
            if (Array.isArray(Data) && typeof Data !== 'string') {
                const data: Facturas[] | undefined = await getAllNOTsynchroFacts();
                if (Array.isArray(data) && data.length > 0) {
                    setDataEntregas(data);
                } else {
                    setLabel('No se encontraron facturas con firmas.');
                }
            } else {;
                setLabel(Data);
            }

        } catch (error) {
            console.error('Error obteniendo datos:', error);
            Alert.alert('ERROR', 'Hubo un problema al obtener los datos');

        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ backgroundColor: 'white', height: '100%' }}>{
            dataEntregas.length > 0 ?
                (<View >
                    <View >
                        <TouchableOpacity onPress={() => { SentToValidate(); }}
                            style={styles.buttonSynchro}>
                            <Text style={{ color: 'white', alignSelf: 'center', fontWeight: 'bold', fontSize: 15 }}>SINCRONIZAR FACTURAS</Text>
                            <IconButton icon={'cloud-upload'} size={30} iconColor="white" style={{ alignSelf: 'center' }} />
                        </TouchableOpacity>

                        <ScrollView style={{ height: '80%' }}>
                            <DataTable>
                                <DataTable.Header
                                    style={
                                        {
                                            width: '95%',
                                            backgroundColor: '#171717',
                                            alignSelf: 'center',
                                            borderRadius: 10,
                                            borderWidth: 1,
                                            borderColor: 'white'
                                        }
                                    }>
                                    <DataTable.Title><Text style={{ color: 'white' }}>CLIENTE</Text></DataTable.Title>
                                    <DataTable.Title><Text style={{ color: 'white' }}>FACTURA</Text></DataTable.Title>
                                    <DataTable.Title><Text style={{ color: 'white' }}>RUTA</Text></DataTable.Title>
                                    <DataTable.Title><Text style={{ color: 'white' }}>CAJAS</Text></DataTable.Title>
                                    <DataTable.Title><Text style={{ color: 'white' }}>UNIDADES</Text></DataTable.Title>
                                </DataTable.Header>
                                {
                                    dataEntregas.map((item: Facturas) => {
                                        return (
                                            <DataTable.Row key={item.factura_id} style={styles.StyleRow}>
                                                <DataTable.Cell><Text style={{ color: 'black', fontSize: screenwidth * 0.02, width: '80%' }}>{item.clientenombre}</Text></DataTable.Cell>
                                                <DataTable.Cell><Text style={{ color: 'black' }}>{item.factura}</Text></DataTable.Cell>
                                                <DataTable.Cell><Text style={{ color: 'black' }}>{item.lista_empaque}</Text></DataTable.Cell>
                                                <DataTable.Cell><Text style={{ color: 'black' }}>{item.cant_cajas}</Text></DataTable.Cell>
                                                <DataTable.Cell><Text style={{ color: 'black' }}>{item.cant_unidades}</Text></DataTable.Cell>
                                            </DataTable.Row>
                                        )
                                    })
                                }
                            </DataTable>
                        </ScrollView>

                    </View >

                    <LoadingModal visible={loading} message="SINCRONIZANDO FACTURAS" />

                </View>
                ) : (
                    <View style={{ alignSelf: 'center', top: 150 }}>
                        <Text style={{ alignSelf: 'center', color: 'grey' }}>SIN FACTURAS FIRMADAS</Text>
                        <Text style={{ alignSelf: 'center', color: 'black' }}>{label}</Text>
                        <Image source={box} style={{ width: 300, height: 300 }} />
                    </View>
                )
        }</View>
    )

}

const styles = StyleSheet.create({
    buttonSynchro: {
        height: 80,
        backgroundColor: 'black',
        justifyContent: 'space-around',
        alignContent: 'center',
        borderRadius: 10,
        width: 500,
        display: 'flex',
        flexDirection: 'row',
        margin: 10,
        alignSelf: 'center'
    },
    StyleRow: {
        width: '95%',
        alignSelf: 'center',
        backgroundColor: 'white',
        //borderRadius: 10,
        //elevation: 10,
        //marginTop: 5,
        padding: 5
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 1,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
})
