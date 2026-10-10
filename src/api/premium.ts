import api from './client'

/** Register this signed-in Angel One account for premium, using the session's credentials. */
export async function registerPremium(countryCode: string, whatsappNumber: string): Promise<void> {
  await api.post('/api/premium/register', {
    country_code: countryCode,
    whatsapp_number: whatsappNumber,
  })
}
