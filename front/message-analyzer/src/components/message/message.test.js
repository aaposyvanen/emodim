import React from 'react';
import renderer from 'react-test-renderer';
import Message from "./message";

test("Message renders correctly with props", () => {
    const data = {
        commentMetadata: {
            author: "Author",
            datetime: "2000-01-01 00:00:00",
            id: "1"
        },
        words: [
            {
                word: "test",
                valence: -1,
                arousal: 1
            }
        ]
    };
    const component = renderer.create(
        <Message data={data} />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test("Message renders correctly without props", () => {
    const component = renderer.create(
        <Message />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
