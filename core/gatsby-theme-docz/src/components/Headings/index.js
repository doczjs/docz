/** @jsx jsx */
import { jsx } from 'theme-ui'

const heading = Tag => {
  const Component = props => {
    return !!props.id ? (
      <Tag {...props}>
        <a
          href={`#${props.id}`}
          sx={{
            color: 'inherit',
            textDecoration: 'none',
            ':hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {props.children}
        </a>
      </Tag>
    ) : (
      <Tag {...props} />
    )
  }

  Component.displayName = Tag
  return Component
}

export const h2 = heading('h2')
export const h3 = heading('h3')
export const h4 = heading('h4')
export const h5 = heading('h5')
export const h6 = heading('h6')
