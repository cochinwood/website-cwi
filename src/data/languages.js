export const LANGUAGES = [
  // Primary Business & South Indian
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  // All Eighth Schedule Official Indian Languages
  { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'brx', name: 'Bodo', native: 'बर’' },
  { code: 'doi', name: 'Dogri', native: 'डोगरी' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'ks', name: 'Kashmiri', native: 'कश्मीरी / کٲشُر' },
  { code: 'kok', name: 'Konkani', native: 'कोंकणी' },
  { code: 'mai', name: 'Maithili', native: 'मैथिली' },
  { code: 'mni', name: 'Manipuri', native: 'মণিপুরী / ꯃꯤꯇꯩꯂꯣꯟ' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्' },
  { code: 'sat', name: 'Santali', native: 'संथाली / ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'sd', name: 'Sindhi', native: 'سنڌي / सिन्धी' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  // Major Commercial & Regional Dialects
  { code: 'bho', name: 'Bhojpuri', native: 'भोजपुरी' },
  { code: 'hne', name: 'Chhattisgarhi', native: 'छत्तीसगढ़ी' },
  { code: 'bgc', name: 'Haryanvi', native: 'हरियाणवी' },
  { code: 'mwr', name: 'Marwari', native: 'मारवाड़ी' },
  { code: 'tcy', name: 'Tulu', native: 'ತುಳು' },
  // Key International & Export Markets
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'ru', name: 'Russian', native: 'Русский' }
];

export const DEALING_TYPES = [
  { id: 'Domestic', label: 'Domestic', desc: 'Focuses on inland/national markets & local clients', badgeColor: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'Export', label: 'Export', desc: 'Focuses on international buyers & overseas shipping', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'Both', label: 'Both', desc: 'Handles both domestic and international sales inquiries', badgeColor: 'bg-purple-100 text-purple-800 border-purple-300' }
];

export const REGIONAL_PRESETS = [
  { name: 'Malayalam', native: 'മലയാളം' },
  { name: 'Kannada', native: 'ಕನ್ನಡ' },
  { name: 'English', native: 'English' },
  { name: 'Hindi', native: 'हिन्दी' },
  { name: 'Tamil', native: 'தமிழ்' },
  { name: 'Arabic', native: 'العربية' },
  { name: 'Tulu', native: 'ತುಳು' },
  { name: 'Telugu', native: 'తెలుగు' }
];

export const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+968', country: 'Oman', flag: '🇴🇲' },
  { code: '+974', country: 'Qatar', flag: '🇶🇦' },
  { code: '+965', country: 'Kuwait', flag: '🇰🇼' },
  { code: '+973', country: 'Bahrain', flag: '🇧🇭' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+1', country: 'USA/Canada', flag: '🇺🇸' }
];

export const USER_ROLES = [
  { id: 'Sales', label: 'Sales / Business Development', requiresSalesFields: true },
  { id: 'Operations', label: 'Operations & Logistics', requiresSalesFields: false },
  { id: 'Admin', label: 'System Administrator', requiresSalesFields: false },
  { id: 'Customer Support', label: 'Customer Support', requiresSalesFields: false }
];

