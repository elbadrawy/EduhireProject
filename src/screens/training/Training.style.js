import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  containerStyle: {
    flexGrow: 1,
    //alignItems: 'center',
    //justifyContent: 'center',
    backgroundColor:"#003049",
    paddingTop:15,
  },
  formHolder:{
    borderWidth:1,
    width:'100%',
    height:'90%',
    backgroundColor:'white',
    padding:15,
    alignItems:'center',
    justifyContent:'center',
    borderTopLeftRadius:50,
    borderTopRightRadius:50,
    marginBottom:0,
    borderColor:'rgba(0,0,0,0.2)',
    shadowColor:"#333333", 
   
    shadowOpacity:0.9,
    shadowRadius:4,
    elevation:15,
  },
  coverLetter:{
    height:200,
    backgroundColor:'#fff',
    borderWidth:0.5,
    borderRadius:10,
    borderColor:'#525252',
    width:'100%',
    padding:15,
    shadowColor:"#333333", 
   
    shadowOpacity:0.9,
    shadowRadius:4,
    elevation:15,
  },
  dropdown: {
    margin: 16,
    height: 50,
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



  // Submit Training 
  Input:{
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.4)',
    padding: 5,
    borderRadius: 20,
    paddingLeft: 10,
    fontSize: 16,
    marginBottom: 10,
    width: '100%',
    maxHeight: 50,
  },
  submitTrainingHolder:{
    width: '100%',
    padding: 15,
    alignItems: 'center',
    // justifyContent: 'center',
    paddingTop:70,
    marginTop:50,
    borderWidth: 1,
    borderColor:'rgba(0,0,0,0.2)',
    height: '100%',
    borderTopRightRadius:50,
    borderTopLeftRadius:50,
    backgroundColor:"#fff",
    shadowColor:"#333333", 
    shadowOfset:{
    width:10,
    height:10,
    },
    shadowOpacity:0.9,
    shadowRadius:4,
    elevation:15,
  }


});
