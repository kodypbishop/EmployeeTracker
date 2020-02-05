drop database if exists employee_db;
create database employee_db;

use employee_db;

create table employee(
    id int(10) primary key auto_increment not null,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id int(10) not null,
    manager_id int(10)
);

create table role(
    id int(10) primary key auto_increment not null,
    title varchar(30) not null,
    salary varchar(30) not null,
    department_id int(10) not null
);

create table department(
    id int(10) primary key auto_increment not null,
    name varchar(30) not null
);

insert into employee (first_name, last_name, role_id, manager_id)
values ("Kody","Bishop",1,3),("Paul","John",2,3),("Dave","Johnson",3,null),("Bill","Anderson",4,5),("Jane","Smith",5,null),("Spike","Lee",6,7),("Karen","Bing",7,null);

insert into role (title, salary, department_id)
values ("Junior Dev","55k",1),("Senior Dev","75k",1),("Tech Supervisor","120k",1),("Designer","50k",2),("Head Designer","80k",2),("Salesperson","45k",3),("Employee Support","70k",4);

insert into department (name)
values ("Tech"),("Design"),("Sales"),("HR");