import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "react-native-paper";
import { Facturas } from "../../../interfaces/facturas";

interface Props {
    fact : Facturas | undefined
}

export const HeadBoxChecker: React.FC<Props> = ({fact}) => {

    return (
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center' }}>
            <View style={{ width: '100%', alignSelf: 'center', display: 'flex', flexDirection: 'column' }}>
                <Card style={{ margin: 7, alignSelf: 'center', backgroundColor: 'black', width: '95%', borderRadius: 5 }}>
                    <View style={{ margin: 10 }}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={[styles.title, { textAlign: 'right' }]}>FACTURA :</Text>
                            <Text style={styles.title}>{fact?.factura}</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={[styles.title, { textAlign: 'right' }]}>CLIENTE :</Text>
                            <Text style={[styles.title, { textAlign: 'right', width: '80%' }]}>{fact?.clientenombre}</Text>
                        </View>
                        <View style={{
                            display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
                            borderTopWidth: 1, borderTopColor: 'white'
                        }}>
                            <Text style={[styles.title, { textAlign: 'right' }]}>RUTA(S) :</Text>
                            <View style={styles.title}>{fact?.lista_empaque.split(',').map((item, index) => (
                                <Text key={index} style={{ textAlign: 'left', textAlignVertical: 'center', color: 'white', fontSize: 12 }}>{item.trim()}</Text>
                            ))}</View>
                        </View>
                    </View>
                </Card>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        margin: 2,
        fontSize: 12,
        color: 'white',
        fontWeight: 'bold'
    }
})