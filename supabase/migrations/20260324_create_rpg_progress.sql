CREATE TABLE IF NOT EXISTS rpg_progress (
  id TEXT PRIMARY KEY DEFAULT 'default',
  character_name TEXT NOT NULL DEFAULT 'Vibecoder',
  character_title TEXT NOT NULL DEFAULT 'Product Manager turned Vibecoder',
  completed_skills TEXT[] NOT NULL DEFAULT '{}',
  xp_history JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO rpg_progress (id, character_name, character_title, completed_skills, xp_history)
VALUES (
  'default',
  'Vibecoder',
  'Product Manager turned Vibecoder',
  '{}',
  '[{"date": "2026-03-24", "xp": 0}]'
)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE rpg_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access" ON rpg_progress;
CREATE POLICY "Allow all access" ON rpg_progress
  FOR ALL USING (true) WITH CHECK (true);
