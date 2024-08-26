import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import * as MediaLibrary from "expo-media-library";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Gallery from "./Gallery";

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      const { status } = await MediaLibrary.getPermissionsAsync();
      if (status === "granted") {
        setHasPermission(true);
      }
    };
    checkPermission();
  }, []);

  const handleRequestPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      setHasPermission(true);
    }
  };

  return (
    <SafeAreaProvider>
      <View style={[styles.container, { width: 393 }]}>
        {!hasPermission ? (
          <TouchableOpacity onPress={handleRequestPermission}>
            <Text>Request Permission</Text>
          </TouchableOpacity>
        ) : (
          <Gallery />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
