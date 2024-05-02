CREATE DATABASE IF NOT EXISTS uevent;
-- CREATE USER 'scheban'@'localhost' IDENTIFIED BY 'securepass';
GRANT ALL PRIVILEGES ON uevent.* TO 'scheban'@'localhost';
FLUSH PRIVILEGES;