import { EncryptionKeys } from './EncryptionKeys';

export interface VideoURL {
  cached: boolean;
  expiresAt: string;
  keys: EncryptionKeys[];
  message: string;
  status: boolean;
  video: {
    id: number; title: string,
    urls: { '1080p': string; '720p': string; '480p': string };

  };
  ImageURL: { ImageUrl: string };
  username: string;
  email: string;
  query_token: string;
}
