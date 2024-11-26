import { img_1, img_2, img_3, img_4, img_5, img_6, img_7, img_8, img_9, img_10 } from "../assets";

export const navLinks = [
    {
        id: "sign_up",
        title: "Sign Up",
        link: "/signup",
    },
    {
      id: "login",
      title: "Login",
      link: "/login"
  },
]

// Define the type for event data
export interface CustomEvent {
  id: number;
  name: string;
  city: string;
  country: string;
  date: string;
  time: string;
  cover_image: string;
  ticket_details: {
    type: string;
    price: number;
  }[];
  company: string;
  description?: string;
  link: string; // Dynamically generated link for the event
}

// Function to generate a link from the event name
function generateLink(eventName: string): string {
  return `/events/${eventName.toLowerCase().replace(/\s+/g, '-')}`;
}

export const events: CustomEvent[] = [
  {
    id: 1,
    name: "Nairobi Tech Summit",
    city: "Nairobi",
    country: "Kenya",
    date: "2024-12-12",
    time: "9:00 am",
    cover_image: img_1,
    ticket_details: [
      { type: "Early Bird", price: 1000 },
      { type: "Regular", price: 1500 },
      { type: "VIP", price: 3000 }
    ],
    company: "Tech Africa Solutions",
    description:
      "Join industry leaders and tech enthusiasts at the Nairobi Tech Summit. Discover the latest trends in technology, innovation, and digital transformation. A perfect event for networking and learning about emerging tech solutions.",
    link: generateLink("Nairobi Tech Summit") // Dynamically generated
  },
  {
    id: 2,
    name: "Lamu Cultural Festival",
    city: "Lamu",
    country: "Kenya",
    date: "2024-11-20",
    time: "10:00 am",
    cover_image: img_2,
    ticket_details: [
      { type: "General Admission", price: 2000 }
    ],
    company: "Lamu Tourism Board",
    description:
      "Experience the rich Swahili culture at the Lamu Cultural Festival. Enjoy traditional music, dance, dhow races, and cultural exhibitions in the beautiful coastal town of Lamu.",
    link: generateLink("Lamu Cultural Festival")
  },
  {
    id: 3,
    name: "Mombasa Food Festival",
    city: "Mombasa",
    country: "Kenya",
    date: "2024-11-25",
    time: "12:00 pm",
    cover_image: img_3,
    ticket_details: [
      { type: "General Admission", price: 0 }
    ],
    company: "Coastal Delights",
    description:
      "Indulge in a culinary journey at the Mombasa Food Festival. Sample a wide variety of local and international dishes, enjoy live cooking demos, and experience the vibrant food culture of the coast.",
    link: generateLink("Mombasa Food Festival")
  },
  {
    id: 4,
    name: "Kisumu Music Concert",
    city: "Kisumu",
    country: "Kenya",
    date: "2024-12-02",
    time: "6:30 pm",
    cover_image: img_4,
    ticket_details: [
      { type: "Early Bird", price: 1000 },
      { type: "Regular", price: 1500 },
      { type: "VIP", price: 3000 }
    ],
    company: "Lake Victoria Vibes",
    description:
      "Enjoy an evening of live performances from top local artists at the Kisumu Music Concert. Dance to the beats by Lake Victoria with stunning sunset views. A night to remember!",
    link: generateLink("Kisumu Music Concert")
  },
  {
    id: 5,
    name: "Nakuru Wildlife Marathon",
    city: "Nakuru",
    country: "Kenya",
    date: "2024-11-18",
    time: "6:00 am",
    cover_image: img_5,
    ticket_details: [
      { type: "Standard Entry", price: 1500 }
    ],
    company: "Run Wild Kenya",
    description:
      "Run for a cause at the Nakuru Wildlife Marathon. A unique marathon experience that takes you through scenic routes around Nakuru National Park, supporting wildlife conservation efforts.",
    link: generateLink("Nakuru Wildlife Marathon")
  },
  {
    id: 6,
    name: "Eldoret Agribusiness Expo",
    city: "Eldoret",
    country: "Kenya",
    date: "2024-11-30",
    time: "8:00 am",
    cover_image: img_6,
    ticket_details: [
      { type: "General Admission", price: 0 }
    ],
    company: "AgriGrowth Kenya",
    description:
      "Explore the latest innovations in agribusiness at the Eldoret Agribusiness Expo. Meet industry experts, discover new farming technologies, and learn about sustainable agricultural practices.",
    link: generateLink("Eldoret Agribusiness Expo")
  },
  {
    id: 7,
    name: "Nanyuki Adventure Hike",
    city: "Nanyuki",
    country: "Kenya",
    date: "2024-11-22",
    time: "7:00 am",
    cover_image: img_7,
    ticket_details: [
      { type: "General Admission", price: 1000 }
    ],
    company: "Kenya Trails",
    description:
      "Get your adrenaline pumping with the Nanyuki Adventure Hike. Trek through scenic trails, enjoy breathtaking views of Mount Kenya, and connect with fellow adventure enthusiasts.",
    link: generateLink("Nanyuki Adventure Hike")
  },
  {
    id: 8,
    name: "Diani Beach Yoga Retreat",
    city: "Diani",
    country: "Kenya",
    date: "2024-12-05",
    time: "9:00 am",
    cover_image: img_8,
    ticket_details: [
      { type: "Standard", price: 5000 },
      { type: "VIP", price: 8000 }
    ],
    company: "Serenity Wellness",
    description:
      "Unwind and rejuvenate at the Diani Beach Yoga Retreat. Enjoy daily yoga sessions, meditation on the beach, and holistic wellness workshops in a tranquil coastal setting.",
    link: generateLink("Diani Beach Yoga Retreat")
  },
  {
    id: 9,
    name: "Karen Christmas Market",
    city: "Nairobi",
    country: "Kenya",
    date: "2024-12-15",
    time: "10:00 am",
    cover_image: img_9,
    ticket_details: [
      { type: "General Admission", price: 0 }
    ],
    company: "Karen Traders Association",
    description:
      "Get into the festive spirit at the Karen Christmas Market. Shop for unique holiday gifts, enjoy delicious treats, and experience the joy of the season with family and friends.",
    link: generateLink("Karen Christmas Market")
  },
  {
    id: 10,
    name: "Thika Art and Craft Fair",
    city: "Thika",
    country: "Kenya",
    date: "2024-12-08",
    time: "11:00 am",
    cover_image: img_10,
    ticket_details: [
      { type: "General Admission", price: 500 }
    ],
    company: "Creative Kenya",
    description:
      "Celebrate creativity at the Thika Art and Craft Fair. Discover handmade crafts, paintings, sculptures, and more from talented local artists and artisans.",
    link: generateLink("Thika Art and Craft Fair")
  }
];
