import React, { createContext, useContext, useEffect, useState } from 'react';

import { useURL } from 'expo-linking';
import { supabase } from './supabase';
import { Session, User } from '@supabase/supabase-js';
import { useAtom } from 'jotai';
import { authTokenAtom } from '../jotai/atoms';

export const AuthContext = createContext({
  user: null,
  session: null,
});

export const AuthContextProvider = (props) => {
  const [userSession, setUserSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useAtom(authTokenAtom);

  const url = useURL();

  useEffect(() => {
    if (url) {
      const correctUrl = url.includes('#') ? url.replace('#', '?') : url;
      const urlObject = new URL(correctUrl);
      const accessToken = urlObject.searchParams.get('access_token');
      const refreshToken = urlObject.searchParams.get('refresh_token');
      if (!refreshToken || !accessToken) return;
      // bug fix, Buffer is used in the underlying lib, but is not imported
      global.Buffer = require('buffer').Buffer;
      supabase.auth
        .setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
        .then(({ data: { session } }) => {
          if (session) {
            //@ts-ignore
            supabase.auth._notifyAllSubscribers('SIGNED_IN', session);
          }
        });
    }
  }, [url]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserSession(session);
      setUser(session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUserSession(session);
      setUser(session?.user ?? null);
      if (session?.access_token) {
        setToken(session.access_token);
      }
    });

    return () => {
      authListener.subscription;
    };
  }, [url, setUserSession]);

  const value = {
    userSession,
    user,
  };
  return <AuthContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a AuthContextProvider.');
  }
  return context;
};
