
export interface CouponConfig {
  fromNumber: string;
  toNumber: string;
  fuelType: string;
  volume: string;
  volumeText: string;
  companyName: string;
  signatory: string;
  fontFamily: string;
}

export interface VolumeOption {
  value: string;
  label: string;
  text: string;
}

export const FUEL_TYPES = ['E5', 'A95', 'Dầu DO'];

export const FONT_OPTIONS = [
  { value: "'Inter', sans-serif", label: 'Mặc định (Inter)' },
  { value: "'Times New Roman', Times, serif", label: 'Times New Roman' },
  { value: "Arial, sans-serif", label: 'Arial' },
];

export const VOLUME_OPTIONS: VolumeOption[] = [
  { value: '01', label: '01 Lít (Một Lít)', text: 'Một Lít' },
  { value: '02', label: '02 Lít (Hai Lít)', text: 'Hai Lít' },
  { value: '03', label: '03 Lít (Ba Lít)', text: 'Ba Lít' },
  { value: '04', label: '04 Lít (Bốn Lít)', text: 'Bốn Lít' },
  { value: '05', label: '05 Lít (Năm Lít)', text: 'Năm Lít' },
  { value: '10', label: '10 Lít (Mười Lít)', text: 'Mười Lít' },
  { value: '20', label: '20 Lít (Hai mươi Lít)', text: 'Hai mươi Lít' },
  { value: '30', label: '30 Lít (Ba mươi Lít)', text: 'Ba mươi Lít' },
];
