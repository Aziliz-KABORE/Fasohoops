export const INSTITUTIONAL_ROLES = ["ADMIN", "FEBBA", "MINISTERE", "PARTENAIRE"] as const;

export type InstitutionalRole = (typeof INSTITUTIONAL_ROLES)[number];

export const INSTITUTIONAL_CAPABILITIES = [
  "Valider les comptes des clubs et entraîneurs",
  "Superviser les licences",
  "Consulter les statistiques nationales agrégées",
  "Modérer les contenus",
] as const;

export function isInstitutionalRole(role: unknown): role is InstitutionalRole {
  return typeof role === "string" && INSTITUTIONAL_ROLES.includes(role as InstitutionalRole);
}

export function getInstitutionLabel(role: string) {
  return {
    ADMIN: "Administrateur",
    FEBBA: "FEBBA",
    MINISTERE: "Ministère",
    PARTENAIRE: "Partenaire",
  }[role] ?? "Espace institutionnel";
}