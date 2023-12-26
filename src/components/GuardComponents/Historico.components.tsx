import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';


export const OtrosMenu: React.FC = () => {
    const [selectedValue, setSelectedValue] = useState('option1');

    return (
        <View>
            <View style={{ borderWidth: 1, borderColor: 'black', borderRadius: 5, paddingHorizontal: 10 }}>
                <Picker
                    selectedValue={selectedValue}
                    onValueChange={(itemValue: any) => setSelectedValue(itemValue)}
                >
                    <Picker.Item label="Option 1" value="option1" />
                    <Picker.Item label="Option 2" value="option2" />
                    <Picker.Item label="Option 3" value="option3" />
                </Picker>
            </View>
        </View>
    )

}
