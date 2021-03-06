import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  Button,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import TextToSpeech from './text_to_speech';

export default function BottomSheet({ panY }) {
  const { height } = useWindowDimensions();

  const gestureHandler = useAnimatedGestureHandler(
    {
      onStart(_, context) {
        context.startY = panY.value;
      },
      onActive(event, context) {
        panY.value = context.startY + event.translationY;
      },
      onEnd() {
        if (panY.value < -height * 0.4) {
          panY.value = withTiming(-(height * 0.6));
        } else {
          panY.value = withTiming(0);
        }
      },
    },
    [height]
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(panY.value, [-1, 0], [-1, 0], {
            extrapolateLeft: Extrapolate.EXTEND,
            extrapolateRight: Extrapolate.CLAMP,
          }),
        },
      ],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View
        style={[
          styles.container,
          { top: height * 0.9 },
          animatedStyle,
        ]}
      >
        <SafeAreaView style={styles.wrapper}>
          <View style={styles.content}>
            <Text style={styles.title}>Space Needle</Text>
            <Text style={styles.subtitle}>Located in the Lower Queen Anne neighborhood, it was built in the Seattle Center for the 1962 World's Fair, which drew over 2.3 million visitors. Nearly 20,000 people a day used its elevators during the event.</Text>
            <TextToSpeech />
            <View style={styles.fakeContent} />
          </View>
        </SafeAreaView>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: -50,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {
      height: -6,
      width: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  wrapper: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontWeight: '400',
    fontSize: 25,
    marginTop: -10,
  },
  subtitle: {
    fontWeight: '200',
    marginTop: 20,
    fontSize: 16,
    marginBottom: 20,
  },
  fakeContent: {
    flex: 1,
    height: 1000,
  },
});

