import React, { useEffect, useState, useRef } from "react";
import { Text, View, TextInput, Dimensions, StyleSheet, Alert, TouchableOpacity, ScrollView, ActivityIndicator, Image } from "react-native";
import { Facturas } from "../../../interfaces/facturas";
import axios from "axios";
import db_dir from "../../../config/db";
import { DataTable } from 'react-native-paper';
import useGuardList from "../../../storage/gaurdMemory";
const windowWithd = Dimensions.get('window').width;
const processing = require('../../../assets/images/Processing-bro.png');

export const ListToTransito: React.FC<{ modalVisible: boolean, closeModal: () => void }> = ({ modalVisible, closeModal }) => {
    const [transportista, setTransportista] = useState<string>('');        // save the data of the Entregador
    const [camion, setCamion] = useState<string>('');                      // save the data of the Camion
    const [listFact, setListFact] = useState<Facturas[]>([]);              // this is to show locally
    const { GetIsCheckedFacts, updateIsInTransit } = useGuardList();       // this is to get the checked facts
    const inputRef = useRef<TextInput>(null);                              // this is to check the camion and entregador 
    const [Value_, setValue_] = useState('');                              // this is used as well to check camion and entregador
    const [encabezado, setEncabezado] = useState<any>();                   // this got the header of one declaracion de envio

    useEffect(() => {
        setListFact(GetIsCheckedFacts());
        if (listFact.length <= 0 && modalVisible === true) {
            load();
        }
    }, [modalVisible]);

    useEffect(() => {
        get_encabezado();
    })

    const get_encabezado = async () => {
        let params_: number = listFact[0].id_dec_env;

        const enca = await axios.get(db_dir + '/decEnv/app/getEncabezado', { params: { id_dec_env: params_ } });
        setEncabezado(enca.data.data)
        console.log(encabezado);
    }

    const load = () => {
        return (<ActivityIndicator size="large" color="#0000ff" />)
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

                if (encabezado[0]?.placa === t) { //  listFact.some(item => item.placa === t)
                    setCamion(t);
                    Alert.alert('CAMION ESCANEADO');
                    setValue_('');

                } else if (encabezado[0]?.cod_empleado.toString() === t) { // listFact.some(item => item.nombre === t)
                    setTransportista(t);
                    Alert.alert('ENTREGADOR ESCANEADO');
                    setValue_('');

                } else {
                    Alert.alert('NO PERTENECE A ESTA DECLARACION DE ENVIO');
                    setValue_('');
                }

            } else {
                Alert.alert('NO PERTENECE A ESTA DECLARACION DE ENVIO');
            }
        }
        setValue_('');
    };

    if (listFact.length === 0) {
        if (modalVisible) {
            return (
                <View style={{ alignContent: 'center' }}>
                    <Text style={{ alignSelf: 'center', top: '20%', color: 'white' }}>SIN FACTURAS ESCANEADAS</Text>
                    <Image source={processing} style={{ width: '50%', height: '50%', alignSelf: 'center', top: '30%' }} />
                </View>
            )
        }
    } else {
        return (
            <View>

                <View style={styles.headSty}>
                    <View style={styles.buttonContainer}>
                        <Text style={styles.headTitle}>ENVIO A TRANSITO</Text>

                        <TouchableOpacity style={styles.button} onPress={() => { FacturasToTransito(); closeModal() }}>
                            <Text style={styles.buttonText}>FINALIZAR</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.Textplaces}>
                        <TextInput
                            ref={inputRef}
                            style={{ color: 'white', borderColor: 'grey', textAlign: 'center' }}
                            value={Value_}
                            onChangeText={(text) => setValue_(text)}
                            onSubmitEditing={handleBarcodeScan}
                            placeholderTextColor={'white'}
                            placeholder="ESCANEE CAMION Y ENTREGADOR"
                            autoFocus
                            onBlur={() => inputRef.current?.focus()}
                        />
                    </View>

                    <View style={styles.descrip}>
                        <Text style={[styles.headtext, { backgroundColor: camion === '' ? '#FF9900' : '#0066FF' }]}>CAMION :{listFact[0].placa}</Text>
                        <Text style={[styles.headtext, { backgroundColor: transportista === '' ? '#FF9900' : '#0066FF' }]}>ENTREGADOR :{listFact[0].nombre}</Text>
                    </View>
                </View>
                <ScrollView>
                    <DataTable style={styles.table}>
                        <DataTable.Header>
                            <DataTable.Title><Text style={styles.tableheader}>RUTA</Text></DataTable.Title>
                            <DataTable.Title><Text style={styles.tableheader}>FACTURA</Text></DataTable.Title>
                            <DataTable.Title><Text style={styles.tableheader}>CLIENTE</Text></DataTable.Title>
                            <DataTable.Title><Text style={styles.tableheader}>CAJAS</Text></DataTable.Title>
                            <DataTable.Title><Text style={styles.tableheader}>UNIDADES</Text></DataTable.Title>
                        </DataTable.Header>
                        <ScrollView style={{ height: 'auto' }}>
                            {
                                listFact.map((item) => (
                                    <DataTable.Row key={item.factura_id} style={styles.tableRow}>
                                        <DataTable.Cell><Text style={styles.tableText}>{item.lista_empaque}</Text></DataTable.Cell>
                                        <DataTable.Cell><Text style={styles.tableText}>{item.factura}</Text></DataTable.Cell>
                                        <DataTable.Cell><Text style={styles.tableText}>{item.clientenombre}</Text></DataTable.Cell>
                                        <DataTable.Cell><Text style={styles.tableText}>{item.cant_cajas}</Text></DataTable.Cell>
                                        <DataTable.Cell><Text style={styles.tableText}>{item.cant_unidades}</Text></DataTable.Cell>
                                    </DataTable.Row>
                                ))
                            }
                        </ScrollView>

                        <DataTable.Row>
                            <DataTable.Cell><Text style={{ color: 'white' }}>totales</Text></DataTable.Cell>
                            <DataTable.Cell>-</DataTable.Cell>
                            <DataTable.Cell>-</DataTable.Cell>
                            <DataTable.Cell><Text style={{ color: 'white' }}>{listFact.reduce((total, factura) => total + factura.cant_cajas, 0)}</Text></DataTable.Cell>
                            <DataTable.Cell><Text style={{ color: 'white' }}>{listFact.reduce((total, factura) => total + factura.cant_unidades, 0)}</Text></DataTable.Cell>
                        </DataTable.Row>

                    </DataTable>
                </ScrollView>
            </View >

        );
    }
};



const styles = StyleSheet.create({
    headSty: {
        margin: 15,
        backgroundColor: '#010E21',
        borderRadius: 0,
        borderLeftColor: '#00BCD4',
        borderLeftWidth: 10
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Adjust as neede
        backgroundColor: '#010E21',
    },
    button: {
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 0,
        backgroundColor: '#010E21',
        position: 'absolute',
        right: 4
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: windowWithd * 0.025,
    },
    Textplaces: {
        backgroundColor: '#1C2833',
        width: '90%',
        textAlign: 'center',
        alignSelf: 'center'
    },
    descrip: {
        alignSelf: 'center',
        flexDirection: 'row',
        width: '90%',
        padding: '3%',
        borderRadius: 10,
        justifyContent: 'space-between'
    },
    headTitle: {
        color: '#00BCD4',
        textAlign: 'center',
        fontSize: windowWithd * 0.029,
        fontWeight: '700',
        marginTop: 10,
        marginBottom: 5,
        marginLeft: '35%'
    },
    headtext: {
        fontWeight: 'bold',
        fontSize: windowWithd * 0.025,
        borderRadius: 70,
        alignSelf: 'center',
        textAlign: 'center',
        padding: 3,
        marginTop: 3,
        width: '40%',
        color: 'white'
    },
    table: {
        width: '95%',
        alignSelf: 'center',
        backgroundColor: '#010E21'
    },
    tableheader: {
        color: 'white',
        fontSize: windowWithd * 0.025
    },
    tableRow: {
        backgroundColor: '#1C2833',
        fontSize: windowWithd * 0.02
    },
    tableText: {
        color: 'white',
        width: 'auto'
    }
});
