import React, { useState, useRef } from "react";
import { Button, Text, View, TextInput, FlatList, StyleSheet, ScrollView, Modal, Alert, Dimensions } from "react-native";
import { DataTable, IconButton, Card } from 'react-native-paper';


interface props {
    cantCajas: number | undefined;
    CloseBarcode: () => void;
    counterBoxes : (num : number) => number;
}

const ScanMe: React.FC<props> = ({ cantCajas, CloseBarcode, counterBoxes}) => {
    const BarCodeInput = useRef<TextInput | null>(null);
    const [counter, setCounter] = useState<number>(counterBoxes(0));
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
                counterBoxes(1);
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
        
        <View style={styles.cardContainer}>
                <View style={styles.contet}>
                    <IconButton icon={'inbox'} size={120} />
                    <View>
                        <Text style={styles.textTitle}> {counter}/{cantCajas} </Text>
                        <TextInput
                            ref={BarCodeInput}
                            style={{ display: 'none' }} // Hide the input field
                            onChangeText={handleBar}
                            autoFocus/>
                    </View>
                </View>
        </View>
    )

}

const styles = StyleSheet.create({
    cardContainer: {
        display :'flex',
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
        display : 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    }
});



export default ScanMe;