import { loadStripe, type Stripe } from '@stripe/stripe-js'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
)

let stripePromise: Promise<Stripe | null>

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    
    if (!publishableKey) {
      console.log('💳 Mode simulation Stripe - Clé publique manquante')
      return Promise.resolve(null)
    }
    
    stripePromise = loadStripe(publishableKey)
  }
  return stripePromise
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  client_secret?: string
}

export interface PriceData {
  amount: number
  currency: string
  description: string
  sessionId: string
  participantId: string
}

export async function createPaymentIntent(data: PriceData): Promise<PaymentIntent> {
  try {
    if (!import.meta.env.VITE_STRIPE_SECRET_KEY) {
      console.log('💳 Mode simulation Stripe - Paiement simulé:', {
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        sessionId: data.sessionId
      })
      
      return {
        id: `sim_pi_${Date.now()}`,
        amount: data.amount,
        currency: data.currency,
        status: 'succeeded',
        client_secret: `sim_secret_${Date.now()}`
      }
    }

    const response = await fetch('/.netlify/functions/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        metadata: {
          session_id: data.sessionId,
          participant_id: data.participantId
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Erreur création PaymentIntent: ${response.status}`)
    }

    return await response.json()

  } catch (error) {
    console.error('Erreur lors de la création du PaymentIntent:', error)
    throw error
  }
}

export async function confirmPayment(
  paymentIntentId: string,
  paymentMethodId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!import.meta.env.VITE_STRIPE_SECRET_KEY) {
      console.log('💳 Mode simulation Stripe - Paiement confirmé:', paymentIntentId)
      return { success: true }
    }

    const stripe = await getStripe()
    if (!stripe) {
      throw new Error('Stripe non initialisé')
    }

    const { error } = await stripe.confirmCardPayment(paymentIntentId, {
      payment_method: paymentMethodId
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }

  } catch (error) {
    console.error('Erreur lors de la confirmation du paiement:', error)
    return { success: false, error: 'Erreur technique' }
  }
}

export async function savePaymentToDatabase(
  paymentData: {
    payment_intent_id: string
    session_id: string
    participant_id: string
    amount: number
    currency: string
    status: string
  }
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('session_participants')
      .update({
        payment_status: paymentData.status === 'succeeded' ? 'paid' : 'pending',
        payment_intent_id: paymentData.payment_intent_id,
        payment_amount: paymentData.amount
      })
      .eq('id', paymentData.participant_id)

    if (error) {
      console.error('Erreur sauvegarde paiement:', error)
      return false
    }

    const { error: logError } = await supabase
      .from('payment_logs')
      .insert({
        payment_intent_id: paymentData.payment_intent_id,
        session_id: paymentData.session_id,
        participant_id: paymentData.participant_id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: paymentData.status,
        created_at: new Date().toISOString()
      })

    if (logError) {
      console.warn('Erreur log paiement:', logError)
    }

    return true

  } catch (error) {
    console.error('Erreur lors de la sauvegarde du paiement:', error)
    return false
  }
}

export async function refundPayment(
  paymentIntentId: string,
  amount?: number
): Promise<{ success: boolean; refund_id?: string; error?: string }> {
  try {
    if (!import.meta.env.VITE_STRIPE_SECRET_KEY) {
      console.log('💳 Mode simulation Stripe - Remboursement:', {
        paymentIntentId,
        amount: amount || 'total'
      })
      return { success: true, refund_id: `sim_re_${Date.now()}` }
    }

    const response = await fetch('/.netlify/functions/refund-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_intent: paymentIntentId,
        amount
      })
    })

    if (!response.ok) {
      throw new Error(`Erreur remboursement: ${response.status}`)
    }

    return await response.json()

  } catch (error) {
    console.error('Erreur lors du remboursement:', error)
    return { success: false, error: 'Erreur technique' }
  }
}

export function formatPrice(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency.toUpperCase()
  }).format(amount / 100)
}

export function validateAmount(amount: number): boolean {
  return amount > 0 && amount <= 9999999
}

export async function getPaymentHistory(participantId: string): Promise<unknown[]> {
  try {
    const { data, error } = await supabase
      .from('payment_logs')
      .select(`
        *,
        training_sessions(title, start_date)
      `)
      .eq('participant_id', participantId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur récupération historique:', error)
      return []
    }

    return data || []

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error)
    return []
  }
}