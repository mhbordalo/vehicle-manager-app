# Aplicativo de Gestão de Veículos

Este projeto é um aplicativo mobile e web desenvolvido em **React Native com Expo** e **React Navigation**, que permite o **cadastro, listagem, edição e exclusão** de veículos, simulando uma API com JSON Server.

## Visão Geral

- **Tecnologias:** React Native, Expo, React Navigation, TypeScript, Axios, JSON Server
- **Funcionalidades:** CRUD de veículos, tema claro/escuro, navegação por abas e modais, feedback visual via modais customizados, busca robusta, validação obrigatória, feedback visual universal
- **Ambientes:** Suporte a web e mobile (Android/iOS)

## Arquitetura e Estrutura

- **Navegação:** 100% React Navigation (Stack + Tabs), sem resíduos de expo-router
- **Telas:** Login, Home (listagem e busca), Register (cadastro), EditVehicle (edição/exclusão)
- **Componentes:** VehicleCard (cartão de veículo com botão de editar), ThemeToggleButton (alternância de tema)
- **Contexto:** ThemeContext para tema global claro/escuro, persistido via AsyncStorage
- **Estilos:** Centralizados em constants/Styles.ts e constants/Colors.ts, com função para gerar estilos temáticos
- **API:** Axios configurado para ambiente web/mobile, consumindo um JSON Server local
- **Hooks customizados:** Para tema e cor, abstraindo o uso do contexto e do sistema

## Estrutura de Pastas

```bash
/vehicle-manager-app
├── App.tsx
├── app/
│   ├── contexts/
│   │   └── ThemeContext.tsx
│   ├── login.tsx
│   ├── Home.tsx
│   ├── Register.tsx
│   └── EditVehicle.tsx
├── assets/
│   ├── fonts/
│   │   └── SpaceMono-Regular.ttf
│   └── images/
│       ├── adaptive-icon.png
│       ├── favicon.png
│       ├── icon.png
│       ├── partial-react-logo.png
│       ├── react-logo.png
│       ├── react-logo@2x.png
│       ├── react-logo@3x.png
│       └── splash-icon.png
├── components/
│   ├── ThemeToggleButton.tsx
│   └── VehicleCard.tsx
├── constants/
│   ├── Brands.ts
│   ├── Colors.ts
│   └── Styles.ts
├── hooks/
│   ├── useColorScheme.ts
│   ├── useColorScheme.web.ts
│   └── useThemeColor.ts
├── scripts/
├── services/
│   └── api.ts
├── types/
│   └── vehicle.ts
├── db.json
├── package.json
├── tsconfig.json
├── eslint.config.js
├── app.json
├── README.md
```

## UX/UI e Funcionalidades

- **CRUD completo:** Cadastro, listagem, edição e exclusão de veículos
- **Busca robusta:** Ignora acentos, espaços, maiúsculas/minúsculas, busca por múltiplos campos
- **Validação obrigatória:** Cadastro e edição exigem todos os campos preenchidos, com feedback visual via modal customizado
- **Validação de placa:** Aceita 3 formatos (ABC1D23, ABC1234, ABC-1234), sempre salva em maiúsculo
- **Validação de ano:** Apenas 4 dígitos (ex: 2025)
- **Validação de e-mail:** No login, exige formato válido
- **Feedback visual:** Modais customizados para sucesso, erro e confirmação, compatíveis com web e mobile
- **Tema global:** Alternância clara/escura em todo o app, inclusive na tab bar
- **Tab bar:** Ícone de logout centralizado, texto "Sair" abaixo, altura aumentada, cor adaptada ao tema
- **Acessibilidade:** Uso de SafeAreaView, contraste de cores, botões grandes e textos legíveis

## Dependências Principais

- **@react-navigation/native**: Navegação principal
- **@react-navigation/stack**: Navegação em pilha (Stack Navigator)
- **@react-navigation/bottom-tabs**: Navegação por abas
- **axios**: Consumo de API REST
- **@react-native-async-storage/async-storage**: Persistência do tema
- **JSON Server**: Backend simulado para CRUD
- **React Native/Expo**: Base do app

## Riscos e Limitações

- **Backend local:** Apenas para prototipação, não recomendado para produção
- **Sem autenticação real:** Qualquer usuário pode acessar e manipular dados
- **Sem validação de formato para outros campos:** Apenas placa, ano e e-mail são validados
- **Sem persistência em nuvem:** Dados apenas locais
- **Sem loading indicators:** Não há feedback visual durante requisições
- **Sem testes automatizados**
- **CORS:** Pode haver problemas ao acessar a API em ambientes diferentes

## Sugestões de Melhoria

- Implementar autenticação real (JWT, OAuth, etc)
- Adicionar loading indicators durante requisições
- Internacionalização (i18n)
- Testes automatizados (unitários e de integração)
- Melhorias de acessibilidade (labels, roles, foco)
- Persistência em nuvem (Firebase, Supabase, etc)
- Validação de formato para outros campos (modelo, cor)

## Instruções de Uso

1. **Clone o repositório:**

   ```bash
   git clone <repo>
   cd vehicle-manager-app
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Inicie o JSON Server:**

   ```bash
   json-server --watch db.json --port 3001
   ```

4. **Execute o app:**

   ```bash
   npx expo start -c
   ```

   - Para web:
      - pressione "w" no terminal,
      - "F12" no navegador,
      - Ctrl+Shift+M para ativar emulação de dispositivo
   - Para mobile: use o app Expo Go ou emulador

## Observações

- O projeto utiliza **React Navigation** para toda a navegação (Stack e Tabs)
- Para produção, recomenda-se implementar autenticação, validação de formato, persistência em nuvem e backend real

---

**Desenvolvido para fins de estudo, prototipação e demonstração.**
