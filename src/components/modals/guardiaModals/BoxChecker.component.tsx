import React, { useState, useRef } from "react";
import { Button, Text, View, TextInput, FlatList, StyleSheet, ScrollView, Modal, Alert } from "react-native";
import { Facturas } from "../../../interfaces/facturas";
import { DataTable, IconButton, Card } from 'react-native-paper';
import QRScanner, { QRScannerDL } from "../../camara/camScam.component";                                 // this is the camera itself
import ScanMe from "./ScannerMethod.component";                                         // this is the item box

interface props {
    fact: Facturas | undefined;
    visible: boolean;
    close: () => void;
    tipe : number; // 0 for Guard, 1 for Deliver
}

const BoxChecker: React.FC<props> = ({ fact, visible, close, tipe}) => {
    const [counter, setCounter] = useState<number>(0); // this is to count how many fact has been scanned by the Guard.
    const [see, setSee] = useState(false);
    const [see2, setSee2] = useState(false);

    const CounterBoxes = (num: number) => {
        setCounter(prevCounter => prevCounter + num);
        return counter;
    }

    const Visible = () => {
        setSee(true);
    }
    const Toclose = () => {
        setSee(false);
    }

    const CloseBarcode = () => {
        setSee2(false);
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => { close }}>

            <View style={styles.modalOverlay}>
                <View style={styles.centeredView}>
                    <Card style={{ width: '80%', height: '50%', borderRadius: 3 }}>

                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View>
                                <Text style={styles.title}>FACTURA : {fact?.ref_factura}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <IconButton
                                    icon={'file-excel-box-outline'}
                                    onPress={() => { close(); Toclose() }}
                                    iconColor="red" size={40}
                                    style={{ alignItems: 'flex-end', marginRight: 10 }} />
                            </View>
                        </View>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Card
                                style={{ width: '30%', height: 'auto', margin: 'auto', backgroundColor: '#2855F6', borderRadius: 0 }}
                                onPress={() => { Visible();}}>
                                <IconButton icon={'camera'} size={30} style={{ alignSelf: 'center' }} iconColor="white" />
                            </Card>
                            
                            <ScanMe cantCajas={fact?.cant_cajas} CloseBarcode={CloseBarcode} counterBoxes={CounterBoxes} /> 
                            
                        </View>
                        <View>
                        </View>
                        { tipe === 0 && <QRScanner fact={fact} visible={see} close={Toclose} counterBoxes={CounterBoxes} /> }
                        { tipe === 1 && <QRScannerDL fact={fact} visible={see} close={Toclose} counterBoxes={CounterBoxes} />}
                        
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