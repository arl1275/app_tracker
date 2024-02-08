import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import UserStorage from "../../storage/user";
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

interface Props{
    setpage: ( value : number) => void;
}

export const MainGuardView : React.FC<Props> = ({ setpage }) => {
    const [data, setData] = useState<dec_envio[]>([]);                                          // data to show in list
    const [selectedValue, setSelectedValue] = useState<string>('');                             // THIS IS NOT WORKING
    const [selectedDecla, setSelectDeclar] = useState<number>(0);                               // this is to get the declaration in specific
    const [showResumenChecked_List, setShowResumenChecked_List] = useState<boolean>(false);     // data to show the checked list
    const [loading, setLoading] = useState(false);                                              // this is to update facturas data|
    const { closeSession } = UserStorage();

    useEffect(() => {
        get_data();
    }, [])

    const get_data = async () => {
        setLoading(true);
        try {
            const valores = await axios.get(db_dir + '/decEnv/app/getDec_env');
            setData(valores.data.data);
            //console.log('DEC-ENVIO.APP : ', data)
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

    const hadler_picker = async ( value : any) =>{
        if(value === '0'){
            await closeSession();
            setpage(0);
        } 
        else{
            setSelectedValue(value);
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <ListToTransito modalVisible={showResumenChecked_List} closeModal={to_Close} />
            <LoadingModal visible={loading} message="ACTUALIZANDO FACTURAS" />

            <View>
                <View style={styles.navbar}>
                    <View style={{ flexDirection: 'row' }}>
                        <IconButton icon={'account-circle'} size={20} iconColor="white" />

                        <Picker
                            selectedValue={selectedValue}
                            style={{ height: 50, width: 50, color: 'white' }}
                            onValueChange={(itemValue) => hadler_picker(itemValue)}>
                            <Picker.Item label="INICIO" value='1' />
                            {/* <Picker.Item label="OTROS" value='2' /> */}
                            <Picker.Item label="SALIR" value='0' />
                        </Picker>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            {/* <TouchableOpacity style={{ backgroundColor: '#063970', marginRight: '10%' }} onPress={() => { }}>
                                <Text style={{ color: 'white' }}>HISTORICOS</Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity style={{ backgroundColor: '#063970', marginRight: 'auto', height : 'auto' }} onPress={() => { get_data() }} >
                                <Text style={{ color: 'white' }}>ACTUALIZAR</Text>
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
                                style={{ backgroundColor: '#0E6655', marginRight: 'auto', width: '20%' }}
                                onPress={() => { to_Open() }}>
                                     {/* <Icon name={'inbox'} size={120} color={'black'} /> */}
                                <Text style={{ color: 'white', marginTop : 10, alignSelf: 'center' }}>TRANSITO</Text>
                            </TouchableOpacity>

                            <Picker
                                selectedValue={selectedDecla}
                                style={{ height: 'auto', width: '80%', backgroundColor: '#1A5276' }}
                                onValueChange={(itemValue) => setSelectDeclar(itemValue)} >

                                <Picker.Item label="SELECCIONAR DECLARACION DE ENVIO" value='0' style={{backgroundColor: '#063970', color : 'white'}}/>
                                {data.map((item: dec_envio) => {
                                    return (<Picker.Item key={item.declaracion_env} label={`DEC_ENVIO : ${item.declaracion_env}`} value={item.id} style={{ backgroundColor: '#063970', color : 'white' }} />)
                                })}
                            </Picker>
                        </View>

                        {
                            selectedDecla == 0 ?
                                <View>
                                    <Card style={{ width : '60%', alignSelf : 'center', marginTop : '45%', backgroundColor : '#A9DFBF'}}>
                                        <Text style={{color : 'black', margin : 10}}> SELECCIONE UNA DECLARACINO DE ENVIO PARA VALIDAR</Text>
                                    </Card>
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
        paddingRight : 7,
        width: 'auto'
    },
});



