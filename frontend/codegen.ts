import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  // Aponta para o schema do backend em desenvolvimento
  // Troque pela URL do servidor quando estiver rodando: "http://localhost:4000/graphql"
  schema: "http://localhost:4000/graphql",
  documents: "src/**/*.{ts,tsx}",
  generates: {
    "src/__generated__/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
      config: {
        scalars: {
          DateTime: "string",
        },
        // Gera tipos com nomes descritivos para cada operação
        avoidOptionals: false,
        maybeValue: "T | null | undefined",
      },
    },
  },
  hooks: {
    afterAllFileWrite: ["prettier --write"],
  },
}

export default config
