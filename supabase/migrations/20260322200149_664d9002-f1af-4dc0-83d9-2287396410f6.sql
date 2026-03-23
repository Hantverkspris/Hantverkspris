
-- Tighten: only allow adding yourself as participant
DROP POLICY IF EXISTS "Authenticated users can add participants" ON public.conversation_participants;
CREATE POLICY "Users can add themselves as participants" ON public.conversation_participants FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
