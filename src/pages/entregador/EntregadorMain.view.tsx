import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { DataTable, IconButton } from 'react-native-paper';
import { Facturas } from "../../interfaces/facturas";
import EntregadorListView from "../../components/entregadorComponents/entregador.component";
import { VistadeSync } from "../../components/entregadorComponents/ToSync.components";

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
    const [isSynchro, setIsChro] = useState(false);

    return (
        <View>
            
            <View style={styles.navbar}>
                <View style={{ flexDirection: 'row' }}>
                    <IconButton icon={'account-circle'} size={25} iconColor="white" />
                    <View style={{ alignSelf: 'center'}}>
                        <Text>ADMIN</Text>
                    </View>
                </View>
                <View>
                    <View style={{ display: 'flex', flexDirection : 'row'}}>
                        <TouchableOpacity style={{marginRight : '10%'}}>
                            <Text style={styles.buttonText} onPress={() => {setPage('lista')}}>
                                FACTURAS
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setPage('sync') }}>
                            <Text style={styles.buttonText}>
                                SINCRONIZACION
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View>
                {page === 'lista' ? <EntregadorListView /> : null}
                {page === 'sync' ? <VistadeSync /> : null}
            </View>


        </View>
    )
}