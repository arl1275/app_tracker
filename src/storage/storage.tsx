import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Facturas } from '../interfaces/facturas';

interface FacturaState {
  data: Facturas[];
  fetchData: () => Promise<void>;
  updateFactura: (updatedFactura: Facturas[]) => Promise<void>;
  getFacturaById: (id: number) => Promise<Facturas | null>;
  updateStateAndHasSing: (idToUpdate: number, newState: string, pathPic: string) => Promise<void>;
  updateSing: (idToUpdate: number, singPath: string) => Promise<void>;
  updateSynchro: (id: number) => Promise<void>;
  getStorageEntregado: () => Promise<Facturas[] | string>;
  getAllEnTransitoFacts: () => Promise<Facturas[]>;
  getAllNOTsynchroFacts: () => Promise<Facturas[] | undefined>;
  updateIsCheck: (id: number) => Promise<void>;
  deleteAllfacts: () => Promise<boolean>;
}

const formatDate = () => {
  const unixTimestamp = Date.now();
  const date = new Date(unixTimestamp);
  const formattedDate = date.toISOString().replace('T', ' ').slice(0, -1);
  return formattedDate;
}

const useFacturaStore: any = create<FacturaState>((set, get) => ({
  data: [],

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

  getAllEnTransitoFacts: async () => {
    const { data } = get();
    const Datos_: Facturas[] = data.filter((factura: Facturas) => factura.state_name === 'EN TRANSITO');
    return Datos_;
  },

  updateFactura: async (facturas: Facturas[]) => {
    const { data } = get();

    if (!data || data.length === 0) {
      // If data is empty or null, store the entire array
      await AsyncStorage.setItem('facturaData', JSON.stringify(facturas));
      console.log('SE GUARDO DE FORMA LOCAL LAS FACTURAS');
      set({ data: facturas });
    } else {
      // Filter out facturas that are already present in the existing data
      const newData: Facturas[] = facturas.filter((factura) => !data.some((existingFactura: Facturas) => existingFactura.factura_id === factura.factura_id));

      if (newData.length > 0) {
        const newFilteredData: Facturas[] = [...data, ...newData];
        await AsyncStorage.setItem('facturaData', JSON.stringify(newFilteredData));
        set({ data: newFilteredData });
      } else {
        console.log('No new data to insert LOCAL FACTURAS.');
      }
    }
  },

  getFacturaById: async (id: number): Promise<Facturas | null> => {
    const { data } = get();
    const factura = data.find((factura: Facturas) => factura.factura_id === id);
    if (factura) {
      return factura;
    } else {
      console.log('Factura not found with ID:', id);
      return null;
    }
  },

  updateStateAndHasSing: async (idToUpdate: number, newState: string, pathPic: string) => {
    try {
      const storedData = await AsyncStorage.getItem('facturaData');
      if (storedData !== null) {
        let data: Facturas[] = JSON.parse(storedData);

        // Find the index of the factura to update
        const facturaIndex = data.findIndex((factura) => factura.factura_id === idToUpdate);

        if (facturaIndex !== -1) {
          // Update state and hasSing for the found factura
          data[facturaIndex] = {
            ...data[facturaIndex],
            state: newState,
            namePic: pathPic,
            hasPic: true,
          };

          // Save the updated data back to AsyncStorage
          await AsyncStorage.setItem('facturaData', JSON.stringify(data));
          set({ data });
        } else {
          console.error('Factura not found with the given ID:', idToUpdate);
        }
      }
    } catch (error) {
      console.error('Error updating state and hasSing:', error);
    }
  },

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
            state: 'SINCRONIZADO',
            state_name: 'SINCRONIZADO'
          };
          await AsyncStorage.setItem('facturaData', JSON.stringify(data));
          set({ data });
        } else {
          console.error('Factura not found with the given ID:', id);
        }
      } else {
        console.error('Error: no data found in storage');
      }
    } catch (err) {
      console.error('Error updating synchro status:', err);
    }
  },

  updateSing: async (idToUpdate: number, singPath: string) => {
    try {
      const storedData = await AsyncStorage.getItem('facturaData');
      if (storedData !== null) {
        let data: Facturas[] = JSON.parse(storedData);
        const facturaIndex = data.findIndex((factura) => factura.factura_id === idToUpdate);

        if (facturaIndex !== -1) {
          data[facturaIndex] = {
            ...data[facturaIndex],
            hasSing: true,
            nameSing: singPath,
            fech_hora_entrega: formatDate(),
            state_name: 'FIRMADO',
            state: 'FIRMADO'
          };
          await AsyncStorage.setItem('facturaData', JSON.stringify(data));
          set({ data });
        } else {
          console.error('Factura not found with the given ID:', idToUpdate);
        }
      }
    } catch (error) {
      console.error('Error updating signature:', error);
    }
  },

  getStorageEntregado: async () => {
    try {
      const storage = await AsyncStorage.getItem('facturaData');
      if (storage !== null) {
        let data: Facturas[] = JSON.parse(storage);
        const factData: Facturas[] = data.filter((factura) => factura.state_name === 'FIRMADO' && factura.hasSing === true);
        return factData.length > 0 ? factData : 'No hay facturas firmadas.';
      } else {
        return 'No se generaron correctamente las facturas firmadas';
      }
    } catch (error) {
      console.error('Error fetching delivered data:', error);
      return 'Hubo un error general al traer las facturas.';
    }
  },

  getAllNOTsynchroFacts: async () => {
    try {
      const val = await AsyncStorage.getItem('facturaData');
      if (val !== null) {
        let data: Facturas[] = JSON.parse(val);
        const factData: Facturas[] = data.filter((factura) => factura.hasSing === true && factura.state_name === 'FIRMADO' && factura.is_Sinchro !== true);
        return factData.length > 0 ? factData : undefined;
      }
    } catch (err) {
      console.error('Error fetching non-synchronized data:', err);
      return undefined;
    }
  },

  updateIsCheck: async (id: number) => {
    try {
      const storedData = await AsyncStorage.getItem('facturaData');
      if (storedData !== null) {
        let data: Facturas[] = JSON.parse(storedData);
        const facturaIndex = data.findIndex((factura) => factura.factura_id === id);

        if (facturaIndex !== -1) {
          data[facturaIndex] = {
            ...data[facturaIndex],
            is_check: true,
            state: 'ENTREGADO',
            state_name: 'ENTREGADO'
          };
          await AsyncStorage.setItem('facturaData', JSON.stringify(data));
          set({ data });
        } else {
          console.error('Factura not found with the given ID:', id);
        }
      }
    } catch (err) {
      console.error('Error updating IsCheck status:', err);
    }
  },

  deleteAllfacts: async () => {
    try {
      const storedData = await AsyncStorage.getItem('facturaData');
      if (storedData !== null) {
        const facturaData: Facturas[] = JSON.parse(storedData);

        if (facturaData.length <= 0) {
          return true;
        } else {
          const hasUnsyncedFacturaWithSignature = facturaData.some((factura: Facturas) => factura.hasSing && factura.is_Sinchro !== true);

          if (hasUnsyncedFacturaWithSignature) {
            return false;
          } else {
            await AsyncStorage.removeItem('facturaData');
            set({ data: [] });
            return true;
          }
        }
      } else {
        return true;
      }
    } catch (error) {
      console.error('Error deleting AsyncStorage:', error);
      return false;
    }
  }
}));

export default useFacturaStore;
