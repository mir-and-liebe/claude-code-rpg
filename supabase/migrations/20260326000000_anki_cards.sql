-- Anki Card System
-- Cards with SM-2 spaced repetition, RPG XP integration, learning status

CREATE TABLE IF NOT EXISTS anki_cards (
  id TEXT PRIMARY KEY,
  deck TEXT NOT NULL,           -- skill tree or topic group
  front TEXT NOT NULL,          -- question side
  back TEXT NOT NULL,           -- answer side
  tags TEXT[] DEFAULT '{}',     -- e.g. ['command', 'mcp', 'agent', 'concept']
  related_skill TEXT,           -- links to skill tree node
  difficulty TEXT DEFAULT 'normal', -- 'easy', 'normal', 'hard'
  xp_reward INTEGER DEFAULT 5,
  -- SM-2 fields
  ease_factor REAL DEFAULT 2.5,
  interval_days INTEGER DEFAULT 0,  -- 0 = new (never reviewed)
  repetitions INTEGER DEFAULT 0,
  next_review DATE,
  last_review DATE,
  -- Learning status
  status TEXT DEFAULT 'new',    -- 'new', 'learning', 'reviewing', 'mature'
  times_correct INTEGER DEFAULT 0,
  times_wrong INTEGER DEFAULT 0,
  -- Metadata
  source TEXT DEFAULT 'seed',   -- 'seed', 'vault-sync', 'manual'
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE anki_cards ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'anki_cards' AND policyname = 'Allow all'
  ) THEN
    CREATE POLICY "Allow all" ON anki_cards FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Track total anki XP in progress
ALTER TABLE rpg_progress ADD COLUMN IF NOT EXISTS anki_xp INTEGER DEFAULT 0;
ALTER TABLE rpg_progress ADD COLUMN IF NOT EXISTS anki_streak INTEGER DEFAULT 0;
ALTER TABLE rpg_progress ADD COLUMN IF NOT EXISTS anki_last_date DATE;
