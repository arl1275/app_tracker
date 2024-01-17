import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Facturas } from "../../interfaces/facturas";
import axios from "axios";
import db_dir from "../../config/db";
import LoadingModal from "../Activity/activity.component";
import { IconButton } from "react-native-paper";
import { Picker } from '@react-native-picker/picker';
import ListComponentModal from "../listComponents/list.component.modal";
import { ListToTransito } from "../modals/guardiaModals/LisToTransit.component";


interface dec_envio {
    ref_declaracion_envio: string,
    cant_facturas: string,
    cant_cajas: string,
    cant_unidades: string
}

export const MainGuardView = () => {
    const [data, setData] = useState<dec_envio[]>([]);
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [selectedDecla, setSelectDeclar] = useState<string>('');
    const [showResumenChecked_List, setShowResumenChecked_List] = useState<boolean>(false);

    useEffect(() => {
        get_data();
    }, [])

    const get_data = async () => {
        try {
            const valores = await axios.get(db_dir + '/cons/decEnv');
            setData(valores.data.data);
        } catch (err) {
            console.log('error para obtener data: ', err);
        }
    }

    // this is to Close the list of the checked
    const to_Close = () =>{
        setShowResumenChecked_List(false);
    }

    const to_Open = () => {
        setShowResumenChecked_List(true);
    }

    return (
        <View style={{flex : 1}}>
            <ListToTransito modalVisible={showResumenChecked_List} closeModal={to_Close} />

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
                                <Text style={{ color: 'white' }}>ACTUALIZAR LISTA</Text>
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
                            style={{ backgroundColor: '#063970', marginRight: 'auto' , width : '20%'}} 
                            onPress={() => { to_Open()}}>
                                <Text style={{ color: 'white', marginTop : '10%', alignSelf : 'center'}}>A TRANSITO</Text>
                            </TouchableOpacity>
                            <Picker
                                selectedValue={selectedDecla}
                                style={{ height: 50, width: '80%', backgroundColor: '#1A5276' }}
                                onValueChange={(itemValue) => setSelectDeclar(itemValue)} >
                                <Picker.Item label="SELECCIONAR DECLARACION DE ENVIO" value='0' />
                                {data.map((item: dec_envio) => {
                                    return (<Picker.Item label={` DECLARACION DE ENVIO: ${item.ref_declaracion_envio}`} value={item.ref_declaracion_envio} style={{ backgroundColor: '#34495E' }} />)
                                })}
                            </Picker>
                        </View>

                        {
                            selectedDecla == '0' ?
                                <View>
                                    <Text style={{ color: 'black' }}>FAVOR SELECCIONE UNA DECLARACION DE ENVIO</Text>
                                </View>
                                :
                                <ListComponentModal ref_declaracion_envio={selectedDecla} />
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



