export class WhatsAppService {
  private get token() {
    return process.env.WHATSAPP_ACCESS_TOKEN;
  }

  private get phoneNumberId() {
    return process.env.WHATSAPP_PHONE_NUMBER_ID;
  }

  private get templateName() {
    return process.env.WHATSAPP_OTP_TEMPLATE_NAME;
  }

  private isConfigured() {
    return !!this.token && !!this.phoneNumberId && !!this.templateName;
  }

  async sendOtp(phone: string, otp: string): Promise<{ success: boolean; error?: any }> {
    if (!this.isConfigured()) {
      console.warn('WhatsApp API not configured. Skipping WhatsApp OTP.');
      // Fallback for development if keys aren't set
      if (process.env.NODE_ENV === 'development') {
        console.log(`[DEV OTP] Would have sent ${otp} to ${phone} via WhatsApp`);
        return { success: true };
      }
      return { success: false, error: 'WhatsApp keys are not configured on the server.' };
    }

    try {
      // Clean phone number: remove all non-digits, ensure it doesn't have leading + or 00
      let cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.startsWith('00')) cleanPhone = cleanPhone.substring(2);

      const url = `https://graph.facebook.com/v19.0/${this.phoneNumberId}/messages`;
      
      const payload = {
        messaging_product: 'whatsapp',
        to: cleanPhone,
        type: 'template',
        template: {
          name: this.templateName,
          language: {
            code: 'en_US', // Standard language code for templates, adjust if necessary
          },
          components: [
            {
              type: 'body',
              parameters: [
                {
                  type: 'text',
                  text: otp,
                },
              ],
            },
            {
              type: 'button',
              sub_type: 'url',
              index: '0',
              parameters: [
                {
                  type: 'text',
                  text: otp,
                },
              ],
            },
          ],
        },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Sometimes the button component causes an error if the template doesn't have a button.
        // Let's retry with just the body component if it fails.
        if (data.error && data.error.message.includes('component')) {
          console.warn('Retrying WhatsApp message without button component...');
          const fallbackPayload = {
            messaging_product: 'whatsapp',
            to: cleanPhone,
            type: 'template',
            template: {
              name: this.templateName,
              language: { code: 'en_US' },
              components: [
                {
                  type: 'body',
                  parameters: [
                    { type: 'text', text: otp }
                  ]
                }
              ]
            }
          };

          const fallbackResponse = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(fallbackPayload),
          });

          const fallbackData = await fallbackResponse.json();
          if (!fallbackResponse.ok) {
            console.error('WhatsApp Fallback API Error:', fallbackData);
            return { success: false, error: fallbackData?.error?.message || 'Fallback failed' };
          }
          return { success: true };
        }

        console.error('WhatsApp API Error:', data);
        return { success: false, error: data?.error?.message || 'WhatsApp API failed' };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error sending WhatsApp message:', error);
      return { success: false, error: error.message || String(error) };
    }
  }
}

export const whatsappService = new WhatsAppService();
