'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface Zone { id: string; name: string; }

export default function AddConsumerPage() {
  const router = useRouter();
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    consumerNumber: '',
    fullName: '',
    fatherOrCompanyName: '',
    phone: '',
    email: '',
    cnicOrRegistrationNo: '',
    addressLine: '',
    city: '',
    zoneId: '',
    connectionType: 'domestic',
    meterNumber: '',
    status: 'active',
  });

  useEffect(() => {
    api.get<any>('/consumers?limit=1').then(() => {}).catch(() => {});
    // fetch zones from reports dashboard (zones are embedded in consumers)
    // We'll use a simple hardcoded fetch or pull from the existing data
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      // Get zones by fetching a consumer and extracting zone, or fetch directly
      const result = await api.get<{ data: Array<{ zone?: Zone }> }>('/consumers?limit=100');
      const seen = new Map<string, Zone>();
      result.data.forEach((c) => {
        if (c.zone) seen.set(c.zone.id, c.zone);
      });
      setZones(Array.from(seen.values()));
    } catch {}
  };

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.consumerNumber.trim()) { setError('Consumer number is required'); return; }
    if (!form.fullName.trim()) { setError('Full name is required'); return; }

    setLoading(true);
    try {
      const payload: any = { ...form };
      if (!payload.zoneId) delete payload.zoneId;
      if (!payload.email) delete payload.email;
      if (!payload.fatherOrCompanyName) delete payload.fatherOrCompanyName;
      if (!payload.cnicOrRegistrationNo) delete payload.cnicOrRegistrationNo;
      if (!payload.meterNumber) delete payload.meterNumber;

      await api.post('/consumers', payload);
      setSuccess(true);
      setTimeout(() => router.push('/dashboard/consumers'), 1500);
    } catch (err: any) {
      const msg = Array.isArray(err?.message) ? err.message[0] : err?.message || 'Failed to add consumer';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <CheckCircle className="w-14 h-14 text-green-500 mx-auto" />
          <p className="text-xl font-bold text-gray-800">Consumer Added!</p>
          <p className="text-sm text-gray-500">Redirecting to consumer list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/consumers"
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add Consumer</h2>
          <p className="text-gray-500 text-sm mt-0.5">Register a new water consumer</p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Section 1: Identity */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Consumer Number *" required>
              <input
                value={form.consumerNumber}
                onChange={(e) => set('consumerNumber', e.target.value)}
                placeholder="e.g. CN-004-2024"
                required
                className="input-base"
              />
            </Field>
            <Field label="Full Name *" required>
              <input
                value={form.fullName}
                onChange={(e) => set('fullName', e.target.value)}
                placeholder="e.g. Muhammad Usman"
                required
                className="input-base"
              />
            </Field>
            <Field label="Father / Company Name">
              <input
                value={form.fatherOrCompanyName}
                onChange={(e) => set('fatherOrCompanyName', e.target.value)}
                placeholder="Optional"
                className="input-base"
              />
            </Field>
            <Field label="CNIC / Registration No.">
              <input
                value={form.cnicOrRegistrationNo}
                onChange={(e) => set('cnicOrRegistrationNo', e.target.value)}
                placeholder="e.g. 35201-1234567-1"
                className="input-base"
              />
            </Field>
            <Field label="Phone Number">
              <input
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="e.g. 0300-1234567"
                className="input-base"
              />
            </Field>
            <Field label="Email Address">
              <input
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="optional@email.com"
                className="input-base"
              />
            </Field>
          </div>
        </div>

        {/* Section 2: Address */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">
            Address & Location
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Address" className="sm:col-span-2">
              <input
                value={form.addressLine}
                onChange={(e) => set('addressLine', e.target.value)}
                placeholder="House no., Street, Area"
                className="input-base"
              />
            </Field>
            <Field label="City">
              <input
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                placeholder="e.g. Lahore"
                className="input-base"
              />
            </Field>
            <Field label="Zone">
              <select
                value={form.zoneId}
                onChange={(e) => set('zoneId', e.target.value)}
                className="input-base"
              >
                <option value="">— Select Zone —</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>{z.name}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        {/* Section 3: Connection */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">
            Connection Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Connection Type">
              <select
                value={form.connectionType}
                onChange={(e) => set('connectionType', e.target.value)}
                className="input-base"
              >
                <option value="domestic">Domestic</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
                <option value="government">Government</option>
              </select>
            </Field>
            <Field label="Meter Number">
              <input
                value={form.meterNumber}
                onChange={(e) => set('meterNumber', e.target.value)}
                placeholder="e.g. MTR-0010"
                className="input-base"
              />
            </Field>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
                className="input-base"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="disconnected">Disconnected</option>
              </select>
            </Field>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 justify-end">
          <Link
            href="/dashboard/consumers"
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Add Consumer'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
  className = '',
  required,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
