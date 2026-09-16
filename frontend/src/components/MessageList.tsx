// frontend/src/components/MessageList.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MessageList() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/connexion?callbackUrl=/messages');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Chargement...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div>
      {/* Votre contenu de messagerie ici */}
      <h1>Messagerie - Bienvenue {session.user?.email}</h1>
    </div>
  );
}