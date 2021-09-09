import React from 'react';
import renderer from 'react-test-renderer';
import AnnotatedMessage from "./annotatedMessage";

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
        <AnnotatedMessage data={data} />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
