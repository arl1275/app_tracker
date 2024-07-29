import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Alert, ScrollView } from 'react-native';
import { DataTable } from 'react-native-paper';
import { Facturas } from "../../interfaces/facturas";
import { EntregaModal } from "../modals/entregadorModals/entregaModal.component";
import useFacturaStore from "../../storage/storage";
import BoxChecker_ent from "../modals/entregadorModals/BoxChequerEnt.component";
import { Dimensions } from "react-native";
import { RegisterView } from "../modals/entregadorModals/RegisterView.component";
const widthScreen = Dimensions.get('window').width;

const styles = StyleSheet.create({
    tableHeader: {
        width: '95%',
        backgroundColor: "black",
        marginBottom: 5,
        marginTop: 5,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 5,
        elevation: 10,
        alignSelf: 'center',
        height: 'auto'
    },
    tableRow: {
        backgroundColor: "white",
        width: '95%',
        alignSelf: 'center'
    }
});


function EntregadorListView() {
    const [EntregarFact, serEntregarFact] = useState<Facturas | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [see, setSee] = useState(false);
    const [fact_, setfact] = useState<Facturas>();
    const { data, fetchData } = useFacturaStore();
    const [openRegister, setOpenRegister] = useState(false);

    // useEffect(() => {
    //     const fetchDataInterval = setInterval(() => { fetchData();}, 1500);
    //     return () => { clearInterval(fetchDataInterval);};
    // }, []);

    const OpenRegister_func = (value: boolean) => { setOpenRegister(value);}
    const openModal = () => { setModalVisible(true);};
    const closeModal = () => { setModalVisible(false);};
    const close = () => { setSee(false);}
    //THIS IS TO SAVE THE FACTURAS THAT WERE VALIDADED
    const dataToSend = (fact: Facturas) => { serEntregarFact(fact); openModal(); }

    //THIS IS TO OPEN THE BOXCHER OR THE FACTURA VALIDATOR
    const BoxOrSing = (item: Facturas) => {
        if (item.is_check != true && fact_ !== null) {
            setSee(true);
        } else {
            if (item.hasSing === true) {
                OpenRegister_func(true);
            } else if (item.is_Sinchro) {
                Alert.alert('FACTURA YA SINCRONIZADA');
            } else {
                dataToSend(item);
            }
        }
    }

    const color_choose = (item: Facturas) => {
        if (item.state_name === 'FIRMADO') {
            return '#33CCFF';
        } else if (item.state_name === 'SINCRONIZADO') {
            return '#82E0AA';
        } else if (item.state_name === 'ENTREGADO') {
            return '#F9E79F';
        } else {
            return '0';
        }
    }

    return (
        <View style={{ backgroundColor: 'white' }}>
            {
                data.length > 0 && (
                    <View style={{ height: '100%' }}>
                        <DataTable>
                            <DataTable.Header style={styles.tableHeader}>
                                <DataTable.Title><Text style={{ color: 'white', fontSize: widthScreen * 0.02 }}>CLIENTE</Text></DataTable.Title>
                                <DataTable.Title><Text style={{ color: 'white', fontSize: widthScreen * 0.02 }}>FACTURA</Text></DataTable.Title>
                                <DataTable.Title><Text style={{ color: 'white', fontSize: widthScreen * 0.02 }}>EMPAQUE</Text></DataTable.Title>
                                <DataTable.Title><Text style={{ color: 'white', fontSize: widthScreen * 0.02 }}>CAJAS</Text></DataTable.Title>
                                <DataTable.Title><Text style={{ color: 'white', fontSize: widthScreen * 0.02 }}>UNIDADES</Text></DataTable.Title>
                                <DataTable.Title><Text style={{ color: 'white', fontSize: widthScreen * 0.02 }}>ESTADO</Text></DataTable.Title>
                            </DataTable.Header>
                            <ScrollView>
                                {
                                    data.map((item: Facturas) => {
                                        let valor = color_choose(item);
                                        return (
                                            <DataTable.Row key={item.factura_id} onPress={() => { setfact(item); BoxOrSing(item); }} style={[styles.tableRow, {backgroundColor:valor, marginTop:1 }]}>
                                                <DataTable.Cell><Text style={{ fontSize: widthScreen * 0.015, fontWeight: '400', color: 'black', width: '90%', margin: '5%' }}>{item.clientenombre}</Text></DataTable.Cell>
                                                <DataTable.Cell><Text style={{ fontSize: widthScreen * 0.02, fontWeight: 'bold', color: 'black', }}>{item.factura}</Text></DataTable.Cell>
                                                <DataTable.Cell><View style={{ }}>
                                                    {item.lista_empaque.split(',').map((item, index) => (
                                                        <Text key={index} style={style.itemStyle}>{item.trim()}</Text>
                                                    ))}</View></DataTable.Cell>
                                                <DataTable.Cell><Text style={{ fontSize: widthScreen * 0.02, fontWeight: '400', color: 'black', margin: '5%' }}>{item.cant_cajas}</Text></DataTable.Cell>
                                                <DataTable.Cell><Text style={{ fontSize: widthScreen * 0.02, fontWeight: '400', color: 'black', margin: '5%' }}>{item.cant_unidades}</Text></DataTable.Cell>
                                                <DataTable.Cell><Text style={{ fontSize: widthScreen * 0.02, fontWeight: 'bold', color: 'black' }}>{item.state_name === undefined ? 'PENDIENTE' : item.state_name}</Text></DataTable.Cell>
                                            </DataTable.Row>
                                        )
                                    })
                                }
                            </ScrollView>
                        </DataTable>


                        <EntregaModal factura={EntregarFact} modalVisible={modalVisible} closeModal={closeModal} />
                        <BoxChecker_ent visible={see} close={close} fact={fact_} />
                        <RegisterView item={fact_} open={OpenRegister_func} Isopen={openRegister} />
                    </View >
                )
            }</View>
    );

}
export default EntregadorListView;

const style = StyleSheet.create({
    itemStyle : {
        textAlign: 'left',
        textAlignVertical: 'center',
        color: '#2C2C2C',
        fontSize: widthScreen * 0.022,
        margin: '1%'
    }
})