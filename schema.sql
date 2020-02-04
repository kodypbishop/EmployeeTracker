drop database if exists employee_db;
create database employee_db;

use employee_db;

create table employee(
    id int(10) primary key auto_increment not null,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id int(10) not null
);

create table role(
    id int(10) primary key auto_increment not null,
    title varchar(30) not null,
    salary varchar(30) not null,
    department_id int(10) not null
);

create table dapartment(
    id int(10) primary key auto_increment not null,
    name varchar(30) not null
);