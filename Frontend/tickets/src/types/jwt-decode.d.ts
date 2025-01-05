declare module "jwt-decode" {
    export function jwtDecode<T>(token: string): T;
  }
  