"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function ProfilPage() {
  const { data: session } = useSession();

  const [profile, setProfile] = useState<any>(null);
  
  useEffect(() => {
      if (session?.user?.id) {
          fetchFromBackend(`/joueurs/${session.user.id}`)
              .then(data => setProfile(data))
              .catch(err => console.error(err));
      }
  }, [session]);

  if (!profile) return <div className="text-center py-20">Chargement...</div>;

  const mockProfile = {
    nom: profile.nom + " " + profile.prenom,
    poste: profile.poste || "Non spécifié",
    taille: profile.taille || "0.00",
    poids: profile.poids || "0",
    club: profile.clubActuel || "Agent Libre",
    ville: "Ouagadougou",
    bio: profile.bio || "Joueur passionné. Je cherche toujours à m'améliorer.",
    photoUrl: profile.photoUrl || session?.user?.image,
    video: "https://www.youtube.com/embed/ScMzIvxBSi4", // Placeholder highlight video
    photos: [
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80",
      "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=500&q=80",
      "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=500&q=80",
    ]
  };
    <div className="max-w-5xl mx-auto px-5 sm:px-10 py-12">
      {/* Header Profile */}
      <div className="card p-8 mb-8 relative overflow-hidden">
        {/* Background Banner */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-black dark:to-gray-900"></div>
        
        <div className="relative pt-16 flex flex-col md:flex-row gap-8 items-start md:items-end">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-900 shadow-xl bg-white flex-shrink-0">
            {session?.user?.image ? (
              <Image src={session.user.image} alt="Avatar" width={128} height={128} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-black text-gray-400 bg-gray-100">
                {profile.nom.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
              <div>
                <h1 className="text-3xl font-black text-white">{profile.nom}</h1>
                <p className="text-white/80 font-semibold">{profile.poste} • {profile.club}</p>
              </div>
              <Link href="/profil/edit" className="btn-primary flex-shrink-0 text-sm">
                Éditer le profil
              </Link>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <span className="flex items-center gap-1.5 text-sm font-medium text-foreground/70 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                <span className="text-lg">📏</span> {profile.taille}m
              </span>
              <span className="flex items-center gap-1.5 text-sm font-medium text-foreground/70 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                <span className="text-lg">⚖️</span> {profile.poids}kg
              </span>
              <span className="flex items-center gap-1.5 text-sm font-medium text-foreground/70 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                <span className="text-lg">📍</span> {profile.ville}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Bio & Stats */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <div className="card p-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-foreground/40 mb-4">Biographie</h2>
            <p className="text-sm text-foreground/80 font-medium leading-relaxed">
              {profile.bio}
            </p>
          </div>
          
          <div className="card p-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-foreground/40 mb-4">Dernières Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-black">18.4</p>
                <p className="text-[10px] uppercase font-bold text-foreground/40">Points/M</p>
              </div>
              <div>
                <p className="text-2xl font-black">7.2</p>
                <p className="text-[10px] uppercase font-bold text-foreground/40">Rebonds/M</p>
              </div>
              <div>
                <p className="text-2xl font-black">3.1</p>
                <p className="text-[10px] uppercase font-bold text-foreground/40">Passes/M</p>
              </div>
              <div>
                <p className="text-2xl font-black">22.1</p>
                <p className="text-[10px] uppercase font-bold text-foreground/40">Éval/M</p>
              </div>
            </div>
            <Link href="/statistiques" className="block text-center mt-6 text-xs font-bold text-primary hover:underline">
              Voir toutes les stats →
            </Link>
          </div>
        </div>

        {/* Right Column: Portfolio */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="text-lg font-black mb-6">Portfolio & Highlights</h2>
            
            {/* Vidéo */}
            <div className="mb-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground/40 mb-3">Dernière Vidéo (Highlights)</h3>
              <div className="relative w-full rounded-2xl overflow-hidden bg-black" style={{ paddingTop: '56.25%' }}>
                <iframe 
                  src={profile.video} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                ></iframe>
              </div>
            </div>

            {/* Photos */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground/40 mb-3">Photos d'action</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {profile.photos.map((photo, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                    <img src={photo} alt={`Action ${idx+1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
