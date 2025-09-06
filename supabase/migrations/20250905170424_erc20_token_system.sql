-- Location: supabase/migrations/20250905170424_erc20_token_system.sql
-- Schema Analysis: Fresh project - no existing schema
-- Integration Type: Complete new module
-- Dependencies: None (fresh project)

-- 1. Extensions & Types
CREATE TYPE public.transaction_type AS ENUM ('transfer', 'mint', 'burn', 'approval');

-- 2. Core Tables - Token Contracts
CREATE TABLE public.token_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    symbol TEXT NOT NULL UNIQUE,
    decimals INTEGER NOT NULL DEFAULT 18,
    total_supply BIGINT NOT NULL DEFAULT 0,
    max_supply BIGINT NOT NULL,
    contract_address TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- User Profiles for token holders
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    wallet_address TEXT UNIQUE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Token Balances
CREATE TABLE public.token_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    token_contract_id UUID REFERENCES public.token_contracts(id) ON DELETE CASCADE,
    balance BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, token_contract_id)
);

-- Allowances for approvals
CREATE TABLE public.token_allowances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    spender_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    token_contract_id UUID REFERENCES public.token_contracts(id) ON DELETE CASCADE,
    allowance BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(owner_id, spender_id, token_contract_id)
);

-- Transaction History
CREATE TABLE public.token_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_contract_id UUID REFERENCES public.token_contracts(id) ON DELETE CASCADE,
    from_user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    to_user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    transaction_type public.transaction_type NOT NULL,
    amount BIGINT NOT NULL,
    transaction_hash TEXT,
    block_number BIGINT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Essential Indexes
CREATE INDEX idx_user_profiles_wallet ON public.user_profiles(wallet_address);
CREATE INDEX idx_token_balances_user_token ON public.token_balances(user_id, token_contract_id);
CREATE INDEX idx_token_allowances_owner ON public.token_allowances(owner_id, token_contract_id);
CREATE INDEX idx_token_transactions_contract ON public.token_transactions(token_contract_id);
CREATE INDEX idx_token_transactions_users ON public.token_transactions(from_user_id, to_user_id);

-- 4. ERC-20 Functions (BEFORE RLS POLICIES)

-- Get token name
CREATE OR REPLACE FUNCTION public.token_name(contract_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT name FROM public.token_contracts WHERE id = contract_id;
$$;

-- Get token symbol
CREATE OR REPLACE FUNCTION public.token_symbol(contract_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT symbol FROM public.token_contracts WHERE id = contract_id;
$$;

-- Get token decimals
CREATE OR REPLACE FUNCTION public.token_decimals(contract_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT decimals FROM public.token_contracts WHERE id = contract_id;
$$;

-- Get total supply
CREATE OR REPLACE FUNCTION public.token_total_supply(contract_id UUID)
RETURNS BIGINT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT total_supply FROM public.token_contracts WHERE id = contract_id;
$$;

-- Get max supply
CREATE OR REPLACE FUNCTION public.token_max_supply(contract_id UUID)
RETURNS BIGINT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT max_supply FROM public.token_contracts WHERE id = contract_id;
$$;

-- Get balance of address
CREATE OR REPLACE FUNCTION public.token_balance_of(contract_id UUID, user_address UUID)
RETURNS BIGINT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT COALESCE(balance, 0)
FROM public.token_balances 
WHERE token_contract_id = contract_id AND user_id = user_address;
$$;

-- Get allowance
CREATE OR REPLACE FUNCTION public.token_allowance(contract_id UUID, owner_address UUID, spender_address UUID)
RETURNS BIGINT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT COALESCE(allowance, 0)
FROM public.token_allowances 
WHERE token_contract_id = contract_id 
  AND owner_id = owner_address 
  AND spender_id = spender_address;
$$;

-- Transfer function
CREATE OR REPLACE FUNCTION public.token_transfer(contract_id UUID, to_address UUID, amount BIGINT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    from_user_id UUID := auth.uid();
    from_balance BIGINT;
    to_balance BIGINT;
BEGIN
    -- Check if user is authenticated
    IF from_user_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Get current balances
    SELECT COALESCE(balance, 0) INTO from_balance 
    FROM public.token_balances 
    WHERE token_contract_id = contract_id AND user_id = from_user_id;
    
    SELECT COALESCE(balance, 0) INTO to_balance 
    FROM public.token_balances 
    WHERE token_contract_id = contract_id AND user_id = to_address;
    
    -- Check if sender has enough balance
    IF from_balance < amount THEN
        RETURN FALSE;
    END IF;
    
    -- Update sender balance
    INSERT INTO public.token_balances (user_id, token_contract_id, balance)
    VALUES (from_user_id, contract_id, from_balance - amount)
    ON CONFLICT (user_id, token_contract_id)
    DO UPDATE SET balance = from_balance - amount, updated_at = CURRENT_TIMESTAMP;
    
    -- Update recipient balance
    INSERT INTO public.token_balances (user_id, token_contract_id, balance)
    VALUES (to_address, contract_id, to_balance + amount)
    ON CONFLICT (user_id, token_contract_id)
    DO UPDATE SET balance = to_balance + amount, updated_at = CURRENT_TIMESTAMP;
    
    -- Record transaction
    INSERT INTO public.token_transactions (token_contract_id, from_user_id, to_user_id, transaction_type, amount)
    VALUES (contract_id, from_user_id, to_address, 'transfer'::public.transaction_type, amount);
    
    RETURN TRUE;
END;
$$;

-- Approve function
CREATE OR REPLACE FUNCTION public.token_approve(contract_id UUID, spender_address UUID, amount BIGINT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    owner_user_id UUID := auth.uid();
BEGIN
    -- Check if user is authenticated
    IF owner_user_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Set allowance
    INSERT INTO public.token_allowances (owner_id, spender_id, token_contract_id, allowance)
    VALUES (owner_user_id, spender_address, contract_id, amount)
    ON CONFLICT (owner_id, spender_id, token_contract_id)
    DO UPDATE SET allowance = amount, updated_at = CURRENT_TIMESTAMP;
    
    -- Record approval transaction
    INSERT INTO public.token_transactions (token_contract_id, from_user_id, to_user_id, transaction_type, amount)
    VALUES (contract_id, owner_user_id, spender_address, 'approval'::public.transaction_type, amount);
    
    RETURN TRUE;
END;
$$;

-- Transfer from (for approved spending)
CREATE OR REPLACE FUNCTION public.token_transfer_from(contract_id UUID, from_address UUID, to_address UUID, amount BIGINT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    spender_user_id UUID := auth.uid();
    current_allowance BIGINT;
    from_balance BIGINT;
    to_balance BIGINT;
BEGIN
    -- Check if user is authenticated
    IF spender_user_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Get current allowance
    SELECT COALESCE(allowance, 0) INTO current_allowance 
    FROM public.token_allowances 
    WHERE token_contract_id = contract_id 
      AND owner_id = from_address 
      AND spender_id = spender_user_id;
    
    -- Check if spender has enough allowance
    IF current_allowance < amount THEN
        RETURN FALSE;
    END IF;
    
    -- Get current balances
    SELECT COALESCE(balance, 0) INTO from_balance 
    FROM public.token_balances 
    WHERE token_contract_id = contract_id AND user_id = from_address;
    
    SELECT COALESCE(balance, 0) INTO to_balance 
    FROM public.token_balances 
    WHERE token_contract_id = contract_id AND user_id = to_address;
    
    -- Check if from address has enough balance
    IF from_balance < amount THEN
        RETURN FALSE;
    END IF;
    
    -- Update allowance
    UPDATE public.token_allowances 
    SET allowance = current_allowance - amount, updated_at = CURRENT_TIMESTAMP
    WHERE token_contract_id = contract_id 
      AND owner_id = from_address 
      AND spender_id = spender_user_id;
    
    -- Update balances
    INSERT INTO public.token_balances (user_id, token_contract_id, balance)
    VALUES (from_address, contract_id, from_balance - amount)
    ON CONFLICT (user_id, token_contract_id)
    DO UPDATE SET balance = from_balance - amount, updated_at = CURRENT_TIMESTAMP;
    
    INSERT INTO public.token_balances (user_id, token_contract_id, balance)
    VALUES (to_address, contract_id, to_balance + amount)
    ON CONFLICT (user_id, token_contract_id)
    DO UPDATE SET balance = to_balance + amount, updated_at = CURRENT_TIMESTAMP;
    
    -- Record transaction
    INSERT INTO public.token_transactions (token_contract_id, from_user_id, to_user_id, transaction_type, amount)
    VALUES (contract_id, from_address, to_address, 'transfer'::public.transaction_type, amount);
    
    RETURN TRUE;
END;
$$;

-- Trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, wallet_address)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'wallet_address', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Enable RLS
ALTER TABLE public.token_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_allowances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_transactions ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- Token contracts - public read
CREATE POLICY "public_can_read_token_contracts"
ON public.token_contracts
FOR SELECT
TO public
USING (true);

-- User profiles - users manage own profiles
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Token balances - users can view own balances, public read for transparency
CREATE POLICY "public_can_read_token_balances"
ON public.token_balances
FOR SELECT
TO public
USING (true);

CREATE POLICY "users_manage_own_token_balances"
ON public.token_balances
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Token allowances - users can manage own allowances
CREATE POLICY "users_manage_own_token_allowances"
ON public.token_allowances
FOR ALL
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- Users can view allowances where they are spender
CREATE POLICY "users_can_view_spender_allowances"
ON public.token_allowances
FOR SELECT
TO authenticated
USING (spender_id = auth.uid());

-- Token transactions - public read for transparency
CREATE POLICY "public_can_read_token_transactions"
ON public.token_transactions
FOR SELECT
TO public
USING (true);

-- 7. Mock Data
DO $$
DECLARE
    admin_user_id UUID := gen_random_uuid();
    user1_id UUID := gen_random_uuid();
    user2_id UUID := gen_random_uuid();
    token_contract_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@tokenapp.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Token Admin", "wallet_address": "0x1234567890abcdef"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user1_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'alice@tokenapp.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Alice Johnson", "wallet_address": "0xabcdef1234567890"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user2_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'bob@tokenapp.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Bob Smith", "wallet_address": "0xfedcba0987654321"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create token contract
    INSERT INTO public.token_contracts (id, name, symbol, decimals, total_supply, max_supply, contract_address)
    VALUES (
        token_contract_id, 
        'Demo Token', 
        'DEMO', 
        18, 
        1000000000000000000000000, -- 1,000,000 tokens with 18 decimals
        10000000000000000000000000, -- 10,000,000 max supply
        '0x742d35cc67c7b6f8b47bc37b7e1c65ad0c4c2b4e'
    );

    -- Create initial token balances
    INSERT INTO public.token_balances (user_id, token_contract_id, balance)
    VALUES
        (admin_user_id, token_contract_id, 500000000000000000000000), -- 500,000 tokens
        (user1_id, token_contract_id, 300000000000000000000000),     -- 300,000 tokens
        (user2_id, token_contract_id, 200000000000000000000000);     -- 200,000 tokens

    -- Create sample allowances
    INSERT INTO public.token_allowances (owner_id, spender_id, token_contract_id, allowance)
    VALUES
        (user1_id, user2_id, token_contract_id, 50000000000000000000000), -- Alice allows Bob 50,000 tokens
        (admin_user_id, user1_id, token_contract_id, 100000000000000000000000); -- Admin allows Alice 100,000 tokens

    -- Create sample transactions
    INSERT INTO public.token_transactions (token_contract_id, from_user_id, to_user_id, transaction_type, amount)
    VALUES
        (token_contract_id, null, admin_user_id, 'mint'::public.transaction_type, 500000000000000000000000),
        (token_contract_id, null, user1_id, 'mint'::public.transaction_type, 300000000000000000000000),
        (token_contract_id, null, user2_id, 'mint'::public.transaction_type, 200000000000000000000000),
        (token_contract_id, user1_id, user2_id, 'approval'::public.transaction_type, 50000000000000000000000);
END $$;