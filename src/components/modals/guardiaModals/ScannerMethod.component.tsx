import React, { useState } from "react";
import { Button, Text, View, TextInput, FlatList, StyleSheet, ScrollView, Modal, Alert } from "react-native";
import { Facturas } from "../../../interfaces/facturas";
import { DataTable, IconButton, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

interface props{
    cantCajas : number | undefined;
}

const ScanMe : React.FC<props> = ({cantCajas}) => {
    const [counter, setCounter] = useState<number>(0);
    const [data, setData] = useState<string[]>([]);

    const handleBarcodeScan = (scannedText: any) => {
        let values = '';
        if (scannedText.length >= 0) {
            values = scannedText.toString();
            console.log('QR caja :', values);

            if (!data?.includes(values)) {
                Alert.alert("CAJA YA ESCANEADA")
            } else {
                setCounter(counter + 1);
                data?.push(scannedText);
            }
        }
    };

    return(
        <View>
            <Card>
            <Ionicons name="ios-checkmark-circle" size={32} color="green" />
            </Card>
        </View>
    )

}

export default ScanMe;