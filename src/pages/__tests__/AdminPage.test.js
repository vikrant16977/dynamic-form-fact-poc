import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminPage from "../AdminPage";
import { FormContext } from "../../context/FormContext";
import { MemoryRouter } from "react-router-dom";
import HeaderBar from "../../components/HeaderBar";
import AdminFormBuilder from "../../components/AdminFormBuilder";

// Mock dependencies
jest.mock("../../components/HeaderBar", () => () => (
  <div data-testid="header-bar" />
));
jest.mock("../../components/AdminFormBuilder", () => (props) => (
  <div data-testid="admin-form-builder">{JSON.stringify(props)}</div>
));
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

const renderAdminPage = ({
  forms = [],
  setForms = jest.fn(),
  selectedFormId = null,
  addNewForm = jest.fn(),
  updateSelectedFormId = jest.fn(),
  localStorageNewForm = null,
} = {}) => {
  if (localStorageNewForm !== null) {
    window.localStorage.setItem("newForm", localStorageNewForm);
  } else {
    window.localStorage.removeItem("newForm");
  }
  return render(
    <FormContext.Provider
      value={{
        forms,
        setForms,
        selectedFormId,
        addNewForm,
        updateSelectedFormId,
      }}
    >
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    </FormContext.Provider>
  );
};

describe("AdminPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it("renders HeaderBar and main containers", () => {
    renderAdminPage();
    expect(screen.getByTestId("header-bar")).toBeInTheDocument();
    expect(screen.getByText(/Form Editor/i)).toBeInTheDocument();
  });

  it("displays Form Builder section when newForm is true", () => {
    renderAdminPage({ localStorageNewForm: "true" });
    expect(screen.getByText(/Form Builder/i)).toBeInTheDocument();
    expect(screen.getByText(/Back/i)).toBeInTheDocument();
    expect(screen.getByText(/Create/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Form Title/i)).toBeInTheDocument();
  });

  it("calls navigate when Back button is clicked", () => {
    renderAdminPage({ localStorageNewForm: "true" });
    fireEvent.click(screen.getByText(/Back/i));
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  it("handles input and Create button, calls addNewForm, then clears input", () => {
    const addNewForm = jest.fn();
    renderAdminPage({
      localStorageNewForm: "true",
      addNewForm,
    });
    const input = screen.getByPlaceholderText(/Form Title/i);
    fireEvent.change(input, { target: { value: "Test Form" } });
    expect(input.value).toBe("Test Form");
    fireEvent.click(screen.getByText(/Create/i));
    expect(addNewForm).toHaveBeenCalledWith("Test Form");
    expect(input.value).toBe(""); // Should be cleared after create
  });

  it("does not call addNewForm if input is empty or whitespace", () => {
    const addNewForm = jest.fn();
    renderAdminPage({
      localStorageNewForm: "true",
      addNewForm,
    });
    const input = screen.getByPlaceholderText(/Form Title/i);
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.click(screen.getByText(/Create/i));
    expect(addNewForm).not.toHaveBeenCalled();
  });

  it("shows form dropdown when there is at least one form", () => {
    const forms = [
      { id: 1, title: "Form 1" },
      { id: 2, title: "Form 2" },
    ];
    renderAdminPage({ forms });
    expect(screen.getByText(/Select Form to Edit/i)).toBeInTheDocument();
    expect(screen.getByText("Form 1")).toBeInTheDocument();
    expect(screen.getByText("Form 2")).toBeInTheDocument();
  });

  it("calls updateSelectedFormId when dropdown value changes", () => {
    const forms = [{ id: 1, title: "Form 1" }];
    const updateSelectedFormId = jest.fn();
    renderAdminPage({
      forms,
      selectedFormId: null,
      updateSelectedFormId,
    });
    const dropdown = screen.getByRole("listbox");
    fireEvent.click(dropdown);
    const option = screen.getByText("Form 1");
    fireEvent.click(option);
    expect(updateSelectedFormId).toHaveBeenCalledWith(1);
  });

  it("renders AdminFormBuilder when selectedFormId matches a form", () => {
    const forms = [{ id: 5, title: "Form X" }];
    renderAdminPage({
      forms,
      selectedFormId: 5,
    });
    expect(screen.getByTestId("admin-form-builder")).toBeInTheDocument();
  });

  it("does not render AdminFormBuilder when no form is selected", () => {
    renderAdminPage({
      forms: [{ id: 1, title: "Form 1" }],
      selectedFormId: null,
    });
    expect(screen.queryByTestId("admin-form-builder")).toBeNull();
  });

  it("renders correctly for empty forms state (edge case)", () => {
    renderAdminPage({ forms: [] });
    expect(screen.queryByText(/Select Form to Edit/i)).toBeNull();
  });

  it("handles edge case: selectedFormId doesn't match any form", () => {
    renderAdminPage({
      forms: [{ id: 1, title: "Form 1" }],
      selectedFormId: 999,
    });
    expect(screen.queryByTestId("admin-form-builder")).toBeNull();
  });

  it("renders loading state if context is slow (simulate)", async () => {
    // Simulate context loading by not providing forms
    render(
      <FormContext.Provider value={{ forms: [] }}>
        <MemoryRouter>
          <AdminPage />
        </MemoryRouter>
      </FormContext.Provider>
    );
    // Should not crash; may not render anything meaningful
    expect(screen.getByTestId("header-bar")).toBeInTheDocument();
  });

  it("snapshot test: initial render, no newForm, no forms", () => {
    const { asFragment } = renderAdminPage();
    expect(asFragment()).toMatchSnapshot();
  });
});
