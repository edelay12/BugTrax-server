TRUNCATE users CASCADE;
insert into users (user_name, full_name, password , title, picture, team_id)
VALUES 
('jApple', 'Jon Apple' , '$2a$10$w9NMvoUtctDegO.sAJFdEOt1igq68zVfAZhnUqYkfaCS4wl2V7g5.', 'Lead Engineer', bytea('assets/headshots/3.jpg'), 2),
('jBryant', 'Jay Bryant' , '$2a$10$w9NMvoUtctDegO.sAJFdEOt1igq68zVfAZhnUqYkfaCS4wl2V7g5.', 'Front-end Engineer', bytea('assets/headshots/1.jpg'), 2),
('eBailey', 'Eula Bailey' , '$2a$10$w9NMvoUtctDegO.sAJFdEOt1igq68zVfAZhnUqYkfaCS4wl2V7g5.', 'Full-stack Engineer', bytea('assets/headshots/2.jpg'), 2),
('jParks', 'Jay Parks' , '$2a$10$w9NMvoUtctDegO.sAJFdEOt1igq68zVfAZhnUqYkfaCS4wl2V7g5.', 'Project manager', bytea('assets/headshots/11.png'), 2),
('lRhodes', 'Lisa Rhodes' , '$2a$10$w9NMvoUtctDegO.sAJFdEOt1igq68zVfAZhnUqYkfaCS4wl2V7g5.', 'Senior React developer', bytea('assets/headshots/10.png'), 2),
('dClarke', 'Deborah Clarke' , '$2a$10$w9NMvoUtctDegO.sAJFdEOt1igq68zVfAZhnUqYkfaCS4wl2V7g5.', 'Javascript Developer', bytea('assets/headshots/8.jpg'), 2),
('dRita', 'Darin Rita' , '$2a$10$w9NMvoUtctDegO.sAJFdEOt1igq68zVfAZhnUqYkfaCS4wl2V7g5.', 'Front-end Engineer', bytea('assets/headshots/9.png'), 2),
('jDoe', 'Jane Doe' , '$2a$10$w9NMvoUtctDegO.sAJFdEOt1igq68zVfAZhnUqYkfaCS4wl2V7g5.', 'Project manager', bytea('assets/headshots/12.png'), 2)

