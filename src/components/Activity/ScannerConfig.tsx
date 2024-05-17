import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { Icon } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackGuardList } from "../../pages/guardia/guard_navigate";
let reset = require('../../assets/barcodeConfig/reset.png');
let bluetooth = require('../../assets/barcodeConfig/bluetooth.png');
let data_sufix = require('../../assets/barcodeConfig/data_suffix.png');
let enterkey = require('../../assets/barcodeConfig/enterkey.png');
let scanoptions = require('../../assets/barcodeConfig/scanoptions.png');
let tabKey = require('../../assets/barcodeConfig/tabKey.png');

export const ScannerConfig = () => {
    const BarNav = useNavigation<StackNavigationProp<RootStackGuardList>>();

    return (
        <View>
            <View style={{ backgroundColor : '#FF6600', display : 'flex', flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center'}}>
                <TouchableOpacity onPress={ () => { BarNav.navigate('Inicio') } }>
                    <Icon source={'keyboard-backspace'} size={30} color="black"/>
                </TouchableOpacity>
                <Text style={{ color: 'black', alignSelf : 'center', margin : 10}}>CONFIGURAR ESCANER</Text>
            </View>
            
            <ScrollView style={{  alignSelf : 'center'}}>
                <Image source={reset} style={{width : 350, height : 150, aspectRatio : 1.5, alignSelf : 'center', marginBottom : 80}} />
                <Image source={scanoptions} style={{width : 350, height : 150, aspectRatio : 3, alignSelf : 'center', marginBottom : 80}}/>
                <Image source={data_sufix} style={{width : 350, height : 150, aspectRatio : 3, alignSelf : 'center', marginBottom : 80}}/>
                <Image source={enterkey} style={{width : 350, height : 150, aspectRatio : 1.5, alignSelf : 'center', marginBottom : 80}}/>
                <Image source={tabKey} style={{width : 350, height : 150, aspectRatio : 3, alignSelf : 'center', marginBottom : 80}}/>
                <Image source={bluetooth} style={{width : 350, height : 150, aspectRatio : 2, alignSelf : 'center', marginBottom : 80}}/>
            </ScrollView>
        </View>
    )

}