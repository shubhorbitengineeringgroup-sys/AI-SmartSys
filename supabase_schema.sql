-- AI-SmartSys Supabase Schema Script
-- Run this script in your Supabase SQL Editor to create the required tables and configure security policies.

-- 1. Create Contact Submissions Table (stores forms & requirement submissions)
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    source TEXT DEFAULT 'classic_form'::text NOT NULL, -- 'classic_form', 'onboarding_bot', 'ai_chatbot'
    status TEXT DEFAULT 'new'::text NOT NULL           -- 'new', 'in_progress', 'resolved'
);

-- 2. Create Chat Messages Table (logs AI Chatbot conversations for auditing)
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    session_id TEXT NOT NULL,                          -- Unique session string generated on client
    sender TEXT NOT NULL,                              -- 'user' or 'bot'
    message TEXT NOT NULL,
    user_name TEXT,                                    -- Captured during chat (optional)
    user_email TEXT                                    -- Captured during chat (optional)
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies
-- Allow public users (unauthenticated) to submit contact forms and chatbot inputs
CREATE POLICY "Allow public inserts to contact_submissions" 
ON public.contact_submissions 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow public inserts to chat_messages" 
ON public.chat_messages 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow authenticated users (dashboard admins) to read all submissions and transcripts
CREATE POLICY "Allow authenticated reads to contact_submissions" 
ON public.contact_submissions 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated reads to chat_messages" 
ON public.chat_messages 
FOR SELECT 
TO authenticated 
USING (true);

-- Allow authenticated users (dashboard admins) to update submission statuses
CREATE POLICY "Allow authenticated updates to contact_submissions" 
ON public.contact_submissions 
FOR UPDATE 
TO authenticated 
USING (true);

-- Add index to chat messages for faster lookup by session ID
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON public.contact_submissions(created_at DESC);
