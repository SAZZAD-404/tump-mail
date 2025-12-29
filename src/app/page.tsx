"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  RefreshCw, 
  Copy, 
  Mail, 
  Moon, 
  Sun,
  Globe,
  User,
  Zap,
  MapPin,
  Lock,
  Phone,
  Calendar,
  Building,
  Eye,
  EyeOff,
  Sparkles,
  Shield,
  Download,
  Share2,
  ExternalLink,
  ChevronDown,
  Check,
  Star,
  Heart,
  Bookmark,
  Settings,
  Menu,
  X,
  Inbox,
  AlertCircle,
  CheckCircle
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// API endpoints
const PRIYO_EMAIL_API = "https://free.priyo.email/api/random-email/7jkmE5NM2VS6GqJ9pzlI";
const SONJJ_API = "https://app.sonjj.com";
const MAIL_TM_API = "https://api.mail.tm";
const BARID_API = "https://api.barid.site";

// Country data with names for email generation
const COUNTRIES = [
  { 
    name: "USA", 
    flag: "🇺🇸", 
    code: "US", 
    firstNames: ["James", "Mary", "Robert", "Patricia", "Michael", "Jennifer", "William", "Elizabeth", "David", "Linda", "Christopher", "Sarah", "Daniel", "Jessica", "Matthew", "Ashley", "Anthony", "Emily", "Joshua", "Megan", "Andrew", "Amanda", "Kenneth", "Dorothy", "Paul", "Lisa", "Steven", "Nancy", "Joshua", "Karen"],
    lastNames: ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"],
    domains: ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com"]
  },
  { 
    name: "Bangladesh", 
    flag: "🇧🇩", 
    code: "BD", 
    firstNames: ["Mohammad", "Fatima", "Ahmed", "Ayesha", "Rahman", "Khadija", "Hassan", "Zainab", "Ali", "Amina", "Omar", "Sadia", "Ibrahim", "Nusrat", "Yusuf", "Rashida", "Tariq", "Salma", "Karim", "Nasreen"],
    lastNames: ["Rahman", "Ahmed", "Khan", "Islam", "Hossain", "Ali", "Begum", "Chowdhury", "Akter", "Khatun", "Uddin", "Bibi", "Sheikh", "Miah", "Sarkar", "Das", "Roy", "Saha", "Barua", "Chakma"],
    domains: ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"]
  },
  { 
    name: "India", 
    flag: "🇮🇳", 
    code: "IN", 
    firstNames: ["Aarav", "Aanya", "Vihaan", "Saanvi", "Aditya", "Ananya", "Arjun", "Diya", "Reyansh", "Myra", "Sai", "Isha", "Krishna", "Priya", "Rohan", "Neha", "Aryan", "Kavya", "Karan", "Riya"],
    lastNames: ["Sharma", "Verma", "Gupta", "Singh", "Kumar", "Patel", "Shah", "Joshi", "Reddy", "Nair", "Iyer", "Agarwal", "Mishra", "Rao", "Pandey", "Sinha", "Mehta", "Chopra", "Malhotra", "Bansal"],
    domains: ["gmail.com", "yahoo.co.in", "rediffmail.com", "hotmail.com"]
  },
  { 
    name: "Pakistan", 
    flag: "🇵🇰", 
    code: "PK", 
    firstNames: ["Muhammad", "Fatima", "Ali", "Aisha", "Ahmad", "Zainab", "Hassan", "Khadija", "Omar", "Amina", "Ibrahim", "Sadia", "Yusuf", "Nadia", "Tariq", "Rabia", "Bilal", "Sana", "Usman", "Hira"],
    lastNames: ["Khan", "Ali", "Shah", "Ahmed", "Hussain", "Malik", "Chaudhry", "Sheikh", "Butt", "Awan", "Qureshi", "Siddiqui", "Bhatti", "Rajput", "Mughal", "Dar", "Lone", "Wani", "Mir", "Bhat"],
    domains: ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"]
  },
  { 
    name: "UK", 
    flag: "🇬🇧", 
    code: "GB", 
    firstNames: ["Oliver", "Olivia", "George", "Amelia", "Harry", "Isla", "Jack", "Emily", "Charlie", "Ava", "Noah", "Sophia", "Leo", "Mia", "Thomas", "Grace", "William", "Lily", "James", "Ella"],
    lastNames: ["Smith", "Jones", "Taylor", "Brown", "Williams", "Wilson", "Johnson", "Davies", "Robinson", "Wright", "Thompson", "Evans", "Walker", "White", "Roberts", "Green", "Hall", "Wood", "Jackson", "Clarke"],
    domains: ["gmail.com", "yahoo.co.uk", "hotmail.co.uk", "outlook.com", "btinternet.com"]
  },
  { 
    name: "Canada", 
    flag: "🇨🇦", 
    code: "CA", 
    firstNames: ["Liam", "Olivia", "Noah", "Emma", "William", "Charlotte", "Oliver", "Amelia", "Benjamin", "Ava", "Elijah", "Sophia", "James", "Isabella", "Lucas", "Mia", "Mason", "Evelyn", "Logan", "Harper"],
    lastNames: ["Smith", "Brown", "Tremblay", "Martin", "Roy", "Wilson", "MacDonald", "Taylor", "Campbell", "Anderson", "Jones", "Thompson", "Scott", "Clark", "Lewis", "Walker", "Hall", "Young", "Allen", "King"],
    domains: ["gmail.com", "yahoo.ca", "hotmail.com", "outlook.com", "rogers.com"]
  },
  { 
    name: "Australia", 
    flag: "🇦🇺", 
    code: "AU", 
    firstNames: ["Oliver", "Charlotte", "Noah", "Olivia", "Jack", "Amelia", "William", "Isla", "Leo", "Mia", "Henry", "Ava", "Charlie", "Grace", "Thomas", "Ella", "Lucas", "Zoe", "Liam", "Chloe"],
    lastNames: ["Smith", "Jones", "Williams", "Brown", "Wilson", "Taylor", "Johnson", "White", "Martin", "Anderson", "Thompson", "Nguyen", "Thomas", "Walker", "Harris", "Lee", "Ryan", "Robinson", "Kelly", "King"],
    domains: ["gmail.com", "yahoo.com.au", "hotmail.com", "outlook.com", "bigpond.com"]
  },
  { 
    name: "Germany", 
    flag: "🇩🇪", 
    code: "DE", 
    firstNames: ["Ben", "Emma", "Paul", "Mia", "Leon", "Hannah", "Finn", "Sophia", "Noah", "Emilia", "Elias", "Marie", "Louis", "Anna", "Felix", "Lena", "Henry", "Lea", "Max", "Lina"],
    lastNames: ["Müller", "Schmidt", "Schneider", "Fischer", "Weber", "Meyer", "Wagner", "Becker", "Schulz", "Hoffmann", "Schäfer", "Koch", "Bauer", "Richter", "Klein", "Wolf", "Schröder", "Neumann", "Schwarz", "Zimmermann"],
    domains: ["gmail.com", "web.de", "gmx.de", "t-online.de", "yahoo.de"]
  },
  { 
    name: "France", 
    flag: "🇫🇷", 
    code: "FR", 
    firstNames: ["Gabriel", "Léo", "Raphaël", "Emma", "Jade", "Louise", "Arthur", "Alice", "Lucas", "Lina", "Hugo", "Chloé", "Louis", "Manon", "Nathan", "Léa", "Enzo", "Mila", "Adam", "Zoé"],
    lastNames: ["Martin", "Bernard", "Thomas", "Petit", "Robert", "Richard", "Durand", "Dubois", "Moreau", "Laurent", "Simon", "Michel", "Lefebvre", "Leroy", "Roux", "David", "Bertrand", "Morel", "Fournier", "Girard"],
    domains: ["gmail.com", "orange.fr", "free.fr", "hotmail.fr", "yahoo.fr"]
  },
  { 
    name: "Japan", 
    flag: "🇯🇵", 
    code: "JP", 
    firstNames: ["Ren", "Haruto", "Itsuki", "Himari", "Akari", "Ichika", "Minato", "Yua", "Kaito", "Sakura", "Sota", "Mei", "Yuto", "Hana", "Riku", "Aoi", "Hiroto", "Yui", "Takumi", "Rin"],
    lastNames: ["Sato", "Suzuki", "Takahashi", "Tanaka", "Watanabe", "Ito", "Yamamoto", "Nakamura", "Kobayashi", "Kato", "Yoshida", "Yamada", "Sasaki", "Yamaguchi", "Saito", "Matsumoto", "Inoue", "Kimura", "Hayashi", "Shimizu"],
    domains: ["gmail.com", "yahoo.co.jp", "hotmail.com", "outlook.jp", "docomo.ne.jp"]
  }
];

// Email generation patterns
const EMAIL_PATTERNS = [
  "firstname.lastname",
  "firstname_lastname", 
  "firstnamelastname",
  "firstname.lastname123",
  "firstname123",
  "f.lastname",
  "firstname.l",
  "fl123"
];

type GeneratedEmail = {
  email: string;
  password: string;
  country: string;
  flag: string;
  firstName: string;
  lastName: string;
  pattern: string;
  provider?: 'local' | 'priyo' | 'barid' | 'mailtm';
  token?: string;
  accountId?: string;
};

type TempEmailProvider = {
  name: string;
  domains: string[];
  generateEmail: () => Promise<{ email: string; password?: string; token?: string; accountId?: string }>;
};

type EmailMessage = {
  id: string;
  from: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
};

type UserProfile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  dateOfBirth: string;
  gender: string;
  occupation: string;
};

export default function EmailGenerator() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("USA");
  const [generatedEmails, setGeneratedEmails] = useState<GeneratedEmail[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("generator");
  const [emailProvider, setEmailProvider] = useState<'local' | 'priyo' | 'barid' | 'mailtm'>('local');
  const [availableDomains, setAvailableDomains] = useState<string[]>([]);
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<GeneratedEmail | null>(null);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("email_gen_theme");
    if (savedTheme) {
      const isDark = savedTheme === "dark";
      setIsDarkMode(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    }
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("email_gen_favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Auto-refresh messages for active email
  useEffect(() => {
    if (selectedEmail && selectedEmail.provider !== 'local') {
      const interval = setInterval(() => {
        checkEmailMessages(selectedEmail);
      }, 10000); // Check every 10 seconds

      return () => clearInterval(interval);
    }
  }, [selectedEmail]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("email_gen_theme", newTheme ? "dark" : "light");
  };

  // API Integration Functions
  const fetchPriyoEmail = async () => {
    try {
      const response = await fetch(PRIYO_EMAIL_API);
      const data = await response.json();
      return {
        email: data.email || `temp${Date.now()}@priyo.email`,
        password: generatePassword()
      };
    } catch (error) {
      console.error('Priyo API error:', error);
      return null;
    }
  };

  const fetchBaridEmail = async () => {
    try {
      // Get available domains first
      const domainsResponse = await fetch(`${BARID_API}/domains`);
      const domainsData = await domainsResponse.json();
      
      if (domainsData.success && domainsData.result.length > 0) {
        const domain = domainsData.result[0];
        const username = `user${Date.now()}`;
        const email = `${username}@${domain}`;
        
        return {
          email,
          password: generatePassword()
        };
      }
      return null;
    } catch (error) {
      console.error('Barid API error:', error);
      return null;
    }
  };

  const fetchMailTmEmail = async () => {
    try {
      // Get available domains
      const domainsResponse = await fetch(`${MAIL_TM_API}/domains`);
      const domainsData = await domainsResponse.json();
      
      if (domainsData["hydra:member"] && domainsData["hydra:member"].length > 0) {
        const domain = domainsData["hydra:member"][0].domain;
        const username = `user${Date.now()}`;
        const email = `${username}@${domain}`;
        const password = generatePassword();
        
        // Create account
        const createResponse = await fetch(`${MAIL_TM_API}/accounts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: email,
            password: password
          })
        });
        
        if (createResponse.ok) {
          const accountData = await createResponse.json();
          
          // Get token
          const tokenResponse = await fetch(`${MAIL_TM_API}/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              address: email,
              password: password
            })
          });
          
          const tokenData = await tokenResponse.json();
          
          return {
            email,
            password,
            token: tokenData.token,
            accountId: accountData.id
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Mail.tm API error:', error);
      return null;
    }
  };

  const checkEmailMessages = async (emailData: GeneratedEmail) => {
    if (!emailData.provider || emailData.provider === 'local') return;
    
    try {
      let messages: EmailMessage[] = [];
      
      if (emailData.provider === 'mailtm' && emailData.token) {
        const response = await fetch(`${MAIL_TM_API}/messages`, {
          headers: {
            'Authorization': `Bearer ${emailData.token}`
          }
        });
        const data = await response.json();
        
        messages = data["hydra:member"]?.map((msg: any) => ({
          id: msg.id,
          from: msg.from.address,
          subject: msg.subject || '(No Subject)',
          body: msg.intro || '',
          date: msg.createdAt,
          read: msg.seen
        })) || [];
      } else if (emailData.provider === 'barid') {
        const response = await fetch(`${BARID_API}/emails/${emailData.email}`);
        const data = await response.json();
        
        if (data.success) {
          messages = data.result.map((msg: any) => ({
            id: msg.id,
            from: msg.from_address,
            subject: msg.subject || '(No Subject)',
            body: msg.text_content || '',
            date: new Date(msg.received_at * 1000).toISOString(),
            read: false
          }));
        }
      }
      
      setMessages(messages);
      return messages;
    } catch (error) {
      console.error('Error checking messages:', error);
      return [];
    }
  };

  const generateRandomEmail = useCallback(async () => {
    setIsGenerating(true);
    
    try {
      const country = COUNTRIES.find(c => c.name === selectedCountry) || COUNTRIES[0];
      const firstName = country.firstNames[Math.floor(Math.random() * country.firstNames.length)];
      const lastName = country.lastNames[Math.floor(Math.random() * country.lastNames.length)];
      const pattern = EMAIL_PATTERNS[Math.floor(Math.random() * EMAIL_PATTERNS.length)];
      
      let emailData: { email: string; password: string; token?: string; accountId?: string } | null = null;
      let provider: 'local' | 'priyo' | 'barid' | 'mailtm' = 'local';
      
      // Try to get email from selected provider
      if (emailProvider === 'priyo') {
        emailData = await fetchPriyoEmail();
        provider = 'priyo';
      } else if (emailProvider === 'barid') {
        emailData = await fetchBaridEmail();
        provider = 'barid';
      } else if (emailProvider === 'mailtm') {
        emailData = await fetchMailTmEmail();
        provider = 'mailtm';
      }
      
      // Fallback to local generation if API fails
      if (!emailData) {
        const domain = country.domains[Math.floor(Math.random() * country.domains.length)];
        let emailPrefix = "";
        const randomNum = Math.floor(Math.random() * 999) + 1;
        
        switch (pattern) {
          case "firstname.lastname":
            emailPrefix = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
            break;
          case "firstname_lastname":
            emailPrefix = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
            break;
          case "firstnamelastname":
            emailPrefix = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
            break;
          case "firstname.lastname123":
            emailPrefix = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}`;
            break;
          case "firstname123":
            emailPrefix = `${firstName.toLowerCase()}${randomNum}`;
            break;
          case "f.lastname":
            emailPrefix = `${firstName.charAt(0).toLowerCase()}.${lastName.toLowerCase()}`;
            break;
          case "firstname.l":
            emailPrefix = `${firstName.toLowerCase()}.${lastName.charAt(0).toLowerCase()}`;
            break;
          case "fl123":
            emailPrefix = `${firstName.charAt(0).toLowerCase()}${lastName.charAt(0).toLowerCase()}${randomNum}`;
            break;
        }
        
        emailData = {
          email: `${emailPrefix}@${domain}`,
          password: generatePassword()
        };
        provider = 'local';
      }
      
      const newEmail: GeneratedEmail = {
        email: emailData.email,
        password: emailData.password,
        country: country.name,
        flag: country.flag,
        firstName,
        lastName,
        pattern,
        provider,
        token: emailData.token,
        accountId: emailData.accountId
      };
      
      setGeneratedEmails(prev => [newEmail, ...prev.slice(0, 9)]);
      setSelectedEmail(newEmail);
      
      // Generate user profile
      generateUserProfile(firstName, lastName, country);
      
      // Check for messages if it's a real email service
      if (provider !== 'local') {
        setTimeout(() => checkEmailMessages(newEmail), 2000);
      }
      
      toast.success(`${provider === 'local' ? 'Local' : provider.toUpperCase()} email generated for ${country.name}!`);
      
    } catch (error) {
      toast.error("Failed to generate email");
      console.error('Email generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [selectedCountry, emailProvider]);

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const generateUserProfile = (firstName: string, lastName: string, country: any) => {
    const occupations = ["Software Engineer", "Teacher", "Doctor", "Designer", "Manager", "Consultant", "Analyst", "Developer", "Writer", "Artist"];
    const genders = ["Male", "Female"];
    
    const profile: UserProfile = {
      name: `${firstName} ${lastName}`,
      email: generatedEmails[0]?.email || "",
      phone: generatePhoneNumber(country.code),
      address: generateAddress(),
      city: generateCity(country.name),
      country: country.name,
      zipCode: generateZipCode(),
      dateOfBirth: generateDateOfBirth(),
      gender: genders[Math.floor(Math.random() * genders.length)],
      occupation: occupations[Math.floor(Math.random() * occupations.length)]
    };
    
    setUserProfile(profile);
  };

  const generatePhoneNumber = (countryCode: string) => {
    const codes = { US: "+1", BD: "+880", IN: "+91", PK: "+92", GB: "+44", CA: "+1", AU: "+61", DE: "+49", FR: "+33", JP: "+81" };
    const code = codes[countryCode as keyof typeof codes] || "+1";
    const number = Math.floor(Math.random() * 9000000000) + 1000000000;
    return `${code} ${number.toString().replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}`;
  };

  const generateAddress = () => {
    const streetNumbers = Math.floor(Math.random() * 9999) + 1;
    const streetNames = ["Main St", "Oak Ave", "Pine Rd", "Elm Dr", "Cedar Ln", "Maple Way", "Park Ave", "First St"];
    return `${streetNumbers} ${streetNames[Math.floor(Math.random() * streetNames.length)]}`;
  };

  const generateCity = (country: string) => {
    const cities = {
      "USA": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"],
      "Bangladesh": ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna"],
      "India": ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata"],
      "Pakistan": ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad"],
      "UK": ["London", "Manchester", "Birmingham", "Liverpool", "Leeds"],
      "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
      "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
      "Germany": ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
      "France": ["Paris", "Marseille", "Lyon", "Toulouse", "Nice"],
      "Japan": ["Tokyo", "Osaka", "Kyoto", "Nagoya", "Sapporo"]
    };
    const countryCities = cities[country as keyof typeof cities] || cities["USA"];
    return countryCities[Math.floor(Math.random() * countryCities.length)];
  };

  const generateZipCode = () => {
    return Math.floor(Math.random() * 90000) + 10000;
  };

  const generateDateOfBirth = () => {
    const year = Math.floor(Math.random() * 30) + 1980;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const toggleFavorite = (email: string) => {
    const newFavorites = favorites.includes(email) 
      ? favorites.filter(f => f !== email)
      : [...favorites, email];
    setFavorites(newFavorites);
    localStorage.setItem("email_gen_favorites", JSON.stringify(newFavorites));
  };

  const exportData = () => {
    const data = {
      emails: generatedEmails,
      profile: userProfile,
      favorites: favorites,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-generator-data.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully!");
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      <Toaster position="top-right" richColors theme={isDarkMode ? "dark" : "light"} />
      
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b ${isDarkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-white/80 border-slate-200'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gradient-to-r from-blue-600 to-purple-600'}`}>
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Email Generator Pro
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Professional Email & Profile Generator
                </p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className={`rounded-full ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden rounded-full ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-b ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}
          >
            <div className="container mx-auto px-4 py-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="generator">Generator</TabsTrigger>
                  <TabsTrigger value="inbox">
                    Inbox
                    {messages.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                        {messages.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="hidden md:block mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-lg mx-auto">
              <TabsTrigger value="generator" className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Generator</span>
              </TabsTrigger>
              <TabsTrigger value="inbox" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Inbox</span>
                {messages.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                    {messages.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span>History</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Email Generator Tab */}
          <TabsContent value="generator" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <h2 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Generate Professional Emails
              </h2>
              <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} max-w-2xl mx-auto`}>
                Create realistic email addresses with matching profiles from different countries. Perfect for testing, development, and privacy.
              </p>
            </motion.div>

            {/* Country Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white/70 border-slate-200'} backdrop-blur-sm`}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>Select Country</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {COUNTRIES.map((country) => (
                      <motion.button
                        key={country.code}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedCountry(country.name)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          selectedCountry === country.name
                            ? isDarkMode 
                              ? 'border-purple-500 bg-purple-500/20' 
                              : 'border-blue-500 bg-blue-500/20'
                            : isDarkMode
                              ? 'border-slate-600 hover:border-slate-500 bg-slate-700/50'
                              : 'border-slate-300 hover:border-slate-400 bg-white/50'
                        }`}
                      >
                        <div className="text-2xl mb-1">{country.flag}</div>
                        <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {country.name}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Email Provider Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white/70 border-slate-200'} backdrop-blur-sm`}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Email Provider</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { id: 'local', name: 'Local Generator', desc: 'Fake emails for testing', icon: '🏠', status: 'active' },
                      { id: 'priyo', name: 'Priyo Email', desc: 'Real temporary emails', icon: '📧', status: 'unknown' },
                      { id: 'barid', name: 'Barid Site', desc: 'Temporary inbox service', icon: '📮', status: 'unknown' },
                      { id: 'mailtm', name: 'Mail.tm', desc: 'Disposable email service', icon: '📬', status: 'unknown' }
                    ].map((provider) => (
                      <motion.button
                        key={provider.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setEmailProvider(provider.id as any)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 text-left re${
                          emailProvider === provider.id
                            ? isDarkMode 
                              ? 'border-purple-500 bg-purple-500/20' 
                              : 'border-blue-500 bg-blue-500/20'
                            : isDarkMode
                              ? 'border-slate-600 hover:border-slate-500 bg-slate-700/50'
                              : 'border-slate-300 hover:border-slate-400 bg-white/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-xl">{provider.icon}</div>
                          {provider.status === 'active' && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          {provider.status === 'unknown' && (
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {provider.name}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          {provider.desc}
                        </div>
                      </motion.button>
 }
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Generate Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <Button
                onClick={generateRandomEmail}
                disabled={isGenerating}
                size="lg"
                className={`px-8 py-4 text-lg font-semibold rounded-xl ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                } text-white shadow-lg hover:shadow-xl transition-all duration-200`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Email
                  </>
                )}
              </Button>
            </motion.div>

            {/* Generated Emails */}
            {generatedEmails.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white/70 border-slate-200'} backdrop-blur-sm`}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Mail className="h-5 w-5" />
                      <span>Generated Emails</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="flex items-center space-x-1"
                      >
                        {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="hidden sm:inline">
                          {showPasswords ? 'Hide' : 'Show'} Passwords
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={exportData}
                        className="flex items-center space-x-1"
                      >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Export</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {generatedEmails.map((emailData, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-xl border ${
                            isDarkMode 
                              ? 'bg-slate-700/50 border-slate-600' 
                              : 'bg-white/80 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{emailData.flag}</span>
                              <div>
                                <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                  {emailData.firstName} {emailData.lastName}
                                </div>
                                <div className={`text-sm flex items-center space-x-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                  <span>{emailData.country} • {emailData.pattern}</span>
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {emailData.provider || 'local'}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFavorite(emailData.email)}
                              className={`${
                                favorites.includes(emailData.email)
                                  ? 'text-yellow-500 hover:text-yellow-600'
                                  : isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-700'
                              }`}
                            >
                              {favorites.includes(emailData.email) ? (
                                <Star className="h-4 w-4 fill-current" />
                              ) : (
                                <Star className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                Email Address
                              </label>
                              <div className="flex items-center space-x-2">
                                <Input
                                  value={emailData.email}
                                  readOnly
                                  className={`font-mono text-sm ${
                                    isDarkMode 
                                      ? 'bg-slate-800 border-slate-600 text-white' 
                                      : 'bg-slate-50 border-slate-300 text-slate-900'
                                  }`}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(emailData.email, "Email")}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                Password
                              </label>
                              <div className="flex items-center space-x-2">
                                <Input
                                  type={showPasswords ? "text" : "password"}
                                  value={emailData.password}
                                  readOnly
                                  className={`font-mono text-sm ${
                                    isDarkMode 
                                      ? 'bg-slate-800 border-slate-600 text-white' 
                                      : 'bg-slate-50 border-slate-300 text-slate-900'
                                  }`}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(emailData.password, "Password")}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          {/* Inbox Tab */}
          <TabsContent value="inbox" className="space-y-8">
            {selectedEmail && selectedEmail.provider !== 'local' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white/70 border-slate-200'} backdrop-blur-sm`}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Mail className="h-5 w-5" />
                      <span>Inbox - {selectedEmail.email}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="capitalize">
                        {selectedEmail.provider}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => selectedEmail && checkEmailMessages(selectedEmail)}
                        className="flex items-center space-x-1"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span className="hidden sm:inline">Refresh</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {messages.length > 0 ? (
                      <div className="space-y-3">
                        {messages.map((message, index) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 rounded-lg border ${
                              isDarkMode 
                                ? 'bg-slate-700/50 border-slate-600' 
                                : 'bg-white/80 border-slate-200'
                            } ${!message.read ? 'border-l-4 border-l-blue-500' : ''}`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                  {message.subject}
                                </div>
                                <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                  From: {message.from}
                                </div>
                              </div>
                              <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                {new Date(message.date).toLocaleString()}
                              </div>
                            </div>
                            {message.body && (
                              <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mt-2 p-3 rounded bg-slate-100/10`}>
                                {message.body.length > 200 ? `${message.body.substring(0, 200)}...` : message.body}
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Mail className={`h-12 w-12 mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                        <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          No Messages Yet
                        </h3>
                        <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-4`}>
                          Your temporary inbox is empty. Messages will appear here when received.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => selectedEmail && checkEmailMessages(selectedEmail)}
                          className="flex items-center space-x-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                          <span>Check for Messages</span>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <Mail className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  No Active Email
                </h3>
                <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-6`}>
                  Generate a real temporary email to access the inbox
                </p>
                <Button 
                  onClick={() => setActiveTab("generator")} 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Email
                </Button>
              </motion.div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-8">
            {userProfile ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white/70 border-slate-200'} backdrop-blur-sm`}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Generated Profile</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Full Name
                          </label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Input value={userProfile.name} readOnly />
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(userProfile.name, "Name")}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Email
                          </label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Input value={userProfile.email} readOnly />
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(userProfile.email, "Email")}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Phone
                          </label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Input value={userProfile.phone} readOnly />
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(userProfile.phone, "Phone")}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Address
                          </label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Input value={userProfile.address} readOnly />
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(userProfile.address, "Address")}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            City
                          </label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Input value={userProfile.city} readOnly />
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(userProfile.city, "City")}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Country
                          </label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Input value={userProfile.country} readOnly />
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(userProfile.country, "Country")}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Zip Code
                          </label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Input value={userProfile.zipCode} readOnly />
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(userProfile.zipCode.toString(), "Zip Code")}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Date of Birth
                          </label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Input value={userProfile.dateOfBirth} readOnly />
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(userProfile.dateOfBirth, "Date of Birth")}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Gender
                          </label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Input value={userProfile.gender} readOnly />
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(userProfile.gender, "Gender")}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Occupation
                          </label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Input value={userProfile.occupation} readOnly />
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(userProfile.occupation, "Occupation")}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <User className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  No Profile Generated
                </h3>
                <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-6`}>
                  Generate an email first to see the matching profile
                </p>
                <Button onClick={generateRandomEmail} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Profile
                </Button>
              </motion.div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-8">
            {favorites.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white/70 border-slate-200'} backdrop-blur-sm`}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="h-5 w-5" />
                      <span>Favorite Emails</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {favorites.map((email, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-3 rounded-lg border flex items-center justify-between ${
                            isDarkMode 
                              ? 'bg-slate-700/50 border-slate-600' 
                              : 'bg-white/80 border-slate-200'
                          }`}
                        >
                          <span className={`font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {email}
                          </span>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(email, "Email")}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFavorite(email)}
                              className="text-yellow-500 hover:text-yellow-600"
                            >
                              <Star className="h-4 w-4 fill-current" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <Bookmark className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  No Favorites Yet
                </h3>
                <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-6`}>
                  Star your favorite generated emails to save them here
                </p>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className={`border-t mt-16 ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/50 border-slate-200'} backdrop-blur-sm`}>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Email Generator Pro
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Generate professional email addresses with matching profiles from different countries. Perfect for testing and development.
              </p>
            </div>
            
            <div>
              <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Features
              </h4>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <li>• Country-based name generation</li>
                <li>• Multiple email patterns</li>
                <li>• Complete user profiles</li>
                <li>• Export functionality</li>
                <li>• Mobile-friendly design</li>
              </ul>
            </div>
            
            <div>
              <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                APIs Used
              </h4>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <li>• Priyo Email API</li>
                <li>• Sonjj API</li>
                <li>• Mail.tm API</li>
                <li>• Custom generators</li>
              </ul>
            </div>
          </div>
          
          <div className={`border-t mt-8 pt-8 text-center text-sm ${isDarkMode ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
            <p>© 2025 Email Generator Pro.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
