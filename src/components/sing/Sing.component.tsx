import React, { useRef, useImperativeHandle, forwardRef, useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import SignatureCapture, { SaveEventParams } from 'react-native-signature-capture';
import RNFS from 'react-native-fs';
import useFacturaStore from '../../storage/storage';

interface Props {
  setIsEmpty: (val: boolean) => void;   // this is to check if the sing is empty
  id : number | undefined;              // this is for the name of the sing
  isnext : (val : boolean) => void;     // this is to check if the sing is saved;
}

const RNSignatureExample: React.FC<Props> = ({ setIsEmpty, id, isnext}) => {
  const signatureRef = useRef<any>(null);
  //const signatureRef = useRef<SignatureCapture>(null);
  const defRoute = '/storage/emulated/0/Android/data/com.app_despacho/files/saved_signature/'; // route where files will be saved.
  const { data, fetchData, updateFactura, getFacturaById, updateSing} = useFacturaStore();
 
  const saveNameFileSing = () =>{
    const dataFact = getFacturaById(id);
    return defRoute + dataFact.factura_id.toString() + '.png';
  }

  const saveSign = () => {
    try {
      if (signatureRef.current) {
        signatureRef.current.saveImage();        
        return false
      }
    } catch (err) {
      console.log('Error saving image:', err);
    }
  };

  const _onSaveEvent = async (result: SaveEventParams) => {
    try {
      // set the name of the file
      const oldPath = result.pathName;
      const newPath = saveNameFileSing();
      
      await RNFS.moveFile(oldPath, newPath);
      console.log('Image renamed :', newPath);

   
        updateSing( id , result.encoded);
        isnext(true);
        Alert.alert('FINALIZADO', 'Se guardo la firma')
    } catch (err) {
      console.log('Error renaming image:', err);
    }
  };

  const _onDragEvent = () => {
    setIsEmpty(false);
    console.log('Dragged');
  };

  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <Text style={{ alignItems: 'center', justifyContent: 'center' }}>FIRMAR FACTURA</Text>
      <SignatureCapture
        style={{ flex: 1, borderWidth: 4, borderColor: 'black' }}
        ref={signatureRef}
        onSaveEvent={_onSaveEvent}
        onDragEvent={_onDragEvent}
        saveImageFileInExtStorage={true}
        showTitleLabel={false}
        viewMode="portrait"
        showNativeButtons = {true}
      />
      {/* <Button title="Save" onPress={()=>{saveSign()}} /> */}
      {/* <Button title="RESET" onPress={saveSign} />  */}
    </View>
  );

  
};

export default RNSignatureExample;

