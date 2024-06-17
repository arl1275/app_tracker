import React, { useState, useRef, useEffect } from "react";
import { Text, View, TextInput, StyleSheet, ScrollView, Modal, Alert, Keyboard } from "react-native";
import { play_sound } from "../../Activity/sound.component";
import { Facturas } from "../../../interfaces/facturas";
import { Card } from 'react-native-paper';
import { box_to_check } from "../../../interfaces/box";
import boxChequerStorage from "../../../storage/checkBoxes";
import { IconButton } from 'react-native-paper';
import useFacturaStore from "../../../storage/storage";


interface props {
    fact: Facturas | undefined;
    visible: boolean;
    close: () => void;
    tipe: number; // 0 for Guard, 1 for Deliver
}

const BoxChecker_ent: React.FC<props> = ({ fact, visible, close, tipe }) => {
    const [counter, setCounter] = useState<number>(0);      // this is to count how many fact has been scanned by the Guard.
    const [see2, setSee2] = useState(false);
    const inputRef = useRef<TextInput>(null);               // ref para el input text of the scanner
    const { updateIsCheck } = useFacturaStore();             // to save the info fact in the memory        
    const [scanned, setScanned] = useState<string[]>([]);         // to access the data save in momery
    const [Value_, setValue_] = useState('');
    const [Boxes, setBoxes] = useState<box_to_check[]>([]);        // is to check the boxes in memory
    const { getcajasFacts, validateBox } = boxChequerStorage()


    useEffect(() => {
        if (typeof fact?.cant_cajas === 'string') {
            let dat = 0;
            dat = parseInt(fact.cant_cajas);
            if (dat === counter && dat != 0) {
                updateIsCheck(fact?.factura_id);
                Alert.alert('FINALIZADO');
                CloseBarcode();
                setCounter(0);
                close();
            }
        }
    }, [counter]);

    useEffect(() => {
        getBoxes(); // to sync the boxes
    }, [visible])


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
                if (scanned?.includes(t)) {
                    //Alert.alert("CAJA YA ESCANEADA");
                    play_sound(false);
                    setValue_('');
                } else {
                    for (let i = 0; i < Boxes.length; i++) {
                        if (t === Boxes[i].caja) {
                            Boxes[i].is_check = true;
                            play_sound(true);
                            CounterBoxes(1);
                            scanned?.push(t);
                            setValue_('');
                            return
                        }
                        setValue_('');
                    }
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
            setBoxes(await getcajasFacts(fact?.factura, fact?.factura_id));
        } catch (err) {
            console.log('NO SE PUDO OBTENER LAS CAJAS : ', err)
        }
    };

    const OpenDetail = () => {
        setSee2(!see2);
    }

    return (
        <>
            {visible === true &&
                (Boxes ?
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={visible}
                        onRequestClose={() => { close }}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.centeredView}>
                                <Card style={{ backgroundColor: 'white', borderRadius: 15, width: '95%' }}>

                                    <View style={{ margin: 3 }}>
                                        <IconButton
                                            icon={'close-box'}
                                            onPress={() => { setSee2(false); setCounter(0); close(); }} // this cleal all my variables with the close button
                                            iconColor="red" size={30}
                                        />
                                    </View>

                                    <View style={{ position: 'absolute', right: 10, top: 5 }}>
                                        <IconButton icon={'eye'} iconColor={"black"} size={25} onPress={() => OpenDetail()} />
                                    </View>

                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center' }}>

                                        <View style={{ width: '100%', alignSelf: 'center', display: 'flex', flexDirection: 'column' }}>

                                            <Card style={{ margin: 7, alignSelf: 'center', backgroundColor: '#EBEDEF', width: '95%' }}>

                                                <View style={{ margin: 10 }}>
                                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <Text style={[styles.title, { textAlign: 'right' }]}>FACTURA :</Text>
                                                        <Text style={styles.title}>{fact?.factura}</Text>
                                                    </View>
                                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <Text style={[styles.title, { textAlign: 'right' }]}>RUTA :</Text>
                                                        <Text style={styles.title}>{fact?.lista_empaque}</Text>
                                                    </View>
                                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <Text style={[styles.title, { textAlign: 'right' }]}>CLIENTE :</Text>
                                                        <Text style={[styles.title, { textAlign: 'right', width: '80%' }]}>{fact?.clientenombre}</Text>
                                                    </View>
                                                </View>

                                            </Card>
                                        </View>

                                    </View>

                                    <View style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}>
                                        <View>
                                            <View style={{ display: 'flex', flexDirection: 'row', alignSelf: 'center' }}>
                                                <IconButton icon={'inbox'} size={120} iconColor={'grey'} />
                                                <View>
                                                    <Text style={{ color: 'black', fontSize: 70 }}> {counter}/{fact?.cant_cajas} </Text>
                                                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                                                        <TextInput
                                                            ref={inputRef}
                                                            style={{ color: 'black', borderColor: 'grey' }}
                                                            value={Value_}
                                                            onChangeText={(text) => setValue_(text)}
                                                            onSubmitEditing={handleBarcodeScan}
                                                            placeholderTextColor={'grey'}
                                                            placeholder="BARCODE"
                                                            autoFocus
                                                            onBlur={() => inputRef.current?.focus()}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>

                                        <Card>
                                            {
                                                see2 === true &&
                                                <View style={{ backgroundColor: '#EAEDED', borderBottomLeftRadius : 15 , borderBottomRightRadius : 15 }}>
                                                    <View style={{ alignSelf: 'center', width: '90%', margin: 10, height: 100 , borderWidth : 0, }}>
                                                        <ScrollView>
                                                            {
                                                                Array.isArray(Boxes) ?
                                                                    Boxes.map((item)  => {
                                                                        let ischeck = item.is_check === true ? '#E91E63' : 'black';
                                                                        return (
                                                                            <View style={
                                                                                {
                                                                                    marginTop: 10,
                                                                                    marginLeft: '3%',
                                                                                    marginRight: '3%',
                                                                                    marginBottom: 5,
                                                                                    borderRadius: 15,
                                                                                    backgroundColor: ischeck,
                                                                                    display: 'flex',
                                                                                    flexDirection: 'row',
                                                                                    justifyContent: 'space-around',
                                                                                    padding: 5
                                                                                }
                                                                            }>
                                                                                <Text style={{ backgroundColor: ischeck, color: 'white' }} key={item.albaran}>{item.caja}</Text>
                                                                                <Text style={{ backgroundColor: ischeck, color: 'white' }} key={item.albaran}>{item.numerocaja}</Text>
                                                                            </View>
                                                                        )
                                                                    }) : <Text style={{ color: 'black' }}>SIN DATA</Text>
                                                            }
                                                        </ScrollView>
                                                    </View>
                                                </View>
                                            }
                                        </Card>
                                    </View>
                                    <View>
                                    </View>
                                </Card>
                            </View>
                        </View>
                    </Modal> : null
                )

            }
        </>


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
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent black
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
        margin: 2,
        fontSize: 15,
        color: 'black',
        fontWeight: 'bold'
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
