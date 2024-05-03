import React, {useState, useEffect} from 'react';
import {ScrollView, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function Container(props) {
  const insets = useSafeAreaInsets();
  const {scrollViewEnabled, children} = props;
  if (scrollViewEnabled) {
    return (
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{
          flex: 1, // Paddings to handle safe area
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}>
        {children}
      </ScrollView>
    );
  }
  return (
    <View
      style={[
        props.containerStyle,
        {
          flex: 1, // Paddings to handle safe area
          paddingTop: insets.top,
          //paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}>
      {children}
    </View>
  );
}
