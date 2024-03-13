import React, { useEffect, useState, useRef } from "react";
import { Button, Text, View, TextInput, FlatList, StyleSheet, Modal, Alert, TouchableOpacity } from "react-native";
import { Facturas } from "../../../interfaces/facturas";
//test-imports
import RNSignatureExample from '../../sing/Sing.component';
import CameraScreen from "../../camara/cam.component";
import useFacturaStore from "../../../storage/storage";



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
        if (isPic == false) {
            Alert.alert('SIN FOTO');
        } else if (isEmpty === true) {
            Alert.alert("ERROR FALTA DE FIRMA", 'Se necesita ingresar la firma del receptor de la factura para continuar con el proceso de entrega.')
        } else if (saveSing === false) {
            Alert.alert("ERROR GUARDADO DE FIRMA", 'Se necesita guardar la firma para validar la factura.')
        } else {
            setValidateStep('pic');
            closeModal();
        }
    }

    const ConfirmAllDataBfSing = () => {
        if (id != null || isPic == true) {
            setValidateStep('sing');
        } else {
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
                            {validateStep === 'sing' ?
                                <View>
                                    
                                        <Text style={styles.title}>FIRMA DE ENTREGA</Text>

                                        <View style={{ margin: 1 }} >
                                            <View style={styles.table}>

                                                <View style={styles.row}>
                                                    <Text style={styles.header}>CLIENTE :</Text>
                                                    <Text style={styles.value}>{fact?.clientenombre}</Text>
                                                </View>
                                                <View style={styles.row}>
                                                    <Text style={styles.header}>ENTREGADOR :</Text>
                                                    <Text style={styles.value}>{fact?.nombre}</Text>
                                                </View>

                                                <View style={styles.row}>
                                                    <Text style={styles.header}>CAMION :</Text>
                                                    <Text style={styles.value}>{fact?.placa}</Text>
                                                </View>

                                                <View style={styles.row}>
                                                    <Text style={styles.header}>FACTURA :</Text>
                                                    <Text style={styles.value}>{fact?.factura}</Text>
                                                </View>

                                                <View style={styles.row}>
                                                    <Text style={styles.header}>CANT. CAJAS:</Text>
                                                    <Text style={styles.value}>{fact?.cant_cajas}</Text>
                                                </View>

                                                <View style={styles.row}>
                                                    <Text style={styles.header}>CANT. UNIDADES:</Text>
                                                    <Text style={styles.value}>{fact?.cant_unidades}</Text>
                                                </View>
                                            </View>
                                        </View>

                                         
                                        <RNSignatureExample setIsEmpty={setIsEmpty} id={fact?.factura_id} isnext={setSaveSing} />
                                         
                                     <View>
                                        <TouchableOpacity style={styles.button } onPress={() => { ValSing() }}>
                                            <View >
                                                <Text style={styles.buttonText}>FINALIZAR</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>  

                                </View>
                                : 
                                null
                                }
                            {validateStep === 'pic' ?
                                <View style={{ width: '100%' }}>
                                    <Text style={styles.title}>REGISTRO</Text>
                                    <View style={{ borderColor: 'black' }}>

                                        <View style={{ margin: 1 }}>
                                            <View style={styles.table}>

                                                <View style={styles.row}>
                                                    <Text style={styles.header}>FACTURA :</Text>
                                                    <Text style={styles.value}>{fact?.factura}</Text>
                                                </View>

                                                <View style={styles.row}>
                                                    <Text style={styles.header}>CLIENTE :</Text>
                                                    <Text style={styles.value}>{fact?.clientenombre}</Text>
                                                </View>

                                                <View style={styles.row}>
                                                    <Text style={styles.header}>CAJAS:</Text>
                                                    <Text style={styles.value}>{fact?.cant_cajas}</Text>
                                                </View>

                                                <View style={styles.row}>
                                                    <Text style={styles.header}>UNIDADES :</Text>
                                                    <Text style={styles.value}>{fact?.cant_unidades}</Text>
                                                </View>

                                                <View style={styles.row}>
                                                    <Text style={styles.header}>ENTREGADOR :</Text>
                                                    <Text style={styles.value}>{fact?.nombre}</Text>
                                                </View>

                                            </View>
                                        </View>

                                        <CameraScreen fact={fact} setIsPic={setIsPic} />
                                    </View>

                                    <View style={styles.buttonContainer}>

                                        <TouchableOpacity style={styles.button} onPress={() => { closeModal() }}>
                                            <Text style={styles.buttonText}>CERRAR</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.button} onPress={() => { ConfirmAllDataBfSing() }}>
                                            <Text style={styles.buttonText}>SIGUIENTE</Text>
                                        </TouchableOpacity>

                                    </View>

                                </View>
                                :
                                null
                            }
                        </View>

                    </View>
                </View >

            </View>

        </Modal >

    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        height : 'auto'
    },
    button: {
        padding: 10,
        borderRadius: 3,
        backgroundColor: '#063970',
        width: 'auto'
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
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
    },
    modalContent: {
        zIndex: 1, // Ensure the content is above the overlay
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 5,
        elevation: 5, // For Android shadow77
        width: '100%'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Adjust as needed
        marginVertical: 0,
        width: "auto",
        backgroundColor: '#063970',
    },
    container: {
        backgroundColor: 'white',
        width: '100%', // Adjust this width as needed  
        height: 'auto',
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
    },
    table: {
        borderWidth: 0,
        borderColor: '#000',
        borderRadius: 5,
        padding: 10,
        margin: 10,
        backgroundColor: '#EAF2F8'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    rowmain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        backgroundColor: '#5DADE2'
    },

    header: {
        fontWeight: 'bold',
        color: 'black'
    },
    value: {
        marginLeft: 10,
        color: 'black'
    },

});
