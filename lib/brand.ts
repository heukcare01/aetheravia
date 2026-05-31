// Centralized brand helper for UI & server usage
// Uses NEXT_PUBLIC_* so it works on client and server in Next.js

export const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'Aethravia';
export const brandTagline = process.env.NEXT_PUBLIC_BRAND_TAGLINE || 'Embrace the earth, unveil your personality';
export const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'Heuk care Private limited';
export const shopAddress = process.env.NEXT_PUBLIC_SHOP_ADDRESS || 'H.No.46, Mohalla Mohammad Wasil Near Hadri Masjid, Pilibhit, Uttar Pradesh-262001 (India)';
export const manufacturerAddress = process.env.NEXT_PUBLIC_MANUFACTURER_ADDRESS || 'Sage Apothecary PVT. LTD., Plot No. 516, Pace City-II, Sector-37, Gurugram – 122001 (Haryana)';

export const brandSlug = brandName.toLowerCase().replace(/[^a-z0-9]+/gi, '').trim();
export const brandEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'aethravia@gmail.com';

export const storeName = process.env.STORE_NAME || 'Aethravia Store';
export const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+91-9045429750';
export const businessHours = process.env.NEXT_PUBLIC_BUSINESS_HOURS || '9 a.m. to 6 p.m.';

