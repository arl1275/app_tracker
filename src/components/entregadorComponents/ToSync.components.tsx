import { View, Text, Button, Alert, ScrollView } from "react-native";
import { useState, useEffect } from 'react';
import useFacturaStore from "../../storage/storage";
import { Facturas } from "../../interfaces/facturas";
import { DataTable } from "react-native-paper";
import db_dir from "../../config/db";
import axios from "axios";
import LoadingModal from "../Activity/activity.component";

export function VistadeSync() {
    const { getStorageEntregado, updateSynchro, getAllNOTsynchroFacts } = useFacturaStore();
    const [dataEntregas, setDataEntregas] = useState<Facturas[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    const setSynchro = (arreglo: Facturas[]) => {
        for (let i = 0; arreglo.length > i; i++) {
            updateSynchro(arreglo[i].id);
        }
    }

    const SentToValidate = async () => {
        if (dataEntregas) {
            try {
                //console.log('adata', await getAllNOTsynchroFacts());
                setLoading(true);
                const data = await getAllNOTsynchroFacts();
                console.log('fact to validate: ', data);
                if (data.length > 0) {
                    const response = await axios.put(db_dir + '/entregas/toSincronizar', data)
                    if (response.status === 200) {
                        setSynchro(data)
                        setLoading(false);
                        Alert.alert('SINCRONIZADO', 'Se ha sincronizado correctamente.')
                    } else {
                        Alert.alert('error', 'no se pudo sincronizar');
                    }

                }else{
                    setLoading(false);
                    Alert.alert('NO SE OBTUBIERON DATOS')
                }
            } catch (error) {
                setLoading(false);
                console.error('Error sending data:', error);
                Alert.alert('ERROR', 'No se pudo enviar los datos');
            }
        } else {
            Alert.alert('ERROR', 'NO HAY VALORES PARA ENVIAR');
        }
    };

    const getData = async () => {
        setLoading(true);
        if (getStorageEntregado) {
            const data = await getStorageEntregado();
            setDataEntregas(data);
            //console.log('LOCAL element : ', dataEntregas);
            //console.log('FROM STORAGE : ', await getStorageEntregado());
            setLoading(false);
        } else {
            setLoading(false);
            Alert.alert('ERROR DE LOCAL', 'no se pudo obtener los datos de forma local');
        }
    }

    return (

        <View>{
            dataEntregas.length > 0 ?
                (<View >
                    <LoadingModal visible={loading} message="SINCRONIZANDO FACTURAS" />
                    <View >
                        <ScrollView>
                            <DataTable>
                                <DataTable.Header style={{ width: 'auto' }}>
                                    <DataTable.Title>CLIENTE</DataTable.Title>
                                    <DataTable.Title>FACTURA</DataTable.Title>
                                    <DataTable.Title>EMPAQUE</DataTable.Title>
                                    <DataTable.Title>CAJAS</DataTable.Title>
                                    <DataTable.Title>FIRMADO</DataTable.Title>
                                    <DataTable.Title>FOTO</DataTable.Title>
                                    <DataTable.Title>ID_ENT</DataTable.Title>
                                </DataTable.Header>
                                {
                                    dataEntregas.map((item: Facturas) => {
                                        //console.log('ESTE ES EL ESTADO: ', item.state_name);
                                        return (
                                            // <DataTable.Row onPress={()=> openModal(item)} key={item.id}>
                                            <DataTable.Row key={item.id}>
                                                <DataTable.Cell>{item.cliente}</DataTable.Cell>
                                                <DataTable.Cell>{item.ref_factura}</DataTable.Cell>
                                                <DataTable.Cell>{item.lista_empaque}</DataTable.Cell>
                                                <DataTable.Cell>{item.cant_cajas}</DataTable.Cell>
                                                <DataTable.Cell>{
                                                    item.hasSing === true ? 'SI' : 'NO'
                                                }</DataTable.Cell>
                                                <DataTable.Cell>{
                                                    item.hasPic === true ? 'SI' : 'NO'
                                                }</DataTable.Cell>
                                                <DataTable.Cell>{
                                                    item.hasId !== null ? 'SI' : 'NO'
                                                }</DataTable.Cell>
                                            </DataTable.Row>
                                        )
                                    })
                                }
                            </DataTable>
                        </ScrollView>

                    </View >

                    <View style={{ height: 50, backgroundColor: '#063970', justifyContent: 'center', alignItems: 'flex-end' }}>
                        <Button color={'#063970'} title="SINCRONIZAR" onPress={() => { SentToValidate(); }} />
                    </View>

                </View>) : (
                    <View>
                        <Text style={{ color: 'black' }}>NO SE OBTENIDO LOS DATOS</Text>
                    </View>
                )
        }</View>
    )

}
