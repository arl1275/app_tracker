import React, { useState } from "react";
import { View, TouchableOpacity, TextInput, Text, StyleSheet, } from "react-native";
import { Icon } from "react-native-paper";
import useFacturaStore from "../../storage/storage";

interface AddCommentProps {
    id_factura: number;
}

export const AddComment : React.FC<AddCommentProps> = ( { id_factura }) => {
    const [commment, setComment] = useState<string>('');
    const [displayInput, setDisplayInput] = useState<boolean>(false);
    const { SaveComment } = useFacturaStore(); 

    const Open = () => {
        setDisplayInput(!displayInput);
    }

    const handleTextChange = async (text: string) => {
        if (text.length <= 350) {
            setComment(text);
            await SaveComment(id_factura, commment);
        }
    };

    return (
        <View>
            <View style={styles.button}>
                <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                    onPress={() => { Open(); }}>
                    <Icon source={'pencil-plus'} size={20} color="white" />
                    <Text style={styles.buttonText}>COMENTAR</Text>
                </TouchableOpacity>
            </View>

            {
                displayInput &&
                (
                    <View style={[styles.card, styles.overlay, { width : '100%'}]}>
                        <View style={{ display : 'flex', flexDirection : 'row'}}>
                            <Text style={{ color : 'black', fontWeight : 'bold'}}>Detalle de Entrega :  </Text>
                            <Text style={{ color : 'black', fontWeight : 'bold'}}>{commment.length} / 350</Text>
                        </View>
                        
                        <View style={styles.card}>
                            
                        <TextInput style={styles.textInput}
                            value={commment}
                            onChangeText={handleTextChange}
                            multiline
                        />
                        </View>
                    </View>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'row',
        width: '80%',
        height: 35,
        backgroundColor: '#003366',
        borderRadius: 5,
        padding: 5,
        marginBottom: 10
    },
    buttonText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 10
    },
    card: {
        // Estilos de tu tarjeta
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth : 1,
        borderColor : 'black',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
    },
    overlay: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        zIndex: 10,
        padding: 10,
    },
    textInput: {
        // Estilos de tu TextInput
        height: 60,
        width : '100%',
        color: 'black',
        borderWidth: 0,
        padding:0,
        margin : 0,
        fontSize : 12
    },
})