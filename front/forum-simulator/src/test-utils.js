import React from 'react'
import { render as rtlRender } from '@testing-library/react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import createRootReducer from './reducer'

// This can be used instead of rtlRender to easily render connected (Redux) components.
// Can be especially useful when children of the tested component are connected.
// There might be a better way, (e.g. shallow rendering) but at least this works.
// Inspiration for this approach:
// https://redux.js.org/recipes/writing-tests#connected-components

function render(
    ui,
    {
        initialState,
        store = createStore(createRootReducer, initialState),
        ...renderOptions
    } = {}
) {
    function Wrapper({ children }) {
        return <Provider store={store}>{children}</Provider>
    }
    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

// re-export everything
export * from '@testing-library/react'
// override render method
export { render }
