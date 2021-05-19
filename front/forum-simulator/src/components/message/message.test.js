import React from 'react';
import renderer from 'react-test-renderer';
import Message from "./message";

describe("message", () => {
    it("renders correctly", () => {
        const component = renderer.create(
            <Message />,
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
