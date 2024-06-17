import { createStackNavigator } from '@react-navigation/stack';
import { ScannerConfig_ent } from '../../components/Activity/ScannerConfig_ent';
import EntregadorHomeView from '../../components/entregadorComponents/EntregadorHome.view';
import EntregadorNavbar from '../../components/entregadorComponents/EntregadorNavbar.component';
import { VistadeSync } from '../../components/entregadorComponents/ToSync.components';
import { EntregadorIndexView } from './EntregadorMain.view';

export type RootStacEntregadorList = {
    HomeG   : undefined;
    Entregas : undefined;
    Sincronizado : undefined,
    Barcode  : undefined,
    Details  : { itemId: number } ;
};

function EntregadorRoutes() {
    const Stack = createStackNavigator<RootStacEntregadorList>();
    return (
        <>
            <EntregadorNavbar/>
            <Stack.Navigator initialRouteName='HomeG'>
                <Stack.Screen name="HomeG" component={EntregadorHomeView} options={{ headerShown: false }} />
                <Stack.Screen name="Entregas" component={EntregadorIndexView} options={{ headerShown: false }}/>
                <Stack.Screen name="Sincronizado" component={VistadeSync} options={{ headerShown  : false}}/>  
                <Stack.Screen name="Barcode" component={ScannerConfig_ent} options={{ headerShown  : false}}/> 
            </Stack.Navigator>
        </>

    )
}

export default EntregadorRoutes;