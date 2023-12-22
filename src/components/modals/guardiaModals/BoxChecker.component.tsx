import React, { useState, useRef } from "react";
import { Button, Text, View, TextInput, FlatList, StyleSheet, ScrollView, Modal, Alert } from "react-native";
import { Facturas } from "../../../interfaces/facturas";
import { DataTable, IconButton, Card } from 'react-native-paper';
import QRScanner from "../../camara/camScam.component";
import ScanMe from "./ScannerMethod.component";

interface props {
    fact: Facturas | undefined;
    visible: boolean;
    close: () => void;
}

const BoxChecker: React.FC<props> = ({ fact, visible, close }) => {
    const [counter, setCounter] = useState<number>(0); // this is to count how many fact has been scanned by the Guard.
    const [ScanMethod, setScanMethod] = useState('');
    const [see, setSee] = useState(false);
    const [see2, setSee2] = useState(false);

    const Visible = () => {
        setSee(true);
    }
    const Toclose = () => {
        setSee(false);
        setScanMethod('')
    }

    const showBarcode = () => {
        setSee2(true);
    }

    const CloseBarcode = () => {
        setSee2(false);
        setScanMethod('');
    }


    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => { close }}>
            <View style={styles.modalOverlay}>
                <View style={styles.centeredView}>
                    <Card style={{ width: 'auto', height: 'auto', borderRadius : 0}}>
                        {ScanMethod === '' ? (
                            <><View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            
                                <View>
                                    <Text style={styles.title}>FACTURA : {fact?.ref_factura}</Text>
                                    <Text style={styles.textbody}>CAJAS CONTADAS: {counter}/{fact?.cant_cajas}</Text>
                                </View>
                                <View style={{alignItems : 'flex-end'}}>
                                    <IconButton 
                                        icon={'file-excel-box-outline'} 
                                        onPress={() => { close(); setScanMethod(''); Toclose() }} 
                                        iconColor="red" size={40}
                                        style={{alignItems : 'flex-end', marginRight: 10}} />
                                </View>
                            </View>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                }}>
                                    <Card
                                        style={{ width: '40%', height: 'auto', margin: 20 }}
                                        onPress={() => { setScanMethod('QR'); Visible(); }}>
                                        <IconButton icon={'camera'} size={120} style={{ alignSelf: 'center' }} />
                                        <Text style={{ color: 'black', alignSelf: "center", fontSize: 25 }}>CAMARA</Text>
                                    </Card>

                                    <Card
                                        style={{ width: '40%', height: 'auto', margin: 20 }}
                                        onPress={() => { setScanMethod('barCode'); showBarcode(); }}>
                                        <IconButton icon={'barcode'} size={120} style={{ alignSelf: 'center' }} />
                                        <Text style={{ color: 'black', alignSelf: "center", fontSize: 25 }}>ESCANER</Text>
                                    </Card>

                                </View>
                                <View>
                                </View>
                            </>) : null

                        }

                        <QRScanner fact={fact} visible={see} close={Toclose} />
                        <ScanMe cantCajas={fact?.cant_cajas} visible={see2} CloseBarcode={CloseBarcode} />



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
        margin: 20,
        fontSize: 20,
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