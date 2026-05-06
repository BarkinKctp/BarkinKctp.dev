-- Portfolio Contact Database
-- PostgreSQL Export File

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_email VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO messages (sender_email, message, created_at) VALUES
('berkayk@example.com', 'Hi! I loved your portfolio. Would you be interested in a frontend developer role?', '2026-04-20 10:30:00'),
('barkinkocatepe@gmail.com', 'Great projects! Let me know if you are open to freelance work.', '2026-04-25 14:15:00'),
('tdogan@university.edu', 'Excellent work on your portfolio site. Well done!', '2026-05-01 09:00:00');
