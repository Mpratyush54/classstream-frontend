export interface EncryptionKeys {
  quality: string; // instead of union type
  kid: string;
  encKey?: string;
}
