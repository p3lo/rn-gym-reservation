import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
import { makeRedirectUri, startAsync } from 'expo-auth-session';
import 'react-native-url-polyfill/auto';
import { useAtom } from 'jotai';
import { authToken } from '../jotai/atoms';

const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const googleSignIn = async () => {
  // This will create a redirectUri
  // This should be the URL you added to "Redirect URLs" in Supabase URL Configuration
  // If they are different add the value of redirectUrl to your Supabase Redirect URLs
  const redirectUrl = makeRedirectUri({
    path: '/auth/callback',
  });

  // authUrl: https://{YOUR_PROJECT_REFERENCE_ID}.supabase.co
  // returnURL: the redirectUrl you created above.

  const authResponse = await startAsync({
    authUrl: `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${redirectUrl}`,
    returnUrl: redirectUrl,
  });

  // If the user successfully signs in
  // we will have access to an accessToken and an refreshToken
  // and then we'll use setSession (https://supabase.com/docs/reference/javascript/auth-setsession)
  // to create a Supabase-session using these token
  if (authResponse.type === 'success') {
    supabase.auth.setSession({
      access_token: authResponse.params.access_token,
      refresh_token: authResponse.params.refresh_token,
    });
    return authResponse.params.access_token;
  }
  return null;
};
