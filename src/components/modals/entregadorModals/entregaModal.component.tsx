import React, { useEffect, useState, useRef } from "react";
import styles_made from "../../../assets/stylescss";
import { Button, Text, View, TextInput, FlatList, StyleSheet, Modal, Alert, TouchableOpacity } from "react-native";
import { Facturas } from "../../../interfaces/facturas";
import axios from "axios";
import db_dir from "../../../config/db";
//test-imports
import { DataTable, Icon, IconButton } from 'react-native-paper';
import RNSignatureExample from '../../sing/Sing.component';
import CameraScreen from "../../camara/cam.component";
import useFacturaStore from "../../../storage/storage";


interface FactsComponentProps {
    factura: Facturas; // Array of Factura objects
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
    },
    modalContent: {
        zIndex: 1, // Ensure the content is above the overlay
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 5,
        elevation: 5, // For Android shadow
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Adjust as needed
        marginVertical: 10,
        width: "60%",
        backgroundColor: '#063970',
    },
    container: {
        backgroundColor: 'white',
        width: 'auto', // Adjust this width as needed  
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        alignSelf: 'center',
        color: 'black',
    },
    resumen: {
        fontSize: 15,
        fontWeight: 'normal',
        color: 'black',
    }

});


export const EntregaModal: React.FC<{ factura: Facturas | null, modalVisible: boolean, closeModal: () => void }> = ({ factura, modalVisible, closeModal }) => {
    const fact: Facturas | null = factura;
    const { data, fetchData, updateFactura, getFacturaById, updateStateAndHasSing } = useFacturaStore();

    const [validateStep, setValidateStep] = useState('pic');                //  el root de las vistas del modal
    const [isEmpty, setIsEmpty] = useState(true);                           // valida si la firma no esta vacia
    const [id, setId] = useState<number | null>(null);                      // Envia el Id para la firma
    const [saveSing, setSaveSing] = useState<boolean>(false);               // val to save the info 
    const [isPic, setIsPic] = useState(false);                              // valida si la fotografia es tomada
    // check is the sing is saved
    const signatureRef = useRef<any>(null);

    const ValSing = () => {
        if (isEmpty === true) {
            Alert.alert("ERROR FALTA DE FIRMA", 'Se necesita ingresar la firma del receptor de la factura para continuar con el proceso de entrega.')
        }else if (saveSing === false){
            Alert.alert("ERROR GUARDADO DE FIRMA", 'Se necesita guardar la firma para validar la factura.')
        }else{
            setValidateStep('pic');
            closeModal();
        }
    }

    const ConfirmAllDataBfSing = () => {
        if(id != null || isPic == true){
            setValidateStep('sing');
        }else{
            Alert.alert('FALTA DE DATA', 'Favor verificar si la fotografia o la identidad fue ingresada.')
        }
    
    }

    const saveid = (props: string) => {
        const x = parseInt(props);
        setId(x);

        // Ensure the modal does not close when saveSign is called
        if (signatureRef.current) {
            const preventDefault = signatureRef.current.saveSign();
            if (preventDefault) {

                return;
            }
        }
    };



    return (

        <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
            <View style={styles.modalOverlay}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalContent}>

                            {/* this is the element of the sing*/}
                            {validateStep === 'sing' ?
                                <View style={styles.container}>
                                    <View>
                                        <Text style={styles.title}>RESUMEN DE ENTREGA</Text>
                                        <View style={{ margin: 2 }}>
                                            <Text style={styles.resumen}>ENTREGADOR : {fact?.nombre}</Text>
                                            {/* <Text style={styles.resumen}>CAMION : {fact?.placa}</Text> */}
                                            <Text style={styles.resumen}>FACTURA : {fact?.ref_factura}</Text>
                                            <Text style={styles.resumen}>CAJAS : {fact?.cant_cajas}</Text>
                                        </View>
                                        <View style={{ height: 450, width : 450}}>
                                            <RNSignatureExample setIsEmpty={setIsEmpty} id={fact?.id} isnext={setSaveSing} />
                                        </View>
                                    </View>

                                    <View style={{width : 'auto'}}>
                                        <TouchableOpacity style={styles.button} onPress={ValSing}>
                                            <View style={{justifyContent : 'flex-end'}}>
                                                <Text style={styles.buttonText}>FINALIZAR</Text>
                                            </View>                                           
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                : null}

                            {/* this is the footer of the foto take*/}
                            {validateStep === 'pic' ?
                                    <View style={{width : '100%'}}>
                                        <Text style={styles.title}>FOTO O IDENTIDAD</Text>
                                        <View style={{ borderColor: 'black' }}>
                                            <Text style={styles.resumen}>ENTREGADOR : {fact?.nombre}</Text>
                                            <Text style={styles.resumen}>CAMION : {fact?.placa}</Text>
                                            <Text style={styles.resumen}>FACTURA : {fact?.ref_factura}</Text>
                                            <Text style={styles.resumen}>CAJAS : {fact?.cant_cajas}</Text>
                                            <TextInput
                                                style={{ height: 40, backgroundColor: '#063970' }}
                                                placeholder="INGRESE ID"
                                                onChangeText={saveid}
                                                defaultValue={''}
                                            />
                                            <CameraScreen fact={fact} setIsPic={setIsPic}/>
                                        </View>

                                        <View style={styles.buttonContainer}>
                                            <TouchableOpacity style={styles.button} onPress={() => { closeModal() }}>
                                                <Text style={styles.buttonText}>CERRAR</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.button} onPress={() =>{ConfirmAllDataBfSing()}}>
                                                <Text style={styles.buttonText}>SIGUIENTE</Text>
                                            </TouchableOpacity>
                                        </View>

                                    </View> 
                                    :
                                     null}
                            </View>

                        </View>
                    </View >
                </View>
           
        </Modal >

    );
};
