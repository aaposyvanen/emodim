import React from 'react';
import renderer from 'react-test-renderer';
import EmojiAnnotation from "./emojiAnnotation";

test("EmojiAnnotation renders correctly with different props", () => {

    let component = renderer.create(
        <EmojiAnnotation
            positiveValence={true}
            valenceIntensity={1}
        />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    component = renderer.create(
        <EmojiAnnotation
            positiveValence={true}
            valenceIntensity={5}
        />,
    );
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    component = renderer.create(
        <EmojiAnnotation
            positiveValence={false}
            valenceIntensity={1}
        />,
    );
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    component = renderer.create(
        <EmojiAnnotation
            positiveValence={true}
            valenceIntensity={5}
        />,
    );
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test("EmojiAnnotation renders correctly without props", () => {
    const component = renderer.create(
        <EmojiAnnotation />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
