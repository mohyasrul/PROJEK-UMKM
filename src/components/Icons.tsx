import {
  Home,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  DollarSign,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  Search,
  Bell,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  Download,
  Upload,
  Filter,
  Calendar,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  Info,
  XCircle,
  Check,
  Minus,
  TriangleAlert,
} from 'lucide-react';

export const Icons = {
  // Navigation
  home: Home,
  products: Package,
  customers: Users,
  sales: ShoppingCart,
  reports: BarChart3,
  finance: DollarSign,
  settings: Settings,

  // User actions
  user: User,
  logout: LogOut,

  // UI controls
  menu: Menu,
  close: X,
  search: Search,
  bell: Bell,

  // Theme
  sun: Sun,
  moon: Moon,
  monitor: Monitor,

  // Actions
  add: Plus,
  edit: Edit,
  delete: Trash2,
  view: Eye,
  save: Save,
  download: Download,
  upload: Upload,
  filter: Filter,
  calendar: Calendar,

  // Chevrons
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,

  // Arrows
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,

  // States
  loading: Loader2,
  error: AlertCircle,
  success: CheckCircle,
  info: Info,
  warning: XCircle,

  // Form elements
  Check: Check,
  Minus: Minus,
  CheckCircle: CheckCircle,
  XCircle: XCircle,
  AlertCircle: AlertCircle,
  AlertTriangle: TriangleAlert,
  Info: Info,
  X: X,
};

export type IconName = keyof typeof Icons;
