import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button, Text, View, TextInput, FlatList, StyleSheet, ScrollView, Modal, Alert, Keyboard } from "react-native";
import { Facturas } from "../../../interfaces/facturas";
import { Card } from 'react-native-paper';
// import QRScanner, { QRScannerDL } from "../../camara/camScam.component";                                 // this is the camera itself
import Icon from 'react-native-vector-icons/FontAwesome';
import useGuardList from "../../../storage/gaurdMemory";
// import useFacturaStore from "../../../storage/storage";
import db_dir from "../../../config/db";
import axios from "axios";


interface props {
    fact: Facturas | null;
    visible: boolean;
    close: () => void;
    tipe: number; // 0 for Guard, 1 for Deliver
}

interface boxes {
    facturas: string,
    lista_empaque: string,
    caja: string,
    unidades: number,
    cajas: string,
    check: boolean
}

const BoxChecker: React.FC<props> = ({ fact, visible, close, tipe }) => {
    const [counter, setCounter] = useState<number>(0);      // this is to count how many fact has been scanned by the Guard.
    const [see2, setSee2] = useState(false);
    const inputRef = useRef<TextInput>(null);               // ref para el input text of the scanner
    const { UpdateIsChecked } = useGuardList();             // to save the info fact in the memory        
    const [data, setData] = useState<string[]>([]);         // to access the data save in momery
    const [Value_, setValue_] = useState('');
    const [Boxes, setBoxes] = useState<boxes[]>([]);        // is to check the boxes in memory


    useEffect(() => {
        //console.log('<---------- se entro--------------------->')
        if (typeof fact?.cant_cajas === 'number') {
            let dat = 0;
            dat = fact.cant_cajas;
            console.log('CANTIDAD CAJAS A VALIDAR : ', dat);
            if (dat === counter && dat != 0) {
                UpdateIsChecked(fact?.factura);
                Alert.alert('FINALIZADO');
                setCounter(0);
                setData([]);
                CloseBarcode();
                close();
            }
        }
    }, [counter]);

    useEffect(() => {
        getBoxes(); // to sync the boxes
    }, [fact])


    const CounterBoxes = (num: number) => {
        setCounter(prevCounter => prevCounter + num);
        return counter;
    }

    const CloseBarcode = () => {
        setSee2(false);
    }

    const handleBarcodeScan = () => {
        let t = Value_;
        if (t.length > 0) {
            if (t.length === 13) {                                      // that 13 means the lengt of the barcode
                if (data?.includes(t)) {
                    Alert.alert("CAJA YA ESCANEADA");
                    setValue_('');
                } else {
                    for (let i = 0; i < Boxes.length; i++) {
                        if (t === Boxes[i].caja) {
                            Boxes[i].check = true;
                            //console.log('valor guardado : ', t);
                            CounterBoxes(1);
                            data?.push(t);
                            setValue_('');
                            return
                        }
                        setValue_('');
                    }
                    Alert.alert('CAJA NO ES DE ESTA FACTURA');
                }
            }else{
                setValue_('');
            }
        }
    };

    const getBoxes = async () => {
        try {
            let valores = await axios.get(db_dir + '/facturas/getCajas', { params: { factura: fact?.factura } });
            //console.log('dat cajas : ', valores)
            setBoxes(valores.data.data);
        } catch (err) {
            console.log('NO SE PUDO OBTENER LAS CAJAS : ', err)
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => { close }}>
            <View style={styles.modalOverlay}>
                <View style={styles.centeredView}>
                    <Card style={{ width: '90%', height: 'auto', borderRadius: 3 }}>

                        <Card>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#CFD8DC' }}>

                                <View>
                                    <Text style={styles.title}>CLIENTE : {fact?.clientenombre}</Text>
                                    <Text style={styles.title}>RUTA : {fact?.lista_empaque}</Text>
                                    <Text style={styles.title}>FACTURA : {fact?.factura}</Text>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Icon
                                        name={'close'}
                                        onPress={() => { setCounter(0); setData([]); close(); }} // this cleal all my variables with the close button
                                        color="red" size={25}
                                        style={{ alignItems: 'flex-end', marginRight: 10 }}
                                    />
                                </View>

                            </View>
                        </Card>

                        <View style={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignSelf: 'center' }}>
                                    <Icon name={'inbox'} size={120} color={'black'} />
                                    <View>
                                        <Text style={{ color: 'black', fontSize: 70 }}> {counter}/{fact?.cant_cajas} </Text>
                                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                                            <TextInput
                                                ref={inputRef}
                                                style={{ color: 'black', borderColor: 'grey'}}
                                                value={Value_}
                                                onChangeText={(text) => setValue_(text)}
                                                onSubmitEditing={handleBarcodeScan}
                                                placeholderTextColor={'black'}
                                                placeholder="BARCODE"
                                                autoFocus
                                                onBlur={()=>inputRef.current?.focus()}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <Card style={{ height: 'auto' }}>
                                {Boxes.filter((item: boxes) => item.lista_empaque === fact?.lista_empaque).map((item: boxes) => {
                                    let is_check = item.check === true ? 'green' : 'black';
                                    return (
                                        <Text style={{ backgroundColor: is_check , color : 'white'}}>{item.caja}</Text>
                                    );
                                })}
                            </Card>
                        </View>
                        <View>
                        </View>
                    </Card>
                </View>
            </View>
        </Modal>
    )

}

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#063970',
        padding: 10,
        width: 'auto'
    },
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
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 0,
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
    },
    title: {
        margin: 4,
        marginLeft: 10,
        fontSize: 15,
        color: 'black'
    },
    textbody: {
        color: "#858585",
        marginLeft: 20
    },
    bottomButton: {
        position: 'absolute',
        bottom: -100, // Adjust this value for desired spacing from the bottom
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        position: 'absolute',
        width: 1, // Set a small width to make it invisible
        height: 1, // Set a small height to make it invisible
        opacity: 0, // Make it fully transparent
    },
});


export default BoxChecker;

