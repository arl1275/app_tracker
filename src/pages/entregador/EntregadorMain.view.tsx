import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { DataTable, IconButton } from 'react-native-paper';
import EntregadorListView from "../../components/entregadorComponents/entregador.component";
import { VistadeSync } from "../../components/entregadorComponents/ToSync.components";
import { Picker } from "@react-native-picker/picker";
import checkInternetConnection from "../../utils/network_conn";
import UserStorage from "../../storage/user";

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#063970',
        padding: 10,
        width: 'auto'
    },
    button: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#063970',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

interface props{
    closeSession : (zumachen : string) => void;
}

export const EntregadorIndexView : React.FC<props> = ({closeSession}) => {
    const [page, setPage] = useState('lista');
    const { data } = UserStorage();
    const [selectedValue, setSelectedValue] = useState('1');
    const [ isOffline, setIsconn] = useState<boolean | null>(true);

    const val_connnection = async () =>{
        let x 
        if(typeof await checkInternetConnection() === 'boolean'){
            let x = await checkInternetConnection()
            setIsconn(x);
        }
        
    }

    useEffect(()=>{
        val_connnection();
        console.log('REFERENCIA DE ACTIVA EN RED : ', isOffline); 
    },[5000])

    const handlerPicker = async (value: any) => {
         if (value === '0' && isOffline === true) {
           Alert.alert('LA CESSION SE CERRARA');
           closeSession('');
         } else if (value === '0' && isOffline == false || isOffline == undefined || isOffline == null) {
           Alert.alert('CIERRE DE SESION', 'No se puede cerrar la sesion si no esta conectado a la red');
         } else {
           setSelectedValue(value);
         }
      };

    return (
        <View>

            <View style={styles.navbar}>
                <View style={{ flexDirection: 'row' }}>
                    <IconButton icon={'account-circle'} size={25} iconColor="white" />
                    <Picker
                        selectedValue={selectedValue}
                        style={{ height: 50, width: 150, color: 'white' }}
                        onValueChange={(itemValue) => handlerPicker(itemValue)}
                    >
                        <Picker.Item label={ data ? data.nombre : 'INICIO'} value="1" />
                        <Picker.Item label="CIERRE DIARIO" value="2" />
                        <Picker.Item label="CERRAR SESSION" value="0"/>
                    </Picker>
                </View>
                <View>
                    {selectedValue === '1' ? (
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <TouchableOpacity style={{ marginRight: '10%' }}>
                                <Text style={styles.buttonText} onPress={() => { setPage('lista') }}>
                                    FACTURAS
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setPage('sync') }}>
                                <Text style={styles.buttonText}>
                                    SINCRONIZACION
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                </View>
            </View>

            <View>
                {page === 'lista' ? <EntregadorListView /> : null}
                {page === 'sync' ? <VistadeSync /> : null}
            </View>
        </View>
    )
}