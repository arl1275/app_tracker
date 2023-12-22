import React, { useState, useRef } from "react";
import { Button, Text, View, TextInput, FlatList, StyleSheet, ScrollView, Modal, Alert, Dimensions } from "react-native";
import { DataTable, IconButton, Card } from 'react-native-paper';


interface props {
    cantCajas: number | undefined;
    visible: boolean;
    CloseBarcode: () => void;
}

const ScanMe: React.FC<props> = ({ cantCajas, visible, CloseBarcode }) => {
    const BarCodeInput = useRef<TextInput | null>(null);
    const [counter, setCounter] = useState<number>(0);
    const [data, setData] = useState<string[]>([]);

    const handleBarcodeScan = (scannedText: string) => {
        let values = '';
        if (scannedText.length >= 10) {
            values = scannedText.toString();
            console.log('QR caja :', values);

            if (!data?.includes(values)) {
                Alert.alert("CAJA YA ESCANEADA")
            } else {
                setCounter(counter + 1);
                data?.push(scannedText);
            }
        }

        if (BarCodeInput.current) {
            BarCodeInput.current.blur();
        }
    };

    const handleBar = (scannedBarcode: string) => {
        console.log('data : ', scannedBarcode);
        
        if (scannedBarcode.length >= 10) {
        console.log('Scanned Barcode:', scannedBarcode);
    }

        if (BarCodeInput.current) {
            BarCodeInput.current.blur();
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => { CloseBarcode }}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.cardContainer}>
                        <Card style={{ width: '80%', height: 'auto', borderRadius: 0 }}>
                            <View style={styles.contet}>
                                <IconButton icon={'inbox'} size={120} style={{ alignSelf: 'flex-start' }} />
                                <View>
                                    <Text style={styles.textResume}>Cajas</Text>
                                    <Text style={styles.textTitle}>{counter}/{cantCajas}</Text>
                                    <TextInput
                                        ref={BarCodeInput}
                                        style={{ display: 'none' }} // Hide the input field
                                        onChangeText={handleBar}
                                        autoFocus
                                    />
                                </View>
                            </View>
                            <Button title={'SALIR'} onPress={() => { setCounter(0); CloseBarcode(); }} />
                        </Card>
                    </View>
                </View>
            </View>
        </Modal>

    )

}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '70%',
        height: '30%',
        backgroundColor: 'white',
        borderRadius: 0,
    },
    cardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textResume: {
        color: 'grey'
    },
    textTitle: {
        color: 'black',
        fontSize: 70
    },
    contet: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    }
});



export default ScanMe;