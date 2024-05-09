import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export const EnterPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const fadeInOpacity: Animated.Value = new Animated.Value(0);

  useEffect(() => {
    const fadeIn = () => {
      Animated.timing(fadeInOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    };

    const fadeOut = () => {
      Animated.timing(fadeInOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false);
      });
    };
    fadeIn();

    const timeout = setTimeout(() => {
      fadeOut();
    }, 2000);

    return () => clearTimeout(timeout); 
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.text, { opacity: fadeInOpacity }]}>[ KELLER ]</Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  text: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
  },
});

