import { createElement, useContext, useMemo } from 'react'
import { assoc, first, get, mapValues, kebabCase } from 'lodash/fp'
import { pascalCase } from 'pascal-case'
import marksy from 'marksy'

import { useComponents } from '../hooks'
import { doczState } from '../state'

interface UseComponentPropsParams {
  componentName: string
  fileName: string
}

export const useComponentProps = ({
  componentName,
  fileName,
}: UseComponentPropsParams) => {
  const components = useComponents()
  const { props: stateProps } = useContext(doczState.context)

  const componentMatcher = (componentName: string, item: any) => {
    const matchingPatterns = [
      fileName,
      `/${componentName}.`,
      `/${kebabCase(componentName)}.`,
      `/${pascalCase(componentName)}.`,
    ]
    return !!matchingPatterns.find(pattern => item.key.includes(pattern))
  }

  const found =
    stateProps &&
    stateProps.length > 0 &&
    stateProps.find(item => componentMatcher(componentName, item))

  const value = get('value', found) || []
  const firstDefinition = first(value)
  const definition = value.find((i: any) => i.displayName === componentName)

  const compile = useMemo(
    () => marksy({ createElement, elements: components }),
    [components]
  )

  const props = useMemo(() => {
    const props = get('props', definition || firstDefinition)
    const parseDescs = mapValues((prop: any) => {
      const desc = get('description', prop)
      return !desc ? prop : assoc('description', compile(desc).tree, prop)
    })

    return parseDescs(props)
  }, [compile, definition || firstDefinition])

  return props
}
