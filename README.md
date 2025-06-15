# Aplicativo de Gestão de Veículos

Este projeto é um aplicativo mobile desenvolvido em **React Native com Expo**, que permite o **cadastro, listagem, edição e exclusão** de veículos, simulando uma API com JSON Server.

## Estrutura de pastas

```md
/vehicle-manager-app
├── app/
│   ├── (modals)/
│   │   ├── _layout.tsx
│   │   └── [id].tsx
│   ├── (tabs)/
│   │   ├──_layout.tsx
│   │   ├── index.tsx
│   │   ├── logout.tsx
│   │   └── register.tsx
│   ├── contexts/
│   │   └── ThemeContext.tsx
│   ├── _layout.tsx
│   └── login.tsx
├── assets/
│   ├── fonts/
│   └── images/
├── components/
│   ├── ThemeToggleButton.tsx
│   └── VehicleCard.tsx
├── constants/
│   ├── Brands.ts
│   └── Colors.ts
├── hooks/
│   ├── useColorScheme.ts
│   ├── useColorScheme.web.ts
│   └── useThemeColor.ts
├── scripts/
├── services/
│   └── api.ts
├── types/
│   └── vehicle.ts
```

## Instalação

1. Clone o repositório:

   ```bash
   git clone <repo>
   cd vehicle-manager-app
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o JSON Server:

   ```bash
   json-server --watch db.json --port 3001
   ```

4. Execute o app:

   ```bash
   npx expo start
   ```
