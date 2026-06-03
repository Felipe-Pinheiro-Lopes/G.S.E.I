'use client';

import { useState, useEffect } from 'react';
import { parseCookies } from 'nookies';

/**
 * Hook para obter informações do usuário logado de forma segura.
 * Evita erros de Hydration no Next.js ao ler cookies apenas no cliente.
 */
export interface CurrentUser {
  name: string;
  role: string;       // Ex: "Administrador", "Gestor de Ativos", etc.
  photo?: string;
  rawRole: string;    // Valor original do cookie (Admin, Internal, etc.)
  id?: number;
}

export function useCurrentUser(): CurrentUser {
  const [user, setUser] = useState<CurrentUser>({
    name: "Usuário",
    role: "Administrador",
    photo: undefined,
    rawRole: "Internal"
  });

  useEffect(() => {
    const cookies = parseCookies();

    const name = cookies['gesi.userName'];
    const role = cookies['gesi.role'];
    const photo = cookies['gesi.userPhoto'];
    const userId = cookies['gesi.userId'];

    const clean = (val?: string) => {
      if (!val || val === 'undefined' || val === 'null' || val.trim() === '') {
        return undefined;
      }
      return val;
    };

    const cleanName = clean(name);
    const cleanRole = clean(role);
    const cleanPhoto = clean(photo);

    const finalName = cleanName ?? "Usuário";
    const finalRawRole = cleanRole ?? "Internal";
    const finalRole = (cleanRole === "Internal" || cleanRole === "Admin") ? "Administrador" : (cleanRole ?? "Administrador");
    const finalPhoto = cleanPhoto;

    setUser({
      name: finalName,
      role: finalRole,
      rawRole: finalRawRole,
      photo: finalPhoto,
    });
  }, []);

  return user;
}
