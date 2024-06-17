import React, { useEffect, useState } from "react";
import { Dimensions, Text, View, StyleSheet, ScrollView, Alert, ActivityIndicator, Platform } from "react-native";
import { Facturas } from "../../interfaces/facturas";
import { Card } from 'react-native-paper';
import useGuardList from "../../storage/gaurdMemory";
import BoxChecker from "../modals/guardiaModals/BoxChecker.component";
import db_dir from "../../config/db";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
const windowWithd = Dimensions.get('window').width;

interface props {
    dec_envio: number
}

const ListComponentModal: React.FC<props> = (props) => {
    let parseIntProps = props.dec_envio;
    const [see, setSee] = useState(false);
    const [FilterArr, setFilterArr] = useState<any[]>([]);
    const [selectFact, setSelectFact] = useState<Facturas | null>(null);
    const { data, CargaData } = useGuardList();
    const TotalFacturas: number | null = data.filter((ite: Facturas) => ite.id_dec_env === parseIntProps).length
    const [openLog, setOpenLog] = useState(false);


    useEffect(() => {
        get_facts();
    }, [parseIntProps]);

    useEffect(() => {
        updateList();
    }, [see])

    const updateList = async () => {
        try {
            console.log('data como props : ', props.dec_envio)
            let valores_ = await axios.get(db_dir + '/decEnv/FactsDecEnv', { params: { dec_envio: props.dec_envio } });
            let valores: Facturas[] = valores_.data.data;
            setFilterArr(valores);
            CargaData(valores);
        } catch (err) {
            console.log('error al obtener facturas');
        }
    }

    const get_facts = async () => {
        try {
            setOpenLog(true);
            let valores_ = await axios.get(db_dir + '/decEnv/FactsDecEnv', { params: { dec_envio: props.dec_envio } });
            let valores: Facturas[] = valores_.data.data;
            setFilterArr(valores);
            CargaData(valores);
            setOpenLog(false);
        } catch (err) {
            console.log('error al obtener facturas');
            setOpenLog(false);
        }
    };


    const checkIsCheck = (it: Facturas) => {
        if (it.is_check) {
            Alert.alert('Factura Escaneada');
        } else {
            setSelectFact(it);
            setSee(true);
        }
    }

    const close = () => {
        setSee(false);
    }

    const get_total_cajas = () => {
        if (data) {
            const filteredFacturas = data.filter((ite: Facturas) => ite.id_dec_env === parseIntProps);
            return filteredFacturas.reduce((total: number, factura: Facturas) => total + factura.cant_cajas, 0);
        } else {
            console.log('data vacia')
        }
    }

    const get_total_unidades = () => {
        if (data) {
            const filteredFacturas = data.filter((ite: Facturas) => ite.id_dec_env === parseIntProps);
            return filteredFacturas.reduce((total: number, factura: Facturas) => total + factura.cant_unidades, 0);
        }
    }

    return (
        <View style={{ maxHeight : 'auto', marginBottom : '40%'}}>
            {
                openLog === false && FilterArr.length > 0 ?

                    <View>
                        <View style={{ height : '100%'}}>
                            <BoxChecker fact={selectFact} visible={see} close={close} tipe={0} />
                            <Card style={styles.card}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    alignContent: 'center',
                                    display: "flex",
                                    marginTop: 5,
                                    //width: '100%' 
                                }}>

                                    <Text style={{ color: 'white' }}>Facturas : {TotalFacturas}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.text_head}>CAJAS :</Text>
                                        <Text style={[styles.text_head, { color: 'white', fontWeight: 'bold' }]}>{get_total_cajas()}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.text_head}>UNIDADES :</Text>
                                        <Text style={styles.text_head}>{get_total_unidades()}</Text>
                                    </View>
                                </View>
                            </Card>
                            <ScrollView style={{ marginTop: 5 }}>
                                {
                                    data.filter((ite: Facturas) => ite.id_dec_env === parseIntProps).map((item: Facturas) => {
                                        let valor = item.is_check != true ? '#FFB42A' : item.is_Sinchro === true ? '#A5D6A7' : '#239B56';
                                        let head_valor = item.is_check != true ? '#616161' : item.is_Sinchro === true ? '#00FFFF' : '#00FF66';
                                        return (
                                            <View style={{ alignSelf: "center", width: '95%', marginBottom: 10 }} key={item.factura_id}>

                                                <Card
                                                    style={{
                                                        borderRadius: 15,
                                                        backgroundColor: 'white',
                                                        height: 'auto',
                                                        alignItems: 'center', // Centra los elementos en el eje principal (horizontal)
                                                        justifyContent: 'center', // Centra los elementos en el eje secundario (vertical)
                                                        borderColor: head_valor,
                                                        borderWidth: 1.2,
                                                        marginBottom: 5,
                                                        elevation: 15,
                                                        paddingTop: 10,
                                                        paddingBottom: 10
                                                    }}
                                                    onPress={() => { checkIsCheck(item) }}
                                                    key={item.factura_id}
                                                >

                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '95%' }}>
                                                        <Text style={[styles.sp_text, { width: '20%' }]}>{item.factura}</Text>
                                                        <Text style={[styles.sp_text, { width: '20%' }]}>{item.lista_empaque}</Text>
                                                        <Text style={[styles.sp_text, { width: '30%' }]}>{item.clientenombre}</Text>
                                                        <Text style={[styles.sp_text, { width: '20%' }]}>{item.cant_cajas}</Text>
                                                        <Text style={[styles.sp_text, { width: '7%' }]}>{item.cant_unidades}</Text>
                                                    </View>

                                                </Card>
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    </View>

                    :

                    <View style={{ alignSelf: 'center', alignItems: 'center', top: 200, height: '100%' }}>
                        <ActivityIndicator animating={openLog} size={120} color="#E91E63" />
                    </View>

            }
            {
                FilterArr.length === 0 && openLog === false &&
                <View style={{ alignSelf: 'center', display: 'flex', flexDirection: 'column', width: '80%', height: '100%' }}>
                    <Text style={{ color: 'grey', fontSize: 40 }}>Facturas En Proceso</Text>
                    <Text style={{ color: 'grey', fontSize: 20, top: 120 }}>Detalle</Text>
                    <Text style={{ color: 'grey', fontSize: 20, width: 'auto', marginTop: 140 }}>Las facturas de esta declaración de envio están en transito actualmente.</Text>
                </View>
            }



        </View>
    )

};

export default ListComponentModal;


const styles = StyleSheet.create({
    container: {
        padding: 20,
        width: '100%'
    },
    text_head: {
        color: 'white',
        fontSize: windowWithd * 0.025,
        fontFamily: 'system-ui',
        marginLeft: 10
    },
    center_text: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    designed_area: {
        color: 'black', // Set your text color here
        fontFamily: 'sans-serif',
        fontSize: windowWithd * 0.025,
        textAlign: 'left',
        width: '25%'
    },
    designed_area2: {
        color: 'black', // Set your text color here
        fontFamily: 'sans-serif',
        fontSize: windowWithd * 0.03,
        textAlign: 'left',
        width: '25%'
    },
    sp_text: {
        fontFamily: 'system-ui',
        fontSize: windowWithd * 0.025,
        color: 'black',
        fontWeight: '700'
    },
    sp_text_head: {
        fontFamily: 'system-ui',
        fontSize: windowWithd * 0.035,
        margin: 5,
        color: 'black',
        fontWeight: '700'
    },
    containerFull: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff', // Color de fondo del contenedor principal
    },
    fullWidthView: {
        backgroundColor: '#403f3f',
        alignSelf: 'stretch', // Estirar para llenar el ancho disponible
        width: '97%',
        borderRadius: 10,
        padding: 7,
        height: '100%', // Ocupar todo el espacio vertical disponible
    },

    //---------------------------------------------------------------------

    card: {
        borderRadius: 50,
        backgroundColor: 'black',
        height: 30, // Ajusta la altura según tu necesidad
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        elevation: 40,
    },
});