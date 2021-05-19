import React from 'react';
import renderer from 'react-test-renderer';
import Thread from "./thread";

describe("Thread", () => {
    it("renders correctly", () => {
        const component = renderer.create(
            <Thread />,
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
