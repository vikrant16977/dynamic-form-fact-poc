import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import HomePage from "../HomePage";
import { MemoryRouter } from "react-router-dom";
import { FormContext } from "../../context/FormContext";

// Mock HeaderBar to avoid rendering issues or image imports
jest.mock("../../components/HeaderBar", () => () => <div data-testid="header-bar" />);

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const defaultForms = [
  { id: 1, title: "Form 1" },
  { id: 2, title: "Form 2" },
];

function renderWithContext(
  { forms = defaultForms, updateSelectedFormId = jest.fn(), addNewForm = jest.fn() } = {}
) {
  return render(
    <FormContext.Provider value={{ forms, updateSelectedFormId, addNewForm }}>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </FormContext.Provider>
  );
}

describe("HomePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it("renders HeaderBar and main UI elements", () => {
    renderWithContext();
    expect(screen.getByTestId("header-bar")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /create a new form/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter form name/i)).toBeInTheDocument();
    expect(screen.getByText(/select pre-existing forms/i)).toBeInTheDocument();
    expect(screen.getByText(/discard/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument();
    expect(screen.getAllByText(/or/i).length).toBeGreaterThan(0);
  });

  it("enables and disables the Create button correctly", () => {
    renderWithContext();
    const createBtn = screen.getByRole("button", { name: /create/i });
    expect(createBtn).toBeDisabled();

    const input = screen.getByPlaceholderText(/enter form name/i);
    fireEvent.change(input, { target: { value: "Test Form" } });
    expect(createBtn).not.toBeDisabled();

    fireEvent.change(input, { target: { value: "" } });
    expect(createBtn).toBeDisabled();
  });

  it("handles form name input and calls addNewForm & navigate on Create", () => {
    const addNewForm = jest.fn();
    renderWithContext({ addNewForm });
    const input = screen.getByPlaceholderText(/enter form name/i);
    fireEvent.change(input, { target: { value: "My New Form" } });
    const createBtn = screen.getByRole("button", { name: /create/i });
    fireEvent.click(createBtn);
    expect(addNewForm).toHaveBeenCalledWith("My New Form");
    expect(window.localStorage.getItem("newForm")).toBe("true");
    expect(mockNavigate).toHaveBeenCalledWith("/admin");
  });

  it("does not call addNewForm for empty or whitespace form name", () => {
    const addNewForm = jest.fn();
    renderWithContext({ addNewForm });
    const input = screen.getByPlaceholderText(/enter form name/i);
    fireEvent.change(input, { target: { value: "   " } });
    const createBtn = screen.getByRole("button", { name: /create/i });
    fireEvent.click(createBtn);
    expect(addNewForm).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("shows dropdown options and handles selecting existing form", () => {
    renderWithContext();
    const dropdown = screen.getByText(/select pre-existing forms/i);
fireEvent.click(dropdown);

const menu = document.querySelector('.visible.menu.transition');
expect(menu).toBeTruthy(); // makes sure we found it
const option = within(menu).getByText("Form 1");
fireEvent.click(option);

    // Once selected, Edit button should appear
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });

  it("calls updateSelectedFormId and navigates when Edit is clicked", () => {
    const updateSelectedFormId = jest.fn();
    renderWithContext({ updateSelectedFormId });
    const dropdown = screen.getByText(/select pre-existing forms/i);
fireEvent.click(dropdown);

const menu = document.querySelector('.visible.menu.transition');
expect(menu).toBeTruthy(); // makes sure we found it
const option = within(menu).getByText("Form 1");
fireEvent.click(option);

    const editBtn = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editBtn);
    expect(updateSelectedFormId).toHaveBeenCalledWith(1);
    expect(window.localStorage.getItem("newForm")).toBe("false");
    expect(mockNavigate).toHaveBeenCalledWith("/admin");
  });

  it("disables Edit button if no form is selected and input is empty", () => {
    renderWithContext();
    expect(screen.getByRole("button", { name: /create/i })).toBeDisabled();
  });

  it("resets input and dropdown selection on Discard", () => {
    renderWithContext();
    const input = screen.getByPlaceholderText(/enter form name/i);
    fireEvent.change(input, { target: { value: "Some Form" } });
    const discardBtn = screen.getByText(/discard/i);
    fireEvent.click(discardBtn);
    expect(input.value).toBe("");
    // Dropdown should reset to null value (undefined), so the Create button should be disabled
    expect(screen.getByRole("button", { name: /create/i })).toBeDisabled();
  });

  it("renders correctly with empty forms array", () => {
    renderWithContext({ forms: [] });
    expect(screen.getByText(/select pre-existing forms/i)).toBeInTheDocument();
    // No dropdown options
    fireEvent.click(screen.getByText(/select pre-existing forms/i));
    expect(screen.queryByText("Form 1")).not.toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = renderWithContext();
    expect(asFragment()).toMatchSnapshot();
  });
});