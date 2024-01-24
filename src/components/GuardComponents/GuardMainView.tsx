import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Facturas } from "../../interfaces/facturas";
import axios from "axios";
import db_dir from "../../config/db";
import LoadingModal from "../Activity/activity.component";
import { Card, IconButton } from "react-native-paper";
import { Picker } from '@react-native-picker/picker';
import ListComponentModal from "../listComponents/list.component.modal";                        // this is the component to show table of the declaraciones_env
import { ListToTransito } from "../modals/guardiaModals/LisToTransit.component";

//-------------     ESTE SOLO OBTIENE TODAS LAS DECLARACIONES DE ENVIO      -------------//


interface dec_envio {
    id: number,
    declaracion_env: string,
    camion: string,
    usuario: string
}

export const MainGuardView = () => {
    const [data, setData] = useState<dec_envio[]>([]);                                          // data to show in list
    const [selectedValue, setSelectedValue] = useState<string>('');                             // THIS IS NOT WORKING
    const [selectedDecla, setSelectDeclar] = useState<number>(0);                               // this is to get the declaration in specific
    const [showResumenChecked_List, setShowResumenChecked_List] = useState<boolean>(false);     // data to show the checked list
    const [loading, setLoading] = useState(false);                                              // this is to update facturas data

    useEffect(() => {
        get_data();
    }, [])

    const get_data = async () => {
        setLoading(true);
        try {
            const valores = await axios.get(db_dir + '/decEnv/getDecEnv');
            setData(valores.data.data);
        } catch (err) {
            console.log('error para obtener data: ', err);
        };
        setLoading(false);
    }

    const to_Close = () => {
        setShowResumenChecked_List(false);
    }

    const to_Open = () => {
        setShowResumenChecked_List(true);
    }

    return (
        <View style={{ flex: 1 }}>
            <ListToTransito modalVisible={showResumenChecked_List} closeModal={to_Close} />
            <LoadingModal visible={loading} message="ACTUALIZANDO FACTURAS" />

            <View>
                <View style={styles.navbar}>
                    <View style={{ flexDirection: 'row' }}>
                        <IconButton icon={'account-circle'} size={25} iconColor="white" />

                        <Picker
                            selectedValue={selectedValue}
                            style={{ height: 50, width: 150, color: 'white' }}
                            onValueChange={(itemValue) => setSelectedValue(itemValue)}>
                            <Picker.Item label="INICIO" value="admin" />
                            <Picker.Item label="OTROS" value="option1" />
                            <Picker.Item label="SALIR" value="option2" />
                        </Picker>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <TouchableOpacity style={{ backgroundColor: '#063970', marginRight: '10%' }} onPress={() => { }}>
                                <Text style={{ color: 'white' }}>HISTORICOS</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: '#063970', marginRight: 'auto' }} onPress={() => { get_data() }} >
                                <Text style={{ color: 'white' }}>ACTUALIZAR DECLARACIONES DE ENVIO</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>


            {
                data.length > 0 ?
                    <View>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <TouchableOpacity
                                style={{ backgroundColor: '#28B463', marginRight: 'auto', width: '20%' }}
                                onPress={() => { to_Open() }}>
                                <Text style={{ color: 'white', marginTop: '20%', alignSelf: 'center' }}>TRANSITO</Text>
                            </TouchableOpacity>

                            <Picker
                                selectedValue={selectedDecla}
                                style={{ height: 50, width: '80%', backgroundColor: '#1A5276' }}
                                onValueChange={(itemValue) => setSelectDeclar(itemValue)} >

                                <Picker.Item label="SELECCIONAR DECLARACION DE ENVIO" value='0' />
                                {data.map((item: dec_envio) => {
                                    return (<Picker.Item label={` DECLARACION DE ENVIO: ${item.declaracion_env}`} value={item.id} style={{ backgroundColor: '#063970' }} />)
                                })}
                            </Picker>
                        </View>

                        {
                            selectedDecla == 0 ?
                                <View>
                                    <Card style={{backgroundColor : '#F9E79F'}}><Text>ES TE COLOR, ES PARA FACTURAS SIN REVISAR</Text></Card>
                                    
                                </View>
                                :
                                <ListComponentModal dec_envio={selectedDecla} />
                        }
                    </View>
                    :
                    null
            }
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 5,
        margin: 5,
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 5,
        marginVertical: 5,
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginVertical: 5,
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
    },
    cell: {
        flex: 1,
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        marginBottom: 20,
        color: 'black'
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    navbar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#063970',
        padding: 10,
        width: 'auto'
    },
});



