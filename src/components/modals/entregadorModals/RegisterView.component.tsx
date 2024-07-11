import React, { useState, useEffect } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Facturas } from "../../../interfaces/facturas";
import { Icon } from "react-native-paper";

interface Props {
    item?: Facturas | undefined; // item puede ser undefined
    open: (value: boolean) => void;
    Isopen: boolean
}

export const RegisterView: React.FC<Props> = ({ item, open, Isopen }) => {
    const [PhotoSing, setPhotoSing] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        setModalVisible(Isopen);
    }, [Isopen])

    const closeModal = () => {
        open(false);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <View 
                        style={{ display : 'flex', flexDirection : 'row', justifyContent : 'space-around',
                         width : '100%', backgroundColor : 'black', borderRadius : 5, alignItems : 'center', padding : 5, marginBottom : 20}}>
                            <Text style={styles.modalTitle}>REGISTROS DE ENTREGA</Text>

                            <TouchableOpacity 
                            onPress={()=> setPhotoSing('photo')}
                            style={{ justifyContent : 'center', alignItems : 'center', borderRadius : 100, backgroundColor : PhotoSing === "photo" ? '#FF00CC' : 'grey', padding : 10}}>
                                <Icon color="white" source={'camera'} size={20}/>
                            </TouchableOpacity>

                            <TouchableOpacity 
                            onPress={()=> setPhotoSing('sing')}
                            style={{ justifyContent : 'center', alignItems : 'center', borderRadius : 100, backgroundColor : PhotoSing === "sing" ? '#FF00CC' : 'grey', padding : 10}}>
                                <Icon color="white" source={'file-sign'} size={20}/>
                            </TouchableOpacity>
                        </View>

                        { PhotoSing === 'photo' ? <Image style={styles.image} source={{ uri: `data:image/png;base64,${item?.namePic}` }} /> :
                        PhotoSing === 'sing' ? <Image style={styles.image} source={{ uri: `data:image/png;base64,${item?.nameSing}` }} /> : null
                        }
                        
                        
                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                            <Text style={styles.buttonText}>CERRAR</Text>
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
        width: '90%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 5,
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
        color: 'white'
    },
    image: {
        width: 250,
        height: 250,
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 10,
        width: '85%'
    },
});
