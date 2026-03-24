-- Killer Features Migration
-- Verified skills (completed via challenge vs skipped)
ALTER TABLE rpg_progress ADD COLUMN IF NOT EXISTS verified_skills TEXT[] DEFAULT '{}';

-- Spaced repetition review system
CREATE TABLE IF NOT EXISTS skill_reviews (
  skill_id TEXT PRIMARY KEY,
  ease_factor REAL DEFAULT 2.5,
  interval_days INTEGER DEFAULT 1,
  repetitions INTEGER DEFAULT 0,
  next_review DATE NOT NULL DEFAULT CURRENT_DATE,
  last_review DATE
);

ALTER TABLE skill_reviews ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'skill_reviews' AND policyname = 'Allow all'
  ) THEN
    CREATE POLICY "Allow all" ON skill_reviews FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
