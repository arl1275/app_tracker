import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ImageBackground, useWindowDimensions } from 'react-native';
import { launchCamera, ImagePickerResponse } from 'react-native-image-picker';
import { IconButton } from 'react-native-paper';
import { Facturas } from '../../interfaces/facturas';
import useFacturaStore from '../../storage/storage';

interface props{
  fact : Facturas |  null;
  setIsPic : (val : boolean) => void;
}

const CameraScreen: React.FC<props> = ({fact, setIsPic}) => {
  const [tempUri, setTempUri] = useState<string>();
  const { height } = useWindowDimensions();
  const { updateStateAndHasSing } = useFacturaStore();

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
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5, color : 'grey' }}>Fotografia</Text>
      <View style={{ height: height * 0.2, width: 'auto', borderColor: '#ccc', borderWidth: 1, borderRadius: 3 }}>
        {!tempUri ? (
          <TouchableOpacity onPress={tomarFotografia} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <IconButton icon="camera" size={30} onPress={() => {}} />
            <Text style={{ fontWeight: 'bold', color : 'grey'}}>Tomar fotografia</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={tomarFotografia}>
            <ImageBackground
              source={{ uri : tempUri }}
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

