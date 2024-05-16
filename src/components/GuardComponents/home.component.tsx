import { View, TouchableOpacity, Text } from "react-native";
import UserStorage from "../../storage/user";

const HomeGuardView = () => {
    const { data } = UserStorage();

    return(
        <View style={{ backgroundColor : 'F4F6F7', flex : 1 , height : '100%', width : '100%' }}>
            <Text style={{ color : 'black'}}>{data.nombre}</Text>


        </View>
    )
}

export default HomeGuardView;