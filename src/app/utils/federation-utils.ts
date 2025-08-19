import { loadRemoteModule } from '@angular-architects/native-federation';
import { Type } from '@angular/core';

export async function loadRemoteComponent<T>(remoteName: string, exposedModule: string): Promise<Type<T>> {
  try {
    // Memuat modul dari remote application
    const module = await loadRemoteModule({
      remoteName,
      exposedModule
    });

    // Modul bisa menggunakan default export atau export biasa
    return module.default || module[Object.keys(module)[0]];
  } catch (error) {
    console.error(`Error loading remote component from ${remoteName}/${exposedModule}:`, error);
    throw error;
  }
}