import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Facturas } from '../interfaces/facturas';

interface FacturaState {
  data: Facturas[];
  fetchData: () => Promise<void>;
  updateFactura: (updatedFactura: Facturas[]) => void;                                                      // guarda los datos si no hay facturas 
  getFacturaById: (id: number) => Facturas | undefined;                                                     // Selector function
  updateStateAndHasSing: (idToUpdate: number, newState: string, pathPic: string) => void;                   // set the sing in a Local_file related to one Factura
  updateSing: (idToUpdate: number , singPath: string) => void;                                               // solo marca la factura como que tiene firma.
  updateSynchro: (id: number) => void;                                                                      // solo verifica que una factura ya fue sincronizada
  getStorageEntregado: () => void;                                                                          // solo obtiene las facturas que fueron entregadas.
  getAllEnTransitoFacts: () => void;                                                                        // solo sirve para obtener los datos de las facturas en transito
  getAllNOTsynchroFacts: () => Promise<Facturas[] | undefined>;                                             // solo envia facturas que no esten sincronizadas
  updateIsCheck: (id: number) => void;
}
const formatDate = () => {
  const unixTimestamp = Date.now();                                                                         // Current Unix timestamp
  const date = new Date(unixTimestamp);                                                                     // Convert Unix timestamp to Date object
  const formattedDate = date.toISOString().replace('T', ' ').slice(0, -1);                                  // Format date as YYYY-MM-DD HH:mm:ss.sss
  return formattedDate;
}

const useFacturaStore: any = create<FacturaState>((set) => ({
  data: [],

  // get all data that is already saved
  fetchData: async () => {
    try {
      const storedData = await AsyncStorage.getItem('facturaData');
      if (storedData !== null) {
        set({ data: JSON.parse(storedData) });
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },

  getAllEnTransitoFacts: () => {
    const { data } = useFacturaStore.getState();
    const Datos_: Facturas[] = data.filter((factura: Facturas) => factura.state_name === 'EN TRANSITO');
    return Datos_;
  },

  // save all the data from the synchro button, all the facts in a local file
  updateFactura: (facturas: Facturas[]) => {
    set(() => {
      let newData: Facturas[] = [];
      let newFilteredData: Facturas[] = []
      const { data } = useFacturaStore.getState();

      //first we are going to check if data is null
      if (data.length > 0) {

        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < facturas.length; j++) {
            if (data[i].id === facturas[j].factura_id) {
              newData.push(facturas[j]);
            }
          }
        }

        newFilteredData = [...data, newData];

        AsyncStorage.setItem('facturaData', JSON.stringify(newFilteredData)).catch((error) => {
          console.error('Error saving data:', error);
        });
        console.log('filtered_data : ', newFilteredData);
      } else {
        //if not exist fill the Async Storage with all data
        AsyncStorage.setItem('facturaData', JSON.stringify(facturas)).catch((error) => {
          console.error('Error saving data:', error);
        });

      }
      return { data: facturas };
    });
  },

  // return all the data of one specific fact
  getFacturaById: (id: number) => {
    const { data } = useFacturaStore.getState();
    const factura = data.find((factura: Facturas) => factura.factura_id === id);

    if (factura) {
      console.log('INFO DE LA FACTURA:', factura);
    } else {
      console.log('Factura not found with ID:', id);
    }

    return factura;
  },

  //works for update the element if the fact has sing or not
  updateStateAndHasSing: async (idToUpdate: number, newState: string, pathPic: string) => {
    try {
      console.log('base de foto: ', pathPic.length);

      const storedData = await AsyncStorage.getItem('facturaData');
      if (storedData !== null) {
        let data: Facturas[] = JSON.parse(storedData);

        // Find the index of the factura to update
        const facturaIndex = data.findIndex((factura) => factura.factura_id === idToUpdate);

        if (facturaIndex !== -1) {
          // Update state and hasSing for the found factura
          data[facturaIndex] = {
            ...data[facturaIndex],
            state: newState, // Set hasSing to true
            namePic: pathPic,
            hasPic: true,
          };

          // Save the updated data back to AsyncStorage
          await AsyncStorage.setItem('facturaData', JSON.stringify(data));
          console.log('State and hasSing updated successfully:', data[facturaIndex]);
        } else {
          console.error('Factura not found with the given ID:', idToUpdate);
        }
      }
    } catch (error) {
      console.error('Error updating state and hasSing:', error);
    }
  },

  // set tru to the of the synchro 
  updateSynchro: async (id: number) => {
    try {
      const storedData = await AsyncStorage.getItem('facturaData');
      if (storedData !== null) {
        let data: Facturas[] = JSON.parse(storedData);
        const facturaIndex = data.findIndex((factura) => factura.factura_id === id);
        if (facturaIndex !== -1) {
          data[facturaIndex] = {
            ...data[facturaIndex],
            is_Sinchro: true,
          }
        }
        console.log('se valido a sincronizado')
      } else {
        console.log('erro para obtener el storage');
      }
    } catch (err) {
      console.error('Error updating state and hasSing:', err);
    }
  },

  updateSing: async (idToUpdate: number, singPath: string) => {
    try {
      console.log('=D== > ', idToUpdate, singPath);
      const storedData = await AsyncStorage.getItem('facturaData');
      if (storedData !== null) {
        console.log(await AsyncStorage.getItem('facturaData'));
        let data: Facturas[] = JSON.parse(storedData);
        const facturaIndex = data.findIndex((factura) => factura.factura_id === idToUpdate);

        if (facturaIndex !== -1) {
          data[facturaIndex] = {
            ...data[facturaIndex],
            hasSing: true,
            nameSing: singPath,
            fech_hora_entrega: formatDate(),
            state_name: 'ENTREGADO',
          };
          await AsyncStorage.setItem('facturaData', JSON.stringify(data));
          
        } else {
          console.error('Factura not found with the given ID:', idToUpdate);
        }
      }
    } catch (error) {
      console.error('Error updating state and hasSing:', error);
    }
  },

  getStorageEntregado: async () => {
    try {
      const storage = await AsyncStorage.getItem('facturaData');

      if (storage !== null) {
        let data: Facturas[] = JSON.parse(storage);
        const factData: Facturas[] = data.filter((factura) => factura.state_name === 'ENTREGADO');
        if (factData) {
          return factData;
        } else {
          console.log('factData is void')
        }
      } else {
        console.log('Esto nunca deberia de pasar');
        return 'SIN ENTREGAS REALIZADAS';
      }

    } catch (error) {
      console.log('NO SE PUDO OBTENER LOS DATOS: ', error);
    }
  },

  getAllNOTsynchroFacts: async () => {
    const val = await AsyncStorage.getItem('facturaData');
    if (val !== null) {
      let data: Facturas[] = JSON.parse(val);
      const factData: Facturas[] = data.filter((factura) => factura.hasSing === true);
      if (factData) {
        console.log('data from app : ', factData);
        return factData;
      } else {
        console.log('factData is void')
      }
    }
  },

  updateIsCheck: async (id) => {
    try {
      const storedData = await AsyncStorage.getItem('facturaData');
      if (storedData !== null) {
        let data: Facturas[] = JSON.parse(storedData);
        const facturaIndex = data.findIndex((factura) => factura.factura_id === id);

        if (facturaIndex !== -1) {
          data[facturaIndex] = {
            ...data[facturaIndex],
            is_check: true,
          };
          await AsyncStorage.setItem('facturaData', JSON.stringify(data));
          //console.log('State and hasSing updated successfully:', data[facturaIndex]);
        } else {
          console.error('Factura not found with the given ID:', id);
        }
      }
    } catch (err) {
      console.error('Error updating IsCheck and hasSing:', err);
    }
  }

}));

export default useFacturaStore;
