# AGENTS.md

## Cursor Cloud specific instructions

### Producto

Plantilla móvil Expo SDK 54 + React Navigation (sin Expo Router). Auth y clima usan mocks en `src/shared/mocks/`. No hay backend ni base de datos en el repo.

### Servicios

| Servicio | Puerto | Comando |
|----------|--------|---------|
| Metro / Expo Dev Server | 8081 (por defecto) | `npm start` |
| Web (Metro) | 8081 | `npm run web` o `npm start` y pulsar `w` |

Solo hace falta Metro para desarrollo local con mocks. Android/iOS/Expo Go son opcionales.

### Variables de entorno

Copia `.env.example` → `.env` (gitignored). Tras cambiar `.env`, reinicia Metro. No se requieren secretos para los flujos mock.

### Comandos habituales

Ver `README.md`: `npm run lint`, `npm test`, `npm start`, `npm run web`.

### Notas no obvias

- **`web.output` en `app.json` debe ser `"single"`** para esta app (React Navigation). El valor `"static"` exige `expo-router` y hace fallar `expo start` incluso sin abrir web.
- Expo puede mostrar *"Using src/app as the root directory for Expo Router"* por la carpeta `src/app/`; la navegación real está en `src/app/navigation/` con React Navigation.
- Login de prueba: botón «Entrar como demo» o `demo@plantilla.app` con cualquier contraseña (ver `users.mock.ts`).
- `android/` e `ios/` están en `.gitignore`; usa `npx expo prebuild` cuando necesites builds nativos.
