import useFacturaStore from "../../storage/storage";
import boxChequerStorage from "../../storage/checkBoxes";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { Icon, IconButton } from "react-native-paper";
import { Dimensions } from "react-native";
import { Facturas } from "../../interfaces/facturas";
import { box_to_check } from "../../interfaces/box";
const widthScreen = Dimensions.get('window').width;

const ReportLocalSincro = () => {
    const facturas: Facturas[] = useFacturaStore().data;
    const boxes: box_to_check[] = boxChequerStorage().data;
    const Dec_Env: number[] = Array.from(new Set(facturas.map(item => item.declaracion_envio)));
    const [seeboxes, setSeeboxes] = useState<any>(false);

    const GetTotalCajas_decEnv = (dec: number): number => {
        const filteredFacturas = facturas.filter((item: Facturas) => item.declaracion_envio === dec);
        return filteredFacturas.reduce((total, item) => {
            const cantCajasNum = typeof item.cant_cajas === "string" ? parseInt(item.cant_cajas, 10) : item.cant_cajas;
            return total + (isNaN(cantCajasNum) ? 0 : cantCajasNum);
        }, 0);
    };

    const GetTotalUnidades_decEnv = (dec: number): number => {
        const filteredFacturas = facturas.filter((item: Facturas) => item.declaracion_envio === dec);
        return filteredFacturas.reduce((total, item) => {
            const cantCajasNum = typeof item.cant_unidades === "string" ? parseInt(item.cant_unidades, 10) : item.cant_unidades;
            return total + (isNaN(cantCajasNum) ? 0 : cantCajasNum);
        }, 0);
    };

    const GetTotalUnidades_GEN_decEnv = (): number => {
        const filteredFacturas = facturas;
        return filteredFacturas.reduce((total, item) => {
            const cantCajasNum = typeof item.cant_unidades === "string" ? parseInt(item.cant_unidades, 10) : item.cant_unidades;
            return total + (isNaN(cantCajasNum) ? 0 : cantCajasNum);
        }, 0);
    };

    return (
        <View style={{ height: '100%' }}>
            <View style={style.head_list}>

                <View style={{ flexDirection: 'row', display: 'flex', backgroundColor: '#242424', borderRadius : 10 , width : '55%'}}>

                    <View style={{ width: '30%', borderRadius: 10, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', margin : '1%' }}>
                        <Text style={{ color: 'black', textAlign: 'left', fontSize: widthScreen * 0.025, fontWeight: 'bold' }}>DETALLES</Text>
                    </View>

                    <View style={{ width: '70%' , alignItems : 'center'  }}>

                        <View style={style.head_row}>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems : 'center' }}>
                                <Icon source={'file-document'} size={widthScreen * 0.02} color="white" />
                                <Text style={{ color: 'white', textAlign: 'left', fontSize: widthScreen * 0.02 }}>Facturas</Text>
                            </View>

                            <Text style={{ color: 'white', textAlign: 'left', fontSize: widthScreen * 0.02 }}>{facturas.length}</Text>
                        </View>

                        <View style={style.head_row}>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' , alignItems : 'center' }}>
                                <Icon source={'cube-scan'} size={widthScreen * 0.02} color="white" />
                                <Text style={{ color: 'white', textAlign: 'left', fontSize: widthScreen * 0.02 }}>Cajas</Text>
                            </View>
                            <Text style={{ color: 'white', textAlign: 'left', fontSize: widthScreen * 0.02 }}>{boxes.length}</Text>
                        </View>

                        <View style={style.head_row}>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems : 'center' }}>
                                <Icon source={'tshirt-crew'} size={widthScreen * 0.02} color="white" />
                                <Text style={{ color: 'white', textAlign: 'left', fontSize: widthScreen * 0.02 }}>Unidades</Text>
                            </View>
                            <Text style={{ color: 'white', textAlign: 'left', fontSize: widthScreen * 0.02 }}>{GetTotalUnidades_GEN_decEnv()}</Text>
                        </View>

                    </View>

                </View>

                <View style={{ width : 'auto', position : 'static' , alignItems : 'flex-end'}}>
                    <TouchableOpacity 
                    style={[style.seeBoxes, { backgroundColor: seeboxes ? '#FF0066' : 'white' }]} 
                    onPress={() => { setSeeboxes(!seeboxes) }}>
                        <Icon source={'folder-eye'} size={widthScreen * 0.05} color={seeboxes ? 'white' : 'black'} />
                    </TouchableOpacity>
                </View>

            </View>

            <ScrollView style={{ height: '100%', backgroundColor: 'white', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>

                {Dec_Env.map((item: number) => (
                    <View style={style.factHead} key={item}>
                        <View style={style.headFacturaLis}>
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Icon source={'file-document'} size={widthScreen * 0.03} color="grey" />
                                <Text style={{ color: 'white', fontSize: widthScreen * 0.03, marginLeft: '3%' }}>D-ENV-{item.toString()}</Text>
                            </View>

                            <View style={{ width: '15%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginRight: '2%' }}>
                                <Text style={{ color: 'white', fontSize: widthScreen * 0.03, marginLeft: '3%' }}>{GetTotalCajas_decEnv(item)}</Text>
                                <Text style={{ color: 'white', fontSize: widthScreen * 0.03, marginLeft: '3%' }}>{GetTotalUnidades_decEnv(item)}</Text>
                            </View>

                        </View>

                        {
                            facturas.filter((item_: Facturas) => item_?.declaracion_envio === item)
                                .map((filteredItem: Facturas) => (
                                    <View key={filteredItem.factura_id} style={[style.reportFactname, { backgroundColor : filteredItem.state_name ? '#F0F0F0' : 'white'}]}>
                                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                                            <Text style={{ textAlign: 'left', width: '20%' , color : '#2C2C2C' , fontSize: widthScreen * 0.022 }}>{filteredItem.factura}</Text>
                                            <Text style={{ textAlign: 'left', width: '20%' , color : '#2C2C2C' , fontSize: widthScreen * 0.022 }}>{filteredItem.lista_empaque}</Text>
                                            <Text style={{ textAlign: 'left', width: '10%' , color : '#2C2C2C' , fontSize: widthScreen * 0.022 }}>{filteredItem.cant_cajas}</Text>
                                            <Text style={{ textAlign: 'left', width: '10%' , color : '#2C2C2C' , fontSize: widthScreen * 0.022 }}>{filteredItem.cant_unidades}</Text>
                                            <Text style={{ textAlign: 'left', width: '30%' , color : '#2C2C2C' , fontSize: widthScreen * 0.021 }}>{filteredItem.clientenombre}</Text>
                                        </View>

                                        {seeboxes &&
                                            <ScrollView style={{ borderTopColor: 'white', maxHeight: 100, backgroundColor: '#F2F3F4' }}>
                                                {boxes.filter((box: any) => box.id_factura === filteredItem.factura_id).map((caja: any) => (
                                                    <View key={caja.caja} style={[style.head_row , { marginLeft : '10%'}]}>
                                                        <Text style={{ color: 'grey' , fontSize: widthScreen * 0.021 }}>{caja.numerocaja}</Text>
                                                        <Text style={{ color: 'grey' , fontSize: widthScreen * 0.021 }}>{caja.caja}</Text>
                                                    </View>
                                                ))}
                                            </ScrollView>
                                        }
                                    </View>
                                ))
                        }
                    </View>
                ))
                }
            </ScrollView>

        </View>
    );
}


const style = StyleSheet.create({
    head_list: {
        backgroundColor: 'black',
        height: 'auto',
        width: '100%',
        borderRadius: 15,
        padding: 7,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        left: 0
    },
    head_row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '60%',
        margin: 2
    },
    rowDetail: {
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
    },
    reportFactname: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        borderRadius: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
    },
    factHead: {
        padding: 5,
        paddingTop: 0,
        alignSelf: 'center',
        margin: 5,
        // borderBottomWidth: 0.5,
        // borderBottomColor: 'black',
        backgroundColor: 'white',
        width: '95%',
        //elevation: 5,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black'
    },
    seeBoxes: {
        height: 'auto',
        width : '40%',
        borderRadius: 100,
        justifyContent: 'center',
        alignContent: 'center',
        padding: '10%'
    },
    headFacturaLis: {
        backgroundColor: 'black',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        paddingLeft: '3%',
        justifyContent: 'space-between'
    }
});

export default ReportLocalSincro;
