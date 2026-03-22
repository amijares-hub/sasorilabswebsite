-- ============================================================
-- SASORILABS NEWSLETTER SYSTEM - Complete Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Subscribers table (completely separate from admin auth)
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    source TEXT DEFAULT 'website_popup',
    lang TEXT DEFAULT 'es',
    confirmed BOOLEAN DEFAULT true, -- simplified: no double opt-in for now
    confirmation_token UUID DEFAULT gen_random_uuid(),
    unsubscribe_token UUID DEFAULT gen_random_uuid(),
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Newsletter campaigns table
CREATE TABLE IF NOT EXISTS public.newsletter_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject_es TEXT NOT NULL,
    subject_en TEXT,
    content_es TEXT NOT NULL,
    content_en TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sending', 'sent', 'failed')),
    sent_at TIMESTAMPTZ,
    sent_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Email send log
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subscriber_id UUID REFERENCES public.subscribers(id) ON DELETE SET NULL,
    campaign_id UUID REFERENCES public.newsletter_campaigns(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'campaign' CHECK (type IN ('welcome', 'campaign', 'confirmation')),
    status TEXT DEFAULT 'sent',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe
CREATE POLICY "public_subscribe" ON public.subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_own" ON public.subscribers FOR UPDATE USING (true);
CREATE POLICY "public_read_own" ON public.subscribers FOR SELECT USING (true);

-- Campaings: admin only (service role)
CREATE POLICY "service_only_campaigns" ON public.newsletter_campaigns FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "service_only_logs" ON public.email_logs FOR ALL USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON public.subscribers(status);
CREATE INDEX IF NOT EXISTS idx_subscribers_unsubscribe_token ON public.subscribers(unsubscribe_token);

-- Auto-timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS subscribers_updated_at ON public.subscribers;
CREATE TRIGGER subscribers_updated_at
    BEFORE UPDATE ON public.subscribers
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
