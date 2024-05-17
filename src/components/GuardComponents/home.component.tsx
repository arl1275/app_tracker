import { View, TouchableOpacity, Text, Alert } from "react-native";
import UserStorage from "../../storage/user";
import LinearGradient from "react-native-linear-gradient";
import { Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../..';
import { RootStackGuardList } from "../../pages/guardia/guard_navigate";

const HomeGuardView = () => {
    const { data , closeSession } = UserStorage();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const BarNav = useNavigation<StackNavigationProp<RootStackGuardList>>();

    const ClossingSession = async () => {
        await closeSession() ? navigation.navigate('Home') : Alert.alert('Cierre de Sesion', 'No se pudo realizar el cierre de sesion')   
    }

    return (
        <View style={{ backgroundColor: 'white', flex: 1, height: '100%', width: '100%' }}>
            <View
                style={{
                    borderRadius: 15,
                    borderColor: 'white',
                    margin: 20,
                    height: '40%',
                    backgroundColor: 'white',
                    elevation: 20,
                    padding: 15,
                    justifyContent: 'center'
                }}
            >
                <Text style={{ marginLeft: '10%', color: 'black', fontSize: 35, fontWeight: 'bold' }}>Bienvenido!!</Text>
                <Text style={{ marginLeft: '10%', color: 'black', fontSize: 15, fontWeight: 'bold', marginTop: 5 }}>{data.nombre}</Text>
                <Text style={{ marginLeft: '10%', color: 'grey', fontSize: 15, width: '80%', marginTop: 5 }}>Seleccione las opciones de navegacion o las opciones en la parte inferior</Text>

            </View>


            <View style={{ position: 'relative', bottom: 0, width: '100%' }}>

                <TouchableOpacity onPress={()=>{ BarNav.navigate('Barcode')}}>
                    <LinearGradient
                        colors={['#33FF66', '#336666']}
                        style={{
                            justifyContent: 'center',
                            width: '40%',
                            borderRadius: 15,
                            alignItems: 'center',
                            marginBottom: 10,
                            marginLeft: '5%',
                            height: 150
                        }}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Icon source="barcode-scan" size={60} color="white" />
                        <Text style={{ color: 'white', fontSize: 15 }}>Configuracion de Escaner</Text>
                    </LinearGradient>
                </TouchableOpacity>

            </View>

            <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
                <TouchableOpacity
                    style={{ width : '100%'}}
                    onPress={async ()=>{ await ClossingSession();}}>
                    <LinearGradient
                        colors={['#FF0066', '#FF3300']}
                        style={{
                            justifyContent: 'center',
                            marginLeft: '5%',
                            marginRight: '5%',
                            padding: '2%',
                            marginBottom: 10,
                            borderRadius: 50,
                            alignItems: 'center',
                        }}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={{ color: 'white', fontSize: 15 }}>Salir</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>



        </View>
    )
}

export default HomeGuardView;