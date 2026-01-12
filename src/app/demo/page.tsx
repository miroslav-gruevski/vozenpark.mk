'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Avatar,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Fab,
  Tooltip,
  alpha,
  useTheme,
  Grid,
  LinearProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Pagination,
  Skeleton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import {
  DirectionsCarOutlined,
  AddOutlined,
  NotificationsActiveOutlined,
  CalendarMonthOutlined,
  SecurityOutlined,
  BuildOutlined,
  EditOutlined,
  DeleteOutlined,
  WarningAmberOutlined,
  ScheduleOutlined,
  CheckCircleOutlined,
  KeyboardArrowDown,
  Check,
  HomeOutlined,
  CloseOutlined,
  PersonOutlined,
  DriveEtaOutlined,
  PinOutlined,
  SearchOutlined,
  FilterListOutlined,
  LocalGasStationOutlined,
  ColorLensOutlined,
  SpeedOutlined,
  AttachMoneyOutlined,
  NotesOutlined,
  TwoWheelerOutlined,
  LocalShippingOutlined,
  AirportShuttleOutlined,
  ExpandMore,
  ExpandLess,
  MoreVertOutlined,
  PedalBikeOutlined,
  ArrowUpward,
  ArrowDownward,
  UnfoldMore,
  FileUploadOutlined,
  FileDownloadOutlined,
  DescriptionOutlined,
  TableChartOutlined,
  PictureAsPdfOutlined,
  CodeOutlined,
  UploadOutlined,
  MenuOutlined,
  CategoryOutlined,
} from '@mui/icons-material';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  InputAdornment,
  Collapse,
  SelectChangeEvent,
} from '@mui/material';
import { getTranslations, getLanguageFromStorage, setLanguageToStorage, languages } from '@/lib/i18n';
import { EmptyState } from '@/components/EmptyState';
import { formatDate, getDaysUntil } from '@/lib/dates';
import { fadeInUp, staggerContainer, md3 } from '@/lib/theme';
import type { Language, Vehicle, ExpiryStatus, VehicleType, FuelType } from '@/types';

// MD3 Dialog styling - 28dp corner radius for large dialogs
const dialogPaperProps = {
  sx: { 
    borderRadius: '28px',
    maxWidth: 600,
  }
};

// Vehicle type options - using consistent outlined icons from MUI
const vehicleTypeOptions: { value: VehicleType; label: Record<string, string>; icon: React.ReactNode }[] = [
  { value: 'car', label: { en: 'Car', mk: 'Автомобил', sq: 'Veturë', tr: 'Araba', sr: 'Аутомобил' }, icon: <DirectionsCarOutlined fontSize="small" /> },
  { value: 'suv', label: { en: 'SUV', mk: 'СУВ', sq: 'SUV', tr: 'SUV', sr: 'СУВ' }, icon: <DirectionsCarOutlined fontSize="small" /> },
  { value: 'van', label: { en: 'Van', mk: 'Комбе', sq: 'Furgon', tr: 'Van', sr: 'Комби' }, icon: <LocalShippingOutlined fontSize="small" /> },
  { value: 'truck', label: { en: 'Truck', mk: 'Камион', sq: 'Kamion', tr: 'Kamyon', sr: 'Камион' }, icon: <LocalShippingOutlined fontSize="small" /> },
  { value: 'motorcycle', label: { en: 'Motorcycle', mk: 'Мотор', sq: 'Motoçikletë', tr: 'Motosiklet', sr: 'Мотор' }, icon: <TwoWheelerOutlined fontSize="small" /> },
  { value: 'other', label: { en: 'Other', mk: 'Друго', sq: 'Tjetër', tr: 'Diğer', sr: 'Остало' }, icon: <DirectionsCarOutlined fontSize="small" /> },
];

// Fuel type options
const fuelTypeOptions: { value: FuelType; label: Record<string, string> }[] = [
  { value: 'petrol', label: { en: 'Petrol', mk: 'Бензин', sq: 'Benzinë', tr: 'Benzin', sr: 'Бензин' } },
  { value: 'diesel', label: { en: 'Diesel', mk: 'Дизел', sq: 'Naftë', tr: 'Dizel', sr: 'Дизел' } },
  { value: 'electric', label: { en: 'Electric', mk: 'Електричен', sq: 'Elektrik', tr: 'Elektrik', sr: 'Електрични' } },
  { value: 'hybrid', label: { en: 'Hybrid', mk: 'Хибрид', sq: 'Hibrid', tr: 'Hibrit', sr: 'Хибрид' } },
  { value: 'lpg', label: { en: 'LPG', mk: 'ТНГ', sq: 'GLN', tr: 'LPG', sr: 'ТНГ' } },
  { value: 'other', label: { en: 'Other', mk: 'Друго', sq: 'Tjetër', tr: 'Diğer', sr: 'Остало' } },
];

// Status filter options
const statusFilterOptions = [
  { value: 'all', label: { en: 'All Statuses', mk: 'Сите статуси', sq: 'Të gjitha statuset', tr: 'Tüm Durumlar', sr: 'Сви статуси' } },
  { value: 'expired', label: { en: 'Expired', mk: 'Истечени', sq: 'Skaduar', tr: 'Süresi Dolmuş', sr: 'Истекли' } },
  { value: 'urgent', label: { en: 'Urgent (≤7 days)', mk: 'Итни (≤7 дена)', sq: 'Urgjent (≤7 ditë)', tr: 'Acil (≤7 gün)', sr: 'Хитни (≤7 дана)' } },
  { value: 'soon', label: { en: 'Due Soon (≤30 days)', mk: 'Наскоро (≤30 дена)', sq: 'Së shpejti (≤30 ditë)', tr: 'Yakında (≤30 gün)', sr: 'Ускоро (≤30 дана)' } },
  { value: 'ok', label: { en: 'OK (>30 days)', mk: 'ОК (>30 дена)', sq: 'OK (>30 ditë)', tr: 'OK (>30 gün)', sr: 'ОК (>30 дана)' } },
];

// Generate year options (last 30 years) - use 2026 as base to avoid hydration issues
const yearOptions = Array.from({ length: 30 }, (_, i) => 2026 - i);

// Helper to calculate date offset from now (in days)
const daysFromNow = (days: number): string => {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
};

// Function to generate demo vehicles - called client-side only to avoid hydration mismatch
const generateDemoVehicles = (): Vehicle[] => {
  const now = new Date().toISOString();
  return [
  {
    id: '1',
    plate: 'SK 1234 AB',
    vehicleType: 'car',
    vehicleModel: 'Golf 7 TDI',
    year: 2019,
    color: 'Бела',
    fuelType: 'diesel',
    vin: '9ZZAB12C3DE456789',
    responsiblePerson: 'Марко Петров',
    purchaseDate: new Date('2019-06-15'),
    purchasePrice: 15000,
    mileage: 85000,
    regExpiry: daysFromNow(3),
    insExpiry: daysFromNow(45),
    inspExpiry: daysFromNow(120),
    notes: '',
    userId: 'demo',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '2',
    plate: 'KU 5678 CD',
    vehicleType: 'car',
    vehicleModel: 'Audi A4 Avant',
    year: 2021,
    color: 'Сива',
    fuelType: 'diesel',
    vin: '5Y2BR4EE2XP123456',
    responsiblePerson: 'Ана Јовановска',
    purchaseDate: new Date('2021-03-20'),
    purchasePrice: 28000,
    mileage: 45000,
    regExpiry: daysFromNow(90),
    insExpiry: daysFromNow(14),
    inspExpiry: daysFromNow(200),
    notes: 'Службено возило за менаџмент',
    userId: 'demo',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '3',
    plate: 'BT 9012 EF',
    vehicleType: 'suv',
    vehicleModel: 'BMW X3 xDrive',
    year: 2022,
    color: 'Црна',
    fuelType: 'hybrid',
    vin: '1HGBH41JXMN109186',
    responsiblePerson: 'Петар Николов',
    purchaseDate: new Date('2022-01-10'),
    purchasePrice: 45000,
    mileage: 28000,
    regExpiry: daysFromNow(180),
    insExpiry: daysFromNow(250),
    inspExpiry: daysFromNow(128),
    notes: '',
    userId: 'demo',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '4',
    plate: 'OH 3456 GH',
    vehicleType: 'van',
    vehicleModel: 'Mercedes Sprinter',
    year: 2018,
    color: 'Бела',
    fuelType: 'diesel',
    vin: 'WDB9066331S789012',
    responsiblePerson: 'Иван Стојанов',
    purchaseDate: new Date('2018-09-05'),
    purchasePrice: 35000,
    mileage: 120000,
    regExpiry: daysFromNow(-5),
    insExpiry: daysFromNow(30),
    inspExpiry: daysFromNow(60),
    notes: 'Доставно возило - потребен сервис',
    userId: 'demo',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '5',
    plate: 'PP 7890 IJ',
    vehicleType: 'car',
    vehicleModel: 'Toyota Corolla',
    year: 2023,
    color: 'Сребрена',
    fuelType: 'hybrid',
    vin: 'JTDKN3DU5A0123456',
    responsiblePerson: 'Елена Димитрова',
    purchaseDate: new Date('2023-02-28'),
    purchasePrice: 25000,
    mileage: 15000,
    regExpiry: daysFromNow(365),
    insExpiry: daysFromNow(28),
    inspExpiry: daysFromNow(300),
    notes: '',
    userId: 'demo',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '6',
    plate: 'TT 1111 AA',
    vehicleType: 'truck',
    vehicleModel: 'Volvo FH16',
    year: 2020,
    color: 'Сина',
    fuelType: 'diesel',
    vin: 'YV2RT40A5LB123456',
    responsiblePerson: 'Драган Митров',
    regExpiry: daysFromNow(60),
    insExpiry: daysFromNow(90),
    inspExpiry: daysFromNow(45),
    userId: 'demo',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '7',
    plate: 'VE 2222 BB',
    vehicleType: 'motorcycle',
    vehicleModel: 'Honda CBR 600',
    year: 2021,
    color: 'Црвена',
    fuelType: 'petrol',
    vin: 'JH2PC35021M123456',
    responsiblePerson: 'Никола Спасов',
    regExpiry: daysFromNow(150),
    insExpiry: daysFromNow(200),
    inspExpiry: daysFromNow(180),
    userId: 'demo',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '8',
    plate: 'ST 3333 CC',
    vehicleType: 'car',
    vehicleModel: 'Škoda Octavia',
    year: 2022,
    color: 'Зелена',
    fuelType: 'petrol',
    vin: 'TMBLD45L3C2123456',
    responsiblePerson: 'Сања Костова',
    regExpiry: daysFromNow(5),
    insExpiry: daysFromNow(100),
    inspExpiry: daysFromNow(80),
    userId: 'demo',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '9',
    plate: 'GV 4444 DD',
    vehicleType: 'suv',
    vehicleModel: 'Nissan Qashqai',
    year: 2019,
    color: 'Кафеава',
    fuelType: 'diesel',
    vin: 'SJNFAAJ11U1123456',
    responsiblePerson: 'Борис Тодоров',
    regExpiry: daysFromNow(220),
    insExpiry: daysFromNow(180),
    inspExpiry: daysFromNow(250),
    userId: 'demo',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '10',
    plate: 'PR 5555 EE',
    vehicleType: 'van',
    vehicleModel: 'Ford Transit',
    year: 2017,
    color: 'Бела',
    fuelType: 'diesel',
    vin: 'WF0XXXGCDXHA12345',
    responsiblePerson: 'Горан Илиев',
    regExpiry: daysFromNow(20),
    insExpiry: daysFromNow(15),
    inspExpiry: daysFromNow(40),
    userId: 'demo',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '11',
    plate: 'KP 6666 FF',
    vehicleType: 'car',
    vehicleModel: 'Renault Megane',
    year: 2020,
    color: 'Жолта',
    fuelType: 'petrol',
    vin: 'VF1RFB00X63123456',
    responsiblePerson: 'Маја Атанасова',
    regExpiry: daysFromNow(320),
    insExpiry: daysFromNow(280),
    inspExpiry: daysFromNow(350),
    userId: 'demo',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '12',
    plate: 'DB 7777 GG',
    vehicleType: 'truck',
    vehicleModel: 'MAN TGX',
    year: 2018,
    color: 'Црна',
    fuelType: 'diesel',
    vin: 'WMAN08ZZ19Y123456',
    responsiblePerson: 'Владо Стефанов',
    regExpiry: daysFromNow(-10),
    insExpiry: daysFromNow(50),
    inspExpiry: daysFromNow(70),
    userId: 'demo',
    createdAt: now,
    updatedAt: now,
  },
];
};

function getMinExpiry(vehicle: Vehicle): { days: number; status: ExpiryStatus; type: string } {
  const dates = [
    { type: 'reg', days: getDaysUntil(vehicle.regExpiry) },
    { type: 'ins', days: getDaysUntil(vehicle.insExpiry) },
    { type: 'insp', days: getDaysUntil(vehicle.inspExpiry) },
  ];
  const min = dates.reduce((a, b) => (a.days < b.days ? a : b));
  const status: ExpiryStatus = min.days <= 0 ? 'expired' : min.days <= 7 ? 'urgent' : min.days <= 30 ? 'soon' : 'ok';
  return { days: min.days, status, type: min.type };
}

// Cyrillic to Latin transliteration map for Macedonian names
const cyrillicToLatinMap: Record<string, string> = {
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Ѓ': 'Gj', 'Е': 'E', 'Ж': 'Zh',
  'З': 'Z', 'Ѕ': 'Dz', 'И': 'I', 'Ј': 'J', 'К': 'K', 'Л': 'L', 'Љ': 'Lj', 'М': 'M',
  'Н': 'N', 'Њ': 'Nj', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'Ќ': 'Kj',
  'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'Ch', 'Џ': 'Dzh', 'Ш': 'Sh',
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'ѓ': 'gj', 'е': 'e', 'ж': 'zh',
  'з': 'z', 'ѕ': 'dz', 'и': 'i', 'ј': 'j', 'к': 'k', 'л': 'l', 'љ': 'lj', 'м': 'm',
  'н': 'n', 'њ': 'nj', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'ќ': 'kj',
  'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'џ': 'dzh', 'ш': 'sh',
  // Serbian specific
  'Ћ': 'Ć', 'ћ': 'ć', 'Ђ': 'Đ', 'ђ': 'đ',
};

// Transliterate Cyrillic text to Latin for non-Cyrillic languages
function transliterate(text: string | undefined, lang: Language): string {
  if (!text) return '';
  // Keep Cyrillic for Macedonian and Serbian
  if (lang === 'mk' || lang === 'sr') return text;
  // Transliterate for other languages (en, sq, tr)
  return text.split('').map(char => cyrillicToLatinMap[char] || char).join('');
}

// Format date for input field (YYYY-MM-DD)
function formatDateForInput(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
}

interface VehicleFormData {
  // Vehicle Info
  vehicleType: VehicleType | '';
  vehicleModel: string;
  year: string;
  color: string;
  fuelType: FuelType | '';
  // Identification
  plate: string;
  vin: string;
  // Assignment
  responsiblePerson: string;
  // Purchase Details
  purchaseDate: string;
  purchasePrice: string;
  mileage: string;
  // Expiry Dates
  regExpiry: string;
  insExpiry: string;
  inspExpiry: string;
  // Notes
  notes: string;
}

// Generate empty form data - called at runtime to avoid hydration issues
const getEmptyFormData = (): VehicleFormData => {
  const oneYearFromNow = formatDateForInput(daysFromNow(365));
  return {
    vehicleType: '',
    vehicleModel: '',
    year: '',
    color: '',
    fuelType: '',
    plate: '',
    vin: '',
    responsiblePerson: '',
    purchaseDate: '',
    purchasePrice: '',
    mileage: '',
    regExpiry: oneYearFromNow,
    insExpiry: oneYearFromNow,
    inspExpiry: oneYearFromNow,
    notes: '',
  };
};

// License plate validation - format: BT 1234 CD (letters, numbers, spaces)
const formatLicensePlate = (value: string): string => {
  // Remove invalid characters, keep only letters, numbers, and spaces
  const cleaned = value.toUpperCase().replace(/[^A-Z0-9 ]/g, '');
  // Collapse multiple spaces into single space
  return cleaned.replace(/\s+/g, ' ');
};

// VIN validation - only uppercase letters and numbers, 17 characters
const formatVIN = (value: string): string => {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 17);
};

// Format number with thousand separators
const formatCurrency = (value: string): string => {
  const num = value.replace(/[^\d]/g, '');
  return num ? parseInt(num).toLocaleString() : '';
};

export default function DemoPage() {
  const theme = useTheme();
  const [language, setLanguage] = useState<Language>('mk');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statsFilter, setStatsFilter] = useState<'all' | 'attention' | 'soon' | 'ok'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  
  // Sort state
  type SortColumn = 'model' | 'year' | 'fuel' | 'plate' | 'status' | 'notes' | null;
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  
  // Form section expand states
  const [showPurchaseDetails, setShowPurchaseDetails] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  
  // Action menu state
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [actionMenuVehicle, setActionMenuVehicle] = useState<Vehicle | null>(null);
  
  // Form data - initialize with empty object, will be set properly on first open
  const [formData, setFormData] = useState<VehicleFormData>(() => getEmptyFormData());
  
  // Snackbar
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  
  // Export menu
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    setLanguage(getLanguageFromStorage());
    // Generate demo vehicles client-side to avoid hydration mismatch
    setVehicles(generateDemoVehicles());
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setLanguageToStorage(lang);
    setAnchorEl(null);
  };

  const t = getTranslations(language);
  const currentLang = languages.find(l => l.code === language);

  // Translations
  const text: Record<string, Record<string, string>> = {
    addVehicle: { en: 'Add Vehicle', mk: 'Додај возило', sq: 'Shto automjet', tr: 'Araç Ekle', sr: 'Додај возило' },
    importCSV: { en: 'Import CSV', mk: 'Увези CSV', sq: 'Importo CSV', tr: 'CSV İçe Aktar', sr: 'Увези CSV' },
    exportCSV: { en: 'Export', mk: 'Извези', sq: 'Eksporto', tr: 'Dışa Aktar', sr: 'Извези' },
    exportAsCSV: { en: 'Export as CSV', mk: 'Извези како CSV', sq: 'Eksporto si CSV', tr: 'CSV olarak dışa aktar', sr: 'Извези као CSV' },
    exportAsPDF: { en: 'Export as PDF', mk: 'Извези како PDF', sq: 'Eksporto si PDF', tr: 'PDF olarak dışa aktar', sr: 'Извези као PDF' },
    exportAsExcel: { en: 'Export as Excel', mk: 'Извези како Excel', sq: 'Eksporto si Excel', tr: 'Excel olarak dışa aktar', sr: 'Извези као Excel' },
    exportAsJSON: { en: 'Export as JSON', mk: 'Извези како JSON', sq: 'Eksporto si JSON', tr: 'JSON olarak dışa aktar', sr: 'Извези као JSON' },
    importSuccess: { en: 'Vehicles imported successfully', mk: 'Возилата се увезени успешно', sq: 'Automjetet u importuan me sukses', tr: 'Araçlar başarıyla içe aktarıldı', sr: 'Возила су успешно увезена' },
    exportSuccess: { en: 'Table exported successfully', mk: 'Табелата е извезена успешно', sq: 'Tabela u eksportua me sukses', tr: 'Tablo başarıyla dışa aktarıldı', sr: 'Табела је успешно извезена' },
    editVehicle: { en: 'View/Edit Vehicle', mk: 'Преглед/Измени возило', sq: 'Shiko/Ndrysho automjet', tr: 'Aracı Görüntüle/Düzenle', sr: 'Прегледај/Измени возило' },
    deleteVehicle: { en: 'Delete Vehicle', mk: 'Избриши возило', sq: 'Fshi automjet', tr: 'Aracı Sil', sr: 'Обриши возило' },
    plate: { en: 'License Plate', mk: 'Регистарска таблица', sq: 'Targa', tr: 'Plaka', sr: 'Регистарска таблица' },
    vehicleModel: { en: 'Vehicle Model', mk: 'Модел на возило', sq: 'Modeli i automjetit', tr: 'Araç Modeli', sr: 'Модел возила' },
    vin: { en: 'VIN', mk: 'Број на шасија', sq: 'Numri i shasisë', tr: 'Şasi Numarası', sr: 'Број шасије' },
    responsiblePerson: { en: 'Responsible Person', mk: 'Одговорно лице', sq: 'Personi përgjegjës', tr: 'Sorumlu Kişi', sr: 'Одговорно лице' },
    regExpiry: { en: 'Registration Expiry', mk: 'Истек на регистрација', sq: 'Skadimi i regjistrimit', tr: 'Kayıt Bitiş', sr: 'Истек регистрације' },
    insExpiry: { en: 'Insurance Expiry', mk: 'Истек на осигурување', sq: 'Skadimi i sigurimit', tr: 'Sigorta Bitiş', sr: 'Истек осигурања' },
    inspExpiry: { en: 'Inspection Expiry', mk: 'Истек на преглед', sq: 'Skadimi i kontrollit', tr: 'Muayene Bitiş', sr: 'Истек прегледа' },
    cancel: { en: 'Cancel', mk: 'Откажи', sq: 'Anulo', tr: 'İptal', sr: 'Откажи' },
    save: { en: 'Save', mk: 'Зачувај', sq: 'Ruaj', tr: 'Kaydet', sr: 'Сачувај' },
    delete: { en: 'Delete', mk: 'Избриши', sq: 'Fshi', tr: 'Sil', sr: 'Обриши' },
    deleteConfirm: { 
      en: 'Are you sure you want to delete this vehicle?', 
      mk: 'Дали сте сигурни дека сакате да го избришете ова возило?', 
      sq: 'Jeni të sigurt që dëshironi të fshini këtë automjet?', 
      tr: 'Bu aracı silmek istediğinizden emin misiniz?', 
      sr: 'Да ли сте сигурни да желите да обришете ово возило?' 
    },
    vehicleAdded: { en: 'Vehicle added successfully', mk: 'Возилото е додадено успешно', sq: 'Automjeti u shtua me sukses', tr: 'Araç başarıyla eklendi', sr: 'Возило је успешно додато' },
    vehicleUpdated: { en: 'Vehicle updated successfully', mk: 'Возилото е ажурирано успешно', sq: 'Automjeti u përditësua me sukses', tr: 'Araç başarıyla güncellendi', sr: 'Возило је успешно ажурирано' },
    vehicleDeleted: { en: 'Vehicle deleted successfully', mk: 'Возилото е избришано успешно', sq: 'Automjeti u fshi me sukses', tr: 'Araç başarıyla silindi', sr: 'Возило је успешно обрисано' },
    yourVehicles: { en: 'Your Vehicles', mk: 'Ваши возила', sq: 'Automjetet tuaja', tr: 'Araçlarınız', sr: 'Ваша возила' },
    companyName: { en: 'Demo Company Ltd.', mk: 'Демо Компанија ДООЕЛ', sq: 'Demo Kompania SH.P.K.', tr: 'Demo Şirketi Ltd.', sr: 'Демо Компанија Д.О.О.' },
    allVehicles: { en: 'All Vehicles', mk: 'Сите возила', sq: 'Të gjitha automjetet', tr: 'Tüm Araçlar', sr: 'Сва возила' },
    needsAttention: { en: 'Needs Attention', mk: 'Бараат внимание', sq: 'Kërkon vëmendje', tr: 'Dikkat Gerekiyor', sr: 'Захтева пажњу' },
    dueSoon: { en: 'Due Soon', mk: 'Наскоро', sq: 'Së shpejti', tr: 'Yakında', sr: 'Ускоро' },
    allGood: { en: 'All Good', mk: 'Во ред', sq: 'Gjithçka OK', tr: 'Her şey yolunda', sr: 'Све у реду' },
    welcome: { en: 'Welcome to Demo Dashboard', mk: 'Добредојдовте во демо', sq: 'Mirësevini në demo', tr: 'Demo Paneline Hoş Geldiniz', sr: 'Добродошли у демо' },
    welcomeDesc: { 
      en: 'This is a preview of how VozenPark.mk works. All data shown is for demonstration purposes.', 
      mk: 'Ова е преглед на тоа како работи VozenPark.mk. Сите прикажани податоци се за демонстрација.', 
      sq: 'Kjo është një pamje paraprake se si funksionon VozenPark.mk. Të gjitha të dhënat e treguara janë për demonstrim.', 
      tr: 'Bu, VozenPark.mk\'ın nasıl çalıştığının bir önizlemesidir. Gösterilen tüm veriler gösterim amaçlıdır.', 
      sr: 'Ово је преглед како функционише VozenPark.mk. Сви приказани подаци су у демонстративне сврхе.' 
    },
    home: { en: 'Home', mk: 'Почетна', sq: 'Ballina', tr: 'Ana Sayfa', sr: 'Почетна' },
    edit: { en: 'View/Edit', mk: 'Преглед/Измени', sq: 'Shiko/Ndrysho', tr: 'Görüntüle/Düzenle', sr: 'Прегледај/Измени' },
    expired: { en: 'Expired', mk: 'Истечено', sq: 'Skaduar', tr: 'Süresi Dolmuş', sr: 'Истекло' },
    daysLeft: { en: 'days left', mk: 'дена', sq: 'ditë të mbetura', tr: 'gün kaldı', sr: 'дана' },
    registration: { en: 'Registration', mk: 'Регистрација', sq: 'Regjistrim', tr: 'Kayıt', sr: 'Регистрација' },
    insurance: { en: 'Insurance', mk: 'Осигурување', sq: 'Sigurim', tr: 'Sigorta', sr: 'Осигурање' },
    inspection: { en: 'Inspection', mk: 'Преглед', sq: 'Kontroll', tr: 'Muayene', sr: 'Преглед' },
    emailReminders: { en: 'Email Reminders Active', mk: 'Е-пошта потсетници активни', sq: 'Kujtesa me email aktive', tr: 'E-posta Hatırlatıcıları Aktif', sr: 'Подсетници путем е-поште активни' },
    emailRemindersDesc: { 
      en: 'You will receive notifications 30, 7, and 1 day before each expiration date.', 
      mk: 'Ќе добивате известувања 30, 7 и 1 ден пред секој датум на истекување.', 
      sq: 'Do të merrni njoftime 30, 7 dhe 1 ditë para çdo date skadimi.', 
      tr: 'Her son kullanma tarihinden 30, 7 ve 1 gün önce bildirim alacaksınız.', 
      sr: 'Добићете обавештења 30, 7 и 1 дан пре сваког датума истека.' 
    },
    noVehicles: { en: 'No vehicles yet. Add your first one!', mk: 'Нема возила. Додајте го првото!', sq: 'Nuk ka automjete ende. Shtoni të parin!', tr: 'Henüz araç yok. İlkini ekleyin!', sr: 'Нема возила. Додајте прво!' },
    namePlaceholder: { en: 'John Smith', mk: 'Иван Петров', sq: 'Agron Krasniqi', tr: 'Ahmet Yılmaz', sr: 'Иван Петров' },
    plateHelperText: { en: 'Format: BT 1234 CD', mk: 'Формат: BT 1234 CD', sq: 'Formati: BT 1234 CD', tr: 'Format: BT 1234 CD', sr: 'Формат: BT 1234 CD' },
    vinHelperText: { en: '17 characters, letters and numbers only', mk: '17 знаци, само букви и бројки', sq: '17 karaktere, vetëm shkronja dhe numra', tr: '17 karakter, sadece harf ve rakam', sr: '17 знакова, само слова и бројеви' },
    modelPlaceholder: { en: 'e.g. Golf 7 TDI', mk: 'пр. Golf 7 TDI', sq: 'p.sh. Golf 7 TDI', tr: 'örn. Golf 7 TDI', sr: 'нпр. Golf 7 TDI' },
    status: { en: 'Expiration', mk: 'Истекување', sq: 'Skadimi', tr: 'Bitiş', sr: 'Истек' },
    expiryDate: { en: 'Expiry Date', mk: 'Датум на истекување', sq: 'Data e skadimit', tr: 'Son Kullanma', sr: 'Датум истека' },
    expiryDates: { en: 'Expiry Dates', mk: 'Датуми на истекување', sq: 'Datat e skadimit', tr: 'Son Kullanma Tarihleri', sr: 'Датуми истека' },
    // New field translations
    vehicleType: { en: 'Vehicle Type', mk: 'Тип на возило', sq: 'Lloji i automjetit', tr: 'Araç Tipi', sr: 'Тип возила' },
    year: { en: 'Year', mk: 'Година', sq: 'Viti', tr: 'Yıl', sr: 'Година' },
    color: { en: 'Color', mk: 'Боја', sq: 'Ngjyra', tr: 'Renk', sr: 'Боја' },
    fuelType: { en: 'Fuel Type', mk: 'Гориво', sq: 'Karburanti', tr: 'Yakıt Tipi', sr: 'Гориво' },
    purchaseDate: { en: 'Purchase Date', mk: 'Датум на купување', sq: 'Data e blerjes', tr: 'Satın Alma Tarihi', sr: 'Датум куповине' },
    purchasePrice: { en: 'Purchase Price', mk: 'Цена на купување', sq: 'Çmimi i blerjes', tr: 'Satın Alma Fiyatı', sr: 'Цена куповине' },
    mileage: { en: 'Mileage (km)', mk: 'Километража', sq: 'Kilometrazhi', tr: 'Kilometre', sr: 'Километража' },
    notes: { en: 'Notes', mk: 'Забелешки', sq: 'Shënime', tr: 'Notlar', sr: 'Напомене' },
    // Search and filter translations
    search: { 
      en: 'Search by plate, model, VIN, person, type, status...', 
      mk: 'Пребарај по таблица, модел, VIN, лице, тип, статус...', 
      sq: 'Kërko sipas targës, modelit, VIN, personit, tipit, statusit...', 
      tr: 'Plaka, model, VIN, kişi, tip, durum ara...', 
      sr: 'Претражи по таблици, моделу, VIN, особи, типу, статусу...' 
    },
    filterByStatus: { en: 'Filter by status', mk: 'Филтрирај по статус', sq: 'Filtro sipas statusit', tr: 'Duruma göre filtrele', sr: 'Филтрирај по статусу' },
    filterByType: { en: 'Filter by type', mk: 'Филтрирај по тип', sq: 'Filtro sipas llojit', tr: 'Tipe göre filtrele', sr: 'Филтрирај по типу' },
    allTypes: { en: 'All Types', mk: 'Сите типови', sq: 'Të gjitha llojet', tr: 'Tüm Tipler', sr: 'Сви типови' },
    // Form section translations
    vehicleInfo: { en: 'Vehicle Information', mk: 'Информации за возило', sq: 'Informacione automjeti', tr: 'Araç Bilgileri', sr: 'Информације о возилу' },
    identification: { en: 'Identification', mk: 'Идентификација', sq: 'Identifikimi', tr: 'Kimlik', sr: 'Идентификација' },
    assignment: { en: 'Assignment', mk: 'Доделување', sq: 'Caktimi', tr: 'Atama', sr: 'Додела' },
    purchaseDetails: { en: 'Purchase Details', mk: 'Детали за купување', sq: 'Detajet e blerjes', tr: 'Satın Alma Detayları', sr: 'Детаљи куповине' },
    optional: { en: 'Optional', mk: 'Опционално', sq: 'Opsionale', tr: 'İsteğe bağlı', sr: 'Опционално' },
    selectType: { en: 'Select type', mk: 'Избери тип', sq: 'Zgjidh llojin', tr: 'Tip seç', sr: 'Изабери тип' },
    selectYear: { en: 'Select year', mk: 'Избери година', sq: 'Zgjidh vitin', tr: 'Yıl seç', sr: 'Изабери годину' },
    selectFuel: { en: 'Select fuel', mk: 'Избери гориво', sq: 'Zgjidh karburantin', tr: 'Yakıt seç', sr: 'Изабери гориво' },
    noResults: { en: 'No vehicles match your search', mk: 'Нема возила што одговараат на пребарувањето', sq: 'Asnjë automjet nuk përputhet', tr: 'Aramanıza uygun araç yok', sr: 'Нема возила која одговарају претрази' },
    clearFilters: { en: 'Clear Filters', mk: 'Исчисти филтри', sq: 'Pastro filtrat', tr: 'Filtreleri Temizle', sr: 'Очисти филтере' },
    noVehicles: { en: 'No vehicles yet', mk: 'Сè уште нема возила', sq: 'Ende nuk ka automjete', tr: 'Henüz araç yok', sr: 'Још нема возила' },
    actions: { en: 'Actions', mk: 'Акции', sq: 'Veprimet', tr: 'İşlemler', sr: 'Акције' },
  };

  const txt = (key: string) => text[key]?.[language] || text[key]?.['en'] || key;

  // Calculate stats
  const stats = useMemo(() => {
    let urgent = 0, soon = 0, ok = 0;
    vehicles.forEach(v => {
      const { status } = getMinExpiry(v);
      if (status === 'expired' || status === 'urgent') urgent++;
      else if (status === 'soon') soon++;
      else ok++;
    });
    return { urgent, soon, ok, total: vehicles.length };
  }, [vehicles]);
  
  // Filter vehicles based on search and filters
  const filteredVehicles = useMemo(() => {
    let result = vehicles.filter(v => {
      // Search filter - searches everything in the table across ALL languages
      const searchLower = searchQuery.toLowerCase();
      const minExpiryInfo = getMinExpiry(v);
      const fuelLabel = v.fuelType ? fuelTypeOptions.find(f => f.value === v.fuelType)?.label : null;
      const typeLabel = v.vehicleType ? vehicleTypeOptions.find(t => t.value === v.vehicleType)?.label : null;
      
      // Status translations in all languages for search
      const statusTranslations: Record<string, string[]> = {
        expired: ['expired', 'истечено', 'skaduar', 'süresi dolmuş', 'истекло'],
        urgent: ['urgent', 'итно', 'urgjent', 'acil', 'хитно', 'attention', 'внимание', 'vëmendje', 'dikkat', 'пажња'],
        soon: ['soon', 'наскоро', 'së shpejti', 'yakında', 'ускоро', 'due soon'],
        ok: ['ok', 'во ред', 'në rregull', 'tamam', 'у реду', 'good', 'добро'],
      };
      
      const matchesSearch = !searchQuery || 
        // Core vehicle data
        v.plate.toLowerCase().includes(searchLower) ||
        v.vehicleModel?.toLowerCase().includes(searchLower) ||
        v.vin?.toLowerCase().includes(searchLower) ||
        v.year?.toString().includes(searchLower) ||
        v.color?.toLowerCase().includes(searchLower) ||
        
        // Person responsible
        v.responsiblePerson?.toLowerCase().includes(searchLower) ||
        
        // Notes
        v.notes?.toLowerCase().includes(searchLower) ||
        
        // Fuel type - raw value and all language translations
        v.fuelType?.toLowerCase().includes(searchLower) ||
        (fuelLabel && Object.values(fuelLabel).some(label => label.toLowerCase().includes(searchLower))) ||
        
        // Vehicle type - raw value and all language translations
        v.vehicleType?.toLowerCase().includes(searchLower) ||
        (typeLabel && Object.values(typeLabel).some(label => label.toLowerCase().includes(searchLower))) ||
        
        // Expiration status - match in all languages
        (minExpiryInfo.status && statusTranslations[minExpiryInfo.status]?.some(
          term => term.toLowerCase().includes(searchLower) || searchLower.includes(term.toLowerCase())
        )) ||
        
        // Days remaining (e.g., search "3d" or "128")
        `${minExpiryInfo.days}d`.includes(searchLower) ||
        minExpiryInfo.days.toString() === searchLower;
      
      // Status filter
      const minExpiry = getMinExpiry(v);
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'expired' && minExpiry.status === 'expired') ||
        (statusFilter === 'urgent' && minExpiry.status === 'urgent') ||
        (statusFilter === 'soon' && minExpiry.status === 'soon') ||
        (statusFilter === 'ok' && minExpiry.status === 'ok');
      
      // Type filter
      const matchesType = typeFilter === 'all' || v.vehicleType === typeFilter;
      
      // Stats card filter (Needs Attention = expired+urgent, Due Soon = soon, All Good = ok)
      const matchesStats = statsFilter === 'all' ||
        (statsFilter === 'attention' && (minExpiry.status === 'expired' || minExpiry.status === 'urgent')) ||
        (statsFilter === 'soon' && minExpiry.status === 'soon') ||
        (statsFilter === 'ok' && minExpiry.status === 'ok');
      
      return matchesSearch && matchesStatus && matchesType && matchesStats;
    });
    
    // Apply sorting
    if (sortColumn) {
      result = [...result].sort((a, b) => {
        let compareA: string | number = '';
        let compareB: string | number = '';
        
        switch (sortColumn) {
          case 'model':
            compareA = a.vehicleModel?.toLowerCase() || '';
            compareB = b.vehicleModel?.toLowerCase() || '';
            break;
          case 'year':
            compareA = a.year || 0;
            compareB = b.year || 0;
            break;
          case 'fuel':
            compareA = a.fuelType || '';
            compareB = b.fuelType || '';
            break;
          case 'plate':
            compareA = a.plate.toLowerCase();
            compareB = b.plate.toLowerCase();
            break;
          case 'status':
            compareA = getMinExpiry(a).days;
            compareB = getMinExpiry(b).days;
            break;
          case 'notes':
            compareA = (a.notes || '').toLowerCase();
            compareB = (b.notes || '').toLowerCase();
            break;
        }
        
        if (compareA < compareB) return sortDirection === 'asc' ? -1 : 1;
        if (compareA > compareB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return result;
  }, [vehicles, searchQuery, statusFilter, typeFilter, statsFilter, sortColumn, sortDirection]);
  
  // Paginated vehicles
  const totalPages = Math.ceil(filteredVehicles.length / rowsPerPage);
  const paginatedVehicles = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredVehicles.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredVehicles, currentPage, rowsPerPage]);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter, statsFilter]);

  const getStatusColor = (status: ExpiryStatus) => {
    switch (status) {
      case 'expired':
      case 'urgent':
        return theme.palette.error.main;
      case 'soon':
        return theme.palette.warning.main;
      case 'ok':
        return theme.palette.success.main;
    }
  };
  
  // Check if a date field needs attention (for edit dialog styling)
  const getDateFieldStatus = (dateStr: string): { needsAttention: boolean; status: ExpiryStatus } => {
    if (!dateStr) return { needsAttention: false, status: 'ok' };
    const days = getDaysUntil(new Date(dateStr).toISOString());
    const status: ExpiryStatus = days <= 0 ? 'expired' : days <= 7 ? 'urgent' : days <= 30 ? 'soon' : 'ok';
    return { needsAttention: status === 'expired' || status === 'urgent', status };
  };

  const getStatusIcon = (status: ExpiryStatus) => {
    switch (status) {
      case 'expired':
      case 'urgent':
        return WarningAmberOutlined;
      case 'soon':
        return ScheduleOutlined;
      case 'ok':
        return CheckCircleOutlined;
    }
  };
  
  const getVehicleTypeIcon = (vehicleType?: string) => {
    switch (vehicleType) {
      case 'car':
        return DirectionsCarOutlined;
      case 'suv':
        return DirectionsCarOutlined;
      case 'van':
        return LocalShippingOutlined;
      case 'truck':
        return LocalShippingOutlined;
      case 'motorcycle':
        return TwoWheelerOutlined;
      default:
        return DirectionsCarOutlined;
    }
  };
  
  const openActionMenu = (event: React.MouseEvent<HTMLElement>, vehicle: Vehicle) => {
    setActionMenuAnchor(event.currentTarget);
    setActionMenuVehicle(vehicle);
  };
  
  const closeActionMenu = () => {
    setActionMenuAnchor(null);
    setActionMenuVehicle(null);
  };

  // Handlers
  const openAddDialog = () => {
    setFormData(getEmptyFormData());
    setShowPurchaseDetails(false);
    setShowNotes(false);
    setAddDialogOpen(true);
  };

  const openEditDialog = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({
      vehicleType: vehicle.vehicleType || '',
      vehicleModel: vehicle.vehicleModel || '',
      year: vehicle.year?.toString() || '',
      color: vehicle.color || '',
      fuelType: vehicle.fuelType || '',
      plate: vehicle.plate,
      vin: vehicle.vin || '',
      responsiblePerson: vehicle.responsiblePerson || '',
      purchaseDate: vehicle.purchaseDate ? formatDateForInput(vehicle.purchaseDate as unknown as string) : '',
      purchasePrice: vehicle.purchasePrice?.toString() || '',
      mileage: vehicle.mileage?.toString() || '',
      regExpiry: formatDateForInput(vehicle.regExpiry as unknown as string),
      insExpiry: formatDateForInput(vehicle.insExpiry as unknown as string),
      inspExpiry: formatDateForInput(vehicle.inspExpiry as unknown as string),
      notes: vehicle.notes || '',
    });
    setShowPurchaseDetails(!!(vehicle.purchaseDate || vehicle.purchasePrice || vehicle.mileage));
    setShowNotes(!!vehicle.notes);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDeleteDialogOpen(true);
  };

  const handleAddVehicle = () => {
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      vehicleType: formData.vehicleType || undefined,
      vehicleModel: formData.vehicleModel || undefined,
      year: formData.year ? parseInt(formData.year) : undefined,
      color: formData.color || undefined,
      fuelType: formData.fuelType || undefined,
      plate: formData.plate.toUpperCase(),
      vin: formData.vin || undefined,
      responsiblePerson: formData.responsiblePerson || undefined,
      purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate) : undefined,
      purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice.replace(/,/g, '')) : undefined,
      mileage: formData.mileage ? parseInt(formData.mileage.replace(/,/g, '')) : undefined,
      regExpiry: new Date(formData.regExpiry).toISOString(),
      insExpiry: new Date(formData.insExpiry).toISOString(),
      inspExpiry: new Date(formData.inspExpiry).toISOString(),
      notes: formData.notes || undefined,
      userId: 'demo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setVehicles([newVehicle, ...vehicles]);
    setAddDialogOpen(false);
    setSnackbar({ open: true, message: txt('vehicleAdded'), severity: 'success' });
  };

  const handleEditVehicle = () => {
    if (!selectedVehicle) return;
    setVehicles(vehicles.map(v => 
      v.id === selectedVehicle.id 
        ? {
            ...v,
            vehicleType: formData.vehicleType || undefined,
            vehicleModel: formData.vehicleModel || undefined,
            year: formData.year ? parseInt(formData.year) : undefined,
            color: formData.color || undefined,
            fuelType: formData.fuelType || undefined,
            plate: formData.plate.toUpperCase(),
            vin: formData.vin || undefined,
            responsiblePerson: formData.responsiblePerson || undefined,
            purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate) : undefined,
            purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice.replace(/,/g, '')) : undefined,
            mileage: formData.mileage ? parseInt(formData.mileage.replace(/,/g, '')) : undefined,
            regExpiry: new Date(formData.regExpiry).toISOString(),
            insExpiry: new Date(formData.insExpiry).toISOString(),
            inspExpiry: new Date(formData.inspExpiry).toISOString(),
            notes: formData.notes || undefined,
            updatedAt: new Date().toISOString(),
          }
        : v
    ));
    setEditDialogOpen(false);
    setSelectedVehicle(null);
    setSnackbar({ open: true, message: txt('vehicleUpdated'), severity: 'success' });
  };

  const handleDeleteVehicle = () => {
    if (!selectedVehicle) return;
    setVehicles(vehicles.filter(v => v.id !== selectedVehicle.id));
    setDeleteDialogOpen(false);
    setSelectedVehicle(null);
    setSnackbar({ open: true, message: txt('vehicleDeleted'), severity: 'success' });
  };

  // Export handlers for different formats
  const getExportData = () => {
    return filteredVehicles.map(v => ({
      plate: v.plate,
      model: v.vehicleModel || '',
      vin: v.vin || '',
      type: v.vehicleType || '',
      year: v.year?.toString() || '',
      fuel: v.fuelType || '',
      responsiblePerson: v.responsiblePerson || '',
      regExpiry: formatDate(v.regExpiry, language),
      insExpiry: formatDate(v.insExpiry, language),
      inspExpiry: formatDate(v.inspExpiry, language),
      notes: v.notes || '',
    }));
  };

  const handleExportCSV = () => {
    const headers = ['Plate', 'Model', 'VIN', 'Type', 'Year', 'Fuel', 'Responsible Person', 'Reg Expiry', 'Ins Expiry', 'Insp Expiry', 'Notes'];
    const data = getExportData();
    const rows = data.map(v => [v.plate, v.model, v.vin, v.type, v.year, v.fuel, v.responsiblePerson, v.regExpiry, v.insExpiry, v.inspExpiry, v.notes]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `vehicles_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    
    setExportMenuAnchor(null);
    setSnackbar({ open: true, message: txt('exportSuccess'), severity: 'success' });
  };

  const handleExportJSON = () => {
    const data = getExportData();
    const jsonContent = JSON.stringify(data, null, 2);
    
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `vehicles_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    
    setExportMenuAnchor(null);
    setSnackbar({ open: true, message: txt('exportSuccess'), severity: 'success' });
  };

  const handleExportExcel = () => {
    // For demo, export as CSV with Excel-friendly format
    const headers = ['Plate', 'Model', 'VIN', 'Type', 'Year', 'Fuel', 'Responsible Person', 'Reg Expiry', 'Ins Expiry', 'Insp Expiry', 'Notes'];
    const data = getExportData();
    const rows = data.map(v => [v.plate, v.model, v.vin, v.type, v.year, v.fuel, v.responsiblePerson, v.regExpiry, v.insExpiry, v.inspExpiry, v.notes]);
    
    const csvContent = '\uFEFF' + [ // BOM for Excel UTF-8
      headers.join('\t'),
      ...rows.map(row => row.join('\t'))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `vehicles_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
    URL.revokeObjectURL(link.href);
    
    setExportMenuAnchor(null);
    setSnackbar({ open: true, message: txt('exportSuccess'), severity: 'success' });
  };

  const handleExportPDF = () => {
    // For demo, show info that PDF export would require a library
    setExportMenuAnchor(null);
    setSnackbar({ open: true, message: 'PDF export coming soon', severity: 'info' });
  };

  // Import CSV
  const handleImportCSV = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length < 2) return;
        
        // Skip header row, parse data rows
        const newVehicles: Vehicle[] = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].match(/(".*?"|[^,]+)/g)?.map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"')) || [];
          if (values.length >= 4) {
            newVehicles.push({
              id: `imported-${Date.now()}-${i}`,
              userId: 'demo',
              plate: values[0] || `NEW-${i}`,
              vehicleModel: values[1] || undefined,
              vin: values[2] || undefined,
              vehicleType: (values[3] as VehicleType) || undefined,
              year: values[4] ? parseInt(values[4]) : undefined,
              fuelType: (values[5] as FuelType) || undefined,
              responsiblePerson: values[6] || undefined,
              regExpiry: values[7] ? new Date(values[7]).toISOString() : new Date().toISOString(),
              insExpiry: values[8] ? new Date(values[8]).toISOString() : new Date().toISOString(),
              inspExpiry: values[9] ? new Date(values[9]).toISOString() : new Date().toISOString(),
              notes: values[10] || undefined,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        }
        
        if (newVehicles.length > 0) {
          setVehicles([...newVehicles, ...vehicles]);
          setSnackbar({ open: true, message: `${txt('importSuccess')} (${newVehicles.length})`, severity: 'success' });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* App Bar */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: 'blur(12px) saturate(180%)',
          WebkitBackdropFilter: 'blur(12px) saturate(180%)',
          color: 'text.primary',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        }}
      >
        <Toolbar sx={{ gap: { xs: 1, sm: 2 }, px: { xs: 1.5, sm: 3 } }}>
          {/* Logo - Clickable to Home */}
          <Stack 
            component={Link}
            href="/"
            direction="row" 
            alignItems="center" 
            spacing={0.75} 
            sx={{ 
              flex: 1,
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': {
                opacity: 0.8,
              },
              transition: 'opacity 0.2s',
              minWidth: 0, // Allow shrinking
            }}
          >
            <Box
              component="img"
              src="/VozenPark_logo.svg"
              alt="VozenPark"
              sx={{ height: 20, flexShrink: 0 }}
            />
            <Typography 
              fontWeight={600} 
              color="text.primary" 
              sx={{ 
                lineHeight: 1,
                fontSize: '1rem',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              VozenPark.mk
            </Typography>
            <Chip 
              label="Demo" 
              size="small" 
              color="primary"
              sx={{ 
                ml: { xs: 0.5, sm: 1 }, 
                fontWeight: 600, 
                flexShrink: 0, 
                fontSize: '0.75rem',
                height: 24,
                minWidth: 48,
                borderRadius: '12px',
                letterSpacing: '0.02em',
              }}
            />
          </Stack>

          {/* Desktop Navigation */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button
              onClick={(e) => setAnchorEl(e.currentTarget)}
              endIcon={<KeyboardArrowDown sx={{ fontSize: 16 }} />}
              sx={{ 
                color: 'text.secondary',
                fontWeight: 500,
                fontSize: '0.875rem',
                minWidth: 'auto',
                px: 1.5,
              }}
            >
              {language.toUpperCase()}
            </Button>

            {/* Divider */}
            <Typography sx={{ color: 'divider' }}>|</Typography>

            <Button
              component={Link}
              href="/pricing"
              variant="text"
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.875rem',
                fontWeight: 500,
                minWidth: 'auto',
                px: 1.5,
              }}
            >
              {{ en: 'Pricing', mk: 'Цени', sq: 'Çmimet', tr: 'Fiyatlar', sr: 'Цене' }[language]}
            </Button>

            <Button
              component={Link}
              href="/"
              variant="text"
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.875rem',
                fontWeight: 500,
                minWidth: 'auto',
                px: 1.5,
              }}
            >
              {txt('home')}
            </Button>
          </Stack>

          {/* Mobile Hamburger Menu */}
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{ display: { xs: 'flex', md: 'none' } }}
            aria-label="Open menu"
          >
            <MenuOutlined />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: 'background.paper',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography fontWeight={600} color="text.primary">
                VozenPark.mk
              </Typography>
              <Chip label="Demo" size="small" color="primary" sx={{ fontWeight: 600, fontSize: '0.7rem', height: 20 }} />
            </Stack>
            <IconButton onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <CloseOutlined />
            </IconButton>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          
          {/* Navigation Links */}
          <List sx={{ flex: 1 }}>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/"
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary={txt('home')} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/pricing"
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary={{ en: 'Pricing', mk: 'Цени', sq: 'Çmimet', tr: 'Fiyatlar', sr: 'Цене' }[language]} />
              </ListItemButton>
            </ListItem>
          </List>

          {/* Language Selector at bottom */}
          <Divider sx={{ mb: 2 }} />
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, px: 1 }}>
            {{ en: 'Language', mk: 'Јазик', sq: 'Gjuha', tr: 'Dil', sr: 'Језик' }[language]}
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ px: 1 }}>
            {languages.map((lang) => (
              <Chip
                key={lang.code}
                label={lang.code.toUpperCase()}
                onClick={() => {
                  handleLanguageChange(lang.code);
                  setMobileOpen(false);
                }}
                variant={lang.code === language ? 'filled' : 'outlined'}
                color={lang.code === language ? 'primary' : 'default'}
                sx={{ 
                  fontWeight: 500,
                  minWidth: 48,
                }}
              />
            ))}
          </Stack>
        </Box>
      </Drawer>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div initial="initial" animate="animate" variants={staggerContainer}>
          {/* Welcome Section */}
          <motion.div variants={fadeInUp}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" fontWeight={400} gutterBottom>
                {txt('welcome')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {txt('welcomeDesc')}
              </Typography>
            </Box>
          </motion.div>

          {/* Stats Cards - MD3 Style - Clickable Filters */}
          <motion.div variants={fadeInUp}>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {[
                { 
                  label: txt('allVehicles'), 
                  value: vehicles.length, 
                  color: theme.palette.primary.main,
                  bgColor: md3.primary.container,
                  icon: DirectionsCarOutlined,
                  filterKey: 'all' as const,
                },
                { 
                  label: txt('needsAttention'), 
                  value: stats.urgent, 
                  color: theme.palette.error.main,
                  bgColor: md3.error.container,
                  icon: WarningAmberOutlined,
                  filterKey: 'attention' as const,
                },
                { 
                  label: txt('dueSoon'), 
                  value: stats.soon, 
                  color: theme.palette.warning.main,
                  bgColor: md3.warning.container,
                  icon: ScheduleOutlined,
                  filterKey: 'soon' as const,
                },
                { 
                  label: txt('allGood'), 
                  value: stats.ok, 
                  color: theme.palette.success.main,
                  bgColor: md3.success.container,
                  icon: CheckCircleOutlined,
                  filterKey: 'ok' as const,
                },
              ].map((stat, i) => (
                <Grid size={{ xs: 6, sm: 3 }} key={i} sx={{ display: 'flex' }}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <Card
                      onClick={() => setStatsFilter(statsFilter === stat.filterKey ? 'all' : stat.filterKey)}
                      sx={{
                        bgcolor: stat.bgColor,
                        border: statsFilter === stat.filterKey ? `2px solid ${stat.color}` : '2px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        height: '100%',
                        '&:hover': {
                          boxShadow: `0 4px 12px ${alpha(stat.color, 0.3)}`,
                        },
                      }}
                    >
                      <CardContent sx={{ p: { xs: 2, sm: 2.5 }, height: '100%' }}>
                        <Stack direction="row" alignItems="center" spacing={{ xs: 1.5, sm: 2 }}>
                          <Avatar
                            sx={{
                              bgcolor: alpha(stat.color, 0.2),
                              width: { xs: 40, sm: 48 },
                              height: { xs: 40, sm: 48 },
                              flexShrink: 0,
                            }}
                          >
                            <stat.icon sx={{ color: stat.color, fontSize: { xs: 20, sm: 24 } }} />
                          </Avatar>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                lineHeight: 1.3,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                              }}
                            >
                              {stat.label}
                            </Typography>
                            <Typography 
                              variant="h4" 
                              fontWeight={500} 
                              sx={{ 
                                color: stat.color,
                                fontSize: { xs: '1.5rem', sm: '2rem' },
                                lineHeight: 1.2,
                              }}
                            >
                              {stat.value}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          {/* Vehicles List */}
          <motion.div variants={fadeInUp}>
            <Card sx={{ overflow: 'visible' }}>
              <CardContent sx={{ p: 0 }}>
                {/* Header with Title, Actions, Search and Filters */}
                <Box sx={{ p: { xs: 1.5, sm: 3 }, pb: 2 }}>
                  <Stack 
                    direction="column"
                    spacing={{ xs: 1.5, sm: 2 }}
                  >
                    {/* Row 1: Title + Import & Add Vehicle */}
                    <Stack 
                      direction={{ xs: 'column', sm: 'row' }} 
                      alignItems={{ xs: 'stretch', sm: 'flex-start' }} 
                      justifyContent="space-between" 
                      spacing={{ xs: 1, sm: 0 }}
                      width="100%"
                    >
                      <Box sx={{ mb: { xs: 0.5, sm: 0 } }}>
                        <Typography variant="h5" fontWeight={600} sx={{ mb: 0.25, fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
                          {txt('yourVehicles')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          {txt('companyName')}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
                        <Button
                          variant="outlined"
                          onClick={handleImportCSV}
                          startIcon={<UploadOutlined sx={{ fontSize: { xs: 16, sm: 18 } }} />}
                          size="small"
                          sx={{ 
                            borderRadius: '20px', 
                            height: { xs: 34, sm: 36 },
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            px: { xs: 1.25, sm: 2.5 },
                            textTransform: 'none',
                            whiteSpace: 'nowrap',
                            fontWeight: 500,
                            flex: { xs: 1, sm: 'none' },
                          }}
                        >
                          {txt('importCSV')}
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<AddOutlined sx={{ fontSize: { xs: 16, sm: 18 } }} />}
                          onClick={openAddDialog}
                          size="small"
                          sx={{ 
                            borderRadius: '20px', 
                            height: { xs: 34, sm: 36 },
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            px: { xs: 1.25, sm: 2.5 },
                            textTransform: 'none',
                            whiteSpace: 'nowrap',
                            fontWeight: 500,
                            flex: { xs: 1, sm: 'none' },
                          }}
                        >
                          {txt('addVehicle')}
                        </Button>
                      </Stack>
                    </Stack>
                    
                    {/* Row 2: Search (full width) */}
                    <TextField
                      placeholder={txt('search')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      size="small"
                      fullWidth
                      sx={{ 
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: '20px',
                          height: { xs: 38, sm: 40 },
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          bgcolor: 'grey.50',
                          '&:hover': { bgcolor: 'grey.100' },
                          '&.Mui-focused': { bgcolor: 'background.paper' },
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'transparent',
                        },
                        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'grey.300',
                        },
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchOutlined sx={{ color: 'text.secondary', fontSize: { xs: 18, sm: 20 } }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    
                    {/* Row 3: Type Filter and Export (side by side) */}
                    <Stack direction="row" spacing={1} alignItems="center">
                      <FormControl size="small" sx={{ flex: { xs: 1, sm: 'none' }, minWidth: { sm: 160 } }}>
                        <Select
                          value={typeFilter}
                          onChange={(e: SelectChangeEvent) => setTypeFilter(e.target.value)}
                          displayEmpty
                          startAdornment={
                            <InputAdornment position="start">
                              <DirectionsCarOutlined sx={{ color: 'text.secondary', fontSize: { xs: 16, sm: 18 }, ml: 0.5 }} />
                            </InputAdornment>
                          }
                          sx={{ 
                            borderRadius: '20px', 
                            height: { xs: 38, sm: 40 },
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            bgcolor: 'grey.50',
                            '&:hover': { bgcolor: 'grey.100' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.300' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                          }}
                        >
                          <MenuItem value="all" sx={{ fontSize: '0.875rem' }}>{txt('allTypes')}</MenuItem>
                          {vehicleTypeOptions.map(opt => (
                            <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '0.875rem' }}>
                              <Stack direction="row" alignItems="center" spacing={0.75}>
                                {opt.icon}
                                <span>{opt.label[language] || opt.label.en}</span>
                              </Stack>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl size="small" sx={{ flex: { xs: 1, sm: 'none' }, minWidth: { sm: 140 } }}>
                        <Select
                          value=""
                          displayEmpty
                          renderValue={() => txt('exportCSV')}
                          startAdornment={
                            <InputAdornment position="start">
                              <FileDownloadOutlined sx={{ color: 'text.secondary', fontSize: { xs: 16, sm: 18 }, ml: 0.5 }} />
                            </InputAdornment>
                          }
                          onChange={(e: SelectChangeEvent) => {
                            const format = e.target.value;
                            if (format === 'csv') handleExportCSV();
                            else if (format === 'json') handleExportJSON();
                            else if (format === 'excel') handleExportExcel();
                            else if (format === 'pdf') handleExportPDF();
                          }}
                          sx={{ 
                            borderRadius: '20px', 
                            height: { xs: 38, sm: 40 },
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            bgcolor: 'grey.50',
                            '&:hover': { bgcolor: 'grey.100' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.300' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                          }}
                        >
                          <MenuItem value="csv" sx={{ fontSize: '0.875rem' }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <DescriptionOutlined sx={{ fontSize: 18 }} />
                              <span>{txt('exportAsCSV')}</span>
                            </Stack>
                          </MenuItem>
                          <MenuItem value="excel" sx={{ fontSize: '0.875rem' }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <TableChartOutlined sx={{ fontSize: 18 }} />
                              <span>{txt('exportAsExcel')}</span>
                            </Stack>
                          </MenuItem>
                          <MenuItem value="pdf" sx={{ fontSize: '0.875rem' }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <PictureAsPdfOutlined sx={{ fontSize: 18 }} />
                              <span>{txt('exportAsPDF')}</span>
                            </Stack>
                          </MenuItem>
                          <MenuItem value="json" sx={{ fontSize: '0.875rem' }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <CodeOutlined sx={{ fontSize: 18 }} />
                              <span>{txt('exportAsJSON')}</span>
                            </Stack>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                  </Stack>
                </Box>

                <Divider />
                
                {/* Table Header with Sorting */}
                <Box 
                  sx={{ 
                    px: 3, 
                    py: 1.5, 
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ width: 32 }} /> {/* Icon spacer */}
                    
                    {/* Model - Sortable */}
                    <Box 
                      onClick={() => handleSort('model')}
                      sx={{ 
                        width: 180,
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5, 
                        cursor: 'pointer',
                        '&:hover': { color: 'primary.main' },
                        userSelect: 'none',
                      }}
                    >
                      <Typography variant="caption" color={sortColumn === 'model' ? 'primary' : 'text.secondary'} sx={{ fontWeight: 600 }}>
                        {txt('vehicleModel')}
                      </Typography>
                      {sortColumn === 'model' ? (
                        sortDirection === 'asc' ? <ArrowUpward sx={{ fontSize: 14 }} color="primary" /> : <ArrowDownward sx={{ fontSize: 14 }} color="primary" />
                      ) : (
                        <UnfoldMore sx={{ fontSize: 14, color: 'text.disabled' }} />
                      )}
                    </Box>
                    
                    {/* Year - Sortable */}
                    <Box 
                      onClick={() => handleSort('year')}
                      sx={{ 
                        width: 70, 
                        display: { xs: 'none', md: 'flex' }, 
                        alignItems: 'center', 
                        gap: 0.5, 
                        cursor: 'pointer',
                        '&:hover': { color: 'primary.main' },
                        userSelect: 'none',
                      }}
                    >
                      <Typography variant="caption" color={sortColumn === 'year' ? 'primary' : 'text.secondary'} sx={{ fontWeight: 600 }}>
                        {txt('year')}
                      </Typography>
                      {sortColumn === 'year' ? (
                        sortDirection === 'asc' ? <ArrowUpward sx={{ fontSize: 14 }} color="primary" /> : <ArrowDownward sx={{ fontSize: 14 }} color="primary" />
                      ) : (
                        <UnfoldMore sx={{ fontSize: 14, color: 'text.disabled' }} />
                      )}
                    </Box>
                    
                    {/* Fuel - Sortable */}
                    <Box 
                      onClick={() => handleSort('fuel')}
                      sx={{ 
                        width: 80, 
                        display: { xs: 'none', lg: 'flex' }, 
                        alignItems: 'center', 
                        gap: 0.5, 
                        cursor: 'pointer',
                        '&:hover': { color: 'primary.main' },
                        userSelect: 'none',
                      }}
                    >
                      <Typography variant="caption" color={sortColumn === 'fuel' ? 'primary' : 'text.secondary'} sx={{ fontWeight: 600 }}>
                        {txt('fuelType')}
                      </Typography>
                      {sortColumn === 'fuel' ? (
                        sortDirection === 'asc' ? <ArrowUpward sx={{ fontSize: 14 }} color="primary" /> : <ArrowDownward sx={{ fontSize: 14 }} color="primary" />
                      ) : (
                        <UnfoldMore sx={{ fontSize: 14, color: 'text.disabled' }} />
                      )}
                    </Box>
                    
                    {/* Plate - Sortable */}
                    <Box 
                      onClick={() => handleSort('plate')}
                      sx={{ 
                        width: 160, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5, 
                        cursor: 'pointer',
                        '&:hover': { color: 'primary.main' },
                        userSelect: 'none',
                      }}
                    >
                      <Typography variant="caption" color={sortColumn === 'plate' ? 'primary' : 'text.secondary'} sx={{ fontWeight: 600 }}>
                        {txt('plate')} / {txt('vin')}
                      </Typography>
                      {sortColumn === 'plate' ? (
                        sortDirection === 'asc' ? <ArrowUpward sx={{ fontSize: 14 }} color="primary" /> : <ArrowDownward sx={{ fontSize: 14 }} color="primary" />
                      ) : (
                        <UnfoldMore sx={{ fontSize: 14, color: 'text.disabled' }} />
                      )}
                    </Box>
                    
                    {/* Status - Sortable */}
                    <Box 
                      onClick={() => handleSort('status')}
                      sx={{ 
                        width: 90, 
                        display: { xs: 'none', md: 'flex' }, 
                        alignItems: 'center', 
                        gap: 0.5, 
                        cursor: 'pointer',
                        '&:hover': { color: 'primary.main' },
                        userSelect: 'none',
                      }}
                    >
                      <Typography variant="caption" color={sortColumn === 'status' ? 'primary' : 'text.secondary'} sx={{ fontWeight: 600 }}>
                        {txt('status')}
                      </Typography>
                      {sortColumn === 'status' ? (
                        sortDirection === 'asc' ? <ArrowUpward sx={{ fontSize: 14 }} color="primary" /> : <ArrowDownward sx={{ fontSize: 14 }} color="primary" />
                      ) : (
                        <UnfoldMore sx={{ fontSize: 14, color: 'text.disabled' }} />
                      )}
                    </Box>
                    
                    {/* Notes - Sortable */}
                    <Box 
                      onClick={() => handleSort('notes')}
                      sx={{ 
                        flex: 1,
                        display: { xs: 'none', md: 'flex' }, 
                        alignItems: 'center', 
                        gap: 0.5, 
                        cursor: 'pointer',
                        '&:hover': { color: 'primary.main' },
                        userSelect: 'none',
                      }}
                    >
                      <Typography variant="caption" color={sortColumn === 'notes' ? 'primary' : 'text.secondary'} sx={{ fontWeight: 600 }}>
                        {txt('notes')}
                      </Typography>
                      {sortColumn === 'notes' ? (
                        sortDirection === 'asc' ? <ArrowUpward sx={{ fontSize: 14 }} color="primary" /> : <ArrowDownward sx={{ fontSize: 14 }} color="primary" />
                      ) : (
                        <UnfoldMore sx={{ fontSize: 14, color: 'text.disabled' }} />
                      )}
                    </Box>
                    
                    <Box sx={{ width: 48 }} /> {/* Menu spacer */}
                  </Stack>
                </Box>

                {/* Vehicle List - Compact */}
                {isLoading ? (
                  // Skeleton loading state
                  <>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          px: 3,
                          py: 2,
                          borderBottom: index < 4 ? `1px solid ${theme.palette.divider}` : 'none',
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={2}>
                          {/* Icon skeleton */}
                          <Skeleton variant="circular" width={32} height={32} />
                          {/* Model & person */}
                          <Box sx={{ width: 180 }}>
                            <Skeleton variant="text" width={120} height={20} />
                            <Skeleton variant="text" width={80} height={14} />
                          </Box>
                          {/* Year */}
                          <Box sx={{ width: 70, display: { xs: 'none', md: 'block' } }}>
                            <Skeleton variant="text" width={40} />
                          </Box>
                          {/* Fuel */}
                          <Box sx={{ width: 80, display: { xs: 'none', lg: 'block' } }}>
                            <Skeleton variant="text" width={50} />
                          </Box>
                          {/* Plate */}
                          <Box sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}>
                            <Skeleton variant="text" width={100} height={20} />
                            <Skeleton variant="text" width={140} height={12} />
                          </Box>
                          {/* Status */}
                          <Box sx={{ width: 90, display: { xs: 'none', md: 'block' } }}>
                            <Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: '12px' }} />
                          </Box>
                          {/* Notes */}
                          <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }}>
                            <Skeleton variant="text" width="80%" />
                          </Box>
                          {/* Menu button */}
                          <Skeleton variant="circular" width={28} height={28} />
                        </Stack>
                      </Box>
                    ))}
                  </>
                ) : (
                <AnimatePresence>
                  {paginatedVehicles.map((vehicle, index) => {
                    const minExpiry = getMinExpiry(vehicle);
                    const statusColor = getStatusColor(minExpiry.status);
                    const StatusIcon = getStatusIcon(minExpiry.status);
                    const VehicleTypeIcon = getVehicleTypeIcon(vehicle.vehicleType);

                    return (
                      <motion.div
                        key={vehicle.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Box
                          onClick={() => openEditDialog(vehicle)}
                          sx={{
                            px: { xs: 2, sm: 3 },
                            py: { xs: 1.5, sm: 2 },
                            borderBottom: index < paginatedVehicles.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.04),
                            },
                            transition: 'background-color 0.15s',
                          }}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={{ xs: 1.5, sm: 2 }}
                            sx={{ width: '100%' }}
                          >
                            {/* Vehicle Type Icon */}
                            <Tooltip title={vehicleTypeOptions.find(o => o.value === vehicle.vehicleType)?.label[language] || txt('vehicleType')}>
                              <Box sx={{ width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <VehicleTypeIcon sx={{ fontSize: 24, color: 'text.secondary' }} />
                              </Box>
                            </Tooltip>
                            
                            {/* Vehicle Model & Person */}
                            <Box sx={{ width: { xs: 'auto', sm: 180 }, flex: { xs: 1, sm: 'none' }, minWidth: 0 }}>
                              <Typography 
                                variant="body2" 
                                fontWeight={600} 
                                sx={{ 
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: { xs: '180px', sm: '100%' },
                                }}
                              >
                                {vehicle.vehicleModel || vehicle.plate}
                              </Typography>
                              {vehicle.responsiblePerson && (
                                <Typography 
                                  variant="caption" 
                                  color="text.secondary" 
                                  sx={{ 
                                    display: 'block',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: { xs: '180px', sm: '100%' },
                                  }}
                                >
                                  {transliterate(vehicle.responsiblePerson, language)}
                                </Typography>
                              )}
                            </Box>
                            
                            {/* Year */}
                            <Box sx={{ width: 70, display: { xs: 'none', md: 'block' } }}>
                              <Typography variant="body2" color="text.secondary">
                                {vehicle.year || '—'}
                              </Typography>
                            </Box>
                            
                            {/* Fuel Type */}
                            <Box sx={{ width: 80, display: { xs: 'none', lg: 'block' } }}>
                              <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                                {vehicle.fuelType ? fuelTypeOptions.find(f => f.value === vehicle.fuelType)?.label[language] : '—'}
                              </Typography>
                            </Box>
                            
                            {/* Plate & VIN combined */}
                            <Box sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}>
                              <Typography variant="body2" fontWeight={500} sx={{ letterSpacing: '0.03em' }}>
                                {vehicle.plate}
                              </Typography>
                              {vehicle.vin && (
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    fontFamily: 'monospace', 
                                    color: 'text.disabled',
                                    fontSize: '0.65rem',
                                    letterSpacing: '0.01em',
                                    display: 'block',
                                  }}
                                >
                                  {vehicle.vin}
                                </Typography>
                              )}
                            </Box>
                            
                            {/* Status Badge */}
                            <Box sx={{ width: 90, display: { xs: 'none', md: 'block' } }}>
                              <Chip
                                size="small"
                                label={minExpiry.days <= 0 
                                  ? txt('expired')
                                  : `${minExpiry.days}d`
                                }
                                icon={<StatusIcon sx={{ fontSize: 14 }} />}
                                sx={{
                                  height: 28,
                                  minWidth: 60,
                                  fontSize: '0.75rem',
                                  bgcolor: alpha(statusColor, 0.12),
                                  color: statusColor,
                                  fontWeight: 600,
                                  border: `1px solid ${alpha(statusColor, 0.25)}`,
                                  borderRadius: '14px',
                                  '& .MuiChip-icon': { 
                                    color: statusColor,
                                    marginLeft: '6px',
                                  },
                                  '& .MuiChip-label': {
                                    px: 1,
                                  },
                                }}
                              />
                            </Box>
                            
                            {/* Notes - visible on md+ */}
                            <Tooltip title={transliterate(vehicle.notes, language) || ''} arrow placement="top">
                              <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }}>
                                <Typography 
                                  variant="body2" 
                                  color="text.secondary"
                                  sx={{ 
                                    display: 'block',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {transliterate(vehicle.notes, language) || '—'}
                                </Typography>
                              </Box>
                            </Tooltip>

                            {/* Flex spacer for xs/sm to push 3-dot menu to right */}
                            <Box sx={{ flex: 1, display: { xs: 'block', md: 'none' } }} />

                            {/* 3-dot Actions Menu */}
                            <IconButton 
                              size="small" 
                              onClick={(e) => {
                                e.stopPropagation();
                                openActionMenu(e, vehicle);
                              }}
                              sx={{ flexShrink: 0 }}
                              aria-label={txt('actions')}
                            >
                              <MoreVertOutlined fontSize="small" />
                            </IconButton>
                          </Stack>

                          {/* Mobile Status - Clean, single badge with touch-friendly sizing */}
                          <Box sx={{ display: { xs: 'flex', md: 'none' }, mt: 1, alignItems: 'center', gap: 1.5 }}>
                            <Chip
                              size="small"
                              label={minExpiry.days <= 0 ? txt('expired') : `${minExpiry.days}d`}
                              icon={<StatusIcon sx={{ fontSize: 14 }} />}
                              sx={{
                                height: 28,
                                minWidth: 56,
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                bgcolor: alpha(statusColor, 0.12),
                                color: statusColor,
                                border: `1px solid ${alpha(statusColor, 0.25)}`,
                                borderRadius: '14px',
                                '& .MuiChip-icon': { 
                                  color: statusColor,
                                  marginLeft: '6px',
                                },
                                '& .MuiChip-label': {
                                  px: 1,
                                },
                              }}
                            />
                            {/* Show plate on mobile if not in model */}
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: 'text.secondary',
                                fontWeight: 500,
                                letterSpacing: '0.02em',
                              }}
                            >
                              {vehicle.plate}
                            </Typography>
                          </Box>
                        </Box>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                )}
                
                {/* Pagination */}
                {filteredVehicles.length > rowsPerPage && (
                  <Box sx={{ 
                    p: 2, 
                    display: 'flex', 
                    justifyContent: 'center',
                    borderTop: `1px solid ${theme.palette.divider}`,
                  }}>
                    <Pagination 
                      count={totalPages}
                      page={currentPage}
                      onChange={(_, page) => setCurrentPage(page)}
                      color="primary"
                      size="small"
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}

                {filteredVehicles.length === 0 && vehicles.length > 0 && (
                  <EmptyState
                    variant="no-results"
                    title={txt('noResults')}
                    description={{ 
                      en: 'Try adjusting your search or filters', 
                      mk: 'Обидете се да ги приспособите пребарувањето или филтрите', 
                      sq: 'Provoni të rregulloni kërkimin ose filtrat', 
                      tr: 'Aramayı veya filtreleri ayarlamayı deneyin', 
                      sr: 'Покушајте да прилагодите претрагу или филтере' 
                    }[language] || 'Try adjusting your search or filters'}
                    actionLabel={txt('clearFilters')}
                    onAction={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setTypeFilter('all');
                      setStatsFilter('all');
                    }}
                  />
                )}
                
                {vehicles.length === 0 && (
                  <EmptyState
                    variant="no-vehicles"
                    title={txt('noVehicles')}
                    description={{ 
                      en: 'Add your first vehicle to start tracking expiration dates', 
                      mk: 'Додајте го вашето прво возило за да започнете со следење на датуми', 
                      sq: 'Shtoni automjetin tuaj të parë për të filluar gjurmimin', 
                      tr: 'Takibi başlatmak için ilk aracınızı ekleyin', 
                      sr: 'Додајте прво возило да бисте почели праћење датума' 
                    }[language] || 'Add your first vehicle to start tracking expiration dates'}
                    actionLabel={txt('addVehicle')}
                    onAction={() => openAddDialog()}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Info Banner */}
          <motion.div variants={fadeInUp}>
            <Card
              sx={{
                mt: 4,
                bgcolor: md3.primary.container,
                border: 'none',
              }}
            >
              <CardContent>
                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={2}>
                  <NotificationsActiveOutlined sx={{ color: 'primary.main', fontSize: 32 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={500}>
                      {txt('emailReminders')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {txt('emailRemindersDesc')}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </Container>

      {/* FAB */}
      <Tooltip title={txt('addVehicle')}>
        <Fab
          color="primary"
          onClick={openAddDialog}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
        >
          <AddOutlined />
        </Fab>
      </Tooltip>

      {/* Language Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{ sx: { borderRadius: '12px', mt: 1 } }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={lang.code === language}
          >
            <span style={{ marginRight: 12, fontWeight: 600, fontSize: '0.75rem', color: '#666' }}>{lang.flag}</span>
            {lang.name}
            {lang.code === language && <Check sx={{ ml: 2, fontSize: 18 }} />}
          </MenuItem>
        ))}
      </Menu>
      
      {/* Row Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={closeActionMenu}
        PaperProps={{ sx: { borderRadius: '12px', minWidth: 140 } }}
      >
        <MenuItem 
          onClick={() => {
            if (actionMenuVehicle) openEditDialog(actionMenuVehicle);
            closeActionMenu();
          }}
        >
          <EditOutlined sx={{ mr: 1.5, fontSize: 18 }} />
          {txt('edit')}
        </MenuItem>
        <MenuItem 
          onClick={() => {
            if (actionMenuVehicle) openDeleteDialog(actionMenuVehicle);
            closeActionMenu();
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteOutlined sx={{ mr: 1.5, fontSize: 18 }} />
          {txt('delete')}
        </MenuItem>
      </Menu>

      {/* Add Vehicle Dialog - MD3 28dp corners */}
      <Dialog 
        open={addDialogOpen} 
        onClose={() => setAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={dialogPaperProps}
        scroll="paper"
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">{txt('addVehicle')}</Typography>
            <IconButton onClick={() => setAddDialogOpen(false)} size="small" aria-label={txt('cancel')}>
              <CloseOutlined />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: '70vh' }}>
          <Stack spacing={2.5}>
            {/* Vehicle Info Section */}
            <Typography variant="subtitle2" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DriveEtaOutlined fontSize="small" />
              {txt('vehicleInfo')}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>{txt('vehicleType')}</InputLabel>
                  <Select
                    value={formData.vehicleType}
                    label={txt('vehicleType')}
                    onChange={(e: SelectChangeEvent) => setFormData({ ...formData, vehicleType: e.target.value as VehicleType })}
                  >
                    <MenuItem value=""><em>{txt('selectType')}</em></MenuItem>
                    {vehicleTypeOptions.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {opt.icon}
                          <span>{opt.label[language] || opt.label.en}</span>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label={txt('vehicleModel')}
                  value={formData.vehicleModel}
                  onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                  fullWidth
                  size="small"
                  placeholder={txt('modelPlaceholder')}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>{txt('year')}</InputLabel>
                  <Select
                    value={formData.year}
                    label={txt('year')}
                    onChange={(e: SelectChangeEvent) => setFormData({ ...formData, year: e.target.value })}
                  >
                    <MenuItem value=""><em>{txt('selectYear')}</em></MenuItem>
                    {yearOptions.map(y => (
                      <MenuItem key={y} value={y.toString()}>{y}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label={txt('color')}
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: <ColorLensOutlined sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>{txt('fuelType')}</InputLabel>
                  <Select
                    value={formData.fuelType}
                    label={txt('fuelType')}
                    onChange={(e: SelectChangeEvent) => setFormData({ ...formData, fuelType: e.target.value as FuelType })}
                    startAdornment={<LocalGasStationOutlined sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />}
                  >
                    <MenuItem value=""><em>{txt('selectFuel')}</em></MenuItem>
                    {fuelTypeOptions.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label[language] || opt.label.en}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Divider />
            
            {/* Identification Section */}
            <Typography variant="subtitle2" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DirectionsCarOutlined fontSize="small" />
              {txt('identification')}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label={txt('plate')}
                  value={formData.plate}
                  onChange={(e) => setFormData({ ...formData, plate: formatLicensePlate(e.target.value) })}
                  fullWidth
                  size="small"
                  required
                  placeholder="BT 1234 CD"
                  helperText={txt('plateHelperText')}
                  inputProps={{
                    style: { textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 },
                    maxLength: 15,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label={txt('vin')}
                  value={formData.vin}
                  onChange={(e) => setFormData({ ...formData, vin: formatVIN(e.target.value) })}
                  fullWidth
                  size="small"
                  placeholder="WVWZZZ3CZWE123456"
                  helperText={txt('vinHelperText')}
                  inputProps={{
                    style: { textTransform: 'uppercase', letterSpacing: '0.02em', fontFamily: 'monospace' },
                    maxLength: 17,
                  }}
                />
              </Grid>
            </Grid>

            <Divider />
            
            {/* Assignment Section */}
            <Typography variant="subtitle2" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonOutlined fontSize="small" />
              {txt('assignment')}
            </Typography>
            
            <TextField
              label={txt('responsiblePerson')}
              value={formData.responsiblePerson}
              onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
              fullWidth
              size="small"
              placeholder={txt('namePlaceholder')}
            />

            <Divider />
            
            {/* Expiry Dates Section - With attention highlighting for Edit */}
            <Typography variant="subtitle2" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarMonthOutlined fontSize="small" />
              {txt('expiryDates')}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                {(() => {
                  const regStatus = editDialogOpen ? getDateFieldStatus(formData.regExpiry) : { needsAttention: false, status: 'ok' as ExpiryStatus };
                  return (
                    <TextField
                      label={txt('regExpiry')}
                      type="date"
                      value={formData.regExpiry}
                      onChange={(e) => setFormData({ ...formData, regExpiry: e.target.value })}
                      onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                      fullWidth
                      size="small"
                      error={regStatus.needsAttention}
                      helperText={regStatus.needsAttention ? txt('expired') : undefined}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: <CalendarMonthOutlined sx={{ mr: 1, fontSize: 18, color: regStatus.needsAttention ? 'error.main' : 'primary.main' }} />,
                      }}
                      sx={{ cursor: 'pointer', '& input': { cursor: 'pointer' } }}
                    />
                  );
                })()}
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                {(() => {
                  const insStatus = editDialogOpen ? getDateFieldStatus(formData.insExpiry) : { needsAttention: false, status: 'ok' as ExpiryStatus };
                  return (
                    <TextField
                      label={txt('insExpiry')}
                      type="date"
                      value={formData.insExpiry}
                      onChange={(e) => setFormData({ ...formData, insExpiry: e.target.value })}
                      onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                      fullWidth
                      size="small"
                      error={insStatus.needsAttention}
                      helperText={insStatus.needsAttention ? txt('expired') : undefined}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: <SecurityOutlined sx={{ mr: 1, fontSize: 18, color: insStatus.needsAttention ? 'error.main' : 'warning.main' }} />,
                      }}
                      sx={{ cursor: 'pointer', '& input': { cursor: 'pointer' } }}
                    />
                  );
                })()}
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                {(() => {
                  const inspStatus = editDialogOpen ? getDateFieldStatus(formData.inspExpiry) : { needsAttention: false, status: 'ok' as ExpiryStatus };
                  return (
                    <TextField
                      label={txt('inspExpiry')}
                      type="date"
                      value={formData.inspExpiry}
                      onChange={(e) => setFormData({ ...formData, inspExpiry: e.target.value })}
                      onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                      fullWidth
                      size="small"
                      error={inspStatus.needsAttention}
                      helperText={inspStatus.needsAttention ? txt('expired') : undefined}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: <BuildOutlined sx={{ mr: 1, fontSize: 18, color: inspStatus.needsAttention ? 'error.main' : 'success.main' }} />,
                      }}
                      sx={{ cursor: 'pointer', '& input': { cursor: 'pointer' } }}
                    />
                  );
                })()}
              </Grid>
            </Grid>
            
            {/* Purchase Details - Collapsible */}
            <Box>
              <Button
                size="small"
                onClick={() => setShowPurchaseDetails(!showPurchaseDetails)}
                startIcon={showPurchaseDetails ? <ExpandLess /> : <ExpandMore />}
                sx={{ color: 'text.secondary', textTransform: 'none' }}
              >
                {txt('purchaseDetails')} ({txt('optional')})
              </Button>
              <Collapse in={showPurchaseDetails}>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label={txt('purchaseDate')}
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label={txt('purchasePrice')}
                      value={formData.purchasePrice}
                      onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value.replace(/[^\d]/g, '') })}
                      fullWidth
                      size="small"
                      InputProps={{
                        startAdornment: <AttachMoneyOutlined sx={{ mr: 0.5, fontSize: 18, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label={txt('mileage')}
                      value={formData.mileage}
                      onChange={(e) => setFormData({ ...formData, mileage: e.target.value.replace(/[^\d]/g, '') })}
                      fullWidth
                      size="small"
                      InputProps={{
                        startAdornment: <SpeedOutlined sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                </Grid>
              </Collapse>
            </Box>
            
            {/* Notes - Collapsible */}
            <Box>
              <Button
                size="small"
                onClick={() => setShowNotes(!showNotes)}
                startIcon={showNotes ? <ExpandLess /> : <ExpandMore />}
                sx={{ color: 'text.secondary', textTransform: 'none' }}
              >
                {txt('notes')} ({txt('optional')})
              </Button>
              <Collapse in={showNotes}>
                <TextField
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                  sx={{ mt: 1 }}
                  placeholder="..."
                />
              </Collapse>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddDialogOpen(false)}>
            {txt('cancel')}
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAddVehicle}
            disabled={!formData.plate.trim()}
          >
            {txt('save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Vehicle Dialog - Same as Add but for editing */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={dialogPaperProps}
        scroll="paper"
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">{txt('editVehicle')}</Typography>
            <IconButton onClick={() => setEditDialogOpen(false)} size="small" aria-label={txt('cancel')}>
              <CloseOutlined />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: '70vh' }}>
          <Stack spacing={2.5}>
            {/* Vehicle Info Section */}
            <Typography variant="subtitle2" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DriveEtaOutlined fontSize="small" />
              {txt('vehicleInfo')}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>{txt('vehicleType')}</InputLabel>
                  <Select
                    value={formData.vehicleType}
                    label={txt('vehicleType')}
                    onChange={(e: SelectChangeEvent) => setFormData({ ...formData, vehicleType: e.target.value as VehicleType })}
                  >
                    <MenuItem value=""><em>{txt('selectType')}</em></MenuItem>
                    {vehicleTypeOptions.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {opt.icon}
                          <span>{opt.label[language] || opt.label.en}</span>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label={txt('vehicleModel')}
                  value={formData.vehicleModel}
                  onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                  fullWidth
                  size="small"
                  placeholder={txt('modelPlaceholder')}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>{txt('year')}</InputLabel>
                  <Select
                    value={formData.year}
                    label={txt('year')}
                    onChange={(e: SelectChangeEvent) => setFormData({ ...formData, year: e.target.value })}
                  >
                    <MenuItem value=""><em>{txt('selectYear')}</em></MenuItem>
                    {yearOptions.map(y => (
                      <MenuItem key={y} value={y.toString()}>{y}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label={txt('color')}
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: <ColorLensOutlined sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>{txt('fuelType')}</InputLabel>
                  <Select
                    value={formData.fuelType}
                    label={txt('fuelType')}
                    onChange={(e: SelectChangeEvent) => setFormData({ ...formData, fuelType: e.target.value as FuelType })}
                    startAdornment={<LocalGasStationOutlined sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />}
                  >
                    <MenuItem value=""><em>{txt('selectFuel')}</em></MenuItem>
                    {fuelTypeOptions.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label[language] || opt.label.en}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Divider />
            
            {/* Identification Section */}
            <Typography variant="subtitle2" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DirectionsCarOutlined fontSize="small" />
              {txt('identification')}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label={txt('plate')}
                  value={formData.plate}
                  onChange={(e) => setFormData({ ...formData, plate: formatLicensePlate(e.target.value) })}
                  fullWidth
                  size="small"
                  required
                  placeholder="BT 1234 CD"
                  helperText={txt('plateHelperText')}
                  inputProps={{
                    style: { textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 },
                    maxLength: 15,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label={txt('vin')}
                  value={formData.vin}
                  onChange={(e) => setFormData({ ...formData, vin: formatVIN(e.target.value) })}
                  fullWidth
                  size="small"
                  placeholder="WVWZZZ3CZWE123456"
                  helperText={txt('vinHelperText')}
                  inputProps={{
                    style: { textTransform: 'uppercase', letterSpacing: '0.02em', fontFamily: 'monospace' },
                    maxLength: 17,
                  }}
                />
              </Grid>
            </Grid>

            <Divider />
            
            {/* Assignment Section */}
            <Typography variant="subtitle2" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonOutlined fontSize="small" />
              {txt('assignment')}
            </Typography>
            
            <TextField
              label={txt('responsiblePerson')}
              value={formData.responsiblePerson}
              onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
              fullWidth
              size="small"
              placeholder={txt('namePlaceholder')}
            />

            <Divider />
            
            {/* Expiry Dates Section - With attention highlighting for Edit */}
            <Typography variant="subtitle2" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarMonthOutlined fontSize="small" />
              {txt('expiryDates')}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                {(() => {
                  const regStatus = editDialogOpen ? getDateFieldStatus(formData.regExpiry) : { needsAttention: false, status: 'ok' as ExpiryStatus };
                  return (
                    <TextField
                      label={txt('regExpiry')}
                      type="date"
                      value={formData.regExpiry}
                      onChange={(e) => setFormData({ ...formData, regExpiry: e.target.value })}
                      onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                      fullWidth
                      size="small"
                      error={regStatus.needsAttention}
                      helperText={regStatus.needsAttention ? txt('expired') : undefined}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: <CalendarMonthOutlined sx={{ mr: 1, fontSize: 18, color: regStatus.needsAttention ? 'error.main' : 'primary.main' }} />,
                      }}
                      sx={{ cursor: 'pointer', '& input': { cursor: 'pointer' } }}
                    />
                  );
                })()}
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                {(() => {
                  const insStatus = editDialogOpen ? getDateFieldStatus(formData.insExpiry) : { needsAttention: false, status: 'ok' as ExpiryStatus };
                  return (
                    <TextField
                      label={txt('insExpiry')}
                      type="date"
                      value={formData.insExpiry}
                      onChange={(e) => setFormData({ ...formData, insExpiry: e.target.value })}
                      onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                      fullWidth
                      size="small"
                      error={insStatus.needsAttention}
                      helperText={insStatus.needsAttention ? txt('expired') : undefined}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: <SecurityOutlined sx={{ mr: 1, fontSize: 18, color: insStatus.needsAttention ? 'error.main' : 'warning.main' }} />,
                      }}
                      sx={{ cursor: 'pointer', '& input': { cursor: 'pointer' } }}
                    />
                  );
                })()}
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                {(() => {
                  const inspStatus = editDialogOpen ? getDateFieldStatus(formData.inspExpiry) : { needsAttention: false, status: 'ok' as ExpiryStatus };
                  return (
                    <TextField
                      label={txt('inspExpiry')}
                      type="date"
                      value={formData.inspExpiry}
                      onChange={(e) => setFormData({ ...formData, inspExpiry: e.target.value })}
                      onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                      fullWidth
                      size="small"
                      error={inspStatus.needsAttention}
                      helperText={inspStatus.needsAttention ? txt('expired') : undefined}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: <BuildOutlined sx={{ mr: 1, fontSize: 18, color: inspStatus.needsAttention ? 'error.main' : 'success.main' }} />,
                      }}
                      sx={{ cursor: 'pointer', '& input': { cursor: 'pointer' } }}
                    />
                  );
                })()}
              </Grid>
            </Grid>
            
            {/* Purchase Details - Collapsible */}
            <Box>
              <Button
                size="small"
                onClick={() => setShowPurchaseDetails(!showPurchaseDetails)}
                startIcon={showPurchaseDetails ? <ExpandLess /> : <ExpandMore />}
                sx={{ color: 'text.secondary', textTransform: 'none' }}
              >
                {txt('purchaseDetails')} ({txt('optional')})
              </Button>
              <Collapse in={showPurchaseDetails}>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label={txt('purchaseDate')}
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label={txt('purchasePrice')}
                      value={formData.purchasePrice}
                      onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value.replace(/[^\d]/g, '') })}
                      fullWidth
                      size="small"
                      InputProps={{
                        startAdornment: <AttachMoneyOutlined sx={{ mr: 0.5, fontSize: 18, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label={txt('mileage')}
                      value={formData.mileage}
                      onChange={(e) => setFormData({ ...formData, mileage: e.target.value.replace(/[^\d]/g, '') })}
                      fullWidth
                      size="small"
                      InputProps={{
                        startAdornment: <SpeedOutlined sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                </Grid>
              </Collapse>
            </Box>
            
            {/* Notes - Collapsible */}
            <Box>
              <Button
                size="small"
                onClick={() => setShowNotes(!showNotes)}
                startIcon={showNotes ? <ExpandLess /> : <ExpandMore />}
                sx={{ color: 'text.secondary', textTransform: 'none' }}
              >
                {txt('notes')} ({txt('optional')})
              </Button>
              <Collapse in={showNotes}>
                <TextField
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                  sx={{ mt: 1 }}
                  placeholder="..."
                />
              </Collapse>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditDialogOpen(false)}>
            {txt('cancel')}
          </Button>
          <Button 
            variant="contained" 
            onClick={handleEditVehicle}
            disabled={!formData.plate.trim()}
          >
            {txt('save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog - MD3 28dp corners */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: '28px' } }}
      >
        <DialogTitle>
          {txt('deleteVehicle')}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {txt('deleteConfirm')}
          </Typography>
          {selectedVehicle && (
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Chip 
                icon={<DirectionsCarOutlined />}
                label={selectedVehicle.plate}
              />
              {selectedVehicle.responsiblePerson && (
                <Chip 
                  icon={<PersonOutlined />}
                  label={transliterate(selectedVehicle.responsiblePerson, language)}
                  variant="outlined"
                />
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            {txt('cancel')}
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleDeleteVehicle}
          >
            {txt('delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
