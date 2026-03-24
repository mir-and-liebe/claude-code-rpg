-- Octalysis Gamification Upgrade
-- Adds columns for narrative, class system, streaks, easter eggs, unlocks

-- Narrative tracking
ALTER TABLE rpg_progress ADD COLUMN IF NOT EXISTS last_seen_chapter TEXT DEFAULT '';

-- Character customization
ALTER TABLE rpg_progress ADD COLUMN IF NOT EXISTS character_class TEXT DEFAULT '';
ALTER TABLE rpg_progress ADD COLUMN IF NOT EXISTS avatar TEXT DEFAULT 'swords';

-- Unlocks
ALTER TABLE rpg_progress ADD COLUMN IF NOT EXISTS unlocked_widgets TEXT[] DEFAULT '{}';

-- Streaks
ALTER TABLE rpg_progress ADD COLUMN IF NOT EXISTS streak_current INTEGER DEFAULT 0;
ALTER TABLE rpg_progress ADD COLUMN IF NOT EXISTS streak_best INTEGER DEFAULT 0;
ALTER TABLE rpg_progress ADD COLUMN IF NOT EXISTS streak_last_date DATE;

-- Easter eggs discovered
ALTER TABLE rpg_progress ADD COLUMN IF NOT EXISTS discovered_easter_eggs TEXT[] DEFAULT '{}';

-- Daily quests
CREATE TABLE IF NOT EXISTS daily_quests (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  quest_type TEXT NOT NULL,
  quest_target TEXT NOT NULL,
  bonus_xp INTEGER NOT NULL DEFAULT 50,
  completed BOOLEAN DEFAULT false
);

ALTER TABLE daily_quests ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'daily_quests' AND policyname = 'Allow all'
  ) THEN
    CREATE POLICY "Allow all" ON daily_quests FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
