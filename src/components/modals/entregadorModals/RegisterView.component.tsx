import React, { useState, useEffect } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Facturas } from "../../../interfaces/facturas";

interface Props {
    item?: Facturas | undefined; // item puede ser undefined
    open: ( value : boolean )=> void;
    Isopen : boolean
}

export const RegisterView: React.FC<Props> = ({ item, open, Isopen})=> {
    // Estado para controlar la visibilidad del modal
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(()=>{
        setModalVisible(Isopen);
    }, [Isopen])

    // Función para abrir el modal
    // const openModal = () => {
    //     setModalVisible(open);
    // };

    // Función para cerrar el modal
    const closeModal = () => {
        open(false);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>

            {/* Modal que muestra la imagen */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        {/* Título del modal */}
                        <Text style={styles.modalTitle}>REGISTROS DE ENTREGA</Text>
                        {/* Imagen en base64 */}
                        <Image
                            style={styles.image}
                            source={{ uri: `data:image/png;base64,${item?.nameSing}` }}
                        />
                        <Image
                            style={styles.image}
                            source={{ uri: `data:image/png;base64,${item?.namePic}` }}
                        />
                        {/* Botón para cerrar el modal */}
                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                            <Text style={styles.buttonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

// Estilos para el componente
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    openButton: {
        backgroundColor: '#f194ff',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    image: {
        width: 250,
        height: 250,
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#2196f3',
        padding: 10,
        borderRadius: 10,
    },
});
