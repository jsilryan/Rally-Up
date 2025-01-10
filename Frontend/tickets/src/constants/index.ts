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

interface Ticket {
  name: string;
  price: number;
  quantity: number;
}

export interface eventFromServer{
  id: string;
  hostUsername: string;
  hostID: string | null;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  bannerPic: string;
  gallery: string[];
  tickets: Ticket[];
}

// Define the name for event data
export interface CustomEvent {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  bannerPic: string;
  tickets: Ticket[];
  company: string;
  description: string;
  link: string; // Dynamically generated link for the event
}

// Function to generate a link from the event name
function generateLink(eventName: string): string {
  return `/events/${eventName.toLowerCase().replace(/\s+/g, '-')}`;
}

export const convertIndividualEventData = (event: eventFromServer): CustomEvent => {
    // Split startDate and endDate into date and time
    const [startDate, startTime] = event.startDate.split('T');
    const [endDate, endTime] = event.endDate.split('T');

    // Dynamically generate the link (example: convert name to a URL-friendly format)
    const generateLink = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

    return {
      id: event.id, // Convert id to number
      name: event.name,
      location: event.location,
      startDate, // Date part
      endDate,   // Date part
      startTime, // Time part
      endTime,   // Time part
      bannerPic: event.bannerPic,
      tickets: event.tickets,
      company: event.hostUsername, // Assuming hostUsername is the company
      description: event.description,
      link: generateLink(event.name), // Generate link from event name
    };
  
};

export const convertEventData = (data: eventFromServer[]): CustomEvent[] => {
  return data.map((event) => {
    // Split startDate and endDate into date and time
    const [startDate, startTime] = event.startDate.split('T');
    const [endDate, endTime] = event.endDate.split('T');

    // Dynamically generate the link (example: convert name to a URL-friendly format)
    const generateLink = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

    return {
      id: event.id, // Convert id to number
      name: event.name,
      location: event.location,
      startDate, // Date part
      endDate,   // Date part
      startTime, // Time part
      endTime,   // Time part
      bannerPic: event.bannerPic,
      tickets: event.tickets,
      company: event.hostUsername, // Assuming hostUsername is the company
      description: event.description,
      link: generateLink(event.name), // Generate link from event name
    };
  });
};

export const events: CustomEvent[] = [
  {
    id: "1",
    name: "Nairobi Tech Summit",
    location: "Nairobi, Kenya",
    startDate: "2024-12-12",
    endDate: "2024-12-12",
    startTime: "9:00 am",
    endTime: "5:00 pm", // Adjusted to represent an end time
    bannerPic: img_1,
    tickets: [
      { name: "Early Bird", price: 1000, quantity: 50 },
      { name: "Regular", price: 1500, quantity: 100 },
      { name: "VIP", price: 3000, quantity: 30 }
    ],
    company: "Tech Africa Solutions",
    description:
      "Join industry leaders and tech enthusiasts at the Nairobi Tech Summit. Discover the latest trends in technology, innovation, and digital transformation. A perfect event for networking and learning about emerging tech solutions.",
    link: generateLink("Nairobi Tech Summit"),
  },
  {
    id: "2",
    name: "Lamu Cultural Festival",
    location: "Lamu, Kenya",
    startDate: "2024-11-20",
    endDate: "2024-11-20",
    startTime: "10:00 am",
    endTime: "6:00 pm", // Adjusted to represent an end time
    bannerPic: img_2,
    tickets: [
      { name: "General Admission", price: 2000, quantity: 150 }
    ],
    company: "Lamu Tourism Board",
    description:
      "Experience the rich Swahili culture at the Lamu Cultural Festival. Enjoy traditional music, dance, dhow races, and cultural exhibitions in the beautiful coastal town of Lamu.",
    link: generateLink("Lamu Cultural Festival"),
  },
  {
    id: "3",
    name: "Mombasa Food Festival",
    location: "Mombasa, Kenya",
    startDate: "2024-11-25",
    endDate: "2024-11-25",
    startTime: "12:00 pm",
    endTime: "10:00 pm", // Adjusted to represent an end time
    bannerPic: img_3,
    tickets: [
      { name: "General Admission", price: 0, quantity: 200 }
    ],
    company: "Coastal Delights",
    description:
      "Indulge in a culinary journey at the Mombasa Food Festival. Sample a wide variety of local and international dishes, enjoy live cooking demos, and experience the vibrant food culture of the coast.",
    link: generateLink("Mombasa Food Festival"),
  },
  {
    id: "4",
    name: "Kisumu Music Concert",
    location: "Kisumu, Kenya",
    startDate: "2024-12-02",
    endDate: "2024-12-02",
    startTime: "6:30 pm",
    endTime: "10:30 pm", // Adjusted to represent an end time
    bannerPic: img_4,
    tickets: [
      { name: "Early Bird", price: 1000, quantity: 70 },
      { name: "Regular", price: 1500, quantity: 120 },
      { name: "VIP", price: 3000, quantity: 25 }
    ],
    company: "Lake Victoria Vibes",
    description:
      "Enjoy an evening of live performances from top local artists at the Kisumu Music Concert. Dance to the beats by Lake Victoria with stunning sunset views. A night to remember!",
    link: generateLink("Kisumu Music Concert"),
  },
  {
    id: "5",
    name: "Nakuru Wildlife Marathon",
    location: "Nakuru, Kenya",
    startDate: "2024-11-18",
    endDate: "2024-11-18",
    startTime: "6:00 am",
    endTime: "12:00 pm", // Adjusted to represent an end time
    bannerPic: img_5,
    tickets: [
      { name: "Standard Entry", price: 1500, quantity: 300 }
    ],
    company: "Run Wild Kenya",
    description:
      "Run for a cause at the Nakuru Wildlife Marathon. A unique marathon experience that takes you through scenic routes around Nakuru National Park, supporting wildlife conservation efforts.",
    link: generateLink("Nakuru Wildlife Marathon"),
  },
  {
    id: "6",
    name: "Eldoret Agribusiness Expo",
    location: "Eldoret, Kenya",
    startDate: "2024-11-30",
    endDate: "2024-11-30",
    startTime: "8:00 am",
    endTime: "5:00 pm", // Adjusted to represent an end time
    bannerPic: img_6,
    tickets: [
      { name: "General Admission", price: 0, quantity: 250 }
    ],
    company: "AgriGrowth Kenya",
    description:
      "Explore the latest innovations in agribusiness at the Eldoret Agribusiness Expo. Meet industry experts, discover new farming technologies, and learn about sustainable agricultural practices.",
    link: generateLink("Eldoret Agribusiness Expo"),
  },
  {
    id: "7",
    name: "Nanyuki Adventure Hike",
    location: "Nanyuki, Kenya",
    startDate: "2024-11-22",
    endDate: "2024-11-22",
    startTime: "7:00 am",
    endTime: "3:00 pm", // Adjusted to represent an end time
    bannerPic: img_7,
    tickets: [
      { name: "General Admission", price: 1000, quantity: 80 }
    ],
    company: "Kenya Trails",
    description:
      "Get your adrenaline pumping with the Nanyuki Adventure Hike. Trek through scenic trails, enjoy breathtaking views of Mount Kenya, and connect with fellow adventure enthusiasts.",
    link: generateLink("Nanyuki Adventure Hike"),
  },
  {
    id: "8",
    name: "Diani Beach Yoga Retreat",
    location: "Diani, Kenya",
    startDate: "2024-12-05",
    endDate: "2024-12-07", // Adjusted to represent a multi-day event
    startTime: "9:00 am",
    endTime: "5:00 pm", // Adjusted to represent an end time
    bannerPic: img_8,
    tickets: [
      { name: "Standard", price: 5000, quantity: 40 },
      { name: "VIP", price: 8000, quantity: 20 }
    ],
    company: "Serenity Wellness",
    description:
      "Unwind and rejuvenate at the Diani Beach Yoga Retreat. Enjoy daily yoga sessions, meditation on the beach, and holistic wellness workshops in a tranquil coastal setting.",
    link: generateLink("Diani Beach Yoga Retreat"),
  },
  {
    id: "9",
    name: "Karen Christmas Market",
    location: "Nairobi, Kenya",
    startDate: "2024-12-15",
    endDate: "2024-12-15",
    startTime: "10:00 am",
    endTime: "8:00 pm", // Adjusted to represent an end time
    bannerPic: img_9,
    tickets: [
      { name: "General Admission", price: 0, quantity: 400 }
    ],
    company: "Karen Traders Association",
    description:
      "Get into the festive spirit at the Karen Christmas Market. Shop for unique holiday gifts, enjoy delicious treats, and experience the joy of the season with family and friends.",
    link: generateLink("Karen Christmas Market"),
  },
  {
    id: "10",
    name: "Thika Art and Craft Fair",
    location: "Thika, Kenya",
    startDate: "2024-12-08",
    endDate: "2024-12-08",
    startTime: "11:00 am",
    endTime: "6:00 pm", // Adjusted to represent an end time
    bannerPic: img_10,
    tickets: [
      { name: "General Admission", price: 500, quantity: 120 }
    ],
    company: "Creative Kenya",
    description:
      "Celebrate creativity at the Thika Art and Craft Fair. Discover handmade crafts, paintings, sculptures, and more from talented local artists and artisans.",
    link: generateLink("Thika Art and Craft Fair"),
  },
];
