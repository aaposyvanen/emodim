import React from 'react';
import renderer from 'react-test-renderer';
import App from './App';

describe("App", () => {
  it("renders correctly", () => {
    const component = renderer.create(
      <App />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
