import { Colors } from "@/constants/Colors";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import TabBarButton from "./TabBarButton";

type Props = BottomTabBarProps;

export function TabBar({ state, descriptors, navigation }: Props) {
  const [dimension, setDimension] = useState({ height: 20, width: 100 });
  const tabPositionX = useSharedValue(0);
  const buttonWidth = dimension.width / state.routes.length;

  const onTabBarLayout = (e: LayoutChangeEvent) => {
    const { height, width } = e.nativeEvent.layout;
    setDimension({ height, width });
  };

  useEffect(() => {
    tabPositionX.value = withTiming(buttonWidth * state.index, {
      duration: 200,
    });
  }, [state.index, buttonWidth]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabPositionX.value }],
  }));

  const renderTabButton = (route: any, index: number) => {
    const { options } = descriptors[route.key];
    const rawLabel = options.tabBarLabel ?? options.title ?? route.name;
    const label = typeof rawLabel === "string" ? rawLabel : String(rawLabel);
    const isFocused = state.index === index;

    const handlePress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      }
    };

    const handleLongPress = () => {
      navigation.emit({
        type: "tabLongPress",
        target: route.key,
      });
    };

    return (
      <TabBarButton
        key={route.key}
        onPress={handlePress}
        onLongPress={handleLongPress}
        isFocused={isFocused}
        routeName={route.name}
        label={label}
      />
    );
  };

  return (
    <View onLayout={onTabBarLayout} style={styles.tabBar}>
      <Animated.View
        style={[styles.indicator, animatedStyle, { width: buttonWidth / 2 }]}
      />
      {state.routes.map(renderTabButton)}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    paddingTop: 16,
    backgroundColor: Colors.white,
    elevation: 8, // Add shadow on Android
    shadowColor: "#000", // Add shadow on iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  indicator: {
    position: "absolute",
    backgroundColor: Colors.primary,
    top: 0,
    left: 20,
    height: 2,
  },
});
