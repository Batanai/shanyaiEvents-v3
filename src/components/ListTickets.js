import React from 'react';
import {View, StyleSheet, FlatList, Text, Button} from 'react-native';

import {useNavigation, useRoute} from '@react-navigation/native';

const ListTickets = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const eId = route.params?.eid;
  const title = route.params?.title;

  console.log('EID', eId, 'TITLE', title);

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.heading}>{title}</Text>
      </View>

      <Button
        title="Scan QR Code"
        onPress={() => navigation.navigate('ScanBarcode', {eid: eId})}
      />
    </View>
  );
};

export default ListTickets;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  item: {
    padding: 10,
    fontSize: 18,

    borderTopWidth: 1,
    borderBottomColor: '#000000',
    height: 44,
  },
  heading: {
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#f4511e',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
    padding: 15,
  },
});
