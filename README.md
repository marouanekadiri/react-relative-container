# **React Relative Container**

Make your component responsive everywhere.

## Installation
```sh
  npm i -s react-relative-container
```

## Usage

Make sure you have forwarded ref to a specific dom element that you want to observe its size change
```jsx
const Parent = React.forwardRef((props, ref) => (<div ref={ref} {...props} />)
```

Wrap the container that you want to observe
```jsx
import { RelativeContainer } from 'react-relative-container'

const Container = RelativeContainer(Parent)
```

Define your custom breakpoints that you want your component to change when we have
```jsx
const S = ({ width }) => width < 400
const M = ({ width }) => width < 700 && width >= 400
const L = ({ width }) => width < 1000 && width >= 700
```

Let say this is your child component
```jsx
const Child = props => {
  return S(props.rcSize) ? 
          <div>i'm small</div> 
            : 
          <div>i'm medium or large</div>
}
```

Apply breakpoints to your child components
```jsx
import { ObserveRCSizeOn } from 'react-relative-container'

const ResponsiveChild = ObserveRCSizeOn(S)(Child) // You can listen to S only
// or
const ResponsiveChild = ObserveRCSizeOn(S, M)(Child) // You can listen to S and M only
// or
const ResponsiveChild = ObserveRCSizeOn(S, M, L)(Child) // You can listen to S, M and L
```

Now all together

```jsx
const Example = () => {
  return (
    <Container>
      <ResponsiveChild />
    </Container>
  )
}

// Or
const Example = () => {
  return (
    <Container>
      <div>
        <ResponsiveChild />
      </div>
      <ResponsiveChild />
    </Container>
  )
}
// They both observe size changes of the container
```

## Usage with `styled-components`
This library provides some api to easily work with styled component
```jsx
import { styledRCMatches } from 'react-relative-container'

// Wrap your container with your styled container
const Container = RelativeContainer(
  styled.div``
)

// breakpoint conditions
const S = ({ width }) => width < 200
const M = ({ width }) => width < 300
const L = ({ width }) => width < 400

// Your responsive child
const ResponsiveChild = ObserveRCSizeOn(S, M, L)(
  styled.div`
    background-color: grey;
    ${styledRCMatches(L)(
      css`
        background-color: yellow;
        font-size: 16px;
      `
    )}
    ${styledRCMatches(M)(
      css`
        background-color: yellow;
        font-size: 16px;
      `
    )}
    ${styledRCMatches(S)(
      css`
        background-color: blue;
        font-size: 10px;
      `
    )}
  `
  )

// This could be your component
const Example = () => {
  return (
    <Container>
      <ResponsiveChild>Hello world</ResponsiveChild>
    </Container>
  )
}
```

Lets assume we have a Page that is like this
```jsx

const grow = keyframes`
  from {
    width: 100px
  }
  to {
    width: 500px;
  }
`

const PageContainer = styled.div`
  width: 500px;
  animation: ${grow} linear 1s;
`

const Page = () => {
 return (
   <PageContainer>
      <Example />
   </PageContainer>
 )
}
```

**Results**

![Styled component example](https://user-images.githubusercontent.com/15144618/99157663-40a98480-26cb-11eb-92ec-c5e7736e7a96.gif)

## Contributing
Contributions are welcomed!