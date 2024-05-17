import React, { useState, useRef, useEffect } from "react";
import { Text, View, TextInput, StyleSheet, ScrollView, Modal, Alert, Dimensions } from "react-native";
import { Facturas } from "../../../interfaces/facturas";
import { Card } from 'react-native-paper';
import { play_sound } from "../../Activity/sound.component";
import Icon from 'react-native-vector-icons/FontAwesome';
import useGuardList from "../../../storage/gaurdMemory";
import db_dir from "../../../config/db";
import axios from "axios";
const windowWithd = Dimensions.get('window').width;                                 // this is the camera itself

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
    const [Value_, setValue_] = useState('');               // value of the textInput area
    const [Boxes, setBoxes] = useState<boxes[]>([]);        // is to check the boxes in memory


    useEffect(() => {
        //console.log('<---------- se entro--------------------->')
        if (typeof fact?.cant_cajas === 'number') {
            let dat = 0;
            dat = fact.cant_cajas;
            console.log('CANTIDAD CAJAS A VALIDAR : ', dat);
            if (dat === counter && dat != 0) {
                setSee2(false);
                UpdateIsChecked(fact?.factura);
                setCounter(0);
                setData([]);
                close();
                Alert.alert('FINALIZADO');
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

    const OpenDetail = () => {
        setSee2(!see2);
    }

    const handleBarcodeScan = () => {
        let t = Value_;
        if (t.length > 0) {
            if (t.length === 13) {                                      // that 13 means the lengt of the barcode
                if (data?.includes(t)) {
                    //Alert.alert("CAJA YA ESCANEADA");
                    play_sound(false);
                    setValue_('');
                    play_sound(false);
                } else {
                    for (let i = 0; i < Boxes.length; i++) {
                        if (t === Boxes[i].caja) {
                            Boxes[i].check = true;
                            CounterBoxes(1);
                            data?.push(t);
                            setValue_('');
                            play_sound(true);
                            return
                        }
                        setValue_('');
                    }
                    //Alert.alert('CAJA NO ES DE ESTA FACTURA');
                    play_sound(false);
                }
            } else {
                setValue_('');
                play_sound(false);
            }
        }
        setValue_('');
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
                    <View style={{ width: '90%', height: 'auto'}}>

                        <View style={{ backgroundColor: 'white', width: '100%' , borderRadius : 15}}>

                            <View style={{ marginBottom : 7, flexDirection : 'row', justifyContent : 'space-between'}}>

                                <View style={{ marginLeft : 10, marginTop : 5 }}>
                                    <Icon name={'eye'} color={"black"} size={25} onPress={() => OpenDetail()} />
                                </View>

                                <View style={{ marginRight : 10, marginTop : 5}}>
                                    <Icon
                                        name={'close'}
                                        onPress={() => { setSee2(false); setCounter(0); setData([]); close(); }} // this cleal all my variables with the close button
                                        color="red" size={25}
                                    />
                                </View>
                            </View>

                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center' }}>

                                <View style={{ width: '100%', alignSelf: 'center', display: 'flex', flexDirection: 'column' }}>

                                    <Card style={{ margin: 10, alignSelf: 'center', backgroundColor : 'white' , borderWidth : 1 , borderColor : 'black', width: '95%', elevation : 80 }}>

                                        <View style={{ margin: 10 , paddingLeft : 20 , paddingRight : 20}}>

                                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={[styles.title, { textAlign: 'right' }]}>FACTURA :</Text>
                                                <Text style={styles.title}>{fact?.factura}</Text>
                                            </View>
                                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={[styles.title, { textAlign: 'right' }]}>RUTA :</Text>
                                                <Text style={styles.title}>{fact?.lista_empaque}</Text>
                                            </View>
                                            <View style={{ display: 'flex' , flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={[styles.title , { textAlign: 'right' }]}>CLIENTE :</Text>
                                                <Text style={[styles.title , { textAlign: 'right' , width : '70%'}]}>{fact?.clientenombre}</Text>
                                            </View>

                                        </View>

                                    </Card>

                                    <Card style={{ backgroundColor: 'white', marginBottom: 10, borderRadius: 7, alignSelf: 'center', borderColor : 'black', borderWidth : 1 , width: '95%', elevation : 15 }}>
                                        <View style={{ margin: 4, display: 'flex', flexDirection: 'column', alignSelf: 'center' }}>
                                            <Text style={{ color: 'black', fontSize: 60, fontFamily: 'system-ui', alignSelf: 'center' }}> {counter}/{fact?.cant_cajas} </Text>
                                            <TextInput
                                                ref={inputRef}
                                                style={{}}
                                                value={Value_}
                                                onChangeText={(text) => setValue_(text)}
                                                onSubmitEditing={handleBarcodeScan}
                                                placeholderTextColor={'black'}
                                                placeholder="BARCODE"
                                                autoFocus
                                                onBlur={() => inputRef.current?.focus()}
                                            />
                                        </View>
                                    </Card>

                                </View>

                            </View>

                            {
                                see2 === true &&
                                <View style={{ height: 'auto' }}>
                                    <Card style={{ alignSelf: 'center', width: '90%', height: 100, margin: 10, backgroundColor: 'white' }}>
                                        <ScrollView>
                                            {
                                                Array.isArray(Boxes) ?
                                                    Boxes.map((item) => {
                                                        let ischeck = item.check === true ? '#00FFFF' : '#FF9900';
                                                        return (
                                                            <Text style={{ backgroundColor: ischeck, color: 'black' }}>{item.caja}</Text>
                                                        )
                                                    }) : <Text style={{ color: 'black' }}>SIN DATA</Text>
                                            }
                                        </ScrollView>
                                    </Card>
                                </View>
                            }


                        </View>

                        <View>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )

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
        marginLeft: 10,
        fontFamily: 'system-ui',
        fontSize: windowWithd * 0.023,
        color: 'black',
        fontWeight: '700'
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

