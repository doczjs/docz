import { useStaticQuery, graphql } from 'gatsby'

export const useDbQuery = () => {
  try {
    const data = useStaticQuery(graphql`
      query {
        doczDb {
          id
          db
        }
      }
    `)

    return JSON.parse(data.doczDb.db)
  } catch (err) {
    console.error(err)
    console.error('Error when parsing docz database')
    return {}
  }
}
