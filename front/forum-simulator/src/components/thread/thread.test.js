import React from "react";
import renderer from 'react-test-renderer';

import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

import { Thread } from "./thread";

const mockStore = configureMockStore();
const store = mockStore({});

describe("Thread", () => {
    it("renders correctly", () => {
        const component = renderer.create(
            <Provider store={store}>
                <Thread />
            </Provider>
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
