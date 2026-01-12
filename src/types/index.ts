export interface User {
  id: string;
  email: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export type VehicleType = 'car' | 'suv' | 'van' | 'truck' | 'motorcycle' | 'other';
export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'lpg' | 'other';

export interface Vehicle {
  id: string;
  userId: string;
  // Vehicle Info
  vehicleType?: VehicleType;
  vehicleModel?: string;
  year?: number;
  color?: string;
  fuelType?: FuelType;
  // Identification
  plate: string;
  vin?: string;
  // Assignment
  responsiblePerson?: string;
  // Purchase Details
  purchaseDate?: Date;
  purchasePrice?: number;
  mileage?: number;
  // Expiry Dates
  regExpiry: Date;
  insExpiry: Date;
  inspExpiry: Date;
  // Notes
  notes?: string;
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleWithStatus extends Vehicle {
  regStatus: ExpiryStatus;
  insStatus: ExpiryStatus;
  inspStatus: ExpiryStatus;
  nextExpiry: {
    type: 'registration' | 'insurance' | 'inspection';
    date: Date;
    daysUntil: number;
  };
}

export type ExpiryStatus = 'expired' | 'urgent' | 'soon' | 'ok';

export interface StatusCount {
  urgent: number;
  soon: number;
  ok: number;
}

export interface ReminderLog {
  id: string;
  userId: string;
  vehicleId: string;
  reminderType: string;
  expiryType: string;
  sentAt: Date;
}

export interface VehicleFormData {
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

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  language: string;
}

export type Language = 'en' | 'mk' | 'sq' | 'tr' | 'sr';

export interface Translations {
  common: {
    appName: string;
    login: string;
    signup: string;
    logout: string;
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    addVehicle: string;
    loading: string;
    error: string;
    success: string;
    dashboard: string;
    welcome: string;
    noVehicles: string;
    confirmDelete: string;
    daysLeft: string;
    day: string;
    days: string;
    expired: string;
    email: string;
    password: string;
    confirmPassword: string;
    language: string;
    or: string;
    createAccount: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    signInToAccount: string;
    getStarted: string;
    hero: string;
    heroDesc: string;
    features: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
  };
  vehicles: {
    plate: string;
    regExpiry: string;
    insExpiry: string;
    inspExpiry: string;
    addNew: string;
    editVehicle: string;
    deleteVehicle: string;
    noVehicles: string;
    registration: string;
    insurance: string;
    inspection: string;
  };
  status: {
    expired: string;
    urgent: string;
    dueSoon: string;
    ok: string;
    allGood: string;
    needsAttention: string;
  };
  errors: {
    invalidEmail: string;
    passwordTooShort: string;
    passwordsDontMatch: string;
    emailInUse: string;
    invalidCredentials: string;
    plateRequired: string;
    dateRequired: string;
    plateInUse: string;
    somethingWentWrong: string;
  };
}
