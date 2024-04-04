import { View, Text, Button, Alert, ScrollView, Image } from "react-native";
import { useState, useEffect } from 'react';
import useFacturaStore from "../../storage/storage";
import { Facturas } from "../../interfaces/facturas";
import { DataTable } from "react-native-paper";
import db_dir from "../../config/db";
import axios from "axios";
import LoadingModal from "../Activity/activity.component";
const box = require('../../assets/images/team_work.png')

export function VistadeSync() {
    const { getStorageEntregado, updateSynchro, getAllNOTsynchroFacts } = useFacturaStore();
    const [dataEntregas, setDataEntregas] = useState<Facturas[]>([]);
    const [loadinglist, setLoadingList ] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    const setSynchro = async (arreglo: Facturas[]) => {
        for (let i = 0; i < arreglo.length ; i++) {
            //console.log('facturas a sincronizar : ', arreglo[i].factura_id)
            await updateSynchro(arreglo[i].factura_id);
        }
    }

    const SentToValidate = async () => {
        if (dataEntregas) {
            try {
                setLoading(true);
                const data = await getAllNOTsynchroFacts();
                //console.log('fact to validate: ', data);
                if (data.length > 0) {

                    const response = await axios.put(db_dir + '/facturas/SubirFotosFact', data);

                    if (response.status === 200) {
                        setSynchro(data);
                        setLoading(false);
                        Alert.alert('SINCRONIZADO', 'Se ha sincronizado correctamente.')
                    } else {
                        Alert.alert('error', 'no se pudo sincronizar');
                    }

                }else{
                    setLoading(false);
                    Alert.alert('NO SE OBTUBIERON DATOS');
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
        if (await getStorageEntregado()) {
            const data = await getAllNOTsynchroFacts();
            if(Array.isArray(data)){
                if(data.length > 0){
                    setDataEntregas(data);
                    setLoading(false);
                }else{
                    Alert.alert('SIN FACTURAS ENTREGADAS');
                }
            }
            
        } else {
            setLoading(false);
            Alert.alert('ERROR DE LOCAL', 'no se pudo obtener los datos de forma local');
        }
    }

    return (

        <View>{
            dataEntregas.length > 0 ?
                (<View >
                    <View >
                        <ScrollView>
                            <DataTable>
                                <DataTable.Header style={{ width: 'auto' , backgroundColor : '#1E8449'}}>
                                    <DataTable.Title><Text style={{color : 'white'}}>CLIENTE</Text></DataTable.Title>
                                    <DataTable.Title><Text style={{color : 'white'}}>FACTURA</Text></DataTable.Title>
                                    <DataTable.Title><Text style={{color : 'white'}}>CAJAS</Text></DataTable.Title>
                                    <DataTable.Title><Text style={{color : 'white'}}>UNIDADES</Text></DataTable.Title>
                                </DataTable.Header>
                                {
                                    dataEntregas.map((item: Facturas) => {
                                        return (
                                            <DataTable.Row key={item.factura_id}>
                                                <DataTable.Cell><Text>{item.clientenombre}</Text></DataTable.Cell>
                                                <DataTable.Cell><Text>{item.factura}</Text></DataTable.Cell>
                                                <DataTable.Cell><Text>{item.cant_cajas}</Text></DataTable.Cell>
                                                <DataTable.Cell><Text>{item.cant_unidades}</Text></DataTable.Cell>
                                            </DataTable.Row>
                                        )
                                    })
                                }
                            </DataTable>
                        </ScrollView>

                    </View >

                    <View style={{ height: 50, backgroundColor: '#1C2833', justifyContent: 'center', alignItems: 'flex-end' }}>
                        <Button color={'#1C2833'} title="SINCRONIZAR" onPress={() => { SentToValidate(); }} />
                    </View>
                    <LoadingModal visible={loading} message="SINCRONIZANDO FACTURAS" />
                </View>) : (
                    <View style={{alignSelf : 'center', top : '30%'}}>
                        <Text style={{alignSelf : 'center'}}>SIN FACTURAS FIRMADAS</Text>
                        <Image source={box} style={{ width : 300, height : 300 }}/>
                    </View>
                )
        }</View>
    )

}
