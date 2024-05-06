CREATE TABLE Permissions (
    permissionId INT AUTO_INCREMENT PRIMARY KEY,
    permission VARCHAR(255)
);

CREATE TABLE Roles (
    roleId INT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(255)
);

CREATE TABLE Users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    address VARCHAR(255),
    telephone INT,
    imageUrl VARCHAR(255),
    isActive BOOLEAN,
    isAdmin BOOLEAN,
    isBlocked BOOLEAN
);

CREATE TABLE Structure (
    structureId INT AUTO_INCREMENT PRIMARY KEY,
    aboutStructure VARCHAR(255)
);

CREATE TABLE Departements (
    departementId INT AUTO_INCREMENT PRIMARY KEY,
    aboutDepartement VARCHAR(255),
    structureId INT,
    FOREIGN KEY (structureId) REFERENCES Structure(structureId)
);

CREATE TABLE UsersRoles (
    userId INT,
    roleId INT,
    FOREIGN KEY (userId) REFERENCES Users(userId),
    FOREIGN KEY (roleId) REFERENCES Roles(roleId),
    PRIMARY KEY (userId, roleId)
);

CREATE TABLE Consumers (
    userId INT,
    regNumber INT,
    departementId INT,
    grade VARCHAR(255),
    FOREIGN KEY (userId) REFERENCES Users(userId),
    FOREIGN KEY (departementId) REFERENCES Departements(departementId),
    PRIMARY KEY (userId)
);

CREATE TABLE RolesPermissions (
    permissionId INT,
    roleId INT,
    FOREIGN KEY (permissionId) REFERENCES Permissions(permissionId),
    FOREIGN KEY (roleId) REFERENCES Roles(roleId),
    PRIMARY KEY (permissionId, roleId)
);
 
INSERT INTO Roles (role) VALUES ('admin');

 
INSERT INTO Permissions (permission) VALUES 
('accountManagement'), 
('consumerManagement'), 
('structureManagement'), 
('accessRightsManagement'), 
('roleManagement'), 
('profileManagement'), 
('applicationSettingsManagement'), 
('archivingManagement');

INSERT INTO RolesPermissions (roleId, permissionId) VALUES 
(1, 1), -- Account Management
(1, 2), -- Consumer Management
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8);
UPDATE Permissions SET permission = 'Account Management' WHERE permission = 'accountManagement';
UPDATE Permissions SET permission = 'Consumer Management' WHERE permission = 'consumerManagement';
UPDATE Permissions SET permission = 'Structure Management' WHERE permission = 'structureManagement';
UPDATE Permissions SET permission = 'Access Rights Management' WHERE permission = 'accessRightsManagement';
UPDATE Permissions SET permission = 'Role Management' WHERE permission = 'roleManagement';
UPDATE Permissions SET permission = 'Profile Management' WHERE permission = 'profileManagement';
UPDATE Permissions SET permission = 'Application Settings Management' WHERE permission = 'applicationSettingsManagement';
UPDATE Permissions SET permission = 'Archiving (Backup)' WHERE permission = 'archivingManagement';

CREATE TABLE Requests (
    requestId INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    dateSubmission DATE,
    isSeen BOOLEAN,
    isValidate BOOLEAN
);

CREATE TABLE Chapitres (
    chapitreId INT PRIMARY KEY AUTO_INCREMENT,
    numChapitre VARCHAR(255),
    libelle VARCHAR(255)
);

CREATE TABLE Fournisseurs (
    fournisseurId INT PRIMARY KEY AUTO_INCREMENT,
    raisonSociale VARCHAR(255),
    address VARCHAR(255),
    phone VARCHAR(255),
    fax VARCHAR(255),
    numRC VARCHAR(255),
    RIB VARCHAR(255),
    NIF VARCHAR(255),
    NIS VARCHAR(255)
);

CREATE TABLE Articles (
    articleId INT PRIMARY KEY AUTO_INCREMENT,
    designation VARCHAR(255),
    chapitreId INT,
    code varchar(255),
    FOREIGN KEY (chapitreId) REFERENCES Chapitres(chapitreId)
);
CREATE TABLE Fournisseur_Article (
    fournisseurId INT,
    articleId INT,
    PRIMARY KEY (fournisseurId, articleId),
    FOREIGN KEY (fournisseurId) REFERENCES Fournisseurs(fournisseurId),
    FOREIGN KEY (articleId) REFERENCES Articles(articleId)
);
CREATE TABLE Products (
    productId INT PRIMARY KEY AUTO_INCREMENT,
    designation VARCHAR(255),
    articleId INT,
    FOREIGN KEY (articleId) REFERENCES Articles(articleId)
);
CREATE TABLE Bon (
    bonId INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(255),
    chapitreId INT,
    articleId INT,
    fournisseurId INT,
    dateCreation date,
    FOREIGN KEY (chapitreId) REFERENCES Chapitres(chapitreId),
    FOREIGN KEY (articleId) REFERENCES Articles(articleId),
    FOREIGN KEY (fournisseurId) REFERENCES Fournisseurs(fournisseurId)
);

CREATE TABLE Commande (
    commandeId INT PRIMARY KEY AUTO_INCREMENT,
    quantity INT,
    pu FLOAT,
    deliveredQuantity INT,
    leftQuantity INT,
    dateCreation DATE,
    bonId INT,
    productId INT,
    FOREIGN KEY (bonId) REFERENCES Bon(bonId),
    FOREIGN KEY (productId) REFERENCES Products(productId)
);
INSERT INTO Fournisseurs (raisonSociale, address, phone, fax, numRC, RIB, NIF, NIS)
VALUES 
('EURL YAPAP', '28 Rue Ghrab Mohamed Mascara', 480741717, 48747474, '31/03-0112265 B 23', '002.00065.89.075.62.611.36', '1131011223274', NULL),
('GPSB BENMOUSSA', '25 Rue Amir Abdelkader Oran', 4876454545, 4876767676, '22/00.0121096 A 22', '005.00065.65.065.62.611.30', '273310107692172', NULL),
('EXTREME SECURITE PREVENTICA', '78 Rue Aboubakr Essadik Sidi Bel Abbes', 4878565656, 4878787878, '22/00.0233555 B 17', '3100322220001780000', '1922002446627', '1922010000179'),
('MACIF FOURNITURE', '25 Cité khaled Hamou Sidi Bel Abbes', 4874939393, 4874949494, '22/00-0173963 A 21', '004 00406 4000075942 17', '197221000061108', '19972210006147');

INSERT INTO Chapitres (numChapitre, libelle)
VALUES 
('21-11', 'Remboursement frais'),
('21-12', 'Matériel et mobilier'),
('21-13', 'Fournitures'),
('21-14', 'Documentation'),
('21-16', 'Habillement personnel'),
('21-17', 'Parc auto'),
('21-18', 'Travaux entretien'),
('21-21', 'Matériel accessoires informatique'),
('21-22', 'Matériel et mobilier pédagogique'),
('21-23', 'Frais liés aux études de post-graduation'),
('21-24', 'Participation aux organismes nationaux et internationaux'),
('21-27', 'Activités culturelles sportives et scientifiques aux étudiants'),
('21-32', 'Frais de fonctionnement liées à la recherche scientifique et au développement');
INSERT INTO Articles (designation, chapitreId, code)
VALUES 
('Frais de réception', (SELECT chapitreId FROM Chapitres WHERE numChapitre = '21-11'), '21.11.2'),
('Acquisition du matériels et mobiliers de bureaux', (SELECT chapitreId FROM Chapitres WHERE numChapitre = '21-12'), '21.12.1'),
('Acquisition du matériel de prévision et de sécurité', (SELECT chapitreId FROM Chapitres WHERE numChapitre = '21-12'), '21.12.3'),
('Aquisition de materiel audiovisuel', (SELECT chapitreId FROM Chapitres WHERE numChapitre = '21-12'), '21.12.5'),
('Acquisitions du matériel de reprographie et d''imprimante', (SELECT chapitreId FROM Chapitres WHERE numChapitre = '21-12'), '21.12.7'),
('Acquisition et entretien du matériel médicale', (SELECT chapitreId FROM Chapitres WHERE numChapitre = '21-12'), '21.12.9'),
('Papeterie et fournitures de bureaux 1', (SELECT chapitreId FROM Chapitres WHERE numChapitre = '21-13'), '21.13.1'),
('Produit d''entretien', (SELECT chapitreId FROM Chapitres WHERE numChapitre = '21-13'), '21.13.2'),
('Fournitures de laboratoires et des ateliers d''enseignement et de recherche', (SELECT chapitreId FROM Chapitres WHERE numChapitre = '21-13'), '21.13.3'),
('Produits pharmaceutiques et chimiques', (SELECT chapitreId FROM Chapitres WHERE numChapitre = '21-13'), '21.13.4'),
('Frais de rellures et d''impression', (SELECT chapitreId FROM Chapitres WHERE numChapitre = '21-13'), '21.13.5'),
('Papier d''ensignement', (SELECT chapitreId FROM Chapitres WHERE numChapitre = '21-13'), '21.13.8'),
('Acquisition de drapeaux nationaux', (SELECT chapitreId FROM Chapitres WHERE numChapitre = '21-13'), '21.13.12'),
('Ouvrages des bibliothéques', (SELECT chapitreId FROM Chapitres WHERE numChapitre = '21-14'), '21.14.2'),
('Habillement des personnels de service', (SELECT chapitreId FROM Chapitres WHERE numChapitre = '21-16'), '21.16.1'),
('Acquisitions du carburant et lubrifiants et graisses', (SELECT chapitreId FROM Chapitres WHERE numChapitre = '21-17'), '21.17.3'),
('Acquisition des pneu pour voiture', (SELECT chapitreId FROM Chapitres WHERE numChapitre = '21-17'), '21.17.4'),
('Entretien, réparation et achat d''outillage et pièces de rechanges', (SELECT chapitreId FROM Chapitres WHERE numChapitre = '21-17'), '21.17.5'),
('Quincaillerie', (SELECT chapitreId FROM Chapitres WHERE numChapitre = '21-18'), '21.18.1'),
('Acqisition du matériels informatiques', (SELECT chapitreId FROM Chapitres WHERE numChapitre = '21-21'), '21.21.1'),
('Fournitures informatiques logiciels et réseaux', (SELECT chapitreId FROM Chapitres WHERE numChapitre = '21-21'), '21.21.2'),
('Acquisition du matériels et mobiliers pédagogiques.', (SELECT chapitreId FROM Chapitres WHERE numChapitre = '21-22'), '21.22.1'),
('Matériels et fournitures au profit poste graduation', (SELECT chapitreId FROM Chapitres WHERE numChapitre = '21-23'), '21.23.4'),
('Logiciels informatiques Spécialisé', (SELECT chapitreId FROM Chapitres WHERE numChapitre = '21-23'), '21.23.3'),
('Activité culturelle', (SELECT chapitreId FROM Chapitres WHERE numChapitre = '21-27'), '21.27.1'),
('Activite sportive', (SELECT chapitreId FROM Chapitres WHERE numChapitre = '21-27'), '21.27.2'),
('Matériels, instrument et petit outillages scientifiques', (SELECT chapitreId FROM Chapitres WHERE numChapitre = '21-32'), '21.32.2');

INSERT INTO Fournisseur_Article (fournisseurId, articleId) VALUES
(5, 1),
(6, 2),
(7, 3),
(8, 4);
 -- Insert products for "Frais de réception"
INSERT INTO Products (designation, articleId) VALUES
('Gateaux', (SELECT articleId FROM Articles WHERE designation = 'Frais de réception')),
('Eau', (SELECT articleId FROM Articles WHERE designation = 'Frais de réception'));

-- Insert products for "Acquisition du matériels et mobiliers de bureaux"
INSERT INTO Products (designation, articleId) VALUES
('Stylos', (SELECT articleId FROM Articles WHERE designation = 'Acquisition du matériels et mobiliers de bureaux')),
('Graveuse', (SELECT articleId FROM Articles WHERE designation = 'Acquisition du matériels et mobiliers de bureaux'));

-- Insert products for "Acquisition du matériel de prévision et de sécurité"
INSERT INTO Products (designation, articleId) VALUES
('Alarme', (SELECT articleId FROM Articles WHERE designation = 'Acquisition du matériel de prévision et de sécurité')),
('Caméra de surveillance', (SELECT articleId FROM Articles WHERE designation = 'Acquisition du matériel de prévision et de sécurité'));
INSERT INTO Products (designation, articleId) VALUES
('Cadenas', (SELECT articleId FROM Articles WHERE designation = 'Acquisition du matériel de prévision et de sécurité'));

-- Insert products for "Aquisition de materiel audiovisuel"
INSERT INTO Products (designation, articleId) VALUES
('Projecteur', (SELECT articleId FROM Articles WHERE designation = 'Aquisition de materiel audiovisuel')),
('Enceintes', (SELECT articleId FROM Articles WHERE designation = 'Aquisition de materiel audiovisuel'));

-- Insert products for "Acquisitions du matériel de reprographie et d'imprimante"
INSERT INTO Products (name, articleId) VALUES
('Imprimante laser', (SELECT articleId FROM Articles WHERE designation = 'Acquisitions du matériel de reprographie et d''imprimante')),
('Photocopieur', (SELECT articleId FROM Articles WHERE designation = 'Acquisitions du matériel de reprographie et d''imprimante'));

-- Insert products for "Acquisition et entretien du matériel médical"
INSERT INTO Products (designation, articleId) VALUES
('Stéthoscope', (SELECT articleId FROM Articles WHERE designation = 'Acquisition et entretien du matériel médical')),
('Tensiomètre', (SELECT articleId FROM Articles WHERE designation = 'Acquisition et entretien du matériel médical'));

-- Insert products for "Papeterie et fournitures de bureaux 1"
INSERT INTO Products (designation, articleId) VALUES
('Carnet de notes', (SELECT articleId FROM Articles WHERE designation = 'Papeterie et fournitures de bureaux 1')),
('Agrafeuse', (SELECT articleId FROM Articles WHERE designation = 'Papeterie et fournitures de bureaux 1'));

-- Insert products for "Produit d'entretien"
INSERT INTO Products (designation, articleId) VALUES
('Nettoyant tout usage', (SELECT articleId FROM Articles WHERE designation = 'Produit d''entretien')),
('Lingettes désinfectantes', (SELECT articleId FROM Articles WHERE designation = 'Produit d''entretien'));

-- Insert products for "Fournitures de laboratoires et des ateliers d'enseignement et de recherche"
INSERT INTO Products (designation, articleId) VALUES
('Lunettes de sécurité', (SELECT articleId FROM Articles WHERE designation = 'Fournitures de laboratoires et des ateliers d''enseignement et de recherche')),
('Éprouvettes', (SELECT articleId FROM Articles WHERE designation = 'Fournitures de laboratoires et des ateliers d''enseignement et de recherche'));

DELIMITER //
CREATE TRIGGER calculate_leftQuantity BEFORE INSERT ON Commande
FOR EACH ROW
BEGIN
    SET NEW.leftQuantity = NEW.quantity - NEW.deliveredQuantity;
END;
//

CREATE TRIGGER update_leftQuantity BEFORE UPDATE ON Commande
FOR EACH ROW
BEGIN
    SET NEW.leftQuantity = NEW.quantity - NEW.deliveredQuantity;
END;
//
DELIMITER ;
