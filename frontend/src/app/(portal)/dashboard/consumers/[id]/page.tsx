'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Droplets,
  Hash,
  Calendar,
  RefreshCw,
  Receipt,
  MessageSquare,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Consumer, Bill } from '@/types';
import { StatusBadge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface ConsumerDetail extends Consumer {
  connections: Array<{
    id: string;
    connectionCode: string;
    connectionSize: string;
    serviceType: string;
    installDate: string;
    status: string;
    tariffPlan?: { name: string; unitRate: number; fixedCharge: number };
  }>;
}

function InfoRow({ label, value, icon }: { label: string; value?: string | null; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      {icon && <span className="text-gray-400 mt-0.5 flex-shrink-0">{icon}</span>}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-gray-800 mt-0.5 break-words">
          {value || <span className="text-gray-300 font-normal">Not provided</span>}
        </p>
      </div>
    </div>
  );
}

export default function ConsumerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [consumer, setConsumer] = useState<ConsumerDetail | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'bills'>('profile');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const c = await api.get<ConsumerDetail>(`/consumers/${id}`);
        setConsumer(c);
        const b = await api.get<Bill[]>(`/billing/bills/consumer/${c.consumerNumber}`);
        setBills(Array.isArray(b) ? b : []);
      } catch {
        router.push('/dashboard/consumers');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-7 h-7 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!consumer) return null;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });

  const formatAmount = (n: number) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/consumers"
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{consumer.fullName}</h2>
          <p className="text-gray-500 text-sm font-mono mt-0.5">{consumer.consumerNumber}</p>
        </div>
        <StatusBadge status={consumer.status} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['profile', 'bills'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize flex items-center gap-2 ${
              activeTab === tab
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'profile' ? <User className="w-4 h-4" /> : <Receipt className="w-4 h-4" />}
            {tab === 'bills' ? `Bills (${bills.length})` : 'Profile'}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Personal Info */}
          <Card>
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" /> Personal Information
            </h3>
            <div>
              <InfoRow label="Full Name" value={consumer.fullName} icon={<User className="w-4 h-4" />} />
              <InfoRow label="Consumer Number" value={consumer.consumerNumber} icon={<Hash className="w-4 h-4" />} />
              <InfoRow label="Phone" value={consumer.phone} icon={<Phone className="w-4 h-4" />} />
              <InfoRow label="Email" value={consumer.email} icon={<Mail className="w-4 h-4" />} />
              <InfoRow
                label="Address"
                value={[consumer.addressLine, consumer.city].filter(Boolean).join(', ')}
                icon={<MapPin className="w-4 h-4" />}
              />
              <InfoRow label="Zone" value={consumer.zone?.name} icon={<MapPin className="w-4 h-4" />} />
            </div>
          </Card>

          {/* Connection Info */}
          <Card>
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-600" /> Connection Details
            </h3>
            <div>
              <InfoRow label="Connection Type" value={consumer.connectionType} />
              <InfoRow label="Meter Number" value={consumer.meterNumber} />
              <InfoRow label="Area" value={consumer.addressLine ? consumer.city : undefined} />
              {consumer.connections?.length > 0 && (
                <>
                  <InfoRow label="Connection Code" value={consumer.connections[0].connectionCode} />
                  <InfoRow label="Service Type" value={consumer.connections[0].serviceType} />
                  <InfoRow label="Connection Size" value={consumer.connections[0].connectionSize} />
                  {consumer.connections[0].installDate && (
                    <InfoRow
                      label="Install Date"
                      value={formatDate(consumer.connections[0].installDate)}
                      icon={<Calendar className="w-4 h-4" />}
                    />
                  )}
                  {consumer.connections[0].tariffPlan && (
                    <InfoRow label="Tariff Plan" value={consumer.connections[0].tariffPlan.name} />
                  )}
                </>
              )}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'bills' && (
        <Card>
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-blue-600" /> Bill History
          </h3>
          {bills.length === 0 ? (
            <div className="flex flex-col items-center py-12 gap-3 text-gray-400">
              <Receipt className="w-10 h-10 text-gray-200" />
              <p className="text-sm font-medium">No bills found</p>
              <p className="text-xs">Bills will appear here once generated via Excel upload</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 rounded-lg">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 rounded-l-lg">Bill No.</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Month</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Issue Date</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Due Date</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Amount</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 rounded-r-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{bill.billNumber}</td>
                      <td className="px-4 py-3 text-gray-700">{bill.billMonth} {bill.billYear}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(bill.issueDate)}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(bill.dueDate)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">
                        {formatAmount(Number(bill.totalAmount))}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={bill.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
