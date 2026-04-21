'use client';

import { useState } from 'react';

const TEMPLATES = [
  {
    key: 'order-admin',
    label: 'New Order',
    group: 'Admin (notifications)',
    description: 'Sent to admin when a new order is received',
  },
  {
    key: 'donation-admin',
    label: 'New Donation',
    group: 'Admin (notifications)',
    description: 'Sent to admin when a donation is received',
  },
  {
    key: 'newsletter-admin',
    label: 'New Subscription',
    group: 'Admin (notifications)',
    description: 'Sent to admin when someone subscribes to the newsletter',
  },
  {
    key: 'contact-admin',
    label: 'Contact Form',
    group: 'Admin (notifications)',
    description: 'Sent to admin when someone submits the contact form',
  },
  {
    key: 'order-user',
    label: 'Order Confirmation',
    group: 'User (confirmations)',
    description: 'Order confirmation email sent to the customer',
  },
  {
    key: 'donation-user',
    label: 'Donation Confirmation',
    group: 'User (confirmations)',
    description: 'Donation confirmation email sent to the donor',
  },
  {
    key: 'newsletter-user',
    label: 'Newsletter Welcome',
    group: 'User (confirmations)',
    description: 'Welcome email sent to the new subscriber',
  },
];

const THEMES = [
  { key: 'blue', label: 'Blue', color: '#3B82F6' },
  { key: 'teal', label: 'Teal', color: '#008286' },
  { key: 'green', label: 'Green', color: '#1EA572' },
  { key: 'turquoise', label: 'Turquoise', color: '#06AED5' },
  { key: 'red', label: 'Red', color: '#dc2626' },
  { key: 'coral', label: 'Coral', color: '#FC5761' },
  { key: 'orange', label: 'Orange', color: '#ea580c' },
  { key: 'gold', label: 'Gold', color: '#ffb700' },
];

const adminTemplates = TEMPLATES.filter(t => t.group === 'Admin (notifications)');
const userTemplates = TEMPLATES.filter(t => t.group === 'User (confirmations)');

export default function EmailPreviewPage() {
  const [selected, setSelected] = useState(TEMPLATES[0].key);
  const [theme, setTheme] = useState('blue');

  const previewUrl = `/api/email-preview?template=${selected}&theme=${theme}`;
  const selectedTemplate = TEMPLATES.find(t => t.key === selected);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">Email Template Preview</h1>
        <p className="text-sm text-gray-500 mt-0.5">{TEMPLATES.length} templates available</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-gray-200 flex flex-col overflow-y-auto shrink-0">
          {/* Theme selector */}
          <div className="px-4 py-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Color Theme</p>
            <div className="flex flex-wrap gap-2">
              {THEMES.map(t => (
                <button
                  key={t.key}
                  title={t.label}
                  onClick={() => setTheme(t.key)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    theme === t.key ? 'border-gray-800 scale-110' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: t.color }}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Selected theme: <span className="font-medium text-gray-600">{theme}</span>
            </p>
          </div>

          {/* Template list */}
          <nav className="flex-1 px-3 py-4 space-y-5">
            {[
              { label: 'Admin (notifications)', items: adminTemplates },
              { label: 'User (confirmations)', items: userTemplates },
            ].map(group => (
              <div key={group.label}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
                  {group.label}
                </p>
                <ul className="space-y-1">
                  {group.items.map(t => (
                    <li key={t.key}>
                      <button
                        onClick={() => setSelected(t.key)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          selected === t.key
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {t.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Preview panel */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
            <div>
              <span className="font-semibold text-gray-800">{selectedTemplate?.label}</span>
              <span className="text-gray-400 mx-2">·</span>
              <span className="text-sm text-gray-500">{selectedTemplate?.description}</span>
            </div>
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-md transition-colors"
            >
              Open in new tab ↗
            </a>
          </div>

          {/* iFrame */}
          <div className="flex-1 p-6 overflow-hidden">
            <iframe
              key={`${selected}-${theme}`}
              src={previewUrl}
              className="w-full h-full rounded-xl border border-gray-200 shadow-md bg-white"
              title={`Preview: ${selectedTemplate?.label}`}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
