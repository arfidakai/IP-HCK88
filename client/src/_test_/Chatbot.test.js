import React from "react";
import { describe, expect, test } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../store/store";
import Home from "../Pages/Home";

beforeAll(() => {
  class IntersectionObserverMock {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  global.IntersectionObserver = IntersectionObserverMock;
});

describe("Chatbot Component", () => {
  test("renders chatbot input", () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );

    const input = screen.getByPlaceholderText(/tulis minat kamu/i);
    expect(input).toBeInTheDocument();
  });

  test("can type and display a user message", () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );

    const input = screen.getByPlaceholderText(/tulis minat kamu/i);
    fireEvent.change(input, { target: { value: "Pengen belajar AI" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    const chatBubble = screen.getByText(/Pengen belajar AI/i);
    expect(chatBubble).toBeInTheDocument();
  });
});
