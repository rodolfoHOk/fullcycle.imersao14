CREATE TABLE routes (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  distance FLOAT NOT NULL,
  status VARCHAR(30) NOT NULL,
  freight_price FLOAT,
  started_at DATETIME,
  finished_at DATETIME
);
