export type Property = {
  id: string;
  name: string;
  location: string;
  price: string;
  agent: string;
  agentPhone: string;
  tag: string;
  image: string;
  imagePosition: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  lotSize: string;
  yearBuilt: string;
  description: string;
  highlights: string[];
  galleryPositions: string[];
};

export const properties: Property[] = [
  {
    id: "aravalli-crest",
    name: "Aravalli Crest Villa",
    location: "Gurugram, Haryana",
    price: "₹12.8 Cr",
    agent: "Aarav Mehta",
    agentPhone: "+91 98100 12345",
    tag: "Private pool villa",
    image: "/images/prop-aravalli.png",
    imagePosition: "bg-left-top",
    bedrooms: 5,
    bathrooms: 6,
    area: "8,200 sq ft",
    lotSize: "14,500 sq ft",
    yearBuilt: "2022",
    description:
      "Perched amid the rolling Aravalli foothills, this contemporary villa redefines what luxury living means in the National Capital Region. The home is a seamless marriage of local stone and poured concrete, with double-height living spaces that open onto a sun-drenched infinity pool overlooking the ridge.",
    highlights: [
      "Infinity pool with Aravalli ridge panorama",
      "Double-height great room with bespoke joinery",
      "Private home theatre (12-seat)",
      "Wine cellar and tasting lounge",
      "Landscaped courtyard garden",
      "Four-car underground garage",
    ],
    galleryPositions: [
      "bg-left-top",
      "bg-right-top",
      "bg-left-bottom",
      "bg-right-bottom",
      "bg-center",
      "bg-right",
    ],
  },
  {
    id: "juhu-sea-pearl",
    name: "Juhu Sea Pearl",
    location: "Mumbai, Maharashtra",
    price: "₹22.4 Cr",
    agent: "Priya Nair",
    agentPhone: "+91 98200 23456",
    tag: "Sea-facing duplex",
    image: "/images/prop-juhu.png",
    imagePosition: "bg-right-top",
    bedrooms: 4,
    bathrooms: 5,
    area: "6,800 sq ft",
    lotSize: "N/A (penthouse)",
    yearBuilt: "2021",
    description:
      "An uncompromising sea-facing duplex on Juhu's most coveted address. Designed by an award-winning Mumbai studio, the residence captures the Arabian Sea on three sides. Floor-to-ceiling glass, travertine floors, and a rooftop plunge pool define a home that moves with the ocean light.",
    highlights: [
      "270° Arabian Sea views",
      "Rooftop plunge pool & sky lounge",
      "Integrated smart home (Crestron)",
      "Private elevator with biometric access",
      "Designer kitchen (Bulthaup)",
      "Walk-in wardrobes with climate control",
    ],
    galleryPositions: [
      "bg-right-top",
      "bg-left-top",
      "bg-center",
      "bg-left-bottom",
      "bg-right-bottom",
      "bg-right",
    ],
  },
  {
    id: "indiranagar-sky-house",
    name: "Indiranagar Sky House",
    location: "Bengaluru, Karnataka",
    price: "₹8.6 Cr",
    agent: "Rohan Iyer",
    agentPhone: "+91 98300 34567",
    tag: "Penthouse residence",
    image: "/images/prop-sky-house.png",
    imagePosition: "bg-left-bottom",
    bedrooms: 3,
    bathrooms: 4,
    area: "4,500 sq ft",
    lotSize: "N/A (penthouse)",
    yearBuilt: "2023",
    description:
      "Indiranagar's most sought-after penthouse commands an uninterrupted 180° view of Bengaluru's skyline and Ulsoor Lake. A single-floor residence with its own private terrace garden, outdoor kitchen, and a plunge pool suspended above the city.",
    highlights: [
      "Private terrace (1,200 sq ft) with outdoor kitchen",
      "Plunge pool with city panorama",
      "Lakeview from every bedroom",
      "Bespoke library and reading room",
      "Double-car dedicated parking",
      "Concierge & valet services",
    ],
    galleryPositions: [
      "bg-left-bottom",
      "bg-right-top",
      "bg-right-bottom",
      "bg-left-top",
      "bg-center",
      "bg-right",
    ],
  },
  {
    id: "alipore-garden-estate",
    name: "Alipore Garden Estate",
    location: "Kolkata, West Bengal",
    price: "₹10.9 Cr",
    agent: "Ananya Sen",
    agentPhone: "+91 98400 45678",
    tag: "Heritage garden home",
    image: "/images/prop-alipore.png",
    imagePosition: "bg-right-bottom",
    bedrooms: 6,
    bathrooms: 7,
    area: "9,400 sq ft",
    lotSize: "1.1 acres",
    yearBuilt: "1957 (restored 2020)",
    description:
      "One of Alipore's last great garden estates, lovingly restored by a National Award-winning conservation architect. The original 1950s structure retains its Italianate columns and wraparound verandahs, while the interiors have been entirely reimagined with contemporary materials that honour the heritage bones.",
    highlights: [
      "1.1-acre private garden with heritage banyan",
      "Restored colonial verandahs",
      "Swimming pool amid tropical landscaping",
      "Staff quarters (3 rooms)",
      "Teak-panelled library",
      "Cellar converted to temperature-controlled wine room",
    ],
    galleryPositions: [
      "bg-right-bottom",
      "bg-left-top",
      "bg-center",
      "bg-right-top",
      "bg-left-bottom",
      "bg-right",
    ],
  },
  {
    id: "ecr-azure-retreat",
    name: "ECR Azure Retreat",
    location: "Chennai, Tamil Nadu",
    price: "₹7.9 Cr",
    agent: "Vikram Rao",
    agentPhone: "+91 98500 56789",
    tag: "Coastal weekend estate",
    image: "/images/prop-ecr.png",
    imagePosition: "bg-center",
    bedrooms: 4,
    bathrooms: 5,
    area: "5,200 sq ft",
    lotSize: "1.2 acres",
    yearBuilt: "2020",
    description:
      "A barefoot-luxury coastal retreat on ECR's quietest stretch. Designed to dissolve the boundary between indoor and outdoor living, the home features wide covered verandahs, a 25-metre lap pool that runs parallel to the sea, and a private access path to the beach.",
    highlights: [
      "25-metre seafront lap pool",
      "Private beach access path",
      "Covered al-fresco dining pavilion",
      "Chef's kitchen with butler's pantry",
      "Solar-powered with battery backup",
      "Caretaker's cottage on site",
    ],
    galleryPositions: [
      "bg-center",
      "bg-left-top",
      "bg-right-top",
      "bg-left-bottom",
      "bg-right-bottom",
      "bg-right",
    ],
  },
  {
    id: "lutyens-court-residence",
    name: "Lutyens Court Residence",
    location: "New Delhi",
    price: "₹31 Cr",
    agent: "Kavya Malhotra",
    agentPhone: "+91 98600 67890",
    tag: "Ultra-prime apartment",
    image: "/images/prop-lutyens.png",
    imagePosition: "bg-right",
    bedrooms: 6,
    bathrooms: 8,
    area: "11,500 sq ft",
    lotSize: "N/A (full floor)",
    yearBuilt: "2019",
    description:
      "A full-floor ultra-prime apartment in the heart of Lutyens' Delhi — arguably the most exclusive address in the country. Commanding an entire floor of one of the Lutyen's Bungalow Zone's few modern residential towers, the home offers a scale and grandeur rarely available in the capital.",
    highlights: [
      "Entire floor (no shared walls)",
      "360° panoramic views of Lutyens' bungalow zone",
      "Private roof-deck with plunge pool (800 sq ft)",
      "Panic room & perimeter security system",
      "8-car basement parking allocation",
      "Direct access to 5-star hotel amenities",
    ],
    galleryPositions: [
      "bg-right",
      "bg-left-top",
      "bg-right-top",
      "bg-center",
      "bg-left-bottom",
      "bg-right-bottom",
    ],
  },
];

export function getPropertyById(id: string): Property | undefined {
  return properties.find((p) => p.id === id);
}
