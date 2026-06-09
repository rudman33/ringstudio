// ── Accounts ──────────────────────────────────────────────
export type Plan = 'trial' | 'free' | 'starter' | 'pro' | 'enterprise'
export type AccountStatus = 'trial' | 'active' | 'suspended' | 'cancelled'

export interface Account {
  id: string
  email: string
  business_name: string
  subdomain: string
  custom_domain?: string
  logo_url?: string
  brand_color: string
  notification_email?: string
  plan: Plan
  status: AccountStatus
  stripe_customer_id?: string
  stripe_subscription_id?: string
  trial_ends_at?: string
  created_at: string
  updated_at: string
}

export type UserRole = 'owner' | 'admin' | 'viewer'

export interface AccountUser {
  id: string
  account_id: string
  user_id: string
  role: UserRole
  created_at: string
}

// ── Builder ───────────────────────────────────────────────
export type StepKey =
  | 'contact' | 'type' | 'photo' | 'stone' | 'shape'
  | 'carat' | 'setting' | 'metal' | 'band'
  | 'enhancements' | 'prefs' | 'summary' | 'viz'

export interface BuilderStep {
  id: string
  account_id: string
  step_key: StepKey
  label: string
  sort_order: number
  is_visible: boolean
  is_required: boolean
  created_at: string
}

export interface StepOption {
  id: string
  account_id: string
  step_key: StepKey
  label: string
  description?: string
  image_url?: string
  color_hex?: string
  price_modifier: number
  sort_order: number
  is_active: boolean
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

// Config the customer-facing builder loads on init
export interface BuilderConfig {
  account: Pick<Account, 'id' | 'business_name' | 'logo_url' | 'brand_color'>
  steps: BuilderStep[]
  options: Record<StepKey, StepOption[]>
}

// ── Ring Builder State ────────────────────────────────────
export interface RingSelections {
  type?: string
  photo?: 'uploaded' | 'none'
  stone?: string
  shape?: string
  carat?: string
  setting?: string
  metal?: string
  band?: string
  enhancements?: string[]
}

export interface RingPreferences {
  ring_size?: string
  band_width?: string
  budget_range?: string
  timeline?: string
  notes?: string
}

export interface RingBuilderState {
  // Contact
  customer_name: string
  customer_email: string
  customer_phone: string
  // Selections
  selections: RingSelections
  // Preferences
  preferences: RingPreferences
  // AI chat
  chatMessages: ChatMessage[]
  // Upload
  inspiration_photo_url?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// ── Inquiries ─────────────────────────────────────────────
export type InquiryStatus = 'new' | 'read' | 'quoted' | 'closed' | 'spam'

export interface Inquiry {
  id: string
  account_id: string
  reference_code: string
  status: InquiryStatus
  customer_name: string
  customer_email: string
  customer_phone?: string
  ring_type?: string
  selections: RingSelections
  inspiration_photo_url?: string
  ring_size?: string
  band_width?: string
  budget_range?: string
  timeline?: string
  notes?: string
  ai_chat_transcript: ChatMessage[]
  quoted_price?: number
  jeweler_notes?: string
  source_url?: string
  created_at: string
  updated_at: string
}

export type InquiryEventType =
  | 'created' | 'status_changed' | 'note_added'
  | 'quoted' | 'assigned'

export interface InquiryEvent {
  id: string
  inquiry_id: string
  account_id: string
  actor: 'jeweler' | 'system' | 'customer'
  event_type: InquiryEventType
  payload: Record<string, unknown>
  created_at: string
}

// ── API Payloads ──────────────────────────────────────────
export interface SubmitInquiryPayload {
  account_id: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  ring_type?: string
  selections: RingSelections
  inspiration_photo_url?: string
  ring_size?: string
  band_width?: string
  budget_range?: string
  timeline?: string
  notes?: string
  ai_chat_transcript?: ChatMessage[]
  source_url?: string
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
}
