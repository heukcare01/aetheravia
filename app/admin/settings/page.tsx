'use client';

import useSWR from 'swr';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminSettingsPage() {
  const { data, isLoading, mutate } = useSWR('/api/admin/settings', fetcher);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    supportPhone: '',
    whatsappNumber: '',
    supportEmail: '',
    shopAddress: '',
  });

  useEffect(() => {
    if (data) {
      setForm({
        supportPhone: data.supportPhone || '',
        whatsappNumber: data.whatsappNumber || '',
        supportEmail: data.supportEmail || '',
        shopAddress: data.shopAddress || '',
      });
    }
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast.success('Settings saved successfully');
      mutate();
    } catch (e: any) {
      toast.error(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading)
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-base-200 rounded animate-pulse" />
        <div className="h-64 bg-base-200 rounded animate-pulse" />
      </div>
    );

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <p className="text-sm opacity-70 mt-1">
          Manage contact details displayed across the website including the floating widget, footer, contact page, and email templates.
        </p>
      </div>

      <div className="card bg-base-100 border shadow-sm">
        <div className="card-body p-6 space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2">📞 Contact Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">
                <span className="label-text font-medium">Support Phone Number</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="+91-9876543210"
                value={form.supportPhone}
                onChange={(e) => setForm((f) => ({ ...f, supportPhone: e.target.value }))}
              />
              <label className="label">
                <span className="label-text-alt opacity-60">
                  Used for phone call links and display throughout the site
                </span>
              </label>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">WhatsApp Number</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="+919876543210 (leave empty to use phone number)"
                value={form.whatsappNumber}
                onChange={(e) => setForm((f) => ({ ...f, whatsappNumber: e.target.value }))}
              />
              <label className="label">
                <span className="label-text-alt opacity-60">
                  Used for the WhatsApp floating widget and wa.me links. Leave empty to default to the phone number above.
                </span>
              </label>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">Support Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full"
                placeholder="support@aethravia.com"
                value={form.supportEmail}
                onChange={(e) => setForm((f) => ({ ...f, supportEmail: e.target.value }))}
              />
              <label className="label">
                <span className="label-text-alt opacity-60">
                  Displayed in footer, contact page, and email templates
                </span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text font-medium">Shop Address</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                rows={3}
                placeholder="Full shop/office address"
                value={form.shopAddress}
                onChange={(e) => setForm((f) => ({ ...f, shopAddress: e.target.value }))}
              />
              <label className="label">
                <span className="label-text-alt opacity-60">
                  Displayed in footer and contact page
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? <span className="loading loading-spinner loading-xs" /> : null}
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
