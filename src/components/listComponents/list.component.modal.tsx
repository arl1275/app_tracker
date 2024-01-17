import React, { useEffect, useState } from "react";
import { Button, Text, View, TextInput, FlatList, StyleSheet, ScrollView, Alert } from "react-native";
import { Facturas } from "../../interfaces/facturas";
import { DataTable, IconButton } from 'react-native-paper';
import useGuardList from "../../storage/gaurdMemory";
import BoxChecker from "../modals/guardiaModals/BoxChecker.component";
import db_dir from "../../config/db";
import axios from "axios";

const styles = StyleSheet.create({
    container: {
        padding: 15,
        width: '100%'
    },
    tableHeader: {
        backgroundColor: 'white',
    },
    SinCheck: {
        backgroundColor: '#E77F7F'
    },
    ConCkeck: {
        backgroundColor: '#2E86C1'
    },
    title: {
        color: 'white', // Set your text color here
    },
});

interface props{
    ref_declaracion_envio : string
}

const ListComponentModal: React.FC<props> = (props) => {
    let parseIntProps = parseInt(props.ref_declaracion_envio);
    //console.log('valores id : ', parseIntProps)
    const [see, setSee] = useState(false);
    const [FilterArr, setFilterArr] = useState<Facturas[]>([]);
    const [selectFact, setSelectFact] = useState<Facturas>();
    const { data, IsCheckVal, CargaData, UpdateIsChecked} = useGuardList();

    useEffect(()=>{
        setFilterArr([]);
        get_facts();
        data
    },[props.ref_declaracion_envio]);

    const get_facts = async () => {
        try {
           let valores_ = (await axios.get(db_dir + '/fact/factEnPreparacion'));
           let valores = valores_.data.data
           CargaData(valores);
           setFilterArr(data.filter((item : Facturas)=> item.ref_declaracion_envio === parseIntProps)); 
        } catch (err) {
            console.log('error al obtener facturas');
        }
    }

    const checkIsCheck = (data: Facturas) => {
        if (data.is_check) {
            Alert.alert('ERROR', 'factura ya validada');
        } else {
            setSee(true);
            setSelectFact(data);
        }
    }

    const close = () => {
        setSee(false);
    }
    const get_total_cajas = () => {
        if (data) {
            const filteredFacturas = data.filter((factura: Facturas) => factura.ref_declaracion_envio === parseIntProps);
            return filteredFacturas.reduce((total: any, factura: Facturas) => total + factura.cant_cajas, 0);
        }
    }
    const get_total_unidades = () => {
        if (data) {
            const filteredFacturas = data.filter((factura: Facturas) => factura.ref_declaracion_envio === parseIntProps);
            return filteredFacturas.reduce((total: any, factura: Facturas) => total + factura.cant_unidades, 0);
        }
    }


     if (FilterArr.length > 0) {
         return (
             <View>
                <ScrollView>
                 <DataTable>

                     <BoxChecker fact={selectFact} visible={see} close={close} tipe={0} />

                     <DataTable.Header style={{ width: 'auto', backgroundColor: "#0C4C7A" }}>
                         <DataTable.Title>
                             <Text style={{ color: 'white' }}>FACTURA</Text>
                         </DataTable.Title>
                         <DataTable.Title>
                             <Text style={{ color: 'white' }}>LISTA EMPAQUE</Text>
                         </DataTable.Title>
                         <DataTable.Title>
                             <Text style={{ color: 'white' }}>CLIENTE</Text>
                         </DataTable.Title>
                         <DataTable.Title>
                             <Text style={{ color: 'white' }}>CAJAS</Text>
                         </DataTable.Title>
                         <DataTable.Title>
                             <Text style={{ color: 'white' }}>UNIDADES</Text>
                         </DataTable.Title>
                     </DataTable.Header>
                     
                        {
                         FilterArr.filter((item: Facturas)=> item.ref_declaracion_envio === parseIntProps).map((item : Facturas) =>{
                            let valor = item.is_check == null ? 'white' : '#D5F5E3';
                            return (
                                          <DataTable.Row key={item.id} onPress={()=>{checkIsCheck(item)}} style={{backgroundColor : valor}}>
                                              <DataTable.Cell><Text style={{color : 'black'}}>{item.ref_factura}</Text></DataTable.Cell>
                                              <DataTable.Cell><Text style={{color : 'black'}}>{item.lista_empaque}</Text></DataTable.Cell>
                                              <DataTable.Cell><Text style={{color : 'black'}}>{item.cliente_nombre}</Text></DataTable.Cell>
                                              <DataTable.Cell><Text style={{color : 'black'}}>{item.cant_cajas}</Text></DataTable.Cell>
                                              <DataTable.Cell><Text style={{color : 'black'}}>{item.cant_unidades}</Text></DataTable.Cell>
                                          </DataTable.Row>
                                      )
                         })
                        }
                        <DataTable.Row  style={{ backgroundColor: "#0C4C7A" }}>
                            <DataTable.Cell><Text style={{color : 'white'}}>totales</Text></DataTable.Cell>
                            <DataTable.Cell><Text></Text></DataTable.Cell>
                            <DataTable.Cell><Text></Text></DataTable.Cell>
                            <DataTable.Cell><Text style={{color : 'white'}}>{get_total_cajas()}</Text></DataTable.Cell>
                            <DataTable.Cell><Text style={{color : 'white'}}>{get_total_unidades()}</Text></DataTable.Cell>
                        </DataTable.Row>
                 </DataTable>
                 </ScrollView>
             </View>
         )
     }
    
};

export default ListComponentModal;