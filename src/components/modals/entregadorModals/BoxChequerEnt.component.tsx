import React, { useState, useRef, useEffect, useMemo } from "react";
import { Text, View, TextInput, StyleSheet, ScrollView, Modal, Alert, Dimensions, TouchableOpacity } from "react-native";
import { Facturas } from "../../../interfaces/facturas";
import { Card, IconButton } from 'react-native-paper';
import { play_sound } from "../../Activity/sound.component";
import boxChequerStorage from "../../../storage/checkBoxes";
import useFacturaStore from "../../../storage/storage";
import { box_to_check } from "../../../interfaces/box";
const windowWithd = Dimensions.get('window').width;                                 // this is the camera itself

interface props {
    fact: Facturas | undefined;
    visible: boolean;
    close: () => void;
}

interface boxes {
    facturas: string,
    lista_empaque: string,
    caja: string,
    unidades: number,
    cajas: string,
    check: boolean,
    numerocaja: string
}

const BoxChecker_ent: React.FC<props> = ({ fact, visible, close }) => {
    const [counter, setCounter] = useState<number>(0);      // this is to count how many fact has been scanned by the Guard.
    const [see2, setSee2] = useState(false);
    const inputRef = useRef<TextInput>(null);               // ref para el input text of the scanner
    const { getcajasFacts } = boxChequerStorage();             // to save the info fact in the memory        
    const [data, setData] = useState<string[]>([]);         // to access the data save in momery
    const [Value_, setValue_] = useState('');               // value of the textInput area
    const [Boxes, setBoxes] = useState<box_to_check[]>([]);        // is to check the boxes in memory
    const { updateIsCheck } = useFacturaStore();

    useEffect(() => {
        let value: string | undefined = fact?.cant_cajas.toString();
        let Cant: number = typeof value === 'string' ? parseInt(value) : 0;
        if (Cant > 0) {
            Cant === counter ? (updateIsCheck(fact?.factura_id), close()) : null;
        } else {
            console.log('valor no valido')
        }
    }, [counter]);

    useEffect(() => {
        getBoxes(); // to sync the boxes
    }, [fact])

    const ClearComponentBeforeClose = () => {
        setSee2(false); setCounter(0); setData([]); setBoxes([]); close();
    }

    const CounterBoxes = (num: number) => {
        setCounter(prevCounter => prevCounter + num);
        return counter;
    }

    const OpenDetail = () => {
        setSee2(!see2);
    }

    //----------------- THIS IS TO TEST ---------------//
    const boxesMap = useMemo(() => {
        const map: any = {};
        for (let i = 0; i < Boxes.length; i++) {
            map[Boxes[i].caja] = Boxes[i];
        }
        return map;
    }, [Boxes]);
    //-------------------------------------------------//

    const handleBarcodeScan = () => {
        let t = Value_;
        if (t.length > 0) {
            if (t.length === 13) {                                      // that 13 means the lengt of the barcode
                if (data?.includes(t)) {
                    //Alert.alert("CAJA YA ESCANEADA");
                    play_sound(false);
                    setValue_('');
                    //play_sound(false);
                } else {
                    if (boxesMap[t]) {
                        boxesMap[t].is_check = true;
                        CounterBoxes(1);
                        data?.push(t);
                        setValue_('');
                        play_sound(true);
                    } else {
                        // Alert.alert('CAJA NO ES DE ESTA FACTURA');
                        setValue_('');
                        play_sound(false);
                    }
                    // for (let i = 0; i < Boxes.length; i++) {
                    //     if (t === Boxes[i].caja) {
                    //         Boxes[i].is_check = true;
                    //         CounterBoxes(1);
                    //         data?.push(t);
                    //         setValue_('');
                    //         play_sound(true);
                    //         return
                    //     }
                    //     setValue_('');
                    // }
                    // //Alert.alert('CAJA NO ES DE ESTA FACTURA');
                    // play_sound(false);
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
            let valores = await getcajasFacts(fact?.factura, fact?.factura_id)
            setBoxes(valores);
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
                    <View style={{ width: '90%', height: 'auto' }}>

                        <View style={{ backgroundColor: '#F4F6F6', width: '100%', borderRadius: 5 }}>

                            <View style={{ padding: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ marginLeft: 10 }}>
                                    <IconButton icon={'eye'} iconColor="black" size={25} onPress={() => OpenDetail()} />
                                </View>
                                <View style={{ marginRight: 10 }}>
                                    <IconButton icon={'close'} iconColor="red" size={25} onPress={() => ClearComponentBeforeClose()} />
                                </View>
                            </View>

                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center' }}>

                                <View style={{ width: '100%', alignSelf: 'center', display: 'flex', flexDirection: 'column', margin: 0 }}>

                                    <Card style={{ marginBottom: 0, alignSelf: 'center', backgroundColor: 'black', width: '95%', elevation: 10, borderRadius: 7 }}>
                                        <View style={{ margin: 10, paddingLeft: 20, paddingRight: 20 }}>

                                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={[styles.title, { textAlign: 'right' }]}>FACTURA :</Text>
                                                <Text style={styles.title}>{fact?.factura}</Text>
                                            </View>
                                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={[styles.title, { textAlign: 'right' }]}>CLIENTE :</Text>
                                                <Text style={[styles.title, { textAlign: 'right', width: '70%' }]}>{fact?.clientenombre}</Text>
                                            </View>
                                            <View style={{
                                                display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
                                                borderTopWidth: 1, borderTopColor: 'white', marginTop: 4
                                            }}>
                                                <Text style={[styles.title, { textAlign: 'right' }]}>RUTA(S) :</Text>
                                                <View style={[styles.title]}>
                                                    {fact?.lista_empaque.split(',').map((albaran, index) => (
                                                        <View key={index}><Text style={[styles.title, { textAlign: 'center' }]}>{albaran.trim()}</Text></View>
                                                    ))}
                                                </View>
                                            </View>
                                        </View>

                                    </Card>

                                    <Card style={{ margin: 10, backgroundColor: 'white', padding: 10, borderWidth: 1, borderColor: '#BFC9CA', borderRadius: 5 }}>
                                        <View style={{ display: 'flex', flexDirection: 'row' }}>

                                            <View style={{
                                                display: 'flex', flexDirection: 'row', width: '60%', flexWrap: 'wrap',
                                                backgroundColor: '#ECF0F1', padding: 5, borderRadius: 5, minHeight: 100, maxHeight: 400,
                                            }}>
                                                {Array.isArray(Boxes) && Boxes.length > 0
                                                    ?
                                                    Boxes.map((item) => {
                                                        let ischeck = item.is_check === true ? '#E91E63' : 'black';
                                                        return (
                                                            <Card style={{ height: 25, width: 25, borderRadius: 4, margin: 1, backgroundColor: ischeck, justifyContent: 'center', alignItems: 'center' }}
                                                                key={item.caja}>
                                                                <Text style={{ textAlignVertical: 'center', color: 'white', fontSize: 10 }}>{item.numerocaja}</Text>
                                                            </Card>
                                                        )
                                                    }
                                                    )
                                                    :
                                                    <TouchableOpacity onPress={() => getBoxes()} style={styles.SyncroBoxesButton}>
                                                        <Text style={{ color: 'black', fontWeight: 'bold' }}>PRESIONE AQUI PARA SINCRONIZAR MANUAL CAJAS</Text>
                                                    </TouchableOpacity>
                                                }
                                            </View>

                                            <View style={{ margin: 4, display: 'flex', flexDirection: 'column', alignSelf: 'auto', justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ color: 'black', fontSize: 60, fontFamily: 'system-ui', textAlign: 'left' }}> {counter}/{fact?.cant_cajas} </Text>
                                                <TextInput
                                                    ref={inputRef}
                                                    style={{ backgroundColor: '#F2F3F4', width: '80%', padding: 2, borderRadius: 4, fontSize: 10 }}
                                                    value={Value_}
                                                    onChangeText={(text) => setValue_(text)}
                                                    onSubmitEditing={handleBarcodeScan}
                                                    placeholderTextColor={'black'}
                                                    placeholder="BARCODE"
                                                    autoFocus
                                                    onBlur={() => inputRef.current?.focus()}
                                                />
                                            </View>

                                        </View>


                                    </Card>

                                </View>

                            </View>

                            {
                                see2 === true &&
                                <View style={{ height: '27%' }}>
                                    <Card style={{ alignSelf: 'center', width: '95%', margin: 5, padding : 3, backgroundColor: 'white', elevation: 10, borderRadius : 5 }}>
                                        <ScrollView>
                                            {Array.isArray(Boxes) && Boxes.length > 0 &&
                                                Boxes.map((item) => {
                                                    let ischeck = item.is_check === true ? '#E91E63' : 'black';
                                                    return (
                                                        <View style={
                                                            {
                                                                marginTop: 5,
                                                                marginLeft: '3%',
                                                                marginRight: '3%',
                                                                marginBottom: 5,
                                                                borderRadius: 5,
                                                                backgroundColor: ischeck,
                                                                display: 'flex',
                                                                flexDirection: 'row',
                                                                justifyContent: 'space-around',
                                                                padding: 5
                                                            }} key={item.caja}>
                                                            <Text style={{ color: 'white' }}>{item?.numerocaja}</Text>
                                                            <Text style={{ color: 'white' }}>{item.caja}</Text>
                                                        </View>

                                                    )
                                                })
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
    SyncroBoxesButton: {
        height: '50%',
        width: '100%',
        backgroundColor: '#F4D03F',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
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
        color: 'white',
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


export default BoxChecker_ent;

function UpdateIsChecked(factura: string) {
    throw new Error("Function not implemented.");
}

