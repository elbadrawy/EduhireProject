import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  containerStyle: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  brandName:{
    fontSize:60,
    fontFamily:'cursive',
    color:'whitesmoke',
    marginBottom:70,
    marginTop:70,
    fontWeight:800,
  },
  bottomScreen:{
    backgroundColor:'white',
    flex:1,
    width:"100%",
    paddingTop:30,
    paddingRight:30,
    paddingLeft:30,
    // display:'flex',
    // justifyContent:'center',
    // alignItems:'center',

    borderTopLeftRadius:50,
    borderTopRightRadius:50,

    shadowColor:"#333333",
    shadowOfset:{
    width:10,
    height:10,
    
    },
    shadowOpacity:0.9,
    shadowRadius:4,
    elevation:17,

  },
  label:{
    marginLeft:10,
    marginBottom:10,
    fontWeight:'bold',
    color:'grey',
  },
  email:{
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.4)',
    padding: 5,
    borderRadius: 20,
    paddingLeft: 10,
    fontSize: 16,
    marginBottom: 10,
    width: '100%',
    maxHeight: 50,
    backgroundColor:'rgba(0,0,0,0.08)'
  },
  password:{
    backgroundColor:'#bdbdbd',
    padding:10,
    borderRadius:20,
    marginBottom:20,
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    width:100,
  },
  orDivider:{
    width:'100%',
    
    textAlign:"center",
    fontSize:16,
    fontWeight:'bold',
    color:'grey',
    marginBottom:20,
  }
});
