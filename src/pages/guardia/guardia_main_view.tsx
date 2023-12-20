import React, { useEffect, useState } from "react";
import { Button, Text, View, TextInput, FlatList, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { Facturas } from "../../interfaces/facturas";
import db_dir from "../../config/db";
import ListComponentModal from "../../components/listComponents/list.component.modal";
import { ListUnitModal } from "../../components/modals/guardiaModals/guardModal.component";
import LoadingModal from "../../components/Activity/activity.component";
import useGuardList from "../../storage/gaurdMemory";

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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#063970',
        padding: 10,
        width: 'auto'
    },
});


function ShowIndexView() {
    const [facts, setFacts] = useState<Facturas[]>([]);
    const [isLoading, setIsLoagin] = useState(false);
    const [Deleting, setIsDeleting] = useState(false);
    const { data, CargaData, GetIsCheckedFacts } = useGuardList();
    // to open modals
    const [modalVisible, setModalVisible] = useState(false);

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    useEffect(() => {
        getFacturas();
    }, [])

    const getFacturas = async () => {
        try {
            setIsLoagin(true);
            const data = await axios.get(db_dir + '/fact/factEnPreparacion');
            console.log("Data from api: ", data.data.data);
            setFacts(data.data.data);
            CargaData(facts);
            setIsLoagin(false);
        } catch (err) {
            setIsLoagin(false);
            Alert.alert('ERROR', 'No se pudo conectar al servidor para obtener los datos');
            console.log('err al intentar obtener facturas en Preparacion : ', err);
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <LoadingModal visible={isLoading} message="ACTUALIZANDO DATOS" />
            <LoadingModal visible={Deleting} message="ESPERE"/>
            <View style={{ flex: 1 }}>
                <View style={styles.navbar}>
                    <Button color={'#063970'} onPress={() => {}} title="ESCANEAR" />
                    <Button color={'#063970'} onPress={() => { getFacturas() }} title="ACTUALIZAR" />

                </View>
                {
                    facts.length > 0 ?

                        <ListComponentModal /> 
                        
                        :

                        <View style={styles.container}>
                            <View style={styles.content}>
                                <Text style={styles.text}>SIN FACTURAS SINCRONIZADAS</Text>
                            </View>
                        </View>
                }
            </View>
            <View style={{ height: 50, backgroundColor: '#063970', justifyContent: 'center', alignItems: 'flex-end' }}>
                <Button color={'#063970'} onPress={openModal} title="ENVIAR A TRANSITO" />
            </View>          
            <ListUnitModal factura={GetIsCheckedFacts()} modalVisible={modalVisible} closeModal={closeModal} />
        </View>
    )
};

export default ShowIndexView;