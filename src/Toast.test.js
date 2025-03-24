import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Toast from "./Toast";

describe("Toast Component", () => {
  const mockFormSubmission = {
    id: "123",
    data: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      liked: false,
    },
  };

  const mockOnLike = jest.fn();
  const mockOnDismiss = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test("renders toast with correct content", () => {
    render(
      <Toast
        formSubmission={mockFormSubmission}
        onLike={mockOnLike}
        onDismiss={mockOnDismiss}
      />
    );

    expect(screen.getByText("New Form Submission")).toBeInTheDocument();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/john.doe@example.com/)).toBeInTheDocument();
    expect(screen.getByText("Like")).toBeInTheDocument();
  });

  test("calls onLike when like button is clicked", () => {
    render(
      <Toast
        formSubmission={mockFormSubmission}
        onLike={mockOnLike}
        onDismiss={mockOnDismiss}
      />
    );

    fireEvent.click(screen.getByText("Like"));

    // Fast-forward time to execute setTimeout callbacks
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockOnLike).toHaveBeenCalledWith(mockFormSubmission);
  });

  test("calls onDismiss when close button is clicked", () => {
    render(
      <Toast
        formSubmission={mockFormSubmission}
        onLike={mockOnLike}
        onDismiss={mockOnDismiss}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    // Fast-forward time to execute setTimeout callbacks
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockOnDismiss).toHaveBeenCalledWith("123");
  });

  test("auto dismisses after duration", () => {
    render(
      <Toast
        formSubmission={mockFormSubmission}
        onLike={mockOnLike}
        onDismiss={mockOnDismiss}
        autoHideDuration={1000}
      />
    );

    // Fast-forward time to execute auto-hide timeout
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Fast-forward time to execute setTimeout in handleClose
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockOnDismiss).toHaveBeenCalledWith("123");
  });
});
