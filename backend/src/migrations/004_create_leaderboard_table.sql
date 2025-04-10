CREATE TABLE IF NOT EXISTS leaderboard (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  wpm FLOAT NOT NULL,
  accuracy FLOAT NOT NULL,
  time_taken FLOAT NOT NULL,
  mode TEXT DEFAULT 'stories',       
  placement INTEGER DEFAULT NULL,   
  played_at TIMESTAMPTZ DEFAULT NOW()
);
