import React from "react";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThreadChanger from "./threadChanger";

test("ThreadChanger renders correctly", () => {
    const mockUpdateIndex = jest.fn();

    const { container } = render(
        <ThreadChanger
            currentIndex={0}
            updateIndex={mockUpdateIndex}
            maxIndex={1}
        />
    );
    expect(container).toMatchSnapshot();
});

test("ThreadChanger calls updateIndex on decrease", () => {
    const mockUpdateIndex = jest.fn();

    render(<ThreadChanger
        currentIndex={2}
        updateIndex={mockUpdateIndex}
        maxIndex={5}
    />);

    userEvent.click(screen.getByText("Prev"));
    expect(mockUpdateIndex).toHaveBeenCalledTimes(1);
    expect(mockUpdateIndex).toHaveBeenCalledWith(1);
});

test("ThreadChanger calls updateIndex on increase", () => {
    const mockUpdateIndex = jest.fn();

    render(<ThreadChanger
        currentIndex={1}
        updateIndex={mockUpdateIndex}
        maxIndex={2}
    />);

    userEvent.click(screen.getByText("Next"));
    expect(mockUpdateIndex).toHaveBeenCalledTimes(1);
    expect(mockUpdateIndex).toHaveBeenCalledWith(2);
});

test("ThreadChanger doesn't decrease index under 0", () => {
    const mockUpdateIndex = jest.fn();

    render(<ThreadChanger
        currentIndex={0}
        updateIndex={mockUpdateIndex}
        maxIndex={1}
    />);

    userEvent.click(screen.getByText("Prev"));
    expect(mockUpdateIndex).toHaveBeenCalledTimes(0);
});

test("ThreadChanger doesn't increase index above max", () => {
    const mockUpdateIndex = jest.fn();

    render(<ThreadChanger
        currentIndex={1}
        updateIndex={mockUpdateIndex}
        maxIndex={1}
    />);

    userEvent.click(screen.getByText("Next"));
    expect(mockUpdateIndex).toHaveBeenCalledTimes(0);
});
