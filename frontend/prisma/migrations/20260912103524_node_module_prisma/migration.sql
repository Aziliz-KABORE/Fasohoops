-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "password" TEXT,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'JOUEUR',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "JoueurProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "poste" TEXT,
    "taille" REAL,
    "poids" REAL,
    "dateNaissance" DATETIME,
    "niveau" TEXT,
    "clubActuel" TEXT,
    CONSTRAINT "JoueurProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClubProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "nomStructure" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "historique" TEXT,
    "besoinsRecrutement" TEXT,
    "licenceNumero" TEXT,
    "statutValidation" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "equipesCategories" TEXT DEFAULT 'Senior, U20, U18, U15',
    CONSTRAINT "ClubProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EntraineurProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "cv" TEXT,
    "experiences" TEXT,
    "formations" TEXT,
    "licenceNumero" TEXT,
    "statutValidation" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    CONSTRAINT "EntraineurProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AgentProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "cv" TEXT,
    "joueursRepresentes" TEXT,
    "licenceNumero" TEXT,
    "statutValidation" TEXT NOT NULL DEFAULT 'VALIDE',
    CONSTRAINT "AgentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Licence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numeroLicence" TEXT NOT NULL,
    "nomTitulaire" TEXT NOT NULL,
    "roleTitulaire" TEXT NOT NULL,
    "clubAffiliation" TEXT,
    "valideJusquA" DATETIME NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'ACTIVE'
);

-- CreateTable
CREATE TABLE "Statistique" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "joueurId" TEXT NOT NULL,
    "match" TEXT,
    "saison" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "rebonds" INTEGER NOT NULL DEFAULT 0,
    "passes" INTEGER NOT NULL DEFAULT 0,
    "contres" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Statistique_joueurId_fkey" FOREIGN KEY ("joueurId") REFERENCES "JoueurProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Evenement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organisateurId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "dateDebut" DATETIME NOT NULL,
    "dateFin" DATETIME NOT NULL,
    "lieu" TEXT NOT NULL,
    CONSTRAINT "Evenement_organisateurId_fkey" FOREIGN KEY ("organisateurId") REFERENCES "ClubProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Inscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "joueurId" TEXT NOT NULL,
    "evenementId" TEXT NOT NULL,
    "dateInscription" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    CONSTRAINT "Inscription_joueurId_fkey" FOREIGN KEY ("joueurId") REFERENCES "JoueurProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Inscription_evenementId_fkey" FOREIGN KEY ("evenementId") REFERENCES "Evenement" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Offre" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clubId" TEXT NOT NULL,
    "posteRecherche" TEXT NOT NULL,
    "niveau" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dateExpiration" DATETIME NOT NULL,
    CONSTRAINT "Offre_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "ClubProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Candidature" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "joueurId" TEXT NOT NULL,
    "offreId" TEXT NOT NULL,
    "dateCandidature" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    CONSTRAINT "Candidature_joueurId_fkey" FOREIGN KEY ("joueurId") REFERENCES "JoueurProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Candidature_offreId_fkey" FOREIGN KEY ("offreId") REFERENCES "Offre" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contenu" TEXT NOT NULL,
    "dateEnvoi" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lu" BOOLEAN NOT NULL DEFAULT false,
    "expediteurId" TEXT NOT NULL,
    "destinataireId" TEXT NOT NULL,
    CONSTRAINT "Message_expediteurId_fkey" FOREIGN KEY ("expediteurId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Message_destinataireId_fkey" FOREIGN KEY ("destinataireId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "JoueurProfile_userId_key" ON "JoueurProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ClubProfile_userId_key" ON "ClubProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EntraineurProfile_userId_key" ON "EntraineurProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AgentProfile_userId_key" ON "AgentProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Licence_numeroLicence_key" ON "Licence"("numeroLicence");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
