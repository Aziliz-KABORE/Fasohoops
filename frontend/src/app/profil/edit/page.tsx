"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchFromBackend } from "@/lib/apiClient";

export default function ProfilEditPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    bio: "",
    taille: "",
    poids: "",
    photoUrl: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      if (session?.user?.id) {
          fetchFromBackend(`/joueurs/${session.user.id}`)
              .then((data: any) => {
                  setFormData({
                      bio: data.bio || "",
                      taille: data.taille || "",
                      poids: data.poids || "",
                      photoUrl: data.photoUrl || ""
                  });
              })
              .catch(err => console.error(err));
      }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
          await fetchFromBackend(`/joueurs/${session?.user?.id}`, {
              method: "PUT",
              body: JSON.stringify(formData)
          });
          router.push("/profil");
      } catch (err) {
          console.error(err);
          alert("Erreur lors de la mise à jour du profil.");
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <h1 className="text-3xl font-black mb-8">Éditer mon profil</h1>
      <form onSubmit={handleSubmit} className="card p-8 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-foreground/50">Photo URL (ou Base64)</label>
              <input type="text" value={formData.photoUrl} onChange={e => setFormData({...formData, photoUrl: e.target.value})} className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-sm focus:ring-2 focus:ring-primary/40" placeholder="https://..." />
          </div>
          <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-foreground/50">Taille (m)</label>
              <input type="text" value={formData.taille} onChange={e => setFormData({...formData, taille: e.target.value})} className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-sm focus:ring-2 focus:ring-primary/40" />
          </div>
          <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-foreground/50">Poids (kg)</label>
              <input type="text" value={formData.poids} onChange={e => setFormData({...formData, poids: e.target.value})} className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-sm focus:ring-2 focus:ring-primary/40" />
          </div>
          <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-foreground/50">Biographie</label>
              <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-sm focus:ring-2 focus:ring-primary/40" rows={4} />
          </div>
          <div className="flex gap-4 mt-4">
              <button type="button" onClick={() => router.push("/profil")} className="btn-secondary flex-1">Annuler</button>
              <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? "Enregistrement..." : "Enregistrer"}</button>
          </div>
      </form>
    </div>
  );
}
