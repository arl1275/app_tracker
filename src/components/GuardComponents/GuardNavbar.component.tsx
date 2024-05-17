import { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackGuardList } from "../../pages/guardia/guard_navigate";

const GuardiaNavbar = () => {
    const [ page, setPage ] = useState<number>(0)
    const navigation = useNavigation<StackNavigationProp<RootStackGuardList>>();
    
    return (
        <View style={{ width: '100%', height: '5%',  backgroundColor : 'white', justifyContent: 'center'}}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>

                <View style={{ borderBottomWidth : 3 , borderBottomColor : page == 0 ? 'black' : 'white', padding : 10}}>
                    <TouchableOpacity onPress={()=>{ navigation.navigate('Inicio'); setPage(0)}}>
                        <Text style={{ color : page == 0 ? 'black' : 'grey'}}>INICIO</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ borderBottomWidth : 3 , borderBottomColor : page == 1 ? 'black' : 'white', padding : 10}}>

                    <TouchableOpacity onPress={()=>{ navigation.navigate('Despacho'); setPage(1)}}>
                        <Text style={{ color : page == 1 ? 'black' : 'grey' }}>DESPACHO</Text>
                    </TouchableOpacity>

                </View>

                <View style={{ borderBottomWidth : 3 , borderBottomColor : page == 2 ? 'black' : 'white', padding : 10 }}>
                    <TouchableOpacity onPress={()=>{ navigation.navigate('Transito'); setPage(2)}}>
                        <Text style={{ color : page == 2 ? 'black' : 'grey' }}>TRANSITO</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default GuardiaNavbar;