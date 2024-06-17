import { View, TouchableOpacity, Text, Alert, StyleSheet, Image } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Syncronazir from "../modals/entregadorModals/syncroniziyer_.component";
import UserStorage from "../../storage/user";
import useFacturaStore from "../../storage/storage";
import boxChequerStorage from "../../storage/checkBoxes";
import { RootStacEntregadorList } from "../../pages/entregador/EntragadorRoutes.page";
import { RootStackParamList } from "../..";
import isConnectedToInternet from "../../utils/network_conn";
import { Dimensions } from "react-native";
import { ActivityIndicator, Icon } from "react-native-paper";
import { useEffect, useState } from "react";
import axios from "axios";
import db_dir from "../../config/db";
import { Facturas } from "../../interfaces/facturas";
import { box_to_check } from "../../interfaces/box";
const withScreen = Dimensions.get('screen').width;

interface FacturaProps {
    id_fact: number;
    fact: string;
}

const EntregadorHomeView = () => {
    const { data, closeSession, getUser } = UserStorage();
    const { deleteAllfacts, updateFactura } = useFacturaStore();
    const { closeBoxes, fetchData_ } = boxChequerStorage();
    const [isConn, setIsConn] = useState<boolean>(false);
    const [facturas, setFacturas] = useState<Facturas[]>([]);
    const [loading, setLoading] = useState(false);
    const [divisable_up, setDivisableUp] = useState<boolean>(false);
    const navigation = useNavigation<StackNavigationProp<RootStacEntregadorList>>();
    const navigation2 = useNavigation<StackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        const intervalId = setInterval(() => {
            IsOnline();
        }, 1000);
        return () => clearInterval(intervalId);
    }, [])

    const IsOnline = async () => {
        setIsConn(await isConnectedToInternet());
    }

    const CerrarSession = async () => {
        setIsConn(await isConnectedToInternet())

        if (isConn) {
            const closeF: boolean = await deleteAllfacts();
            if (closeF) {
                const closeB: boolean = await closeBoxes();
                if (closeB) {
                    const closeU: boolean = await closeSession();
                    closeU ? navigation2.navigate('Home') : Alert.alert('Cierre de Session', 'Hubo un error para cerrar su seccion.')
                }
            } else {
                Alert.alert('Cierre de Session', 'No puede cerrar seccion. Tienen una factura pendiente o firmada')
            }

        } else {
            Alert.alert('Cierre de Session', 'No puede Cerrar session, no esta en red empresarial')
        }

    }

    const getEnTransitoFacts = async () => {
        try {
            const id_user = await getUser();
            const data2 = await axios.get(db_dir + '/facturas/getEnTransFact', { params: { id: id_user.id_user } });
            const facturas_api = data2.data.data

            if (facturas_api.length > 0) {
                setFacturas(facturas_api);
                if (facturas.length > 0) {
                    await updateFactura(facturas);
                    await syncroBoxes();
                    setLoading(false);
                }
            } else {
                console.log('sin valores adsjfkdajs')
            }

        } catch (err) {
            console.log('ERROR AL SINCRONIZAR FACTURAS ENTREGADOR');
            Alert.alert('ERROR AL SINCRONIZAR', 'Es posible que no tenga conexion a internet, favor revisar la conexion en los ajustes del telefono.');
        }
    }

    const syncroBoxes = async () => {
        try {
            let props_cajas_facturas: FacturaProps[] = [];
            if (facturas.length > 0) {
                for (let i = 0; i < facturas.length; i++) {
                    const element: Facturas = facturas[i];
                    let val = {
                        id_fact: element.factura_id,
                        fact: element.factura
                    }
                    props_cajas_facturas.push(val);
                }
                if (props_cajas_facturas.length > 0) {
                    const response = await axios.post(db_dir + '/facturas/app/getCajasOneFact_Entregador', props_cajas_facturas);
                    const valores: box_to_check[] = response.data.data;
                    await fetchData_(valores);
                } else {
                    console.log('error')
                }

            } else {
                console.log(' AUN NO SE SINCRONIZO DE MANERA LOCAL')
            }

        } catch (err) {
            console.log('Error fetching data:', err);
        }

    };

    return (
        <>
            <View style={{ backgroundColor: 'white', flex: 1, height: '100%', width: '100%' }}>
                <View style={style.headHome}>
                    <View style={style.NameLabel}>
                        <Text 
                        style={{ 
                            marginLeft: '10%', 
                            color: 'black', 
                            fontSize: withScreen * 0.03, 
                            fontWeight: 'bold', 
                            marginTop: 5, 
                            alignSelf : 'center',
                            textAlignVertical : 'center'
                            }}>{data.nombre}</Text>
                    </View>


                    <View style={{ height: 'auto', width: '30%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>

                        <TouchableOpacity onPress={() => { navigation.navigate('Barcode') }} style={{ backgroundColor: 'white', borderRadius: 50, padding: 3 }}>
                            <Icon source={'barcode'} color="black" size={25} />
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={async () => { setDivisableUp(true); await getEnTransitoFacts(); setDivisableUp(false) }}
                            style={{ backgroundColor: isConn ? '#FF0066' : 'white', borderRadius: 50, padding: 3, marginRight: '10%' }}
                            disabled={!isConn}>
                            {
                                divisable_up == false ?
                                    <Icon source={'update'} color={isConn ? 'white' : 'black'} size={25} />
                                    :
                                    <ActivityIndicator size={25} color="white" />
                            }

                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { CerrarSession() }} style={{ backgroundColor: isConn ? '#FF0066' : 'white', borderRadius: 50, padding: 3 }} disabled={!isConn}>
                            <Icon source={'logout-variant'} color={isConn ? 'white' : 'black'} size={23} />
                        </TouchableOpacity>

                    </View>

                </View>

                <View style={{ width : '97%', height: '90%', marginTop : 5 , alignSelf : 'center' , justifyContent : 'center' }}>
                    <Syncronazir />
                </View>
            </View>
        </>)
}

const style = StyleSheet.create({
    headHome: {
        borderRadius: 50,
        borderColor: 'white',
        margin: 3,
        height: '6%',
        backgroundColor: 'black',
        elevation: 20,
        padding: 7,
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'row'
    },
    NameLabel: {
        borderRadius: 50,
        backgroundColor: 'white',
        width: '35%',
        height: '100%',
    }
})

export default EntregadorHomeView;

function getUser() {
    throw new Error("Function not implemented.");
}
