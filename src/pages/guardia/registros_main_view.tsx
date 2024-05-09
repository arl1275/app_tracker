import React, { useState } from "react";
import { Text, View, StyleSheet, Alert, TouchableOpacity, Image, Button, ScrollView } from 'react-native';
import { TextInput } from "react-native-paper";
//import DateTimePicker from '@react-native-community/datetimepicker';


export const RegistrosGuardia_view = () => {
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [showDetailDec, setShowDetailDec] = useState(false);



    const onChange = (selectedDate: any) => {
        const currentDate = selectedDate || date;
        setShowPicker(false);
    };

    const OpenDetail = () => {
        setShowDetailDec(!showDetailDec);
    }

    return (
        <>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
                <TextInput placeholder="DEC. ENVIO"></TextInput>
                <Button title="Seleccionar Fecha" onPress={() => setShowPicker(true)}/>
                {/* {showPicker && (
                    <DateTimePicker
                        value={date}
                        mode="date" // Puedes usar 'date', 'time' o 'datetime' según tus necesidades
                        display="default" // Puedes usar 'default', 'spinner' o 'calendar' para Android
                        onChange={onChange}
                    />)
                } */}
            </View>

            <ScrollView>

            </ScrollView>
            
        </>
    )
}