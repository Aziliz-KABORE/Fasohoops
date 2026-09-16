import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Relayer l'inscription vers le backend Spring Boot
    const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || "Erreur lors de l'inscription" },
        { status: res.status }
      );
    }

    return NextResponse.json(
      {
        message: data.message || "Inscription réussie",
        user: data.user,
        token: data.token,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erreur inscription -> Spring Boot:", error);
    return NextResponse.json(
      {
        error:
          "Le serveur backend est inaccessible. Assurez-vous que Spring Boot tourne sur le port 8080.",
      },
      { status: 503 }
    );
  }
}