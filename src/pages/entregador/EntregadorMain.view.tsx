import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { DataTable, IconButton } from 'react-native-paper';
import EntregadorListView from "../../components/entregadorComponents/entregador.component";
import { VistadeSync } from "../../components/entregadorComponents/ToSync.components";
import { Picker } from "@react-native-picker/picker";

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

export function EntregadorIndexView() {
    const [page, setPage] = useState('lista');
    const [selectedValue, setSelectedValue] = useState('1');

    return (
        <View>

            <View style={styles.navbar}>
                <View style={{ flexDirection: 'row' }}>
                    <IconButton icon={'account-circle'} size={25} iconColor="white" />
                    <Picker
                        selectedValue={selectedValue}
                        style={{ height: 50, width: 150, color: 'white' }}
                        onValueChange={(itemValue) => setSelectedValue(itemValue)}
                    >
                        <Picker.Item label="INICIO" value="1" />
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