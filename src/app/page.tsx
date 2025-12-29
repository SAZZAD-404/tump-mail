"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { 
  RefreshCw, 
  Trash2, 
  Copy, 
  ArrowLeft, 
  Mail, 
  Moon, 
  Sun,
  Inbox,
  Check,
  ChevronDown,
  History,
  ShieldCheck,
  Search, 
  Settings,
  Star,
  Menu,
  ChevronLeft,
  ChevronRight,
  Plus,
  Globe,
  User,
  Zap,
  MapPin,
  Lock,
  Phone,
  Calendar,
  Building,
  CreditCard,
  Eye,
  EyeOff,
  Sparkles,
  Shield,
  Download,
  Share2,
  ExternalLink,
  Fingerprint,
  Terminal,
  Cpu,
    Activity,
    Layers,
  Hash,
  X,
  Clock,
  ArrowRight,
  ShieldEllipsis,
  Edit3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const MAIL_TM_API = "https://api.mail.tm";
const BARID_API = "https://api.barid.site";
const SEC_MAIL_API = "https://www.1secmail.com/api/v1/";

type ProviderType = "mailtm" | "barid" | "1secmail";
type EmailFormat = "default" | "professional" | "special" | "short" | "mix" | "custom";

const FALLBACK_DOMAINS: { domain: string; provider: ProviderType }[] = [
  { domain: "barid.site", provider: "barid" },
  { domain: "1secmail.com", provider: "1secmail" },
  { domain: "1secmail.org", provider: "1secmail" },
];

const COUNTRIES = [
  { name: "USA", flag: "🇺🇸", code: "US", firstNames: ["James", "Mary", "Robert", "Patricia", "Michael", "Jennifer", "William", "Elizabeth", "David", "Linda", "Christopher", "Sarah", "Daniel", "Jessica", "Matthew", "Ashley", "Anthony", "Emily", "Joshua", "Megan"], lastNames: ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Martinez", "Anderson", "Taylor", "Thomas", "Moore", "Jackson", "Martin"], cities: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego"], streets: ["Main St", "Oak Ave", "Maple Dr", "Cedar Ln", "Pine Blvd", "Elm St", "Washington Ave"], zip: "10001" },
  { name: "Denmark", flag: "🇩🇰", code: "DK", firstNames: ["Lucas", "Noah", "Victor", "Emma", "Alma", "Clara", "Oscar", "Sofia", "William", "Freja", "Emil", "Ida", "Frederik", "Anna", "Oliver", "Ella"], lastNames: ["Nielsen", "Jensen", "Hansen", "Pedersen", "Andersen", "Larsen", "Sørensen", "Rasmussen", "Jørgensen", "Petersen"], cities: ["Copenhagen", "Aarhus", "Odense", "Aalborg", "Esbjerg", "Randers"], streets: ["Østergade", "Nørregade", "Vestergade", "Søndergade", "Hovedgaden", "Strandvejen"], zip: "1000" },
  { name: "Finland", flag: "🇫🇮", code: "FI", firstNames: ["Onni", "Leo", "Elias", "Aino", "Olivia", "Venla", "Eino", "Lilja", "Väinö", "Helmi", "Noel", "Sofia", "Oliver", "Ella", "Eetu", "Emma"], lastNames: ["Korhonen", "Virtanen", "Mäkinen", "Nieminen", "Mäkelä", "Hämäläinen", "Laine", "Heikkinen", "Koskinen", "Järvinen"], cities: ["Helsinki", "Espoo", "Tampere", "Vantaa", "Oulu", "Turku"], streets: ["Mannerheimintie", "Aleksanterinkatu", "Esplanadi", "Hämeentie", "Kaivokatu"], zip: "00100" },
  { name: "Norway", flag: "🇳🇴", code: "NO", firstNames: ["Jakob", "Emil", "Noah", "Sofie", "Nora", "Emma", "Olav", "Astrid", "Magnus", "Ingrid", "Aksel", "Maja", "Henrik", "Emilie", "Theodor", "Leah"], lastNames: ["Olsen", "Hansen", "Johansen", "Larsen", "Nilsen", "Bakke", "Andersen", "Sørensen", "Eriksen", "Berg"], cities: ["Oslo", "Bergen", "Trondheim", "Stavanger", "Drammen", "Tromsø"], streets: ["Karl Johans gate", "Bogstadveien", "Aker Brygge", "Majorstuen", "Grünerløkka"], zip: "0150" },
  { name: "Sweden", flag: "🇸🇪", code: "SE", firstNames: ["Hugo", "William", "Liam", "Alice", "Maja", "Elsa", "Oscar", "Astrid", "Elias", "Ebba", "Lucas", "Wilma", "Oliver", "Olivia", "Noah", "Saga"], lastNames: ["Andersson", "Johansson", "Karlsson", "Nilsson", "Eriksson", "Larsson", "Olsson", "Persson", "Svensson", "Gustafsson"], cities: ["Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås", "Örebro"], streets: ["Drottninggatan", "Vasagatan", "Kungsgatan", "Sveavägen", "Storgatan"], zip: "111 20" },
  { name: "France", flag: "🇫🇷", code: "FR", firstNames: ["Gabriel", "Léo", "Raphaël", "Emma", "Jade", "Louise", "Arthur", "Alice", "Lucas", "Lina", "Hugo", "Chloé", "Louis", "Manon", "Nathan", "Léa"], lastNames: ["Martin", "Bernard", "Thomas", "Petit", "Robert", "Richard", "Durand", "Dubois", "Moreau", "Laurent", "Simon", "Michel"], cities: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg"], streets: ["Rue de la Paix", "Avenue des Champs-Élysées", "Rue de Rivoli", "Boulevard Haussmann", "Rue du Faubourg"], zip: "75001" },
  { name: "Japan", flag: "🇯🇵", code: "JP", firstNames: ["Ren", "Haruto", "Itsuki", "Himari", "Akari", "Ichika", "Minato", "Yua", "Kaito", "Sakura", "Sota", "Mei", "Yuto", "Hana", "Riku", "Aoi"], lastNames: ["Sato", "Suzuki", "Takahashi", "Tanaka", "Watanabe", "Ito", "Yamamoto", "Nakamura", "Kobayashi", "Kato", "Yoshida", "Yamada"], cities: ["Tokyo", "Osaka", "Kyoto", "Nagoya", "Sapporo", "Fukuoka", "Kobe"], streets: ["Chuo-dori", "Takeshita Street", "Nakamise", "Omotesando", "Ginza-dori"], zip: "100-0001" },
  { name: "UK", flag: "🇬🇧", code: "GB", firstNames: ["Oliver", "Olivia", "George", "Amelia", "Harry", "Isla", "Jack", "Emily", "Charlie", "Ava", "Noah", "Sophia", "Leo", "Mia", "Thomas", "Grace"], lastNames: ["Smith", "Jones", "Taylor", "Brown", "Williams", "Wilson", "Johnson", "Davies", "Robinson", "Wright", "Thompson", "Evans"], cities: ["London", "Birmingham", "Manchester", "Liverpool", "Leeds", "Glasgow", "Edinburgh"], streets: ["High Street", "Station Road", "Church Lane", "Park Avenue", "Mill Lane", "Victoria Road"], zip: "SW1A 1AA" },
  { name: "Bangladesh", flag: "🇧🇩", code: "BD", firstNames: ["Arif", "Sadia", "Tanvir", "Nusrat", "Fahim", "Tasnim", "Rakib", "Maliha", "Rifat", "Jannatul", "Sabbir", "Farzana", "Mehedi", "Naima", "Shakil", "Sumaiya"], lastNames: ["Ahmed", "Rahman", "Islam", "Khan", "Hossain", "Chowdhury", "Akter", "Begum", "Uddin", "Ali", "Hassan", "Miah"], cities: ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Comilla", "Gazipur"], streets: ["Mirpur Road", "Dhanmondi", "Gulshan Ave", "Banani Road", "Uttara Sector", "Motijheel"], zip: "1205" },
  { name: "Germany", flag: "🇩🇪", code: "DE", firstNames: ["Ben", "Emma", "Paul", "Mia", "Leon", "Hannah", "Finn", "Sophia", "Noah", "Emilia", "Elias", "Marie", "Louis", "Anna", "Felix", "Lena"], lastNames: ["Müller", "Schmidt", "Schneider", "Fischer", "Weber", "Meyer", "Wagner", "Becker", "Schulz", "Hoffmann", "Schäfer", "Koch"], cities: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne", "Stuttgart", "Düsseldorf"], streets: ["Hauptstraße", "Bahnhofstraße", "Berliner Straße", "Goethestraße", "Schillerstraße"], zip: "10115" },
  { name: "Italy", flag: "🇮🇹", code: "IT", firstNames: ["Leonardo", "Sofia", "Francesco", "Aurora", "Alessandro", "Giulia", "Lorenzo", "Ginevra", "Mattia", "Alice", "Andrea", "Emma", "Gabriele", "Chiara", "Riccardo", "Martina"], lastNames: ["Rossi", "Russo", "Ferrari", "Esposito", "Bianchi", "Romano", "Colombo", "Ricci", "Marino", "Greco", "Bruno", "Gallo"], cities: ["Rome", "Milan", "Naples", "Turin", "Florence", "Venice", "Bologna"], streets: ["Via Roma", "Via Garibaldi", "Via Dante", "Corso Italia", "Via Mazzini"], zip: "00100" },
  { name: "Spain", flag: "🇪🇸", code: "ES", firstNames: ["Hugo", "Lucía", "Martín", "Sofía", "Lucas", "María", "Mateo", "Martina", "Leo", "Paula", "Daniel", "Valeria", "Pablo", "Emma", "Alejandro", "Julia"], lastNames: ["García", "Rodríguez", "Martínez", "López", "González", "Hernández", "Pérez", "Sánchez", "Romero", "Torres", "Álvarez", "Ruiz"], cities: ["Madrid", "Barcelona", "Valencia", "Seville", "Bilbao", "Málaga", "Zaragoza"], streets: ["Calle Mayor", "Gran Vía", "Paseo de Gracia", "Avenida de la Constitución", "Rambla"], zip: "28001" },
  { name: "India", flag: "🇮🇳", code: "IN", firstNames: ["Aarav", "Aanya", "Vihaan", "Saanvi", "Aditya", "Ananya", "Arjun", "Diya", "Reyansh", "Myra", "Sai", "Isha", "Krishna", "Priya", "Rohan", "Neha"], lastNames: ["Sharma", "Verma", "Gupta", "Singh", "Kumar", "Patel", "Shah", "Joshi", "Reddy", "Nair", "Iyer", "Agarwal"], cities: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune"], streets: ["MG Road", "FC Road", "Linking Road", "Brigade Road", "Anna Salai"], zip: "400001" },
  { name: "Canada", flag: "🇨🇦", code: "CA", firstNames: ["Liam", "Olivia", "Noah", "Emma", "William", "Charlotte", "Oliver", "Amelia", "Benjamin", "Ava", "Elijah", "Sophia", "James", "Isabella", "Lucas", "Mia"], lastNames: ["Smith", "Brown", "Tremblay", "Martin", "Roy", "Wilson", "MacDonald", "Taylor", "Campbell", "Anderson", "Jones", "Thompson"], cities: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton", "Winnipeg"], streets: ["Main Street", "Queen Street", "King Street", "Yonge Street", "Bloor Street"], zip: "M5V 1A1" },
  { name: "Australia", flag: "🇦🇺", code: "AU", firstNames: ["Oliver", "Charlotte", "Noah", "Olivia", "Jack", "Amelia", "William", "Isla", "Leo", "Mia", "Henry", "Ava", "Charlie", "Grace", "Thomas", "Ella"], lastNames: ["Smith", "Jones", "Williams", "Brown", "Wilson", "Taylor", "Johnson", "White", "Martin", "Anderson", "Thompson", "Nguyen"], cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra"], streets: ["George Street", "Collins Street", "Queen Street", "Pitt Street", "Bourke Street"], zip: "2000" },
  { name: "Brazil", flag: "🇧🇷", code: "BR", firstNames: ["Miguel", "Alice", "Arthur", "Sophia", "Gael", "Helena", "Heitor", "Valentina", "Theo", "Laura", "Davi", "Isabella", "Gabriel", "Manuela", "Bernardo", "Júlia"], lastNames: ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes", "Costa", "Ribeiro"], cities: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", "Belo Horizonte", "Curitiba"], streets: ["Avenida Paulista", "Rua Augusta", "Avenida Atlântica", "Rua Oscar Freire", "Avenida Brasil"], zip: "01310-100" },
  { name: "Netherlands", flag: "🇳🇱", code: "NL", firstNames: ["Noah", "Emma", "Liam", "Julia", "Lucas", "Sophie", "Finn", "Mila", "Sem", "Tess", "Milan", "Zoë", "Daan", "Sara", "Jesse", "Anna"], lastNames: ["de Jong", "Jansen", "de Vries", "van den Berg", "van Dijk", "Bakker", "Janssen", "Visser", "Smit", "Meijer", "de Graaf", "Mulder"], cities: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Groningen", "Tilburg"], streets: ["Kalverstraat", "Damrak", "Leidsestraat", "Reguliersbreestraat", "Nieuwendijk"], zip: "1012" },
  { name: "South Korea", flag: "🇰🇷", code: "KR", firstNames: ["Minjun", "Seo-yeon", "Seo-jun", "Ji-woo", "Do-yun", "Seo-yun", "Ye-jun", "Ha-yoon", "Si-woo", "Ha-eun", "Joo-won", "Ji-yoo", "Ha-jun", "Yun-seo", "Jun-seo", "Chae-won"], lastNames: ["Kim", "Lee", "Park", "Choi", "Jung", "Kang", "Cho", "Yoon", "Jang", "Lim", "Han", "Oh"], cities: ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju", "Suwon"], streets: ["Gangnam-daero", "Teheran-ro", "Sejong-daero", "Myeongdong-gil", "Hongdae-ro"], zip: "04524" },
  { name: "Russia", flag: "🇷🇺", code: "RU", firstNames: ["Alexander", "Sofia", "Mikhail", "Maria", "Maxim", "Anna", "Artem", "Victoria", "Dmitry", "Anastasia", "Ivan", "Daria", "Nikita", "Polina", "Kirill", "Elizabeth"], lastNames: ["Ivanov", "Smirnov", "Kuznetsov", "Popov", "Vasiliev", "Petrov", "Sokolov", "Mikhailov", "Novikov", "Fedorov", "Morozov", "Volkov"], cities: ["Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg", "Kazan", "Nizhny Novgorod", "Samara"], streets: ["Tverskaya Street", "Nevsky Prospekt", "Arbat Street", "Kutuzovsky Prospekt", "Leninsky Prospekt"], zip: "101000" },
  { name: "Mexico", flag: "🇲🇽", code: "MX", firstNames: ["Santiago", "Valentina", "Mateo", "Sofía", "Sebastián", "Regina", "Leonardo", "Renata", "Emiliano", "María", "Diego", "Camila", "Daniel", "Ximena", "Miguel", "Isabella"], lastNames: ["García", "Hernández", "Martínez", "López", "González", "Rodríguez", "Pérez", "Sánchez", "Ramírez", "Torres", "Flores", "Rivera"], cities: ["Mexico City", "Guadalajara", "Monterrey", "Cancun", "Puebla", "Tijuana", "León"], streets: ["Paseo de la Reforma", "Avenida Insurgentes", "Calle Madero", "Avenida Juárez", "Calle 5 de Mayo"], zip: "06600" },
];

const EMAIL_FORMATS: { id: EmailFormat; label: string; example: string }[] = [
  { id: "default", label: "Standard (name + surname + numbers)", example: "johndoe123" },
  { id: "professional", label: "Professional (firstname.lastname)", example: "john.doe" },
  { id: "special", label: "Special (with special chars)", example: "john_doe-99" },
  { id: "short", label: "Short (shorter format)", example: "jd99" },
  { id: "mix", label: "Mix (mixed styles)", example: "j.doe_88" },
  { id: "custom", label: "Custom (choose your prefix)", example: "myname" },
];

type Identity = {
  firstName: string;
  lastName: string;
  country: string;
  flag: string;
  code: string;
};

type FakeProfile = {
  username: string;
  password: string;
  address: string;
  city: string;
  zip: string;
  phone: string;
  dob: string;
  ssn: string;
};

type Message = {
  id: string;
  from: string;
  subject: string;
  intro: string;
  createdAt: string;
  seen: boolean;
};

type MessageDetail = Message & {
  text: string;
  html: string;
};

type EmailAccount = {
  address: string;
  token?: string; 
  accountId?: string;
  provider: ProviderType;
};

export default function TTOTumpMail() {
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<"inbox" | "profile" | "history">("inbox");
  const [selectedMessage, setSelectedMessage] = useState<MessageDetail | null>(null);
  const [emailData, setEmailData] = useState<EmailAccount | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [domains, setDomains] = useState<{ domain: string; provider: ProviderType }[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<{ domain: string; provider: ProviderType } | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [fakeProfile, setFakeProfile] = useState<FakeProfile | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [history, setHistory] = useState<EmailAccount[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFormat, setEmailFormat] = useState<EmailFormat>("default");
  const [customPrefix, setCustomPrefix] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("USA");
  const [searchQuery, setSearchQuery] = useState("");

  const inboxRef = useRef<NodeJS.Timeout | null>(null);

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem("tto_theme", next ? "dark" : "light");
    if (next) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  const randomString = (length: number, chars = "abcdefghijklmnopqrstuvwxyz0123456789") => {
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
  };

  const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  const generateFakeProfile = useCallback((id: Identity, countryData: typeof COUNTRIES[0]): FakeProfile => {
    const streetNum = randomNumber(1, 9999);
    const street = countryData.streets[Math.floor(Math.random() * countryData.streets.length)];
    const city = countryData.cities[Math.floor(Math.random() * countryData.cities.length)];
    const year = randomNumber(1970, 2003);
    const month = String(randomNumber(1, 12)).padStart(2, '0');
    const day = String(randomNumber(1, 28)).padStart(2, '0');
    
    return {
      username: `${id.firstName.toLowerCase()}${id.lastName.toLowerCase()}${randomNumber(10, 99)}`,
      password: `${id.firstName.charAt(0).toUpperCase()}${id.lastName.toLowerCase()}@${randomNumber(100, 999)}!`,
      address: `${streetNum} ${street}`,
      city: city,
      zip: countryData.zip || String(randomNumber(1000, 9999)),
      phone: `+${randomNumber(1, 99)} ${randomNumber(100, 999)}-${randomNumber(1000, 9999)}`,
      dob: `${year}-${month}-${day}`,
      ssn: `${randomNumber(100, 999)}-${randomNumber(10, 99)}-${randomNumber(1000, 9999)}`
    };
  }, []);

  const generateIdentity = useCallback((countryName?: string) => {
    const country = (countryName || selectedCountry)
      ? COUNTRIES.find(c => c.name === (countryName || selectedCountry)) || COUNTRIES[0]
      : COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    
    const firstName = country.firstNames[Math.floor(Math.random() * country.firstNames.length)];
    const lastName = country.lastNames[Math.floor(Math.random() * country.lastNames.length)];
    
    const newIdentity: Identity = { firstName, lastName, country: country.name, flag: country.flag, code: country.code };
    setIdentity(newIdentity);
    setFakeProfile(generateFakeProfile(newIdentity, country));
    return newIdentity;
  }, [generateFakeProfile, selectedCountry]);

  const fetchAllDomains = useCallback(async () => {
    try {
      const results = await Promise.allSettled([
        fetch(`${MAIL_TM_API}/domains`).then(r => r.ok ? r.json() : null),
        fetch(`${BARID_API}/domains`).then(r => r.ok ? r.json() : null),
        fetch(`${SEC_MAIL_API}?action=getDomainList`).then(r => r.ok ? r.json() : null)
      ]);

      const allDomains: { domain: string; provider: ProviderType }[] = [];
      if (results[0].status === "fulfilled" && results[0].value) {
        results[0].value["hydra:member"]?.forEach((d: any) => allDomains.push({ domain: d.domain, provider: "mailtm" }));
      }
      if (results[1].status === "fulfilled" && results[1].value?.success) {
        results[1].value.result.forEach((d: string) => allDomains.push({ domain: d, provider: "barid" }));
      }
      if (results[2].status === "fulfilled" && Array.isArray(results[2].value)) {
        results[2].value.forEach((d: string) => allDomains.push({ domain: d, provider: "1secmail" }));
      }

      const uniqueDomains = allDomains.length > 0 ? allDomains : FALLBACK_DOMAINS;
      setDomains(uniqueDomains);
      return uniqueDomains;
    } catch {
      setDomains(FALLBACK_DOMAINS);
      return FALLBACK_DOMAINS;
    }
  }, []);

  const normalizeString = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "");
  };

  const getNewEmail = useCallback(async (domain?: { domain: string; provider: ProviderType }, targetId?: Identity) => {
    setIsLoadingEmail(true);
    try {
      let currentDomains = domains;
      if (currentDomains.length === 0) currentDomains = await fetchAllDomains();
      const activeDomain = domain || selectedDomain || currentDomains[0];
      const activeId = targetId || identity || generateIdentity();
      
      const fn = normalizeString(activeId.firstName).toLowerCase();
      const ln = normalizeString(activeId.lastName).toLowerCase();
      
      let userPart = "";
      switch (emailFormat) {
        case "professional":
          userPart = `${fn}.${ln}`;
          break;
        case "special":
          userPart = `${fn}_${ln}-${randomNumber(10, 99)}`;
          break;
        case "short":
          userPart = `${fn[0]}${ln[0]}${randomNumber(10, 999)}`;
          break;
        case "mix":
          userPart = `${fn[0]}.${ln}_${randomNumber(10, 99)}`;
          break;
        case "custom":
          userPart = customPrefix ? normalizeString(customPrefix).toLowerCase() : `${fn}${ln}${randomNumber(100, 999)}`;
          break;
        default:
          userPart = `${fn}${ln}${randomNumber(100, 999)}`;
      }
      
      const address = `${userPart}@${activeDomain.domain}`;
      const password = randomString(12);

      let newAccount: EmailAccount = { address, provider: activeDomain.provider };

      if (activeDomain.provider === "mailtm") {
        const createRes = await fetch(`${MAIL_TM_API}/accounts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, password }),
        });
        if (createRes.ok) {
          const accountData = await createRes.json();
          const tokenRes = await fetch(`${MAIL_TM_API}/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address, password }),
          });
          const tokenData = await tokenRes.json();
          newAccount = { address, token: tokenData.token, accountId: accountData.id, provider: "mailtm" };
        }
      }

      setEmailData(newAccount);
      setSelectedDomain(activeDomain);
      setMessages([]);
      setSelectedMessage(null);
      setHistory(prev => {
        const updated = [newAccount, ...prev.filter(h => h.address !== address)].slice(0, 20);
        localStorage.setItem("tto_history", JSON.stringify(updated));
        return updated;
      });
      toast.success("Identity Refreshed");
    } catch {
      toast.error("Generation Failed");
    } finally {
      setIsLoadingEmail(false);
    }
  }, [domains, selectedDomain, identity, generateIdentity, fetchAllDomains, emailFormat, customPrefix]);

  const checkInbox = useCallback(async () => {
    if (!emailData || isRefreshing) return;
    setIsRefreshing(true);
    try {
      if (emailData.provider === "mailtm") {
        const res = await fetch(`${MAIL_TM_API}/messages`, {
          headers: { Authorization: `Bearer ${emailData.token}` },
        });
        const data = await res.json();
        setMessages(data["hydra:member"].map((m: any) => ({
          id: m.id, from: m.from.address, subject: m.subject || "(No Subject)", 
          intro: m.intro || "", createdAt: m.createdAt, seen: m.seen 
        })));
      } else if (emailData.provider === "barid") {
        const res = await fetch(`${BARID_API}/emails/${emailData.address}`);
        const data = await res.json();
        if (data.success) {
          setMessages(data.result.map((m: any) => ({
            id: m.id, from: m.from_address, subject: m.subject || "(No Subject)",
            intro: "", createdAt: new Date(m.received_at * 1000).toISOString(), seen: false
          })));
        }
      } else if (emailData.provider === "1secmail") {
        const [login, domain] = emailData.address.split("@");
        const res = await fetch(`${SEC_MAIL_API}?action=getMessages&login=${login}&domain=${domain}`);
        const data = await res.json();
        setMessages(data.map((m: any) => ({
          id: m.id.toString(), from: m.from, subject: m.subject || "(No Subject)",
          intro: "", createdAt: m.date, seen: false
        })));
      }
    } catch {
    } finally {
      setIsRefreshing(false);
    }
  }, [emailData, isRefreshing]);

  const openEmail = async (id: string) => {
    if (!emailData) return;
    const loadingToast = toast.loading("Securely fetching message...");
    try {
      let detail: MessageDetail | null = null;
      if (emailData.provider === "mailtm") {
        const res = await fetch(`${MAIL_TM_API}/messages/${id}`, {
          headers: { Authorization: `Bearer ${emailData.token}` },
        });
        const data = await res.json();
        detail = { ...data, from: data.from.address, html: data.html[0] || data.text };
      } else if (emailData.provider === "barid") {
        const res = await fetch(`${BARID_API}/inbox/${id}`);
        const data = await res.json();
        if (data.success) {
          const m = data.result;
          detail = { id: m.id, from: m.from_address, subject: m.subject, intro: "", 
                    createdAt: new Date(m.received_at * 1000).toISOString(), seen: true, 
                    text: m.text_content, html: m.html_content || m.text_content };
        }
      } else if (emailData.provider === "1secmail") {
        const [login, domain] = emailData.address.split("@");
        const res = await fetch(`${SEC_MAIL_API}?action=readMessage&login=${login}&domain=${domain}&id=${id}`);
        const data = await res.json();
        detail = { id: data.id.toString(), from: data.from, subject: data.subject, intro: "",
                  createdAt: data.date, seen: true, text: data.textBody, html: data.htmlBody || data.textBody };
      }
      if (detail) setSelectedMessage(detail);
      toast.dismiss(loadingToast);
    } catch {
      toast.error("Failed to decrypt message");
      toast.dismiss(loadingToast);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const savedHistory = localStorage.getItem("tto_history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    const savedTheme = localStorage.getItem("tto_theme");
    if (savedTheme === "light") {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
    fetchAllDomains().then(doms => {
      const firstD = doms.find(d => d.provider === 'barid') || doms[0];
      setSelectedDomain(firstD);
      getNewEmail(firstD);
    });
  }, []);

  useEffect(() => {
    if (emailData) {
      inboxRef.current = setInterval(checkInbox, 8000);
      return () => { if (inboxRef.current) clearInterval(inboxRef.current); };
    }
  }, [emailData, checkInbox]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const formatDate = (dateStr: string) => {
    if (!isMounted) return "...";
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredMessages = messages.filter(m => 
    m.from.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerateEmail = () => {
    const newIdentity = generateIdentity();
    getNewEmail(undefined, newIdentity);
  };

  if (!isMounted) return null;

  return (
    <div className={`min-h-[100dvh] font-sans transition-colors duration-500 selection:bg-indigo-500/30 ${isDarkMode ? "bg-[#050507] text-slate-100" : "bg-[#fcfdfe] text-slate-900"}`}>
      <Toaster position="top-right" richColors theme={isDarkMode ? "dark" : "light"} />

      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-60">
        <div className={`absolute -top-[25%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[140px] transition-colors duration-1000 ${isDarkMode ? "bg-indigo-900/40" : "bg-indigo-200/50"}`} />
        <div className={`absolute top-[10%] -right-[5%] w-[40%] h-[50%] rounded-full blur-[120px] transition-colors duration-1000 ${isDarkMode ? "bg-blue-900/30" : "bg-blue-100/40"}`} />
        <div className={`absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full blur-[130px] transition-colors duration-1000 ${isDarkMode ? "bg-violet-900/20" : "bg-violet-100/30"}`} />
      </div>

      <div className="relative z-10 flex flex-col min-h-[100dvh]">
        <header className={`shrink-0 h-14 sm:h-16 px-3 sm:px-6 flex items-center justify-between border-b backdrop-blur-2xl sticky top-0 z-40 ${isDarkMode ? "bg-black/40 border-white/5" : "bg-white/70 border-slate-200/60"}`}>
          <div className="flex items-center gap-2 sm:gap-4">
            <motion.div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => { setActiveView("inbox"); setSelectedMessage(null); }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-indigo-600" : "bg-indigo-500"}`}>
                  <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
              </div>
              <span className="text-sm sm:text-base font-bold tracking-tight">TTO <span className="text-indigo-500">MAIL</span></span>
            </motion.div>
            
            <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/5">
              <NavTab active={activeView === "inbox"} onClick={() => { setActiveView("inbox"); setSelectedMessage(null); }} icon={<Inbox className="h-3.5 w-3.5" />} label="Inbox" count={messages.length} />
              <NavTab active={activeView === "profile"} onClick={() => setActiveView("profile")} icon={<Fingerprint className="h-3.5 w-3.5" />} label="Profile" />
              <NavTab active={activeView === "history"} onClick={() => setActiveView("history")} icon={<Activity className="h-3.5 w-3.5" />} label="History" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5">
              <Button variant="ghost" size="icon" onClick={() => checkInbox()} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-white/10 active:bg-white/20">
                <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-white/10 active:bg-white/20">
                {isDarkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              </Button>
            </div>
            
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden w-9 h-9 rounded-lg bg-white/5 active:bg-white/10">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <AnimatePresence>
            {(sidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
              <motion.aside 
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={`fixed lg:relative z-50 lg:z-auto w-[280px] sm:w-[300px] h-full top-0 left-0 flex flex-col p-4 gap-4 border-r backdrop-blur-xl overflow-y-auto ${isDarkMode ? "bg-black/90 lg:bg-black/20 border-white/5" : "bg-white/95 lg:bg-white/30 border-slate-200/50"}`}
              >
                <div className="flex items-center justify-between lg:hidden mb-2">
                  <span className="text-sm font-bold">Settings</span>
                  <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="w-8 h-8 rounded-lg">
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <Button 
                  onClick={handleGenerateEmail}
                  disabled={isLoadingEmail}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-500/30 gap-2 border border-white/20 active:scale-[0.98]"
                >
                  {isLoadingEmail ? <RefreshCw className="h-4 w-4 animate-spin" /> : <><Sparkles className="h-4 w-4" /> Generate Email</>}
                </Button>

                <div className={`p-4 rounded-xl border ${isDarkMode ? "bg-white/[0.02] border-white/5" : "bg-white border-slate-100"}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
                      <Zap className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">Custom Alias</span>
                  </div>
                  <div className="space-y-3">
                    <Input 
                      placeholder="Enter prefix..." 
                      value={customPrefix}
                      onChange={(e) => { setCustomPrefix(e.target.value); setEmailFormat("custom"); }}
                      className={`h-10 rounded-lg border-none text-sm ${isDarkMode ? "bg-white/[0.04]" : "bg-slate-100/50"}`}
                    />
                    <Button 
                      onClick={() => { setEmailFormat("custom"); getNewEmail(); }}
                      disabled={isLoadingEmail || !customPrefix}
                      className="w-full h-9 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs active:scale-[0.98]"
                    >
                      {isLoadingEmail ? <RefreshCw className="h-3 w-3 animate-spin" /> : "Create"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 lg:hidden">
                  <SidebarLink active={activeView === "inbox"} onClick={() => { setActiveView("inbox"); setSidebarOpen(false); }} icon={<Inbox className="h-4 w-4" />} label="Inbox" />
                  <SidebarLink active={activeView === "profile"} onClick={() => { setActiveView("profile"); setSidebarOpen(false); }} icon={<Fingerprint className="h-4 w-4" />} label="Profile" />
                  <SidebarLink active={activeView === "history"} onClick={() => { setActiveView("history"); setSidebarOpen(false); }} icon={<Activity className="h-4 w-4" />} label="History" />
                </div>

                <div className="space-y-3 mt-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Settings</p>
                  
                  <ConfigDropdown 
                    label="Country" 
                    value={selectedCountry}
                    icon={<span className="text-sm">{COUNTRIES.find(c => c.name === selectedCountry)?.flag}</span>}
                    options={COUNTRIES.map(c => ({ 
                      id: c.name, 
                      label: c.name, 
                      icon: <span>{c.flag}</span>,
                      onSelect: () => { setSelectedCountry(c.name); generateIdentity(c.name); }
                    }))}
                  />

                  <ConfigDropdown 
                    label="Domain" 
                    value={selectedDomain?.domain || "Select..."}
                    icon={<Globe className="h-3.5 w-3.5 text-indigo-500" />}
                    options={domains.map((d, idx) => ({ 
                      id: `${d.domain}-${idx}`, 
                      label: d.domain,
                      badge: d.provider,
                      onSelect: () => setSelectedDomain(d)
                    }))}
                  />

                  <ConfigDropdown 
                    label="Format" 
                    value={EMAIL_FORMATS.find(f => f.id === emailFormat)?.label.split(" (")[0] || "Select..."}
                    icon={<Terminal className="h-3.5 w-3.5 text-indigo-500" />}
                    options={EMAIL_FORMATS.map(f => ({ 
                      id: f.id, 
                      label: f.label.split(" (")[0],
                      subtext: f.example,
                      onSelect: () => setEmailFormat(f.id)
                    }))}
                  />
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

          <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <ScrollArea className="flex-1 p-3 sm:p-4 md:p-6">
              <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 pb-20">
                <AnimatePresence mode="wait">
                  {selectedMessage ? (
                    <motion.div 
                      key="message"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`rounded-2xl border overflow-hidden ${isDarkMode ? "bg-[#0c0c0e] border-white/5" : "bg-white border-slate-200"}`}
                    >
                      <div className="p-3 sm:p-4 border-b flex items-center justify-between bg-white/[0.02]">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedMessage(null)} className="h-8 px-3 rounded-lg gap-2 hover:bg-white/5 active:bg-white/10 font-bold text-xs">
                          <ArrowLeft className="h-4 w-4" />
                          <span className="hidden sm:inline">Back</span>
                        </Button>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-white/5 active:bg-white/10"><Download className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-rose-500/10 active:bg-rose-500/20 text-rose-500"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                      
                      <div className="p-4 sm:p-6 space-y-4">
                        <div className="space-y-3">
                          <h2 className="text-lg sm:text-xl font-bold tracking-tight">{selectedMessage.subject}</h2>
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${isDarkMode ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
                              {selectedMessage.from[0].toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold truncate">{selectedMessage.from}</p>
                              <p className="text-[10px] opacity-40">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>

                        <div className={`p-4 rounded-xl border ${isDarkMode ? "bg-[#111113] border-white/5 text-slate-300" : "bg-[#fcfdfe] border-slate-100 text-slate-700"}`}>
                          {selectedMessage.html ? (
                            <div className="prose prose-sm max-w-none dark:prose-invert overflow-x-auto" dangerouslySetInnerHTML={{ __html: selectedMessage.html }} />
                          ) : (
                            <pre className="whitespace-pre-wrap font-sans text-sm">{selectedMessage.text}</pre>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ) : activeView === "profile" ? (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <div className={`flex flex-col items-center gap-4 p-6 rounded-2xl border ${isDarkMode ? "bg-black/40 border-white/5" : "bg-white border-slate-200/50"}`}>
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl bg-slate-900 border border-white/10">
                          {identity?.flag}
                        </div>
                        <div className="text-center space-y-2">
                          <Badge className="bg-indigo-600 text-white border-none text-[10px] font-bold uppercase tracking-wider">Active</Badge>
                          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{identity?.firstName} <span className="text-indigo-500">{identity?.lastName}</span></h2>
                          <div className="flex flex-wrap justify-center gap-2">
                            <span className="px-2 py-1 rounded-lg bg-white/5 text-[10px] font-bold uppercase">{identity?.country}</span>
                            <span className="px-2 py-1 rounded-lg bg-white/5 text-[10px] font-bold uppercase">{identity?.code}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <ProfileItem icon={<Mail className="h-4 w-4" />} label="Email" value={emailData?.address || "..."} onCopy={() => copyToClipboard(emailData?.address || "", "Email")} highlight />
                        <ProfileItem icon={<User className="h-4 w-4" />} label="Username" value={fakeProfile?.username || "—"} onCopy={() => copyToClipboard(fakeProfile?.username || "", "Username")} />
                        <ProfileItem icon={<Lock className="h-4 w-4" />} label="Password" value={fakeProfile?.password || "—"} onCopy={() => copyToClipboard(fakeProfile?.password || "", "Password")} />
                        <ProfileItem icon={<Phone className="h-4 w-4" />} label="Phone" value={fakeProfile?.phone || "—"} onCopy={() => copyToClipboard(fakeProfile?.phone || "", "Phone")} />
                        <ProfileItem icon={<Building className="h-4 w-4" />} label="City" value={`${fakeProfile?.city}, ${identity?.country}`} onCopy={() => copyToClipboard(`${fakeProfile?.city}, ${identity?.country}`, "City")} />
                        <ProfileItem icon={<Calendar className="h-4 w-4" />} label="DOB" value={fakeProfile?.dob || "—"} onCopy={() => copyToClipboard(fakeProfile?.dob || "", "DOB")} />
                      </div>
                    </motion.div>
                  ) : activeView === "history" ? (
                    <motion.div
                      key="history"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold">History</h2>
                          <p className="text-xs opacity-40">Previous email sessions</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          onClick={() => { setHistory([]); localStorage.removeItem("tto_history"); toast.success("History cleared"); }}
                          className="h-9 px-4 rounded-lg text-rose-500 hover:bg-rose-500/10 active:bg-rose-500/20 font-bold text-xs"
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Clear All
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {history.map((h) => (
                          <div 
                            key={h.address}
                            className={`p-3 sm:p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isDarkMode ? "bg-white/[0.02] border-white/5" : "bg-white border-slate-200"}`}
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-indigo-500 font-mono truncate">{h.address}</p>
                              <Badge variant="outline" className="text-[9px] mt-1">{h.provider}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                onClick={() => { setEmailData(h); setActiveView("inbox"); toast.success("Session restored"); }} 
                                className="h-8 px-3 rounded-lg text-[10px] font-bold bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white"
                              >
                                Restore
                              </Button>
                              <Button onClick={() => setHistory(prev => prev.filter(p => p.address !== h.address))} size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-rose-500 hover:bg-rose-500/10"><X className="h-4 w-4" /></Button>
                            </div>
                          </div>
                        ))}
                        {history.length === 0 && (
                          <div className="py-12 flex flex-col items-center text-center opacity-30">
                            <History className="h-8 w-8 mb-3" />
                            <p className="text-sm font-bold">No history</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="inbox"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      {emailData && (
                        <div className={`p-4 sm:p-6 rounded-2xl border flex flex-col gap-4 ${isDarkMode ? "bg-black/60 border-white/5" : "bg-white border-slate-200"}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${isDarkMode ? "bg-indigo-600 text-white" : "bg-indigo-500 text-white"}`}>
                              <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Active Email</p>
                              <h2 className="text-sm sm:text-lg font-bold font-mono truncate text-indigo-500">
                                {emailData.address}
                              </h2>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button 
                              onClick={() => copyToClipboard(emailData.address, "Email")}
                              className="flex-1 h-10 sm:h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm"
                            >
                              <Copy className="h-4 w-4 mr-2" /> Copy
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={handleGenerateEmail}
                              className="h-10 sm:h-11 px-4 rounded-xl bg-white/[0.02] border-white/10 hover:bg-white/5 active:bg-white/10"
                            >
                              <RefreshCw className={`h-4 w-4 ${isLoadingEmail ? "animate-spin" : ""}`} />
                              <span className="ml-2 sm:hidden">New</span>
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg sm:text-xl font-bold">Inbox</h2>
                        </div>
                        
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-30" />
                          <Input 
                            placeholder="Search..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`h-10 pl-10 rounded-xl border-none text-sm ${isDarkMode ? "bg-white/[0.03]" : "bg-slate-100/50"}`}
                          />
                        </div>

                        <div className={`rounded-xl border overflow-hidden ${isDarkMode ? "bg-black/20 border-white/5" : "bg-white border-slate-100"}`}>
                          {filteredMessages.length === 0 ? (
                            <div className="py-12 flex flex-col items-center text-center px-4">
                              <Inbox className="h-8 w-8 text-indigo-500 mb-3" />
                              <h3 className="text-sm font-bold">Waiting for emails...</h3>
                              <p className="text-xs opacity-40 mt-1">New messages will appear here</p>
                            </div>
                          ) : (
                            <div className="divide-y divide-white/5">
                              {filteredMessages.map((msg) => (
                                <div 
                                  key={msg.id}
                                  onClick={() => openEmail(msg.id)}
                                  className={`p-3 sm:p-4 flex items-center gap-3 cursor-pointer transition-colors active:bg-white/5 ${!msg.seen ? "bg-indigo-500/[0.02]" : ""} ${isDarkMode ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"}`}
                                >
                                  {!msg.seen && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />}
                                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${isDarkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                                    {msg.from[0].toUpperCase()}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-0.5">
                                      <p className={`text-[10px] uppercase tracking-wider truncate ${!msg.seen ? "font-bold text-indigo-500" : "opacity-40"}`}>{msg.from}</p>
                                      <span className="text-[9px] opacity-30 shrink-0">{formatDate(msg.createdAt)}</span>
                                    </div>
                                    <h4 className={`text-sm truncate ${!msg.seen ? "font-bold" : "opacity-80"}`}>{msg.subject}</h4>
                                  </div>
                                  <ChevronRight className="h-4 w-4 opacity-30 shrink-0" />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </main>
        </div>

        <div className="fixed bottom-4 right-4 lg:hidden z-50">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={handleGenerateEmail} 
            className="w-12 h-12 rounded-xl shadow-xl shadow-indigo-500/40 bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center border border-white/20 active:scale-95"
          >
            {isLoadingEmail ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function NavTab({ active, onClick, icon, label, count }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; count?: number }) {
  return (
    <button 
      onClick={onClick}
      className={`relative h-8 px-3 gap-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center ${active ? "text-indigo-500 bg-white/5" : "text-slate-500 hover:text-slate-400"}`}
    >
      {icon}
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span className={`ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${active ? "bg-indigo-500 text-white" : "bg-white/10"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function SidebarLink({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full h-10 px-3 gap-3 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all flex items-center ${active ? "bg-indigo-500/10 text-indigo-500" : "text-slate-500 hover:bg-white/5"}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ConfigDropdown({ label, value, icon, options }: { label: string; value: string; icon: React.ReactNode; options: any[] }) {
  return (
    <div className="space-y-1.5">
      <label className="px-1 text-[10px] font-bold uppercase tracking-widest text-slate-500/60">{label}</label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between h-10 px-3 rounded-lg border-none bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold">
            <div className="flex items-center gap-2">
              {icon}
              <span className="truncate">{value}</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 opacity-40" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[260px] max-h-[250px] overflow-y-auto rounded-xl p-1 border-white/5 bg-black/90">
          {options.map((opt) => (
            <DropdownMenuItem 
              key={opt.id} 
              onClick={opt.onSelect}
              className="rounded-lg h-9 px-2 flex items-center gap-2 text-xs font-bold hover:bg-white/10"
            >
              {opt.icon}
              <div className="flex flex-col min-w-0 flex-1">
                <span className="truncate">{opt.label}</span>
                {opt.subtext && <span className="text-[9px] opacity-40">{opt.subtext}</span>}
              </div>
              {opt.badge && <Badge variant="secondary" className="text-[8px] px-1 h-4 opacity-50">{opt.badge}</Badge>}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ProfileItem({ icon, label, value, onCopy, highlight }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  onCopy: () => void;
  highlight?: boolean;
}) {
  return (
    <div className={`p-3 sm:p-4 rounded-xl border flex items-center justify-between gap-3 active:scale-[0.98] transition-transform ${highlight ? "bg-indigo-500/[0.03] border-indigo-500/20" : "bg-white/[0.02] border-white/5"}`}>
      <div className="flex items-center gap-2 min-w-0">
        <div className={`p-1.5 rounded-lg ${highlight ? "bg-indigo-500 text-white" : "bg-indigo-500/10 text-indigo-500"}`}>{icon}</div>
        <div className="min-w-0">
          <span className="text-[9px] font-bold uppercase tracking-wider opacity-40 block">{label}</span>
          <p className={`text-xs sm:text-sm font-bold truncate font-mono ${highlight ? "text-indigo-500" : ""}`}>{value}</p>
        </div>
      </div>
      <button onClick={onCopy} className="p-2 rounded-lg hover:bg-white/10 active:bg-white/20 shrink-0">
        <Copy className="h-3.5 w-3.5 opacity-40" />
      </button>
    </div>
  );
}
