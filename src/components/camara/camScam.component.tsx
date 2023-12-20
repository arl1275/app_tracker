import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, Modal, Button } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { Facturas } from '../../interfaces/facturas';
import useGuardList from '../../storage/gaurdMemory';

interface props{
  fact: Facturas | undefined;
  visible: boolean;
  close: () => void;
}

const QRScanner: React.FC<props> = ({fact, visible, close}) => {
  //const [scannedData, setScannedData] = useState<string | null>(null);
  const [values, setData] = useState<string[]>([]);
  const [counter, setCounter] = useState<number>(0);
  const {data, GetFactbyID, UpdateIsChecked} = useGuardList();

  const handleQRCodeRead = (e: any) => {
    if (e.data) {
        if ( values.find((item : any) => item === e.data) ) {
          Alert.alert('CODIGO', 'Este Codigo ya ha sido escaneado');
        } else {
          setData([...data, e.data]);
          setCounter(counter + 1);

         if(counter === fact?.cant_cajas){
            UpdateIsChecked(fact.id);
            close();
            Alert.alert('FINALIZADO')
         }

        }
    }
  };
  

  return (
    <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={() => { close }}>

      <View>
        <Text>{fact?.ref_factura}</Text>
        <Text>RESUMEN : {counter}/{fact?.cant_cajas}</Text>
      </View>

      <QRCodeScanner
        onRead={handleQRCodeRead}
        showMarker={true}
        reactivate={true}
        reactivateTimeout={2000}
        markerStyle={{ borderColor: 'red' }}
        permissionDialogTitle={'Permission to use camera'}
        permissionDialogMessage={'We need your permission to use your camera phone'}
        cameraStyle={styles.cameraContainer}
      />

      <View>
        <Button title={'CERRAR'} onPress={()=>{ setCounter(0); close(); }}/>
      </View>

    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '50%',
    height: '50%',
    alignSelf: 'center',
    marginTop: Dimensions.get('window').height * 0.25,
  },
  bottomContent: {
    padding: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannedData: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
  },
});

export default QRScanner;

