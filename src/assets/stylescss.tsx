import { StyleSheet } from 'react-native';

const styles_made = StyleSheet.create({
    cardHeader : {
        backgroundColor: '#ffffff',
        borderRadius: 6,
        border: 0,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5  
    },
    card : {
        backgroundColor: '#ffffff',
        borderRadius: 6,
        border: 0,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5  
    },
    cardCentered: {
        width: '80%', // Adjust the width as needed
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        // Other styles for your card design
      },
    container :{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        display : "flex"
    },
    table: {
        borderWidth: 1,
        borderColor: 'black',
        margin: 10,
      },
      row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: 'black',
      },
      cell: {
        flex: 1,
        padding: 10,
        textAlign: 'center',
      },

      full_card : {
        width: "90%",
        height: "90%",
        display: "flex"
      },
      // listView : {
      //   display : "block",
      //   padding: 0,
      //   margin: 0,
      //   color: "#141515"
      //   background: "#fff",
      //   borderTop: "1px solid #E1E1E1",
      //   border-bottom: "1px solid #E1E1E1",
      //   line-height: "1.3em"
      // }
      listview : {
        display : "flex",
        padding : 0,
        margin : 0,
        color: "#141515",
        background: "#fff",
        borderTop: "1px solid #E1E1E1",
        borderBottom: "1px solid #E1E1E1",
        lineHeight: "1.3em"
      }


});

export default styles_made;