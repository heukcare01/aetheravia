import mongoose from 'mongoose';

export type SiteSettings = {
  _id?: string;
  supportPhone: string;
  whatsappNumber: string;
  supportEmail: string;
  shopAddress: string;
};

const siteSettingsSchema = new mongoose.Schema(
  {
    supportPhone: { type: String, default: '+91-XXXX-XXXXXX' },
    whatsappNumber: { type: String, default: '' }, // Falls back to supportPhone if empty
    supportEmail: { type: String, default: 'aethravia@gmail.com' },
    shopAddress: {
      type: String,
      default:
        'H.no. 46, Mohalla Mohammad Wasil, Near Hadri Masjid, Pilibhit, Uttar Pradesh, India, 262001',
    },
  },
  { timestamps: true }
);

const SiteSettingsModel =
  mongoose.models.SiteSettings ||
  mongoose.model('SiteSettings', siteSettingsSchema);

export default SiteSettingsModel;
