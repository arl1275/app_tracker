import React from "react";
import { Text, View, ImageBackground } from "react-native";
import LinearGradient from "react-native-linear-gradient";
const background_img = require('../../assets/images/entregador_img.jpg')

export const Blankpage = () => {

    return (
        <>
            <View style={{ backgroundColor: '#0f0f0f', width: '100%', height: '100%'}}>

                <View style={{ marginTop: 120, width: '70%', alignSelf: 'center', marginBottom: 30 }}>

                    <Text style={{ color: 'white', fontWeight: 500, fontSize: 40, marginBottom: 5 }}>Bienvenido...</Text>
                    <Text style={{ color: 'grey', fontWeight: 500, fontSize: 20, marginTop : 50 }}>Favor, seleccionar una opcion para continuar.</Text>

                </View>

            </View>
        </>
    )
}