
-- Add avatar_url to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Ads table for hiring/offering staff
CREATE TABLE public.ads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('hire', 'offer')),
  urgent BOOLEAN NOT NULL DEFAULT false,
  title TEXT NOT NULL,
  description TEXT,
  skill TEXT NOT NULL,
  people_count INTEGER NOT NULL DEFAULT 1,
  start_date TEXT NOT NULL,
  duration TEXT NOT NULL,
  location TEXT NOT NULL,
  rate TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can see all ads
CREATE POLICY "Authenticated users can view all ads" ON public.ads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert their own ads" ON public.ads FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own ads" ON public.ads FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own ads" ON public.ads FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Conversations table
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Conversation participants
CREATE TABLE public.conversation_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(conversation_id, user_id)
);

ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;

-- Messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- RLS: users can only see conversations they participate in
CREATE OR REPLACE FUNCTION public.user_in_conversation(_user_id UUID, _conversation_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE user_id = _user_id AND conversation_id = _conversation_id
  )
$$;

CREATE POLICY "Users can view their conversations" ON public.conversations FOR SELECT TO authenticated
  USING (public.user_in_conversation(auth.uid(), id));

CREATE POLICY "Authenticated users can create conversations" ON public.conversations FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their participations" ON public.conversation_participants FOR SELECT TO authenticated
  USING (public.user_in_conversation(auth.uid(), conversation_id));

CREATE POLICY "Authenticated users can add participants" ON public.conversation_participants FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view messages in their conversations" ON public.messages FOR SELECT TO authenticated
  USING (public.user_in_conversation(auth.uid(), conversation_id));

CREATE POLICY "Users can send messages in their conversations" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (public.user_in_conversation(auth.uid(), conversation_id));

-- Profiles: allow authenticated users to view all profiles (for showing company names)
CREATE POLICY "Authenticated users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);

-- Drop the old restrictive select policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies for avatars
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'avatars');
