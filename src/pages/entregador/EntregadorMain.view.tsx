import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { IconButton } from 'react-native-paper';
import EntregadorListView from "../../components/entregadorComponents/entregador.component";
import { VistadeSync } from "../../components/entregadorComponents/ToSync.components";
import { Picker } from "@react-native-picker/picker";
import isConnectedToInternet from "../../utils/network_conn";
import UserStorage from "../../storage/user";
import useFacturaStore from "../../storage/storage";
import boxChequerStorage from "../../storage/checkBoxes";

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

interface props {
    setpage: (value: number) => void;
}

export const EntregadorIndexView: React.FC<props> = ({ setpage }) => {
    const [page, setPage] = useState('lista');
    const { data, closeSession } = UserStorage();
    const { deleteAllfacts } = useFacturaStore();
    const { closeBoxes } = boxChequerStorage();
    const [selectedValue, setSelectedValue] = useState('1');

    const handler_session_close_entregador = async () => {
        if (await isConnectedToInternet()) {
            Alert.alert(
                'Confirmar cierre de sesión',
                '¿Estás seguro de que deseas cerrar la sesión?, puede que tengas FACTURAS PENDIENTES',
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Aceptar',
                        onPress: async () => {
                            await closeSession()
                            const facturaSynchronized = await deleteAllfacts();
                            const boxes_delete = await closeBoxes();

                            if (facturaSynchronized == true && boxes_delete == true) {
                                console.log('Se cerró la sesión');
                                setpage(0);
                                Alert.alert('SE CERRÓ LA SESIÓN');
                            } else {
                                console.log('No se cerró la sesión porque no hay facturas sincronizadas');
                                Alert.alert('NO SE CERRÓ LA SESIÓN: HAY FACTURAS SIN SINCRONIZAR');
                            }
                        },
                    },
                ],
            );
        } else {
            Alert.alert(
                'Error',
                'No se puede cerrar la sesión porque no estás conectado a Internet',
            );
        }
    }

    const handlerPicker = async (value: any) => {
        if (value === '0') {
            if (data.cod_empleado != 0) {
                handler_session_close_entregador();
            }
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
                        <Picker.Item label={data ? data.nombre : 'INICIO'} value="1" />
                        {/* <Picker.Item label="CIERRE DIARIO" value="2" /> */}
                        <Picker.Item label="CERRAR SESSION" value="0" />
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