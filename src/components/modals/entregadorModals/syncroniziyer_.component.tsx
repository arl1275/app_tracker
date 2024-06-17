import { StyleSheet, Text, View, Image } from "react-native";
import useFacturaStore from "../../../storage/storage";
import { Dimensions } from 'react-native';
import ReportLocalSincro from "../../entregadorComponents/reports_sincro";
const img_ = require('../../../assets/images/Update-pana.png')
const withScreen = Dimensions.get('window').width

const Syncronazir = () => {
    const { data } = useFacturaStore();
    return (
        <View style={{  height: '100%' }}>
            <View style={styles.reportSize}>
                {
                    data.length > 0 ?
                        (
                            <View>
                                <ReportLocalSincro />
                            </View>
                        )
                        :
                        (
                            <View>
                                <View style={{ alignItems: 'center', marginTop: 50 }}>
                                    <Text style={{ color: 'black', fontSize: 20 }}>SINCRONIZAR</Text>
                                    <Text style={{ color: 'grey', fontSize: 15 }}>Favor, presione el boton para sincronizar facturas.</Text>
                                </View>

                                <Image source={img_} style={styles.Image} resizeMode="contain" />
                            </View>
                        )
                }
            </View>
        </View>
    )
}

export default Syncronazir;

const styles = StyleSheet.create({
    RowInfo: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        //height : '7%'
    },
    bigbuttonActive: {
        borderRadius: 10,
        borderWidth: 1.5,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        backgroundColor: 'white',
        elevation: 10,
        height: 'auto'
    },
    bottonText: {
        fontSize: withScreen * 0.020,
        alignSelf: 'center',
        fontWeight: 'bold',
        textAlign: 'left',
    },
    reportSize: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        borderColor: 'white',
        alignSelf: 'center',
        elevation: 10,
        borderRadius: 15
    },
    resume: {
        bottom: 0,
        borderRadius: 20,
        height: '5%',
        width: '70%',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center'
    },
    resumeNone: {
        position: 'absolute',
        top: '80%',
        alignSelf: 'center',
        justifyContent: 'center',
        height: '10%'
    },
    Image: {
        width: '70%',
        height: '70%',
        alignSelf: 'center'
    }
})