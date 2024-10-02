import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, Text, Linking, TouchableOpacity} from 'react-native';

import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {MotiView, useAnimationState} from 'moti';
import {Svg, Defs, Rect, Mask} from 'react-native-svg';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';
import {Shadow} from 'react-native-shadow-2';

import {useDispatch, useSelector} from 'react-redux';
import {resetTicket, sendingTicket} from '../store/tickets';
import {useNavigation, useRoute} from '@react-navigation/native';
import {selectUser} from '../store/users';
import {selectTicket} from '../store/tickets';

const ScanBarcode = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const eId = route.params?.eid;

  const loggedInUser = useSelector(selectUser);
  const token = loggedInUser[0]?.token;

  const ticketResponse = useSelector(selectTicket);

  // camera
  const devices = useCameraDevices();
  const device = devices.back;

  // moti
  const loaderAnimationState = useAnimationState({
    start: {opacity: 1},
    stop: {opacity: 0},
  });

  const ticketAnimationState = useAnimationState({
    show: {opacity: 1, translateY: -10},
    hide: {opacity: 0, translateY: 10},
  });

  //barcode
  const [barcode, setBarcode] = useState('');
  const [isScanned, setIsScanned] = useState(false);

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  useEffect(() => {
    toggleActiveState();

    console.log('BARCODE', barcode);
    console.log('IS-SCANNED', isScanned);
  }, [barcodes]);

  const toggleActiveState = async () => {
    if (barcodes && barcodes.length > 0 && isScanned === false) {
      setIsScanned(true);

      barcodes.forEach(async scannedBarcode => {
        if (scannedBarcode.rawValue !== '') {
          setBarcode(scannedBarcode.rawValue);
          ticketAnimationState.transitionTo('show');
        }
      });
    }
  };

  // on component mount
  useEffect(() => {
    loaderAnimationState.transitionTo('stop');
    ticketAnimationState.transitionTo('hide');

    dispatch(resetTicket());

    RequestCameraPermission();
    // RequestMirophonePermission();
  }, []);

  // handlers
  const RequestCameraPermission = useCallback(async () => {
    const cameraPermission = await Camera.requestCameraPermission();

    if (cameraPermission === 'denied') await Linking.openSettings();
  }, []);

  const RequestMirophonePermission = useCallback(async () => {
    const microphonePermission = await Camera.requestMicrophonePermission();

    if (microphonePermission === 'denied') await Linking.openSettings();
  }, []);

  //confirm ticket

  const ticket = {
    token: token,
    qrcode: barcode,
    eid: `${eId}`,
  };

  const confirmBooking = () => {
    dispatch(sendingTicket(ticket));
  };

  if (ticketResponse) {
    console.log('TICKET RES', ticketResponse);
  }

  const CameraFrame = () => {
    return (
      <Svg height="100%" width="100%">
        <Defs>
          <Mask id="mask" x="0" y="0" height="100%" width="100%">
            <Rect height="100%" width="100%" fill="#fff" />
            <Rect height="250" width="250" fill="black" x="18%" y="30%" />
          </Mask>
        </Defs>

        <Rect
          height="100%"
          width="100%"
          fill="rgba(0, 0, 0, 0.8)"
          mask="url(#mask)"
        />

        {/* frame border */}
        <Rect
          height="250"
          width="250"
          stroke="#fff"
          strokeWidth="5"
          x="18%"
          y="30%"
        />
      </Svg>
    );
  };

  const renderCamera = () => {
    if (device == null) {
      return <View style={{flex: 1}} />;
    } else {
      return (
        <View style={{flex: 1}}>
          <Camera
            style={{flex: 1}}
            device={device}
            isActive={true}
            enableZoomGesture
            frameProcessor={frameProcessor}
            frameProcessorFps={5}
          />

          {/* loading / searching view */}
          <MotiView state={loaderAnimationState} style={styles.motiview}>
            <Text style={{color: '#b4bccc', fontSize: 20}}>Searching</Text>
          </MotiView>

          {/* QR code */}
          {/* <View style={styles.qrcode}>
            <CameraFrame />
          </View> */}

          {/* ticket card */}
          <MotiView state={ticketAnimationState} style={styles.motiviewTicket}>
            <Shadow>
              <TouchableOpacity
                style={styles.ticketTouch}
                onPress={() => {
                  confirmBooking();
                  ticketAnimationState.transitionTo('hide');
                }}>
                <View
                  style={{
                    flex: 1,
                    marginLeft: 10,
                    justifyContent: 'space-evenly',
                  }}>
                  <Text
                    style={{fontSize: 15, color: 'purple', paddingBottom: 5}}>
                    QR Code Scan Complete
                  </Text>
                  <Text
                    style={{fontSize: 12, color: 'black', paddingBottom: 5}}>
                    QR Code: {barcode}
                  </Text>
                  <Text
                    style={{fontSize: 12, color: 'black', paddingBottom: 5}}>
                    Event ID: {eId}
                  </Text>
                  <Text style={{fontSize: 15, color: 'purple'}}>
                    Click to Confirm Booking
                  </Text>
                </View>
              </TouchableOpacity>
            </Shadow>
          </MotiView>

          {/* booking card */}
          {ticketResponse[0] && (
            <View style={styles.motiviewBooking}>
              <Shadow>
                <TouchableOpacity
                  style={styles.ticketTouch}
                  onPress={() => {
                    setTimeout(() => {
                      dispatch(resetTicket());
                      navigation.navigate('Events');
                    }, 3000);
                  }}>
                  <View
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      paddingHorizontal: 5,
                      justifyContent: 'space-evenly',
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        color: 'black',
                        fontWeight: 'bold',
                        paddingBottom: 5,
                      }}>
                      Ticket Validation Status
                    </Text>
                    <Text
                      style={
                        ticketResponse[0]?.status === 'SUCCESS'
                          ? {
                              fontSize: 14,
                              color: 'green',
                              fontWeight: 'bold',
                              paddingBottom: 5,
                            }
                          : {
                              fontSize: 14,
                              color: 'red',
                              fontWeight: 'bold',
                              paddingBottom: 5,
                            }
                      }>
                      Status: {ticketResponse[0]?.status}
                    </Text>
                    <Text
                      style={{fontSize: 13, color: 'black', paddingBottom: 5}}>
                      Message: {ticketResponse[0]?.msg}{' '}
                      {ticketResponse[0]?.msg.includes('permission') &&
                        '- Logout and Login again'}
                    </Text>
                    <Text
                      style={{fontSize: 12, color: 'black', paddingBottom: 5}}>
                      Name: {ticketResponse[0]?.name_customer}
                    </Text>
                    <Text
                      style={{fontSize: 12, color: 'black', paddingBottom: 5}}>
                      Seat: {ticketResponse[0]?.seat}
                    </Text>
                    <Text
                      style={{fontSize: 12, color: 'black', paddingBottom: 5}}>
                      CheckedIn Time: {ticketResponse[0]?.checkin_time}
                    </Text>
                    <Text
                      style={{fontSize: 12, color: 'black', paddingBottom: 5}}>
                      Event details: {ticketResponse[0]?.e_cal}
                    </Text>
                    <Text
                      style={
                        ticketResponse[0]?.status === 'SUCCESS'
                          ? {fontSize: 14, color: 'green', fontWeight: 'bold'}
                          : {fontSize: 14, color: 'red', fontWeight: 'bold'}
                      }>
                      Click to Dismiss
                    </Text>
                  </View>
                </TouchableOpacity>
              </Shadow>
            </View>
          )}
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* camera */}
      {renderCamera()}
    </View>
  );
};

export default ScanBarcode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  result: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    alignItems: 'flex-start',
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  result_left: {
    flex: 1,
    backgroundColor: '#000000',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  result_right: {
    flex: 4,
    backgroundColor: '#000000',
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingTop: 5,
  },
  success: {
    backgroundColor: '#90ba3e',
    flex: 1,
    width: '100%',
    height: '100%',
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fail: {
    backgroundColor: 'red',
    flex: 1,
    width: '100%',
    height: '100%',
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  valid_text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  label: {
    color: '#ccc',
  },
  value: {
    color: '#fff',
    fontWeight: 'bold',
  },
  motiview: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#444952',
  },
  qrcode: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scanButton: {
    position: 'absolute',
    height: 20,
    width: 20,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  motiviewTicket: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    paddingVertical: 20,
    alignItems: 'center',
    zIndex: 1,
  },
  motiviewBooking: {
    position: 'absolute',
    top: 300,
    left: 0,
    right: 0,
    height: 250,
    paddingVertical: 20,
    alignItems: 'center',
    zIndex: 1,
  },
  ticketTouch: {
    flex: 1,
    flexDirection: 'row',
    width: '80%',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
});
