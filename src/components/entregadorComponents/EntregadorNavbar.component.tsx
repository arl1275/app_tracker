import { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStacEntregadorList } from "../../pages/entregador/EntragadorRoutes.page";

const EntregadorNavbar = () => {
    const [ page, setPage ] = useState<number>(0)
    const navigation = useNavigation<StackNavigationProp<RootStacEntregadorList>>();
    
    return (
        <View style={{ width: '100%', height: '5%',  backgroundColor : 'white', justifyContent: 'center'}}>

            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>

                <View style={ page == 0 ? style.NavbarButton_active : style.NavbarButton_unactive}>
                    <TouchableOpacity onPress={()=>{ navigation.navigate('HomeG'); setPage(0)}}>
                        <Text style={{ color : page == 0 ? 'white' : 'grey'}}>INICIO</Text>
                    </TouchableOpacity>
                </View>

                <View style={ page == 1 ? style.NavbarButton_active : style.NavbarButton_unactive}>

                    <TouchableOpacity onPress={()=>{ navigation.navigate('Entregas'); setPage(1)}}>
                        <Text style={{ color : page == 1 ? 'white' : 'grey' }}>ENTREGAS</Text>
                    </TouchableOpacity>

                </View>

                <View style={ page == 2 ? style.NavbarButton_active : style.NavbarButton_unactive}>
                    <TouchableOpacity onPress={()=>{ navigation.navigate('Sincronizado'); setPage(2)}}>
                        <Text style={{ color : page == 2 ? 'white' : 'grey' }}>SINCRO</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )
}

export default EntregadorNavbar;

const style = StyleSheet.create({
    NavbarButton_active:{
        borderRadius :  30 , 
        backgroundColor :  'black', 
        padding : 5, 
        width : '30%', 
        alignItems : 'center', 
        justifyContent : 'center', marginTop : 5,
        marginBottom : 5
    },
    NavbarButton_unactive:{
        borderRadius :  30 , 
        backgroundColor : '#F4F6F7', 
        padding : 5, 
        width : '30%', 
        alignItems : 'center', 
        justifyContent : 'center', 
        marginTop : 5,
        marginBottom : 5
    }
})