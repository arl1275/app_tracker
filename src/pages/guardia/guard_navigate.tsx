import { createStackNavigator } from '@react-navigation/stack';
import ListToTransito from '../../components/GuardComponents/LisToTransit.component';
import GuardiaNavbar from '../../components/GuardComponents/GuardNavbar.component';
import { MainGuardView } from './GuardMainView';
import HomeGuardView from '../../components/GuardComponents/home.component';

export type RootStackGuardList = {
    Inicio: undefined;
    Despacho: undefined;
    Transito: undefined,
    Details: { itemId: number };
};

function GuardiaRoutes() {
    const Stack = createStackNavigator<RootStackGuardList>();
    return (
        <>
            <GuardiaNavbar />
            <Stack.Navigator>
                <Stack.Screen name="Inicio" component={HomeGuardView} options={{ headerShown: false }} />
                <Stack.Screen name="Transito" component={ListToTransito} options={{ headerShown: false }}/>
                <Stack.Screen name="Despacho" component={MainGuardView} options={{ headerShown  : false}}/> 
            </Stack.Navigator>
        </>

    )
}

export default GuardiaRoutes;