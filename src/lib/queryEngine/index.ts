export { generateSqlQuery } from "./sqlGenerator"
export { generateMongoQuery } from "./mongoGenerator"
export { generateJsonQuery } from "./jsonGenerator"
export { generateGraphqlQuery } from "./graphqlGenerator"
export { generateCypherQuery } from "./cypherGenerator"
export { generatePromqlQuery } from "./promqlGenerator"
export { generateKqlQuery } from "./kqlGenerator"
export { generateSplQuery } from "./splGenerator"
export type { MongoQuery } from "./mongoGenerator"

export const QUERY_LANGUAGES = [
  "sql",
  "mongo",
  "json",
  "graphql",
  "cypher",
  "promql",
  "kql",
  "spl",
] as const

export type QueryLanguage = (typeof QUERY_LANGUAGES)[number]
