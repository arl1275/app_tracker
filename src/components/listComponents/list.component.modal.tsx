import React, {useState} from "react";
import { Button, Text, View, TextInput, FlatList, StyleSheet, ScrollView, Alert } from "react-native";
import { Facturas } from "../../interfaces/facturas";
import { DataTable, IconButton } from 'react-native-paper';
import useGuardList from "../../storage/gaurdMemory";
import BoxChecker from "../modals/guardiaModals/BoxChecker.component";

//test

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

const ListComponentModal: React.FC = ({}) => {
    const [see, setSee] = useState(false);
    const [dat, setDat] = useState<Facturas>()
    const {data, IsCheckVal} = useGuardList();
    
    const checkIsCheck = (data : Facturas) =>{
        if(data.is_check){
            Alert.alert('ERROR', 'factura ya validada');
        }else{
            setSee(true);
            setDat(data);
        }
        
    }
    const close = () =>{
        setSee(false);
    }


    if (data) {
        return (
            <DataTable>

                <BoxChecker fact={dat} visible={see} close={close} tipe={0}/>

                <DataTable.Header style={{ width: 'auto', backgroundColor: "#0C4C7A" }}>
                    <DataTable.Title>
                        <Text style={{ color: 'white' }}> CLIENTE</Text>
                    </DataTable.Title>
                    <DataTable.Title>
                        <Text style={{ color: 'white' }}>FACTURA</Text>
                    </DataTable.Title>
                    <DataTable.Title>
                        <Text style={{ color: 'white' }}>EMPAQUE</Text>
                    </DataTable.Title>
                    <DataTable.Title>
                        <Text style={{ color: 'white' }}>CAJAS</Text>
                    </DataTable.Title>
                    <DataTable.Title>
                        <Text style={{ color: 'white' }}>UNIDADES</Text>
                    </DataTable.Title>
                </DataTable.Header>{
                    data.map((item : Facturas) => {
                        let valor = item.is_check != true ? styles.SinCheck : styles.ConCkeck;
                        return (
                            <DataTable.Row key={item.id} style={[valor]} onPress={()=>{checkIsCheck(item)}}>
                                <DataTable.Cell><Text>{item.cliente}</Text></DataTable.Cell>
                                <DataTable.Cell><Text>{item.ref_factura}</Text></DataTable.Cell>
                                <DataTable.Cell><Text>{item.lista_empaque}</Text></DataTable.Cell>
                                <DataTable.Cell><Text>{item.cant_cajas}</Text></DataTable.Cell>
                                <DataTable.Cell><Text>{item.cant_unidades}</Text></DataTable.Cell>
                            </DataTable.Row>
                        )
                    })
                }
            </DataTable>
        )
    }
};
export default ListComponentModal;