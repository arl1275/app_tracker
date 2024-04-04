import React, { useEffect, useState } from "react";
import { Dimensions, Text, View, StyleSheet, ScrollView, Alert } from "react-native";
import { Facturas } from "../../interfaces/facturas";
import { Card } from 'react-native-paper';
import useGuardList from "../../storage/gaurdMemory";
import BoxChecker from "../modals/guardiaModals/BoxChecker.component";
import db_dir from "../../config/db";
import axios from "axios";
const windowWithd = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        width: '100%'
    },
    text_head: {
        color: 'white',
        fontSize: windowWithd * 0.03,
        fontFamily: 'system-ui',
        marginLeft: 10
    },
    center_text: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    designed_area: {
        color: 'black', // Set your text color here
        fontFamily: 'sans-serif',
        fontSize: windowWithd * 0.03,
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
        fontSize: windowWithd * 0.03,
        margin: 5,
        color: 'black',
        fontWeight: '700'
    },
    sp_text_head: {
        fontFamily: 'system-ui',
        fontSize: windowWithd * 0.035,
        margin: 5,
        color: 'black',
        fontWeight: '700'
    }
});

interface props {
    dec_envio: number
}

const ListComponentModal: React.FC<props> = (props) => {
    let parseIntProps = props.dec_envio;
    //console.log('dec_env => ', parseIntProps, props.dec_envio);
    const [see, setSee] = useState(false);
    const [FilterArr, setFilterArr] = useState<any[]>([]);
    const [selectFact, setSelectFact] = useState<Facturas | null>(null);
    const { data, CargaData } = useGuardList();


    useEffect(() => {
        get_facts();
    }, [parseIntProps, see]);

    const get_facts = async () => {
        try {
            let valores_ = await axios.get(db_dir + '/decEnv/FactsDecEnv', { params: { dec_envio: props.dec_envio } });
            let valores: Facturas[] = valores_.data.data;
            setFilterArr(valores);
            CargaData(valores);
        } catch (err) {
            console.log('error al obtener facturas');
        }
    };

    const checkIsCheck = (it: Facturas) => {
        if (it.is_check) {
            Alert.alert('ERROR', 'factura ya validada');
        } else {
            setSee(true);
            setSelectFact(it);
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


    if (FilterArr.length > 0) {
        return (
            <View>
                <BoxChecker fact={selectFact} visible={see} close={close} tipe={0} />

                <View style={{ margin: 5, width: '97%', alignSelf: 'center' }}>

                    <Card style={{ borderRadius: 5, borderColor: 'none', backgroundColor: '#34495E', height: 'auto' }}>
                        <View style={styles.center_text}>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', display: "flex" }}>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={styles.text_head}>CAJAS :</Text>
                                    <Text style={styles.text_head}>{get_total_cajas()}</Text>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={styles.text_head}>UNIDADES :</Text>
                                    <Text style={styles.text_head}>{get_total_unidades()}</Text>
                                </View>
                                
                            </View>
                        </View>


                    </Card>
                </View>

                <ScrollView>
                    {
                        data.filter((ite: Facturas) => ite.id_dec_env === parseIntProps).map((item: Facturas) => {
                            let valor = item.is_check != true ? '#FFB42A' : item.is_Sinchro === true ? '#A5D6A7' : '#239B56';
                            let head_valor = item.is_check != true ? '#E91E63' : item.is_Sinchro === true ? '#1B5E20' : '#00FF66';
                            return (
                                <View style={{ alignSelf: "center", width: '95%', marginTop: 10 }} key={item.factura_id}>

                                    <Card
                                        style={{
                                            borderRadius: 0,
                                            borderColor: 'none',
                                            backgroundColor: valor,
                                            height: 'auto',
                                            borderLeftColor: head_valor, // Color de la línea superior
                                            borderLeftWidth: 10,
                                        }} onPress={() => { checkIsCheck(item) }}>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>

                                            <Text style={styles.sp_text}>{item.factura}</Text>
                                            <Text style={styles.sp_text}>{item.lista_empaque}</Text>
                                            <Text style={[styles.sp_text, { width : '30%'}]}>{item.clientenombre}</Text>
                                            <Text style={styles.sp_text}>{item.cant_cajas}</Text>
                                            <Text style={styles.sp_text}>{item.cant_unidades}</Text>

                                        </View>

                                    </Card>
                                </View>
                            )
                        })
                    }
                </ScrollView>

            </View>
        )
    }

};


export default ListComponentModal;