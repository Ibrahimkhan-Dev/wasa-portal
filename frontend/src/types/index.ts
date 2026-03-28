export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  roleId: string;
  permissions: string[];
  status: string;
  lastLoginAt?: string;
  employee?: {
    id: string;
    employeeCode: string;
    designation?: string;
    department?: { name: string };
    zone?: { name: string };
  };
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Consumer {
  id: string;
  consumerNumber: string;
  fullName: string;
  phone?: string;
  email?: string;
  addressLine?: string;
  city?: string;
  zoneId?: string;
  zone?: { name: string };
  connectionType?: string;
  meterNumber?: string;
  status: 'active' | 'suspended' | 'disconnected';
}

export interface Bill {
  id: string;
  consumerId: string;
  consumer?: { fullName: string; consumerNumber: string };
  billMonth: string;
  billYear: number;
  billNumber: string;
  issueDate: string;
  dueDate: string;
  previousReading?: number;
  currentReading?: number;
  unitsConsumed?: number;
  fixedAmount: number;
  usageAmount: number;
  taxAmount: number;
  arrearsAmount: number;
  adjustmentAmount: number;
  lateFeeAmount: number;
  totalAmount: number;
  status: 'unpaid' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';
  billItems?: BillItem[];
  generatedAt: string;
}

export interface BillItem {
  id: string;
  itemType: string;
  description: string;
  amount: number;
}

export interface Employee {
  id: string;
  employeeCode: string;
  fullName: string;
  photoUrl?: string;
  designation?: string;
  departmentId?: string;
  department?: { name: string };
  zoneId?: string;
  zone?: { name: string };
  phone?: string;
  email?: string;
  status: 'active' | 'inactive' | 'suspended';
  isPubliclyVerifiable: boolean;
  qrProfile?: {
    publicSlug: string;
    verificationStatus: string;
  };
}

export interface Complaint {
  id: string;
  complaintNumber: string;
  consumerId?: string;
  consumer?: { fullName: string; consumerNumber: string };
  category: string;
  subject: string;
  description: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'resolved' | 'closed' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedEmployeeId?: string;
  assignedEmployee?: { fullName: string; employeeCode: string };
  submittedByName?: string;
  submittedByPhone?: string;
  submittedAt: string;
  resolvedAt?: string;
  statusHistory?: ComplaintStatusHistory[];
}

export interface ComplaintStatusHistory {
  id: string;
  oldStatus?: string;
  newStatus: string;
  changedByUser: { fullName: string };
  remarks?: string;
  changedAt: string;
}

export interface Notice {
  id: string;
  title: string;
  category?: string;
  content: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  statusCode: number;
  message: string[];
  timestamp: string;
  path: string;
}
