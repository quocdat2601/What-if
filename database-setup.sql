-- =====================================================
-- What If... Game Database Setup Script
-- Version: 0.1
-- Author: Generated for What If... project
-- =====================================================

-- Enable UUID extension for PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CORE TABLES
-- =====================================================

-- Players table
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Game runs table
CREATE TABLE runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    seed BIGINT NOT NULL,
    profile JSONB NOT NULL, -- character background, traits
    current_age INTEGER DEFAULT 0,
    current_stats JSONB NOT NULL, -- HP, Mood, Finance, etc.
    current_energy INTEGER DEFAULT 100,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE,
    run_score INTEGER DEFAULT 0,
    ending_type VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    
    CONSTRAINT valid_age CHECK (current_age >= 0 AND current_age <= 120),
    CONSTRAINT valid_energy CHECK (current_energy >= 0 AND current_energy <= 100)
);

-- Events table (canonical + AI-generated)
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., "evt_00123"
    type VARCHAR(50) NOT NULL, -- milestone, random, opportunity, chain
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    min_age INTEGER DEFAULT 0,
    max_age INTEGER DEFAULT 120,
    prerequisites JSONB, -- stats, history flags, etc.
    choices JSONB NOT NULL, -- array of choice objects
    tags TEXT[], -- education, early_life, etc.
    branch_weight DECIMAL(3,2) DEFAULT 1.0,
    rarity_factor DECIMAL(3,2) DEFAULT 1.0,
    source VARCHAR(20) DEFAULT 'scripted', -- scripted, ai_generated, ai_cached
    ai_signature_hash VARCHAR(64), -- for AI-generated events
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    
    CONSTRAINT valid_age_range CHECK (min_age <= max_age),
    CONSTRAINT valid_branch_weight CHECK (branch_weight >= 0.0 AND branch_weight <= 10.0),
    CONSTRAINT valid_rarity CHECK (rarity_factor >= 0.1 AND rarity_factor <= 10.0)
);

-- Timeline table (event history for each run)
CREATE TABLE timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id UUID NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
    age INTEGER NOT NULL,
    event_id UUID NOT NULL REFERENCES events(id),
    choice_id VARCHAR(20) NOT NULL, -- e.g., "c1", "c2"
    choice_text TEXT NOT NULL,
    result JSONB, -- effects applied, stat changes
    chained_event_id UUID REFERENCES events(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_timeline_age CHECK (age >= 0 AND age <= 120)
);

-- =====================================================
-- 2. META PROGRESSION TABLES
-- =====================================================

-- Talents table
CREATE TABLE talents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- art, music, sports, etc.
    cost INTEGER NOT NULL DEFAULT 100,
    effects JSONB, -- stat bonuses, unlock conditions
    is_active BOOLEAN DEFAULT true
);

-- Perks table
CREATE TABLE perks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- luck_boost, risk_reducer, etc.
    cost INTEGER NOT NULL DEFAULT 100,
    effects JSONB, -- modifiers, bonuses
    is_active BOOLEAN DEFAULT true
);

-- Player talents (unlocked)
CREATE TABLE player_talents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    talent_id UUID NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, talent_id)
);

-- Player perks (unlocked)
CREATE TABLE player_perks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    perk_id UUID NOT NULL REFERENCES perks(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, perk_id)
);

-- Meta points (earned from runs)
CREATE TABLE meta_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    points INTEGER NOT NULL DEFAULT 0,
    earned_from_run_id UUID REFERENCES runs(id),
    spent_on_type VARCHAR(20), -- talent, perk
    spent_on_id UUID, -- talent_id or perk_id
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_points CHECK (points != 0)
);

-- =====================================================
-- 3. AI & CACHING TABLES
-- =====================================================

-- AI cache for pre-generated events
CREATE TABLE ai_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    signature_hash VARCHAR(64) UNIQUE NOT NULL,
    prompt_template VARCHAR(100) NOT NULL,
    context_hash VARCHAR(64) NOT NULL,
    generated_event JSONB NOT NULL,
    model_used VARCHAR(50),
    cost_usd DECIMAL(10,6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_valid BOOLEAN DEFAULT true
);

-- AI generation queue
CREATE TABLE ai_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    priority INTEGER DEFAULT 5,
    prompt_template VARCHAR(100) NOT NULL,
    context JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT
);

-- =====================================================
-- 4. ANALYTICS & MONITORING TABLES
-- =====================================================

-- Choice analytics
CREATE TABLE choice_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id),
    choice_id VARCHAR(20) NOT NULL,
    run_id UUID NOT NULL REFERENCES runs(id),
    player_id UUID NOT NULL REFERENCES players(id),
    player_age INTEGER NOT NULL,
    player_stats JSONB,
    selected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Event frequency tracking
CREATE TABLE event_frequency (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id),
    total_occurrences INTEGER DEFAULT 0,
    successful_choices INTEGER DEFAULT 0,
    last_occurrence TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 5. INDEXES FOR PERFORMANCE
-- =====================================================

-- Runs indexes
CREATE INDEX idx_runs_player_id ON runs(player_id);
CREATE INDEX idx_runs_seed ON runs(seed);
CREATE INDEX idx_runs_active ON runs(is_active);
CREATE INDEX idx_runs_started_at ON runs(started_at);

-- Events indexes
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_age_range ON events(min_age, max_age);
CREATE INDEX idx_events_tags ON events USING GIN(tags);
CREATE INDEX idx_events_source ON events(source);
CREATE INDEX idx_events_branch_weight ON events(branch_weight);

-- Timeline indexes
CREATE INDEX idx_timeline_run_id ON timeline(run_id);
CREATE INDEX idx_timeline_age ON timeline(age);
CREATE INDEX idx_timeline_event_id ON timeline(event_id);

-- AI cache indexes
CREATE INDEX idx_ai_cache_signature ON ai_cache(signature_hash);
CREATE INDEX idx_ai_cache_expires ON ai_cache(expires_at);
CREATE INDEX idx_ai_cache_valid ON ai_cache(is_valid);

-- Analytics indexes
CREATE INDEX idx_choice_analytics_event ON choice_analytics(event_id);
CREATE INDEX idx_choice_analytics_player ON choice_analytics(player_id);
CREATE INDEX idx_choice_analytics_age ON choice_analytics(player_age);

-- =====================================================
-- 6. SAMPLE DATA - CANONICAL EVENTS
-- =====================================================

-- Sample events for testing
INSERT INTO events (event_id, type, title, description, min_age, max_age, choices, tags, branch_weight) VALUES
-- Early life events (0-12)
('evt_001', 'milestone', 'Chào đời', 'Bạn được sinh ra trong một gia đình...', 0, 0, 
 '[{"id":"c1","text":"Khóc to","effects":[{"stat":"hp","delta":-5},{"stat":"mood","delta":-10}]},{"id":"c2","text":"Im lặng","effects":[{"stat":"hp","delta":5},{"stat":"mood","delta":10}]}]', 
 ARRAY['birth', 'milestone'], 1.0),

('evt_002', 'opportunity', 'Học nói', 'Bố mẹ dạy bạn nói từ đầu tiên...', 1, 3, 
 '[{"id":"c1","text":"Học nhanh","effects":[{"stat":"knowledge","delta":10},{"stat":"energy","delta":-20}]},{"id":"c2","text":"Học chậm","effects":[{"stat":"knowledge","delta":5},{"stat":"energy","delta":-10}]}]', 
 ARRAY['early_life', 'learning'], 1.0),

('evt_003', 'random', 'Bị ốm', 'Bạn bị sốt cao...', 2, 8, 
 '[{"id":"c1","text":"Uống thuốc","effects":[{"stat":"hp","delta":-10},{"stat":"mood","delta":-5}]},{"id":"c2","text":"Nghỉ ngơi","effects":[{"stat":"hp","delta":5},{"stat":"mood","delta":-15}]}]', 
 ARRAY['health', 'random'], 0.8),

-- School age events (6-18)
('evt_004', 'milestone', 'Vào lớp 1', 'Ngày đầu tiên đi học...', 6, 6, 
 '[{"id":"c1","text":"Hào hứng","effects":[{"stat":"mood","delta":15},{"stat":"knowledge","delta":10}]},{"id":"c2","text":"Lo lắng","effects":[{"stat":"mood","delta":-10},{"stat":"social","delta":-5}]}]', 
 ARRAY['education', 'milestone'], 1.0),

('evt_005', 'opportunity', 'Tham gia CLB', 'Trường có nhiều CLB thú vị...', 7, 12, 
 '[{"id":"c1","text":"CLB Âm nhạc","effects":[{"stat":"art","delta":15},{"stat":"social","delta":10}]},{"id":"c2","text":"CLB Thể thao","effects":[{"stat":"sports","delta":15},{"stat":"hp","delta":10}]},{"id":"c3","text":"Không tham gia","effects":[{"stat":"energy","delta":20}]}]', 
 ARRAY['education', 'opportunity'], 0.9),

('evt_006', 'random', 'Bị bạn bắt nạt', 'Có một nhóm bạn lớn hơn...', 8, 15, 
 '[{"id":"c1","text":"Đánh trả","effects":[{"stat":"hp","delta":-20},{"stat":"mood","delta":-10}]},{"id":"c2","text":"Báo cô giáo","effects":[{"stat":"social","delta":-5},{"stat":"mood","delta":5}]},{"id":"c3","text":"Bỏ qua","effects":[{"stat":"mood","delta":-15}]}]', 
 ARRAY['social', 'random'], 0.7),

-- Teenage events (13-19)
('evt_007', 'milestone', 'Vào cấp 3', 'Bước vào trường THPT...', 15, 15, 
 '[{"id":"c1","text":"Chọn trường chuyên","effects":[{"stat":"knowledge","delta":20},{"stat":"stress","delta":15}]},{"id":"c2","text":"Trường bình thường","effects":[{"stat":"knowledge","delta":10},{"stat":"stress","delta":5}]}]', 
 ARRAY['education', 'milestone'], 1.0),

('evt_008', 'opportunity', 'Tình yêu đầu đời', 'Bạn gặp một người đặc biệt...', 16, 19, 
 '[{"id":"c1","text":"Tỏ tình","effects":[{"stat":"mood","delta":20},{"stat":"relationship","delta":25}]},{"id":"c2","text":"Giữ bí mật","effects":[{"stat":"mood","delta":5},{"stat":"stress","delta":10}]}]', 
 ARRAY['relationship', 'opportunity'], 0.6),

('evt_009', 'chain', 'Học đàn guitar', 'Bạn muốn học một nhạc cụ...', 14, 18, 
 '[{"id":"c1","text":"Học nghiêm túc","effects":[{"stat":"art","delta":20},{"stat":"energy","delta":-30}]},{"id":"c2","text":"Học cho vui","effects":[{"stat":"art","delta":10},{"stat":"energy","delta":-15}]}]', 
 ARRAY['art', 'learning'], 0.8),

-- Young adult events (20-30)
('evt_010', 'milestone', 'Tốt nghiệp ĐH', 'Ngày nhận bằng tốt nghiệp...', 22, 25, 
 '[{"id":"c1","text":"Tìm việc ngay","effects":[{"stat":"finance","delta":15},{"stat":"stress","delta":20}]},{"id":"c2","text":"Du lịch trước","effects":[{"stat":"mood","delta":25},{"stat":"finance","delta":-20}]}]', 
 ARRAY['education', 'milestone'], 1.0),

('evt_011', 'opportunity', 'Công việc đầu tiên', 'Bạn nhận được lời mời làm việc...', 22, 28, 
 '[{"id":"c1","text":"Nhận ngay","effects":[{"stat":"finance","delta":30},{"stat":"mood","delta":15}]},{"id":"c2","text":"Đàm phán lương","effects":[{"stat":"finance","delta":40},{"stat":"stress","delta":10}]},{"id":"c3","text":"Từ chối","effects":[{"stat":"mood","delta":-10},{"stat":"finance","delta":-20}]}]', 
 ARRAY['career', 'opportunity'], 0.9),

('evt_012', 'random', 'Gặp tai nạn xe', 'Trên đường đi làm...', 20, 35, 
 '[{"id":"c1","text":"Gọi cảnh sát","effects":[{"stat":"hp","delta":-30},{"stat":"finance","delta":-50}]},{"id":"c2","text":"Giải quyết riêng","effects":[{"stat":"hp","delta":-10},{"stat":"finance","delta":-20}]}]', 
 ARRAY['health', 'random'], 0.3);

-- Sample talents
INSERT INTO talents (name, description, category, cost, effects) VALUES
('Nghệ sĩ bẩm sinh', 'Tăng 20% điểm Art trong mọi sự kiện', 'art', 200, '{"art_bonus": 0.2}'),
('Thể thao xuất sắc', 'Tăng 25% điểm Sports và HP', 'sports', 250, '{"sports_bonus": 0.25, "hp_bonus": 0.25}'),
('Thông minh bẩm sinh', 'Tăng 30% điểm Knowledge', 'intelligence', 300, '{"knowledge_bonus": 0.3}'),
('Giao tiếp tốt', 'Tăng 20% điểm Social và Relationship', 'social', 200, '{"social_bonus": 0.2, "relationship_bonus": 0.2}');

-- Sample perks
INSERT INTO perks (name, description, category, cost, effects) VALUES
('Tăng may mắn', 'Tăng 15% cơ hội thành công trong các sự kiện', 'luck', 150, '{"luck_bonus": 0.15}'),
('Giảm rủi ro', 'Giảm 20% thiệt hại từ các sự kiện xấu', 'risk', 200, '{"risk_reduction": 0.2}'),
('Tiết kiệm năng lượng', 'Giảm 25% tiêu hao năng lượng', 'energy', 180, '{"energy_saving": 0.25}'),
('Phục hồi nhanh', 'Tăng 30% tốc độ phục hồi HP và Mood', 'recovery', 220, '{"recovery_bonus": 0.3}');

-- =====================================================
-- 7. VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for active runs with player info
CREATE VIEW active_runs AS
SELECT 
    r.id as run_id,
    p.username,
    r.seed,
    r.current_age,
    r.current_stats,
    r.current_energy,
    r.started_at,
    r.run_score
FROM runs r
JOIN players p ON r.player_id = p.id
WHERE r.is_active = true;

-- View for event statistics
CREATE VIEW event_stats AS
SELECT 
    e.event_id,
    e.title,
    e.type,
    COUNT(t.id) as total_occurrences,
    AVG(CAST(t.age AS DECIMAL)) as avg_age_occurrence,
    e.branch_weight,
    e.rarity_factor
FROM events e
LEFT JOIN timeline t ON e.id = t.event_id
GROUP BY e.id, e.event_id, e.title, e.type, e.branch_weight, e.rarity_factor;

-- =====================================================
-- 8. FUNCTIONS FOR GAME LOGIC
-- =====================================================

-- Function to get next event based on run state
CREATE OR REPLACE FUNCTION get_next_event(
    p_run_id UUID,
    p_current_age INTEGER
)
RETURNS TABLE(
    event_id UUID,
    event_title VARCHAR(255),
    event_description TEXT,
    choices JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.title,
        e.description,
        e.choices
    FROM events e
    WHERE e.is_active = true
        AND e.min_age <= p_current_age
        AND e.max_age >= p_current_age
        AND e.prerequisites IS NULL -- No prerequisites for now
    ORDER BY e.branch_weight DESC, e.rarity_factor DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate run score
CREATE OR REPLACE FUNCTION calculate_run_score(p_run_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_score INTEGER := 0;
    v_survival_bonus INTEGER;
    v_event_bonus INTEGER;
BEGIN
    -- Base score from survival time
    SELECT COALESCE(MAX(current_age), 0) * 10 INTO v_survival_bonus
    FROM runs WHERE id = p_run_id;
    
    -- Bonus from events completed
    SELECT COUNT(*) * 5 INTO v_event_bonus
    FROM timeline WHERE run_id = p_run_id;
    
    v_score := v_survival_bonus + v_event_bonus;
    
    -- Update run score
    UPDATE runs SET run_score = v_score WHERE id = p_run_id;
    
    RETURN v_score;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 9. COMMENTS & DOCUMENTATION
-- =====================================================

COMMENT ON TABLE players IS 'Bảng lưu thông tin người chơi';
COMMENT ON TABLE runs IS 'Bảng lưu các lần chơi (runs) của người chơi';
COMMENT ON TABLE events IS 'Bảng lưu các sự kiện trong game (canonical + AI-generated)';
COMMENT ON TABLE timeline IS 'Bảng lưu lịch sử các sự kiện đã xảy ra trong mỗi run';
COMMENT ON TABLE talents IS 'Bảng lưu các tài năng có thể mở khóa';
COMMENT ON TABLE perks IS 'Bảng lưu các ưu đãi có thể mua';
COMMENT ON TABLE ai_cache IS 'Bảng cache các sự kiện được AI tạo ra';
COMMENT ON TABLE choice_analytics IS 'Bảng phân tích lựa chọn của người chơi';

-- =====================================================
-- 10. FINAL SETUP COMMANDS
-- =====================================================

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;

-- Verify setup
SELECT 'Database setup completed successfully!' as status;
SELECT COUNT(*) as total_events FROM events;
SELECT COUNT(*) as total_talents FROM talents;
SELECT COUNT(*) as total_perks FROM perks; 