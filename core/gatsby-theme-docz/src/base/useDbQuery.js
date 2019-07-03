import { useStaticQuery, graphql } from 'gatsby'
import { get } from 'lodash/fp'

export const useDbQuery = () => {
  try {
    const data = useStaticQuery(graphql`
      query DoczDBQuery {
        allDoczDb {
          edges {
            node {
              db
            }
          }
        }
      }
    `)

    const nodes = get('allDoczDb.edges.node', data)
    return JSON.parse(JSON.parse(nodes[0]))
  } catch (err) {
    console.error('Error when parsing docz database')
    return {}
  }
}
