import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Text, ImageBackground, useWindowDimensions } from 'react-native';
import { RNCamera } from 'react-native-camera';
import RNFS from 'react-native-fs';
import { launchCamera, ImagePickerResponse } from 'react-native-image-picker';
import { IconButton } from 'react-native-paper';
import { Facturas } from '../../interfaces/facturas';
import useFacturaStore from '../../storage/storage';

interface props{
  fact : Facturas |  null;
  setIsPic : (val : boolean) => void;
}


const CameraScreen: React.FC<props> = ({fact, setIsPic}) => {
  const cameraRef = useRef<RNCamera>(null);
  const [tempUri, setTempUri] = useState<string>();
  const { height } = useWindowDimensions();
  const { data, fetchData, updateFactura, getFacturaById, updateStateAndHasSing } = useFacturaStore();

  const takePicture = async () => {
    if (cameraRef.current) {
      console.log('llego adentro de la camara del if')
      try {
        const options = { quality: 0.5, base64: true };
        const data = await cameraRef.current.takePictureAsync(options);

        const customDirectory = '/storage/emulated/0/Android/data/com.app_despacho/files/pics/';
        const customFileName = 'test.jpg';
        const file = customDirectory + customFileName;

        await RNFS.moveFile(data.uri, file);
        console.log('Image saved at:', file);
      } catch (error) {
        console.error('Failed to take picture:', error);
      }
    }
  };

  const tomarFotografia = () => {
    launchCamera({ mediaType: 'photo', quality: 0.2, includeBase64 : true }, (resp: ImagePickerResponse) => {
      if (resp.didCancel) return;
      if (!resp.assets) return;
      setTempUri(resp.assets[0].uri);
      updateStateAndHasSing(fact?.factura_id, 'ENTREGADO', resp.assets[0].base64);
      setIsPic(true);
    });
  };

  return (
    <View style={{ marginBottom: 10, marginTop: 10 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>Fotografia</Text>
      <View style={{ height: height * 0.2, width: 'auto', borderColor: '#ccc', borderWidth: 1, borderRadius: 3 }}>
        {!tempUri ? (
          <TouchableOpacity onPress={tomarFotografia} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <IconButton icon="camera" size={30} onPress={() => {}} />
            <Text style={{ fontWeight: 'bold' }}>Tomar fotografia</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={tomarFotografia}>
            <ImageBackground
              source={{ uri: tempUri }}
              style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
              resizeMode="cover"
            >
              <IconButton icon="camera" size={30} onPress={() =>{}} />
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Editar fotografia</Text>
            </ImageBackground>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CameraScreen;

