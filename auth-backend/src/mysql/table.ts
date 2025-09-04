export const CREATE_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(32),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255)
  );
`;
