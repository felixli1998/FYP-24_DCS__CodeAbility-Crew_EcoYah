-- Create the ecoyah database
CREATE DATABASE ecoyah;

-- Switch to the ecoyah database
\c ecoyah;

-- Create a sample table for demonstration
CREATE TABLE sample_table (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50)
);

-- Insert some sample data
INSERT INTO sample_table (name) VALUES
    ('Sample Data 1'),
    ('Sample Data 2');
