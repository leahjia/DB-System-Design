CREATE TABLE Caregivers (
    Username varchar(255),
    Salt BINARY(16),
    Hash BINARY(16),
    PRIMARY KEY (Username)
);

CREATE TABLE Availabilities (
    Time date,
    Username varchar(255) REFERENCES Caregivers,
    PRIMARY KEY (Time, Username)
);

CREATE TABLE Vaccines (
    Name varchar(255),
    Doses int,
    PRIMARY KEY (Name)
);

CREATE TABLE Patients (
    Username varchar(255),
    Salt BINARY(16),
    Hash BINARY(16),
    PRIMARY KEY (Username)
);

CREATE TABLE Appointments (
    appointment_id int IDENTITY(1, 1),
    Time date,
    Caregiver varchar(255),
    Patient varchar(255) REFERENCES Patients,
    Vaccine varchar(255) REFERENCES Vaccines,
    FOREIGN KEY (Time, Caregiver) REFERENCES Availabilities,
    PRIMARY KEY (appointment_id)
)