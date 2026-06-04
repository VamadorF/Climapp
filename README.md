# Clima (Expo + Open-Meteo)

App movil de pronostico meteorologico creada con **Expo**, **React Native** y
**TypeScript**. Esta version porta la experiencia del repo web
[`VamadorF/clima`](https://github.com/VamadorF/clima) a una app ejecutable con
Expo.

## Funciones

- Busqueda de ciudades con la API gratuita de Open-Meteo.
- Clima actual con temperatura, sensacion, humedad, viento y precipitacion.
- Pronostico de las proximas 24 horas.
- Pronostico de 7 dias.
- Pull-to-refresh para recargar la ciudad seleccionada.

## Arranque rapido

```bash
npm install
npm start
```

En la terminal de Expo: **`a`** Android, **`i`** iOS, **`w`** web. Compatible
con **Expo Go** porque no usa modulos nativos extra ni API keys.

## Estructura principal

```text
src/app/                 -> bootstrap y providers
src/features/weather/    -> pantalla, componentes, hooks y cliente Open-Meteo
src/shared/              -> componentes reutilizables y tema
```

## Scripts

| Comando | Descripcion |
|---------|-------------|
| `npm start` | Metro + Expo Dev Tools |
| `npm run android` | Compilar/ejecutar Android |
| `npm run ios` | Compilar/ejecutar iOS (macOS) |
| `npm run web` | Vista web con Metro |
| `npm run lint` | ESLint |
| `npm test` | Vitest |

## Datos

Los datos provienen de [Open-Meteo](https://open-meteo.com/) bajo licencia
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), con fuentes de
servicios meteorologicos nacionales.
