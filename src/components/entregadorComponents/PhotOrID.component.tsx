import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import Camera from "../camara/cam.component";

export function PhonOrId() {
    const [id, setId] = useState<number | null>(null)


    const settingTheId = (event: any) => {
        setId(event.target.value);
    }

    return (
        <View style={styles.container}>
            <View>
                {/* <Camera/>
                <Text style={styles.title}>RESUMEN DE ENTREGA</Text>

                <View>
                    <Text style={styles.resumen}>ENTREGADOR </Text>
                    <Text style={styles.resumen}>CAMION : {fact?.placa}</Text> 
                    <Text style={styles.resumen}>FACTURA : </Text>
                    <Text style={styles.resumen}>CAJAS : </Text>
                    <TextInput
                        style={{ height: 40 }}
                        placeholder="INGRESE ID"
                        onChangeText={settingTheId}
                        defaultValue={'null'}
                    />
                </View> */}

            </View>
        </View>
    )


}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#063970',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
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
        justifyContent: 'space-around', // Adjust as needed
        marginVertical: 10,
        width: "60%",
        backgroundColor: '#063970',
    },
    container: {
        backgroundColor: 'white',
        width: 'auto', // Adjust this width as needed  
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        alignSelf: 'center'
    },
    resumen: {
        fontSize: 15,
        fontWeight: 'normal',
    },
    text: {
        width: 'auto',
        height: 10
    }

});