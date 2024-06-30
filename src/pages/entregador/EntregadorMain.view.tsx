import React from "react";
import { View, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-paper';
import useFacturaStore from "../../storage/storage";
import EntregadorListView from "../../components/entregadorComponents/entregador.component";
const box = require('../../assets/images/Select-pana.png')

export function EntregadorIndexView() {
    const { data } = useFacturaStore();

    return (
        <View style={{ height : '90%'}}>
            {
                data.length > 0 ?
                    <View>
                        <EntregadorListView />
                    </View>
                    : 
                    <View style={{ position : 'relative', top : '30%', alignItems : 'center'}}>
                        <Text style={{ alignSelf: 'center', color: 'grey' }}>SIN FACTURAS SINCRONIZADAS</Text>
                        <Image source={box} style={{ width: 300, height: 300 }} />
                    </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        backgroundColor: 'black',
        padding: 0,
        borderBottomWidth: 1
    },
    button: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#063970',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        margin: 10,
        textAlign: 'center'
    },
});