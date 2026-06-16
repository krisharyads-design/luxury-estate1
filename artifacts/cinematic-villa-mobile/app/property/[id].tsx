import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type PropertyData = {
  id: string;
  name: string;
  location: string;
  price: string;
  tag: string;
  bedrooms: number;
  baths: number;
  area: string;
  description: string;
  highlights: string[];
  agent: string;
  agentTitle: string;
  cardColor: string;
  accentColor: string;
  rooms: { label: string; color: string }[];
};

const PROPERTIES: Record<string, PropertyData> = {
  "aravalli-crest": {
    id: "aravalli-crest",
    name: "Aravalli Crest Villa",
    location: "Gurugram, Haryana",
    price: "₹12.8 Cr",
    tag: "Private pool villa",
    bedrooms: 5,
    baths: 6,
    area: "8,200 sq ft",
    description:
      "Perched atop the Aravallis with sweeping panoramic views of the Gurugram skyline, this villa blends raw stone facades with warm interiors. A 60-foot infinity pool, private gym, and triple-height library define the experience.",
    highlights: [
      "60 ft infinity pool with Aravalli views",
      "Triple-height library with oak shelving",
      "Private gym & spa suite",
      "Staff quarters with separate entrance",
    ],
    agent: "Nisha Kapoor",
    agentTitle: "Senior Estate Advisor",
    cardColor: "#1a1200",
    accentColor: "#c4a44a",
    rooms: [
      { label: "Living", color: "#2a1a00" },
      { label: "Master", color: "#1a1000" },
      { label: "Pool", color: "#001520" },
      { label: "Library", color: "#0d0800" },
      { label: "Garden", color: "#081008" },
    ],
  },
  "juhu-sea-pearl": {
    id: "juhu-sea-pearl",
    name: "Juhu Sea Pearl",
    location: "Mumbai, Maharashtra",
    price: "₹22.4 Cr",
    tag: "Sea-facing duplex",
    bedrooms: 4,
    baths: 5,
    area: "6,800 sq ft",
    description:
      "Rising above Juhu Beach with unobstructed Arabian Sea views, this duplex features floor-to-ceiling glass walls, an outdoor terrarium, and a rooftop deck perfect for watching Mumbai sunsets from above.",
    highlights: [
      "270° Arabian Sea panorama",
      "Rooftop terrace with teak decking",
      "Private beach access pass",
      "Designer kitchen by Valcucine",
    ],
    agent: "Arjun Mehta",
    agentTitle: "Luxury Residential Specialist",
    cardColor: "#050e1a",
    accentColor: "#3a88c4",
    rooms: [
      { label: "Living", color: "#050e1a" },
      { label: "Master", color: "#040c17" },
      { label: "Terrace", color: "#030810" },
      { label: "Kitchen", color: "#040a14" },
      { label: "Study", color: "#050c18" },
    ],
  },
  "indiranagar-sky-house": {
    id: "indiranagar-sky-house",
    name: "Indiranagar Sky House",
    location: "Bengaluru, Karnataka",
    price: "₹8.6 Cr",
    tag: "Penthouse residence",
    bedrooms: 3,
    baths: 4,
    area: "4,500 sq ft",
    description:
      "Floating above Bengaluru's most vibrant neighbourhood, this penthouse merges concrete brutalism with lush tropical landscaping. Its sky garden blooms year-round with native Deccan flora, while interiors stay cool with passive ventilation design.",
    highlights: [
      "600 sq ft sky garden with native flora",
      "Concrete & teak brutalist architecture",
      "Passive ventilation — no AC required",
      "Private rooftop cinema (8 seats)",
    ],
    agent: "Priya Nair",
    agentTitle: "Urban Residential Advisor",
    cardColor: "#0d091a",
    accentColor: "#7a4dbf",
    rooms: [
      { label: "Living", color: "#0d091a" },
      { label: "Master", color: "#0b0818" },
      { label: "Garden", color: "#080515" },
      { label: "Cinema", color: "#0a0718" },
      { label: "Kitchen", color: "#0c0818" },
    ],
  },
  "alipore-garden-estate": {
    id: "alipore-garden-estate",
    name: "Alipore Garden Estate",
    location: "Kolkata, West Bengal",
    price: "₹10.9 Cr",
    tag: "Heritage garden home",
    bedrooms: 6,
    baths: 7,
    area: "9,400 sq ft",
    description:
      "A rare heritage bungalow on a 1.2-acre plot in Kolkata's most exclusive enclave. Original 1920s columns and verandas have been meticulously restored alongside modern amenities, creating a seamless dialogue between eras.",
    highlights: [
      "1920s heritage columns, fully restored",
      "1.2-acre private garden with century-old oaks",
      "Billiard room & vintage wine cellar",
      "Separate 3-room guest cottage",
    ],
    agent: "Rahul Bose",
    agentTitle: "Heritage Property Specialist",
    cardColor: "#071409",
    accentColor: "#3a8b4a",
    rooms: [
      { label: "Grand Hall", color: "#071409" },
      { label: "Master", color: "#061008" },
      { label: "Garden", color: "#050f06" },
      { label: "Cellar", color: "#040c05" },
      { label: "Cottage", color: "#060f07" },
    ],
  },
  "ecr-azure-retreat": {
    id: "ecr-azure-retreat",
    name: "ECR Azure Retreat",
    location: "Chennai, Tamil Nadu",
    price: "₹7.9 Cr",
    tag: "Coastal estate",
    bedrooms: 4,
    baths: 4,
    area: "5,200 sq ft",
    description:
      "Set on a private stretch of East Coast Road beach, this contemporary estate captures the Bay of Bengal from every room. Courtyards filled with ocean breezes, a plunge pool flush with the sand, and lime-washed Chettinad stone define this coastal sanctuary.",
    highlights: [
      "Direct private beach frontage",
      "Plunge pool at sand level",
      "Chettinad limestone and teakwood interiors",
      "Solar-powered with 10kW installation",
    ],
    agent: "Deepa Subramaniam",
    agentTitle: "Coastal Properties Advisor",
    cardColor: "#040e12",
    accentColor: "#1e8ba8",
    rooms: [
      { label: "Living", color: "#040e12" },
      { label: "Master", color: "#030c10" },
      { label: "Pool", color: "#020a0e" },
      { label: "Courtyard", color: "#030b0f" },
      { label: "Kitchen", color: "#040c10" },
    ],
  },
  "lutyens-court-residence": {
    id: "lutyens-court-residence",
    name: "Lutyens Court Residence",
    location: "New Delhi",
    price: "₹31 Cr",
    tag: "Ultra-prime apartment",
    bedrooms: 6,
    baths: 8,
    area: "11,500 sq ft",
    description:
      "The pinnacle of Delhi luxury — a sprawling residence within Lutyens' Bungalow Zone offering 11,500 sq ft of curated living space. Russian marble floors, hand-painted ceilings, and a private lift entrance set the tone for India's most prestigious address.",
    highlights: [
      "Lutyens' Bungalow Zone — rarest zoning in Delhi",
      "Russian Botticino marble floors throughout",
      "Hand-painted frescoed ceilings",
      "Private lift entrance with biometric access",
    ],
    agent: "Vikram Singh",
    agentTitle: "Ultra-Prime Portfolio Director",
    cardColor: "#0d0a04",
    accentColor: "#b8882a",
    rooms: [
      { label: "Grand Hall", color: "#0d0a04" },
      { label: "Master Suite", color: "#0b0803" },
      { label: "Dining Room", color: "#0a0702" },
      { label: "Study", color: "#0c0904" },
      { label: "Library", color: "#0e0b05" },
    ],
  },
};

function ConsultModal({
  visible,
  onClose,
  property,
}: {
  visible: boolean;
  onClose: () => void;
  property: PropertyData;
}) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert("Required", "Please fill in your name and phone number.");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSubmitted(true);
  };

  const handleClose = () => {
    setName("");
    setPhone("");
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={[modalStyles.container, { paddingBottom: insets.bottom + 24 }]}>
        <View style={modalStyles.handle} />

        {submitted ? (
          <View style={modalStyles.successContainer}>
            <View style={[modalStyles.checkCircle, { borderColor: property.accentColor }]}>
              <Feather name="check" size={32} color={property.accentColor} />
            </View>
            <Text style={modalStyles.successTitle}>Request Received</Text>
            <Text style={modalStyles.successText}>
              {property.agent} will contact you within 24 hours to arrange a private viewing of{" "}
              {property.name}.
            </Text>
            <Pressable style={[modalStyles.doneBtn, { backgroundColor: property.accentColor }]} onPress={handleClose}>
              <Text style={[modalStyles.doneBtnText, { color: "#050505" }]}>Done</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={modalStyles.eyebrow}>Private Consultation</Text>
            <Text style={modalStyles.title}>{property.name}</Text>
            <Text style={modalStyles.agentLine}>
              with {property.agent} · {property.agentTitle}
            </Text>

            <View style={modalStyles.form}>
              <View style={modalStyles.field}>
                <Text style={modalStyles.label}>Full Name</Text>
                <TextInput
                  style={modalStyles.input}
                  placeholder="Your name"
                  placeholderTextColor="#333"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
              <View style={modalStyles.field}>
                <Text style={modalStyles.label}>Phone Number</Text>
                <TextInput
                  style={modalStyles.input}
                  placeholder="+91 —"
                  placeholderTextColor="#333"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <Pressable
              style={[modalStyles.submitBtn, { backgroundColor: property.accentColor }]}
              onPress={handleSubmit}
            >
              <Text style={[modalStyles.submitBtnText, { color: "#050505" }]}>
                Request Viewing
              </Text>
            </Pressable>

            <Text style={modalStyles.disclaimer}>
              Your details are shared only with {property.agent}. We do not share with third parties.
            </Text>
          </>
        )}
      </View>
    </Modal>
  );
}

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [consultOpen, setConsultOpen] = useState(false);

  const property = PROPERTIES[id ?? ""];

  if (!property) {
    return (
      <View style={{ flex: 1, backgroundColor: "#050505", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#fff", fontFamily: "Inter_400Regular" }}>Property not found.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#050505" }}>
      <StatusBar barStyle="light-content" />

      <Pressable
        style={[styles.backBtn, { top: insets.top + (Platform.OS === "web" ? 67 : 12) }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.back();
        }}
      >
        <Feather name="arrow-left" size={20} color="#ffffff" />
      </Pressable>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + (Platform.OS === "web" ? 67 : 60),
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 120),
          },
        ]}
      >
        <View style={[styles.heroBanner, { backgroundColor: property.cardColor }]}>
          <View style={[styles.heroAccentBar, { backgroundColor: property.accentColor }]} />
          <View style={styles.heroGallery}>
            {property.rooms.map((room, i) => (
              <View
                key={i}
                style={[
                  styles.galleryCell,
                  {
                    backgroundColor: room.color,
                    flex: i === 0 ? 2 : 1,
                    borderColor: property.accentColor + "22",
                  },
                ]}
              >
                <Text style={[styles.galleryLabel, { color: property.accentColor + "88" }]}>
                  {room.label}
                </Text>
                <View style={[styles.galleryCellAccent, { borderColor: property.accentColor + "44" }]} />
              </View>
            ))}
          </View>
          <View style={styles.heroOverlay}>
            <View style={[styles.tagBadge, { borderColor: property.accentColor + "55" }]}>
              <Text style={[styles.tagText, { color: property.accentColor }]}>{property.tag}</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.price}>{property.price}</Text>
          <Text style={styles.name}>{property.name}</Text>
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={12} color="#f4d58d" />
            <Text style={styles.location}>{property.location}</Text>
          </View>

          <View style={[styles.specsRow, { borderColor: "#1c1c1c" }]}>
            <View style={styles.specItem}>
              <Feather name="home" size={16} color={property.accentColor} />
              <Text style={styles.specValue}>{property.bedrooms}</Text>
              <Text style={styles.specLabel}>Beds</Text>
            </View>
            <View style={[styles.specDivider, { backgroundColor: "#1c1c1c" }]} />
            <View style={styles.specItem}>
              <Feather name="droplet" size={16} color={property.accentColor} />
              <Text style={styles.specValue}>{property.baths}</Text>
              <Text style={styles.specLabel}>Baths</Text>
            </View>
            <View style={[styles.specDivider, { backgroundColor: "#1c1c1c" }]} />
            <View style={styles.specItem}>
              <Feather name="maximize" size={16} color={property.accentColor} />
              <Text style={styles.specValue}>{property.area}</Text>
              <Text style={styles.specLabel}>Area</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>About this property</Text>
          <Text style={styles.description}>{property.description}</Text>

          <Text style={styles.sectionTitle}>Highlights</Text>
          {property.highlights.map((h, i) => (
            <View key={i} style={styles.highlightRow}>
              <View style={[styles.highlightDot, { backgroundColor: property.accentColor }]} />
              <Text style={styles.highlightText}>{h}</Text>
            </View>
          ))}

          <View style={[styles.agentCard, { borderColor: "#1e1e1e" }]}>
            <View style={[styles.agentAvatar, { backgroundColor: property.accentColor + "22" }]}>
              <Feather name="user" size={20} color={property.accentColor} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.agentName}>{property.agent}</Text>
              <Text style={styles.agentTitle}>{property.agentTitle}</Text>
            </View>
            <Feather name="message-circle" size={20} color={property.accentColor} />
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.ctaBar,
          {
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16),
            borderTopColor: "#1a1a1a",
          },
        ]}
      >
        <Pressable
          style={[styles.ctaBtn, { backgroundColor: property.accentColor }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setConsultOpen(true);
          }}
        >
          <Feather name="calendar" size={16} color="#050505" />
          <Text style={styles.ctaBtnText}>Book Private Viewing</Text>
        </Pressable>
      </View>

      <ConsultModal
        visible={consultOpen}
        onClose={() => setConsultOpen(false)}
        property={property}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 0 },
  backBtn: {
    position: "absolute",
    left: 18,
    zIndex: 100,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#0e0e0e",
    borderWidth: 1,
    borderColor: "#1e1e1e",
    alignItems: "center",
    justifyContent: "center",
  },
  heroBanner: {
    height: 240,
    overflow: "hidden",
    position: "relative",
  },
  heroAccentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    zIndex: 10,
    opacity: 0.9,
  },
  heroGallery: {
    flex: 1,
    flexDirection: "row",
    gap: 1,
  },
  galleryCell: {
    justifyContent: "flex-end",
    padding: 8,
    borderWidth: 0.5,
  },
  galleryLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  galleryCellAccent: {
    width: 16,
    height: 1,
    borderWidth: 0.5,
    marginTop: 4,
  },
  heroOverlay: {
    position: "absolute",
    bottom: 14,
    right: 14,
  },
  tagBadge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#050505aa",
  },
  tagText: {
    fontFamily: "Inter_500Medium",
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  body: { paddingHorizontal: 20, paddingTop: 22 },
  price: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: "#f4d58d",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  name: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: -0.5,
    lineHeight: 32,
    marginBottom: 8,
  },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 22 },
  location: { fontFamily: "Inter_400Regular", fontSize: 12, color: "#666" },
  specsRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 28,
    overflow: "hidden",
  },
  specItem: { flex: 1, alignItems: "center", paddingVertical: 14, gap: 4 },
  specDivider: { width: 1 },
  specValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "#ffffff",
  },
  specLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: "#777",
    textTransform: "uppercase",
    letterSpacing: 3,
    marginBottom: 12,
    marginTop: 4,
  },
  description: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#888",
    lineHeight: 24,
    marginBottom: 28,
  },
  highlightRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 12 },
  highlightDot: { width: 4, height: 4, borderRadius: 2, marginTop: 7, flexShrink: 0 },
  highlightText: { fontFamily: "Inter_400Regular", fontSize: 14, color: "#999", lineHeight: 22, flex: 1 },
  agentCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 28,
  },
  agentAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  agentName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#ffffff",
  },
  agentTitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: "#555",
    marginTop: 2,
  },
  ctaBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 14,
    backgroundColor: "#050505",
    borderTopWidth: 1,
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 4,
  },
  ctaBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: "#050505",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
});

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: "#222",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 28,
  },
  eyebrow: {
    fontFamily: "Inter_500Medium",
    fontSize: 9,
    letterSpacing: 4,
    color: "#f4d58d",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  agentLine: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "#555",
    marginBottom: 32,
  },
  form: { gap: 16, marginBottom: 24 },
  field: { gap: 8 },
  label: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#555",
  },
  input: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#1e1e1e",
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: "#ffffff",
  },
  submitBtn: {
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 16,
  },
  submitBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  disclaimer: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: "#333",
    textAlign: "center",
    lineHeight: 18,
  },
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 24,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  successTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  successText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#666",
    lineHeight: 24,
    textAlign: "center",
  },
  doneBtn: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 4,
  },
  doneBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
});
