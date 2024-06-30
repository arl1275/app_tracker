import React, { useRef, useImperativeHandle, forwardRef, useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import SignatureCapture, { SaveEventParams } from 'react-native-signature-capture';
import RNFS from 'react-native-fs';
import useFacturaStore from '../../storage/storage';
import { Card } from 'react-native-paper';
import { Facturas } from '../../interfaces/facturas';

interface Props {
  setIsEmpty: (val: boolean) => void;   // this is to check if the sing is empty
  id: number | undefined;              // this is for the name of the sing
  isnext: (val: boolean) => void;     // this is to check if the sing is saved;
}

const RNSignatureExample: React.FC<Props> = ({ setIsEmpty, id, isnext }) => {
  const signatureRef = useRef<any>(null);
  //const signatureRef = useRef<SignatureCapture>(null);
  const defRoute = '/storage/emulated/0/Android/data/com.keller/files/saved_signature/'; // route where files will be saved.
  const { getFacturaById, updateSing } = useFacturaStore();

  const saveNameFileSing = async () => {
    //let id_ : number | undefined = typeof id === 'number' ? parseInt(id) : 0;
    const dataFact : Facturas | null = await getFacturaById(id);
    //console.log(' valores desde atras ', dataFact, 'factura id :: ', id);
    if(dataFact != null){
      return defRoute + dataFact.factura_id.toString() + '.png';
    }else{
      //Alert.alert('ERROR', 'Error al guardar el nombre de la foto')
      return null
    }
    
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
      const newPath  = await saveNameFileSing();

      if(newPath == null){
          console.log('ERORR AQUI, ', oldPath, newPath)
          throw Error;
      }

      await RNFS.moveFile(oldPath, newPath);
      console.log('Image renamed :', newPath);


      updateSing(id, result.encoded);
      isnext(true);
      Alert.alert('FINALIZADO', 'Se guardo la firma')

    } catch (err) {
      console.log('Error renaming image:', err);
      Alert.alert('PROBLEMAS PARA GUARDAR FACTURA')
    }
  };

  const _onDragEvent = () => {
    setIsEmpty(false);
    console.log('Dragged');
  };

  return (
    <View style={{ backgroundColor : 'white' }}>
      <View style={{ borderWidth : 1 , borderColor : 'grey', elevation : 10}}>
        <SignatureCapture
          style={{ height: 300 }} // Ajusta la altura según sea necesario
          ref={signatureRef}
          onSaveEvent={_onSaveEvent}
          onDragEvent={_onDragEvent}
          saveImageFileInExtStorage={true}
          showTitleLabel={false}
          viewMode="portrait"
          showNativeButtons={true}
        />
      </View>

      <Text style={{ alignSelf: 'center', color: 'black', fontSize: 10 }}>FIRME EN ESTA AREA</Text>
    </View>

  );


};

export default RNSignatureExample;

