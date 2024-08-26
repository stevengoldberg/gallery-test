import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState, useCallback, useRef } from "react";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MAX_IMAGES = 100000;
const NUM_COLUMNS = 3;

export default function Gallery() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  const listRef = useRef();

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const imageWidth = Math.floor(screenWidth / NUM_COLUMNS);

  useEffect(() => {
    const loadImages = async () => {
      const { assets } = await MediaLibrary.getAssetsAsync({
        mediaType: "photo",
        first: MAX_IMAGES,
        sortBy: ["creationTime"],
      });
      setLoading(false);
      setAssets(assets);
    };
    loadImages();
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <Image
        source={{ uri: item.uri }}
        style={{
          width: imageWidth,
          height: imageWidth,
        }}
        cachePolicy="memory-disk"
      />
    ),
    [imageWidth],
  );

  const scrollToTop = () => {
    listRef.current.scrollToIndex({ index: 0, animated: true });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <View
          style={{
            height: screenHeight,
            width: screenWidth,
            position: "relative",
          }}
        >
          <FlashList
            data={assets}
            estimatedItemSize={imageWidth}
            showsVerticalScrollIndicator={false}
            numColumns={NUM_COLUMNS}
            renderItem={renderItem}
            drawDistance={screenHeight * 2}
            ref={listRef}
          />
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={[styles.button, { bottom: insets.bottom }]}>
              <TouchableOpacity onPress={scrollToTop}>
                <Text style={styles.label}>Back to Top</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    position: "absolute",
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 12,
    opacity: 0.85,
  },
  label: {
    color: "white",
  },
});
