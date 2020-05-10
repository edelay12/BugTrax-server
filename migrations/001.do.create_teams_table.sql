 create TABLE teams (
    id SERIAL PRIMARY KEY,
    team_name Text not null,
    company text,
    team_password text not null,
    team_admin text,
    creator_id NUMERIC,
    date_created TIMESTAMP NOT NULL DEFAULT now()
)

