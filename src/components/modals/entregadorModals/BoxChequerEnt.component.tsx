import React, { useState, useRef, useEffect, useCallback } from "react";
import { Text, View, TextInput, StyleSheet, ScrollView, Modal, Alert, TouchableOpacity } from "react-native";
import { play_sound } from "../../Activity/sound.component";
import { Facturas } from "../../../interfaces/facturas";
import { Card } from 'react-native-paper';
import { box_to_check } from "../../../interfaces/box";
import boxChequerStorage from "../../../storage/checkBoxes";
import { IconButton } from 'react-native-paper';
import useFacturaStore from "../../../storage/storage";
import { HeadBoxChecker } from "../modalsComponents/headBoxChequer.component";


interface props {
    fact: Facturas | undefined;
    visible: boolean;
    close: () => void;
}

const BoxChecker_ent: React.FC<props> = ({ fact, visible, close }) => {
    const [Boxes, setBoxes] = useState<box_to_check[]>([]);                 // this is to save locally the boxes.
    const inputRef = useRef<TextInput>(null);                               // this is to save the TextReference
    const [input, setInput] = useState<string>('');                         // this is to save the Box code Temporaly.
    const [counter, setCounter] = useState<number>(0);                      // this is to save the MountOfCountedBoxes.
    const [ScannedBoxes, setScannedBoxes] = useState<string[]>([]);         // this is to save the Scanned Boxes.
    const [seeDetail, setSeeDetail] = useState<boolean>(false);
    const { getcajasFacts, validateBox } = boxChequerStorage();

    // This use Effect is to Charge the mount of Boxes
    useEffect(()=>{
        visible ? getBoxes() : null;
        counter === fact?.cant_cajas ? close() : null;
    }, [visible, counter]);

    const SeeDetail = ()=>{ setSeeDetail(!seeDetail)};
    const CounterBoxes = () =>{setCounter(prevCounter => prevCounter + 1); play_sound(true)};
    const ValidateBoxScanned = ( caja : string) =>{ return ScannedBoxes.includes(caja)};
    const CloseModal = () => { setInput(''); setBoxes([]); setScannedBoxes([]); setSeeDetail(false); close()};

    const HandleBarcode = async () => {
        let Caja: string = input;
        if (Caja.length >= 13) {
            if (!ValidateBoxScanned(Caja)) {
                let BOX: box_to_check[] | undefined = Boxes.filter((item: box_to_check) => item.caja === Caja);
                if (BOX.length) {
                    await validateBox(BOX[0].caja);
                    setScannedBoxes(prevScanned => [...prevScanned, BOX[0].caja]);
                    CounterBoxes();
                } else {
                    play_sound(false);
                }
            }
        } else {
            play_sound(false);
        }
        setInput('');
    };
    
    const getBoxes = async () => {
        try {
            setBoxes(await getcajasFacts(fact?.factura, fact?.factura_id));
        } catch (err) {
            console.log('NO SE PUDO OBTENER LAS CAJAS : ', err)
        }
    };

    return (
        <>
            {visible === true &&
                (
                    Boxes &&
                    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={() => { close }}>
                        <View style={styles.modalOverlay}>
                            <View style={styles.centeredView}>
                                <Card style={{ backgroundColor: 'white', borderRadius: 5, width: '95%' }}>

                                    <View style={{ margin: 3 }}>
                                        <IconButton icon={'close-box'} onPress={() => { CloseModal()}} // this cleal all my variables with the close button
                                            iconColor="red" size={30}/>
                                    </View>

                                    <View style={{ position: 'absolute', right: 10, top: 5 }}>
                                        <IconButton icon={'eye'} iconColor={'black'} size={25} onPress={() => {SeeDetail()}} />
                                    </View>

                                   <HeadBoxChecker fact={fact} />

                                    <View>
                                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderWidth : 1, borderColor : '#BFC9CA', margin : 15, borderRadius : 4 }}>

                                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '40%' }}>
                                                <IconButton
                                                    icon={Boxes.length > 0 ? 'inbox-multiple' : 'inbox-remove'}
                                                    size={100}
                                                    iconColor={Boxes.length > 0 ? 'black' : 'red'}
                                                    style={{margin : 0}} />
                                                <View>
                                                    <Text style={{ color: 'black', fontSize: 30, margin : 0, padding : 0 }}> {counter}/{fact?.cant_cajas} </Text>
                                                    <View style={{ display: 'flex', flexDirection: 'row', height : 'auto' }}>
                                                        <TextInput
                                                            ref={inputRef}
                                                            style={styles.TextInputStyle}
                                                            value={input}
                                                            onChangeText={(text) => setInput(text)}
                                                            onSubmitEditing={HandleBarcode}
                                                            placeholderTextColor={'grey'}
                                                            placeholder="CODIGO DE BARRAS"
                                                            autoFocus
                                                            onBlur={() => inputRef.current?.focus()}
                                                        />
                                                    </View>
                                                </View>
                                            </View>

                                            <View style={{
                                                display: 'flex', flexDirection: 'row', width: '50%', flexWrap: 'wrap',
                                                backgroundColor: '#E5E7E9', padding: 5, borderRadius: 5, margin: 5
                                            }}>
                                                {Boxes.map((item : box_to_check) => {
                                                    let ischeck = item.is_check === true ? '#E91E63' : 'black';
                                                    return (
                                                        <View style={{ margin: 1.5, borderRadius : 3, height: 25, width: 25, backgroundColor: ischeck, alignItems : 'center', justifyContent : 'center' }} key={item.caja}>
                                                            <Text style={{ backgroundColor: ischeck, color: 'white', fontSize : 10 }}>{item.numerocaja}</Text>
                                                        </View>
                                                    )
                                                })
                                                }
                                            </View>


                                        </View>

                                        <Card>
                                            {
                                                seeDetail &&
                                                <View style={{ backgroundColor: '#E5E7E9', borderRadius : 10 }}>
                                                    <View style={{ alignSelf: 'center', width: '95%', margin: 10, height: 100, borderWidth: 0, }}>
                                                        <ScrollView>
                                                            {
                                                                Array.isArray(Boxes) && Boxes.length > 0 ?
                                                                    Boxes.map((item : box_to_check) => {
                                                                        let ischeck = item.is_check === true ? '#E91E63' : 'black';
                                                                        return (
                                                                            <View style={
                                                                                {
                                                                                    marginTop: 10,
                                                                                    marginLeft: '3%',
                                                                                    marginRight: '3%',
                                                                                    marginBottom: 5,
                                                                                    borderRadius: 7,
                                                                                    backgroundColor: ischeck,
                                                                                    display: 'flex',
                                                                                    flexDirection: 'row',
                                                                                    justifyContent: 'space-around',
                                                                                    padding: 5
                                                                                }
                                                                            } key={item.caja}>
                                                                                <Text style={{ backgroundColor: ischeck, color: 'white' }}>{item.caja}</Text>
                                                                                <Text style={{ backgroundColor: ischeck, color: 'white' }}>{item.numerocaja}</Text>
                                                                            </View>
                                                                        )
                                                                    }) :
                                                                    <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                                                                        <TouchableOpacity
                                                                            onPress={async () => { await getBoxes() }}
                                                                            style={{
                                                                                backgroundColor: 'black',
                                                                                margin: 10,
                                                                                borderRadius: 10,
                                                                                padding: 20
                                                                            }}
                                                                        >
                                                                            <Text style={{ color: 'white' }}>PRESIONE PARA OBTENER LAS CAJAS NUEVAMENTE</Text>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                            }
                                                        </ScrollView>
                                                    </View>
                                                </View>
                                            }
                                        </Card>
                                    </View>
                                    <View>
                                    </View>
                                </Card>
                            </View>
                        </View>
                    </Modal>
                )

            } 
        </>


    )

}

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#063970',
        padding: 10,
        width: 'auto'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent black
    },
    modalContent: {
        zIndex: 1, // Ensure the content is above the overlay
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 0,
        elevation: 5, // For Android shadow

    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Adjust as needed
        marginVertical: 10,
        width: "60%",
        backgroundColor: '#063970',
    },
    button: {
        padding: 10,
        borderRadius: 0,
        backgroundColor: '#063970',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    Textplaces: {
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        margin: 2,
        fontSize: 12,
        color: 'white',
        fontWeight: 'bold'
    },
    textbody: {
        color: "#858585",
        marginLeft: 20
    },
    bottomButton: {
        position: 'absolute',
        bottom: -100, // Adjust this value for desired spacing from the bottom
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        position: 'absolute',
        width: 1, // Set a small width to make it invisible
        height: 1, // Set a small height to make it invisible
        opacity: 0, // Make it fully transparent
    },
    TextInputStyle : {
        color: 'black', 
        borderBottomWidth : 1, 
        borderBottomColor : 'black', 
        fontSize: 10, 
        alignSelf: 'center',
        margin : 0,
        padding : 0
    }
});


export default BoxChecker_ent;
