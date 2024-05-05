import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  containerStyle: {
    //flex: 1,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"#6750A4",
  },
  container:{
    width:'100%',
    backgroundColor:'white',
    flex:1,
    padding:20,
    // borderWidth:5,
    marginTop:20,
    borderTopRightRadius:50,
    borderTopLeftRadius:50,

    shadowColor:"#333333",
    shadowOfset:{
    width:10,
    height:10,
    
    },
    shadowOpacity:0.9,
    shadowRadius:4,
    elevation:17,

  },
  dropdown: {
    margin: 16,
    height: 30,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  Input:{
    // borderWidth:0.6,
    // borderColor:'rgba(0, 0, 0, 0.1)',
    // padding:10,
    // borderTopRightRadius:30,
    // // borderTopLeftRadius:20,
    // borderBottomLeftRadius:30,
    // // borderBottomRightRadius:10,
    
    // backgroundColor:'rgba(0, 0, 0, 0.05)',
    borderRadius:20,
    marginBottom:20,
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    
  },
  

});
