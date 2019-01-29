import React from 'react';
import { View, Text } from 'react-native';
import { LayoutCenter } from '@gqlapp/look-client-react-native';

const Loading = () => (
  <LayoutCenter>
    <View className="text-center">
      <Text>App is loading...</Text>
    </View>
  </LayoutCenter>
);

export default Loading;
