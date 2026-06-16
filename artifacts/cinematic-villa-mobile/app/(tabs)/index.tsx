import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef } from "react";
import {
  Animated,
  FlatList,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Property = {
  id: string;
  name: string;
  location: string;
  price: string;
  tag: string;
  bedrooms: number;
  area: string;
  cardColor: string;
  accentColor: string;
};

const PROPERTIES: Property[] = [
  {
    id: "aravalli-crest",
    name: "Aravalli Crest Villa",
    location: "Gurugram, Haryana",
    price: "₹12.8 Cr",
    tag: "Private pool villa",
    bedrooms: 5,
    area: "8,200 sq ft",
    cardColor: "#1a1200",
    accentColor: "#c4a44a",
  },
  {
    id: "juhu-sea-pearl",
    name: "Juhu Sea Pearl",
    location: "Mumbai, Maharashtra",
    price: "₹22.4 Cr",
    tag: "Sea-facing duplex",
    bedrooms: 4,
    area: "6,800 sq ft",
    cardColor: "#050e1a",
    accentColor: "#3a88c4",
  },
  {
    id: "indiranagar-sky-house",
    name: "Indiranagar Sky House",
    location: "Bengaluru, Karnataka",
    price: "₹8.6 Cr",
    tag: "Penthouse residence",
    bedrooms: 3,
    area: "4,500 sq ft",
    cardColor: "#0d091a",
    accentColor: "#7a4dbf",
  },
  {
    id: "alipore-garden-estate",
    name: "Alipore Garden Estate",
    location: "Kolkata, West Bengal",
    price: "₹10.9 Cr",
    tag: "Heritage garden home",
    bedrooms: 6,
    area: "9,400 sq ft",
    cardColor: "#071409",
    accentColor: "#3a8b4a",
  },
  {
    id: "ecr-azure-retreat",
    name: "ECR Azure Retreat",
    location: "Chennai, Tamil Nadu",
    price: "₹7.9 Cr",
    tag: "Coastal estate",
    bedrooms: 4,
    area: "5,200 sq ft",
    cardColor: "#040e12",
    accentColor: "#1e8ba8",
  },
  {
    id: "lutyens-court-residence",
    name: "Lutyens Court Residence",
    location: "New Delhi",
    price: "₹31 Cr",
    tag: "Ultra-prime apartment",
    bedrooms: 6,
    area: "11,500 sq ft",
    cardColor: "#0d0a04",
    accentColor: "#b8882a",
  },
];

function PropertyCard({ item }: { item: Property }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 30 }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => router.push(`/property/${item.id}`)}
        style={[styles.card, { backgroundColor: item.cardColor }]}
      >
        <View style={[styles.accentBar, { backgroundColor: item.accentColor }]} />

        <View style={styles.cardTop}>
          <View style={[styles.tagBadge, { borderColor: item.accentColor + "66" }]}>
            <Text style={[styles.tagText, { color: item.accentColor }]}>{item.tag}</Text>
          </View>
          <Text style={styles.priceText}>{item.price}</Text>
        </View>

        <Text style={styles.cardName}>{item.name}</Text>

        <View style={styles.locationRow}>
          <Feather name="map-pin" size={11} color="#f4d58d" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Feather name="home" size={12} color="#555" />
              <Text style={styles.statText}>{item.bedrooms} beds</Text>
            </View>
            <View style={styles.dot} />
            <View style={styles.stat}>
              <Feather name="maximize" size={12} color="#555" />
              <Text style={styles.statText}>{item.area}</Text>
            </View>
          </View>
          <Feather name="arrow-right" size={18} color="#f4d58d" />
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function PropertiesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />
      <FlatList
        data={PROPERTIES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PropertyCard item={item} />}
        contentContainerStyle={[
          styles.list,
          {
            paddingTop: insets.top + (Platform.OS === "web" ? 67 : 12),
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 24),
          },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEnabled
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Indian Luxury Portfolio</Text>
            <Text style={styles.headline}>India's{"\n"}Finest{"\n"}Addresses</Text>
            <Text style={styles.subhead}>
              Six exclusive residences. Verified agents.{"\n"}Private viewings available.
            </Text>
            <View style={styles.divider} />
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050505" },
  list: { paddingHorizontal: 16 },
  header: { paddingBottom: 28 },
  eyebrow: {
    fontFamily: "Inter_500Medium",
    fontSize: 9,
    letterSpacing: 4.5,
    color: "#f4d58d",
    textTransform: "uppercase",
    marginBottom: 16,
  },
  headline: {
    fontFamily: "Inter_700Bold",
    fontSize: 46,
    color: "#ffffff",
    lineHeight: 48,
    letterSpacing: -1,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  subhead: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "#555555",
    lineHeight: 21,
    marginBottom: 28,
  },
  divider: { height: 1, backgroundColor: "#1c1c1c", marginBottom: 4 },
  card: {
    borderRadius: 4,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1e1e1e",
    overflow: "hidden",
  },
  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.8,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  tagBadge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  tagText: {
    fontFamily: "Inter_500Medium",
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  priceText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 17,
    color: "#ffffff",
  },
  cardName: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    lineHeight: 24,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 14,
  },
  locationText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#777777",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#1c1c1c",
    paddingTop: 12,
  },
  statsRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  stat: { flexDirection: "row", alignItems: "center", gap: 5 },
  statText: { fontFamily: "Inter_400Regular", fontSize: 11, color: "#555555" },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: "#2e2e2e" },
});
