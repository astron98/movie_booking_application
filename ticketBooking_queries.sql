show databases;
create database booking_movies;
use booking_movies;
show tables;

create table customer (
	cid int(8) not null auto_increment,
    cname varchar(30),
    userid varchar(254) NOT NULL,
    password varchar(50) NOT NULL,
    dob DATE,
    address varchar(200),
    aadhar_id int(16) unique,
    contact int(10),
    primary key(cid)
);
alter table booking_movies.admin change  ename name varchar(30);

-- table 2 (employees-table) 
create table admin (
	aid int(8) not null auto_increment,
    userid varchar(254) not null unique, -- (username is an email-address)
    password varchar(50) not null,  -- bcrypt doesn't work for passwords of length (>50) 
    ename varchar(30),
    primary key(aid)
);

alter table customer modify column contact bigint(10);
drop table customer;
desc customer;

select * from admin;

INSERT INTO `booking_movies`.`customer` (`cid`, `cname`, `userid`, `password`, `dob`, `address`, `contact`) 
VALUES (1, 'mohan lal', 'mohanlal@gmail.com', 'qwerty789', '1988-2-12', 'kasavanhalli,Bangalore', 9934560909);

create table movies (
	_mid varchar(5),
    title varchar(256) not null,
    release_date DATE not null,
    link varchar(500) not null,  -- movie details(IMDB) link.
    image varchar(300),  -- image link(or)path from the /public folder. 
    lang varchar(15) not null,
    genre varchar(15) not null,
    primary key(_mid)
);

create table city(
	ctid int(3) auto_increment not null primary key,
    cname varchar(20) not null unique
);

create table theatre(
        tid varchar(3),
    halls_count int(2) not null,
    tname varchar(30) not null,
    location varchar(15) not null,
    ctid int(3) not null,
    primary key(tid),
    FOREIGN KEY (ctid) REFERENCES city(ctid)
);
show create table theatre;
ALTER TABLE theatre 
DROP FOREIGN KEY theatre_ibfk_1;

create table hall(
	hid varchar(3) not null,
	-- totalSeats int(3) not null,  -- not required
    _mid varchar(4),        
    platinum int(3) not null,              		-- 10
    gold int(3) not null,                		-- 70
    plat_a int(3) not null,						-- 10
    check(plat_a>=0 and plat_a<=platinum),    						
    gold_a int(3) not null,						-- 70
    check(gold_a>=0 and gold_a<=gold),            
    tid varchar(3) not null,            		-- t02  INOX
	time_id int(1) not null,                	-- (2)
    screening_date DATE not null,        		-- 2020-02-26

    Primary key(hid,tid) ,
    foreign key (tid) references theatre(tid),
    foreign key (time_id) references timings(time_id)
);

create table timings(
	time_id int(1) primary key auto_increment,
    timing varchar(20) not null
);
use booking_movies;

create table booked_details(
	rid int(9) primary key auto_increment,
    cid int(8),
    mname varchar(256),
    hid varchar(3),
    tid varchar(3),
    amount int(4),
	city varchar(20)
);

create table rcs (
	rid int(9),
    sid varchar(4),
    primary key (rid,sid)
);



/*
create table hall(
	hid varchar(3) primary key,
    totalSeats int(3) not null,
    mid varchar(4),
    date_time DATETIME,
    tid varchar(3) not null,
    foreign key (tid) references theatre(tid)
);


create table seats (
	platinum int(3),
    gold int(3),
    plat_a int(3) not null check(plat_a>=0),
    gold_a int(3) not null check(gold_a>=0),
    sid varchar(4)  not null,
    hid varchar(3) not null,
    tid varchar(3) not null,
	time_id int(2) not null,
    _date DATE not null,
    foreign key (tid) references theatre(tid),
    foreign key (hid) references hall(hid),
    foreign key (time_id) references timings(time_id),
    primary key(sid,hid,tid,time_id,_date)
);
*/

	

