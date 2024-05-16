import React, { useEffect, useState, useRef } from "react";
import { Text, View, TextInput, Dimensions, StyleSheet, Alert, TouchableOpacity, ScrollView, ActivityIndicator, Image } from "react-native";
import { Facturas } from "../../interfaces/facturas";
import axios from "axios";
import db_dir from "../../config/db";
import { DataTable, Icon } from 'react-native-paper';
import useGuardList from "../../storage/gaurdMemory";
import { play_sound } from "../Activity/sound.component";
import LoadingModal from "../Activity/activity.component";
const windowWithd = Dimensions.get('window').width;
const processing = require('../../assets/images/Processing-bro.png');


const ListToTransito = () => {
    const [transportista, setTransportista] = useState<string>('');        // save the data of the Entregador
    const [camion, setCamion] = useState<string>('');                      // save the data of the Camion
    const [listFact, setListFact] = useState<Facturas[]>([]);              // this is to show locally
    const { GetIsCheckedFacts, updateIsInTransit } = useGuardList();       // this is to get the checked facts
    const inputRef = useRef<TextInput>(null);                              // this is to check the camion and entregador 
    const [Value_, setValue_] = useState('');                              // this is used as well to check camion and entregador
    const [encabezado, setEncabezado] = useState<any>();                   // this got the header of one declaracion de envio7
    const [ openModal , setOpenl] = useState<boolean>(false);              // this si to open the modal of chargin   


    useEffect(() => {
        setListFact(GetIsCheckedFacts());
        if (listFact.length <= 0){ //&& modalVisible === true) {
            load();
        }
    }, []);

    const ModalOpen=()=>{
        setOpenl(!openModal);
    }

    useEffect(() => {
        get_encabezado();
    })

    const get_encabezado = async () => {
        let params_: number = listFact[0]?.id_dec_env;

        const enca = await axios.get(db_dir + '/decEnv/app/getEncabezado', { params: { id_dec_env: params_ } });
        setEncabezado(enca.data.data);
    }

    const load = () => {
        return (<ActivityIndicator size="large" color="#0000ff" />)
    }

    const FacturasToTransito = async () => {
        try {
            ModalOpen();
            if (!camion || !transportista) {
                Alert.alert('ERROR DATOS', 
                'Favor escanee tanto el camion como el Entregador para validar la salida de la factura.');
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
        }finally{
            ModalOpen();
        }
    };

    const handleBarcodeScan = () => {
        let t = Value_;
        if (t.length > 0) {
            if (listFact) {

                if (encabezado[0]?.placa === t) { //  listFact.some(item => item.placa === t)
                    setCamion(t);
                    play_sound(true)
                    setValue_('');

                } else if (encabezado[0]?.cod_empleado.toString() === t) { // listFact.some(item => item.nombre === t)
                    setTransportista(t);
                    play_sound(true)
                    setValue_('');

                } else {
                    play_sound(false);
                    setValue_('');
                }

            } else {
                Alert.alert('NO PERTENECE A ESTA DECLARACION DE ENVIO');
                play_sound(false);
            }
        }
        setValue_('');
    };

    if ( listFact.length === 0 ){
            return (
                <View style={{ alignContent: 'center', backgroundColor : '#F4F6F7' }}>
                    {/* <Text style={{ alignSelf: 'center', top: '20%', color: 'white' }}>SIN FACTURAS ESCANEADAS</Text> */}
                    <Image source={processing} style={{ width: '40%', height: '40%', alignSelf: 'center', top: '30%', backgroundColor : '#F4F6F7'}} /> 
                </View>
            )
            
    } else {
        return (
            <View>
                {
                    openModal && < LoadingModal message="ENVIANDO A TRANSITO" visible={openModal}/>
                }

                <View style={styles.headSty}>

                    <View style={styles.buttonContainer}>
                        <Text style={styles.headTitle}>DESPACHO A TRANSITO</Text>

                        <TouchableOpacity style={styles.button} onPress={() => { FacturasToTransito(); }}>
                            <Text style={styles.buttonText}>FINALIZAR</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={{ justifyContent: 'space-between', display: "flex", flexDirection: 'row', width: '100%', marginBottom : 5 }}>
                        <View style={{ width: '80%', paddingLeft : 20, paddingRight : 10}}>

                            <View style={{ justifyContent: 'space-between', display: "flex", flexDirection: 'row', width: '100%' }}>
                                <Text style={{ color: 'black', fontSize: 15 }}>Camion</Text>
                                <Text style={{ color: 'black', fontSize: 15 }}>{listFact[0]?.placa}</Text>
                            </View>

                            <View style={{ justifyContent: 'space-between', display: "flex", flexDirection: 'row' }}>
                                <Text style={{ color: 'black', fontSize: 15 }}>Entregador</Text>
                                <Text style={{ color: 'black', fontSize: 15 }}>{listFact[0]?.nombre}</Text>
                            </View>
                            <View style={{ justifyContent: 'space-between', display: "flex", flexDirection: 'row' }}>
                                <Text style={{ color: 'black', fontSize: 15 }}>Cajas</Text>
                                <Text style={{ color: 'black' }}>{listFact.reduce((total, factura) => total + factura.cant_cajas, 0)}</Text>
                            </View>
                            <View style={{ justifyContent: 'space-between', display: "flex", flexDirection: 'row' }}>
                                <Text style={{ color: 'black', fontSize: 15 }}>Unidades</Text>
                                <Text style={{ color: 'black' }}>{listFact.reduce((total, factura) => total + factura.cant_unidades, 0)}</Text>
                            </View>

                        </View>


                        <View style={styles.descrip}>
                            <View style={[styles.headtext, { backgroundColor: camion === '' ? '#FF6600' : '#00FF66', width : 'auto'}]}>
                                <Icon source={'truck'} color={"black"} size={25} />
                            </View>
                            <View style={[styles.headtext, { backgroundColor: transportista === '' ? '#FF6600' : '#00FF66', width : 'auto' }]}>
                                <Icon source={'account'} color={"black"} size={25}/>
                            </View>
                        </View>

                    </View>

                    <View style={styles.Textplaces}>
                        <TextInput
                            ref={inputRef}
                            style={{ color: 'black', borderColor: 'white', textAlign: 'center' }}
                            value={Value_}
                            onChangeText={(text) => setValue_(text)}
                            onSubmitEditing={handleBarcodeScan}
                            placeholderTextColor={'grey'}
                            placeholder="ESCANEE CAMION Y ENTREGADOR"
                            autoFocus
                            onBlur={() => inputRef.current?.focus()}
                        />
                    </View>

                </View>

                <ScrollView >
                    <DataTable style={styles.table}>
                        <DataTable.Header>
                            <DataTable.Title><Text style={styles.tableheader}>RUTA</Text></DataTable.Title>
                            <DataTable.Title><Text style={styles.tableheader}>FACTURA</Text></DataTable.Title>
                            <DataTable.Title><Text style={styles.tableheader}>CLIENTE</Text></DataTable.Title>
                            <DataTable.Title><Text style={styles.tableheader}>CAJAS</Text></DataTable.Title>
                            <DataTable.Title><Text style={styles.tableheader}>UNIDADES</Text></DataTable.Title>
                        </DataTable.Header>
                        <ScrollView style={{ height: '90%' }}>
                            {
                                listFact.map((item) => (
                                    <DataTable.Row key={item.factura_id} style={styles.tableRow}>
                                        <DataTable.Cell><Text style={styles.tableText}>{item.lista_empaque}</Text></DataTable.Cell>
                                        <DataTable.Cell><Text style={styles.tableText}>{item.factura}</Text></DataTable.Cell>
                                        <DataTable.Cell><Text style={styles.tableText}>{item.clientenombre}</Text></DataTable.Cell>
                                        <DataTable.Cell><Text style={[{ textAlign : 'right', color : 'black' }]}>{item.cant_cajas}</Text></DataTable.Cell>
                                        <DataTable.Cell><Text style={styles.tableText}>{item.cant_unidades}</Text></DataTable.Cell>
                                    </DataTable.Row>
                                ))
                            }


                            <DataTable.Row>
                                <DataTable.Cell><Text style={{ color: 'black' }}>totales</Text></DataTable.Cell>
                                <DataTable.Cell>.</DataTable.Cell>
                                <DataTable.Cell>.</DataTable.Cell>
                                <DataTable.Cell><Text style={{ color: 'black' }}>{listFact.reduce((total, factura) => total + factura.cant_cajas, 0)}</Text></DataTable.Cell>
                                <DataTable.Cell><Text style={{ color: 'black' }}>{listFact.reduce((total, factura) => total + factura.cant_unidades, 0)}</Text></DataTable.Cell>
                            </DataTable.Row>

                        </ScrollView>

                    </DataTable>
                </ScrollView>

            </View >

        );
    }
};

export default ListToTransito;

const styles = StyleSheet.create({
    headSty: {
        margin: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation : 10
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Adjust as neede
        backgroundColor: 'white',
        alignSelf: 'center',
        width: '90%',
        borderBottomWidth: 1,
        borderBottomColor: 'green',
        marginBottom: 7
    },
    button: {
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 0,
        backgroundColor: 'none',
        position: 'absolute',
        right: 4,
        borderLeftWidth: 2,
        borderLeftColor: 'white'
    },
    buttonText: {
        color: 'green',
        fontWeight: 'bold',
        fontSize: windowWithd * 0.025,
        marginLeft: 30
    },
    Textplaces: {
        backgroundColor: 'white',
        width: '90%',
        textAlign: 'center',
        alignSelf: 'center',
        borderTopWidth: 1,
        borderTopColor: 'black'
    },
    descrip: {
        alignSelf: 'center',
        width: '20%',
        borderRadius: 10,
        justifyContent: 'space-between'
    },
    headTitle: {
        color: 'black',
        textAlign: 'left',
        fontSize: windowWithd * 0.03,
        fontWeight: '700',
        marginTop: 10,
        marginBottom: 5
    },
    headtext: {
        fontWeight: 'bold',
        fontSize: windowWithd * 0.025,
        borderRadius: 5,
        alignSelf: 'center',
        textAlign: 'center',
        padding: 3,
        marginTop: 3,
        width: '40%',
        color: 'white',
    },
    table: {
        width: '95%',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius : 15,
        elevation : 15,
        height : '100%',
        marginBottom : 20
    },
    tableheader: {
        color: 'black',
        fontSize: windowWithd * 0.025
    },
    tableRow: {
        backgroundColor: '#ECF0F1',
        fontSize: windowWithd * 0.02
    },
    tableText: {
        color: 'black',
        width: 'auto',
        fontSize: windowWithd * 0.025
    }
});