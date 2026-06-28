-- Supabase Schema for TrendyAI Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free',
  credits INTEGER DEFAULT 20,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically create profile for new auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, plan, credits)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url',
    'free',
    20 -- default free starter credits
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Voices Table
CREATE TABLE IF NOT EXISTS public.voices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('preset', 'cloned')) NOT NULL,
  elevenlabs_voice_id TEXT NOT NULL,
  sample_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for Voices
ALTER TABLE public.voices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own voices and presets" ON public.voices 
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can insert own voices" ON public.voices 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own voices" ON public.voices 
  FOR DELETE USING (auth.uid() = user_id);

-- 3. Jobs (Video Generation Jobs) Table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('video', 'short', 'reel', 'ad')) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  prompt TEXT,
  script JSONB,
  description TEXT,
  settings JSONB,
  source_images TEXT[],
  voice_id UUID REFERENCES public.voices(id) ON DELETE SET NULL,
  model_used TEXT,
  duration INTEGER,
  generation_time_ms INTEGER,
  output_url TEXT,
  thumbnail_url TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- RLS for Jobs
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own jobs" ON public.jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own jobs" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own jobs" ON public.jobs FOR UPDATE USING (auth.uid() = user_id);

-- 4. Social Accounts Table (OAuth connections)
CREATE TABLE IF NOT EXISTS public.social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform TEXT CHECK (platform IN ('youtube', 'tiktok', 'instagram')) NOT NULL,
  account_name TEXT,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  platform_user_id TEXT,
  connected_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, platform, platform_user_id)
);

-- RLS for Social Accounts
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own connected accounts" ON public.social_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own connected accounts" ON public.social_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update/delete own connected accounts" ON public.social_accounts FOR ALL USING (auth.uid() = user_id);

-- 5. Publish Jobs (Social Posting Jobs) Table
CREATE TABLE IF NOT EXISTS public.publish_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  platform TEXT CHECK (platform IN ('youtube', 'tiktok', 'instagram')) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'processing', 'published', 'failed')) DEFAULT 'pending',
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  post_url TEXT,
  title TEXT,
  description TEXT,
  tags TEXT[],
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for Publish Jobs
ALTER TABLE public.publish_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own publish jobs" ON public.publish_jobs FOR ALL USING (auth.uid() = user_id);

-- 6. Templates Table
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  thumbnail_url TEXT,
  settings JSONB,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for Templates
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can read templates" ON public.templates FOR SELECT USING (true);

-- 7. Subscription Plans Table
CREATE TABLE IF NOT EXISTS public.plans (
  id TEXT PRIMARY KEY, -- 'free', 'starter', 'pro', 'business'
  name TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  credits_per_month INTEGER NOT NULL,
  features JSONB NOT NULL,
  paystack_plan_code TEXT
);

-- RLS for Plans
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can read plans" ON public.plans FOR SELECT USING (true);

-- Insert default subscription plans
INSERT INTO public.plans (id, name, price_cents, credits_per_month, features, paystack_plan_code) VALUES
('free', 'Free Tier', 0, 20, '{"video_quality": "speed", "voice_cloning": false, "social_accounts": 1, "auto_posting": false, "watermark": true}', NULL)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  price_cents = EXCLUDED.price_cents,
  credits_per_month = EXCLUDED.credits_per_month,
  features = EXCLUDED.features;

INSERT INTO public.plans (id, name, price_cents, credits_per_month, features, paystack_plan_code) VALUES
('starter', 'Starter Tier', 1900, 250, '{"video_quality": "speed_balanced", "voice_cloning": true, "max_clones": 1, "social_accounts": 1, "auto_posting": true, "watermark": false}', 'PLN_starter_mock')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  price_cents = EXCLUDED.price_cents,
  credits_per_month = EXCLUDED.credits_per_month,
  features = EXCLUDED.features;

INSERT INTO public.plans (id, name, price_cents, credits_per_month, features, paystack_plan_code) VALUES
('pro', 'Pro Tier', 4900, 800, '{"video_quality": "all", "voice_cloning": true, "max_clones": 5, "social_accounts": 3, "auto_posting": true, "watermark": false}', 'PLN_pro_mock')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  price_cents = EXCLUDED.price_cents,
  credits_per_month = EXCLUDED.credits_per_month,
  features = EXCLUDED.features;

INSERT INTO public.plans (id, name, price_cents, credits_per_month, features, paystack_plan_code) VALUES
('business', 'Business Tier', 9900, 2000, '{"video_quality": "all", "voice_cloning": true, "max_clones": -1, "social_accounts": 10, "auto_posting": true, "watermark": false, "priority_queue": true}', 'PLN_business_mock')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  price_cents = EXCLUDED.price_cents,
  credits_per_month = EXCLUDED.credits_per_month,
  features = EXCLUDED.features;

-- 8. Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id TEXT REFERENCES public.plans(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'unpaid')),
  paystack_subscription_code TEXT,
  paystack_customer_code TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for Subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- 9. Credit Transactions Table (Ledger)
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- positive = credit added, negative = spent
  type TEXT CHECK (type IN ('subscription', 'topup', 'generation', 'publish', 'refund', 'bonus')) NOT NULL,
  description TEXT,
  reference_id UUID, -- references job_id, payment_id, etc.
  balance_after INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for Credit Transactions
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own credit ledger" ON public.credit_transactions FOR SELECT USING (auth.uid() = user_id);

-- 10. Payments Table (Paystack purchases)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  type TEXT CHECK (type IN ('subscription', 'topup')) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'success', 'failed')) DEFAULT 'pending',
  paystack_reference TEXT UNIQUE,
  credits_granted INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for Payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own payment logs" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 11. Atomic Credit Deduction Function
CREATE OR REPLACE FUNCTION public.deduct_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_description TEXT,
  p_reference_id UUID
) RETURNS JSONB AS $$
DECLARE
  v_current_credits INTEGER;
  v_new_credits INTEGER;
BEGIN
  -- Lock user profile row to prevent race conditions
  SELECT credits INTO v_current_credits
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;
  
  IF v_current_credits IS NULL THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;
  
  IF v_current_credits < p_amount THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;
  
  -- Calculate new credits balance
  v_new_credits := v_current_credits - p_amount;
  
  -- Update profile
  UPDATE public.profiles
  SET credits = v_new_credits
  WHERE id = p_user_id;
  
  -- Insert into ledger transaction logs
  INSERT INTO public.credit_transactions (
    user_id,
    amount,
    type,
    description,
    reference_id,
    balance_after
  ) VALUES (
    p_user_id,
    -p_amount,
    'generation',
    p_description,
    p_reference_id,
    v_new_credits
  );
  
  RETURN json_build_object('success', true, 'new_balance', v_new_credits);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_jobs_user_status ON public.jobs(user_id, status);
CREATE INDEX IF NOT EXISTS idx_voices_user ON public.voices(user_id);
CREATE INDEX IF NOT EXISTS idx_publish_jobs_user ON public.publish_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user ON public.credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);
