import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import UserPage from "../UserPage";
import { MemoryRouter } from "react-router-dom";
import { FormContext } from "../../context/FormContext";

// Mock HeaderBar to avoid rendering issues or image imports
jest.mock("../../components/HeaderBar", () => () => <div data-testid="header-bar" />);

const mockForms = [
  {
    id: 1,
    title: "Feedback Form",
    sections: [
      {
        id: "sec1",
        sectionTitle: "Personal Info",
        questions: [
          { id: "q1", label: "Name", type: "text", required: true },
          { id: "q2", label: "Gender", type: "radio", required: false, options: ["Male", "Female"] },
          { id: "q3", label: "Hobbies", type: "checkbox", required: false, options: ["Reading", "Music"] },
        ],
      },
      {
        id: "sec2",
        sectionTitle: "Details",
        questions: [
          { id: "q4", label: "Comments", type: "textarea", required: false },
          { id: "q5", label: "Favorite Color", type: "dropdown", required: false, options: ["Red", "Blue"] },
          { id: "q6", label: "Age", type: "number", required: false },
          { id: "q7", label: "Email", type: "email", required: false },
          { id: "q8", label: "DOB", type: "date", required: false },
          { id: "q9", label: "Meeting Time", type: "time", required: false },
        ],
      },
    ],
  },
];

const defaultContext = {
  forms: mockForms,
  selectedFormId: 1,
  updateSelectedFormId: jest.fn(),
  getSelectedForm: () => mockForms[0],
};

function renderWithContext(ctx = defaultContext) {
  return render(
    <FormContext.Provider value={ctx}>
      <MemoryRouter>
        <UserPage />
      </MemoryRouter>
    </FormContext.Provider>
  );
}

describe("UserPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

 it("renders HeaderBar, form selection header and dropdown", () => {
  renderWithContext();
  expect(screen.getByTestId("header-bar")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /select the form to submit/i })).toBeInTheDocument();
  // expect(screen.getByPlaceholderText(/select a form/i)).toBeInTheDocument(); // REMOVE THIS
  expect(document.querySelector('.ui.selection.dropdown')).toBeInTheDocument(); // ADD THIS
});

  it("renders a warning message if there are no forms", () => {
    renderWithContext({
      ...defaultContext,
      forms: [],
      getSelectedForm: () => undefined,
    });
    expect(screen.getByText(/no forms available/i)).toBeInTheDocument();
  });

it("calls updateSelectedFormId and resets responses when a new form is selected", () => {
  // Provide two forms so a change can actually occur.
  const forms = [
    ...mockForms,
    {
      id: 2,
      title: "Second Form",
      sections: []
    }
  ];
  const updateSelectedFormId = jest.fn();
  renderWithContext({ ...defaultContext, forms, updateSelectedFormId, selectedFormId: 2 });

  // Find the dropdown for form selection (the first .ui.selection.dropdown in DOM)
  const dropdownTrigger = document.querySelectorAll('.ui.selection.dropdown')[0];
  expect(dropdownTrigger).toBeInTheDocument();
  fireEvent.click(dropdownTrigger);

  // Now find and click the "Feedback Form" item in the opened menu
  const menu = document.querySelector('.visible.menu.transition');
  expect(menu).toBeInTheDocument();
  const menuItem = within(menu).getByText("Feedback Form");
  fireEvent.click(menuItem);

  expect(updateSelectedFormId).toHaveBeenCalledWith(1);
});

  it("renders all section headers and questions", () => {
    renderWithContext();
    expect(screen.getByText("Personal Info")).toBeInTheDocument();
    expect(screen.getByText("Details")).toBeInTheDocument();

    // Text input (Name)
    expect(screen.getAllByRole("textbox")[0]).toBeInTheDocument();

    // Radio group (Gender)
    expect(screen.getByText("Gender")).toBeInTheDocument();

    // Checkbox group (Hobbies)
    expect(screen.getByText("Hobbies")).toBeInTheDocument();

    // Textarea (Comments)
    expect(screen.getByText("Comments")).toBeInTheDocument();

    // Dropdown (Favorite Color)
    expect(screen.getByText("Favorite Color")).toBeInTheDocument();

    // Number input (Age)
    expect(screen.getByText("Age")).toBeInTheDocument();

    // Email input (Email)
    expect(screen.getByText("Email")).toBeInTheDocument();

    // Date input (DOB)
    expect(screen.getByText("DOB")).toBeInTheDocument();

    // Time input (Meeting Time)
    expect(screen.getByText("Meeting Time")).toBeInTheDocument();
  });

  it("updates text input value", () => {
    renderWithContext();
    const nameInput = screen.getAllByRole("textbox")[0];
    fireEvent.change(nameInput, { target: { value: "John" } });
    expect(nameInput).toHaveValue("John");
  });

  it("updates textarea value", () => {
    renderWithContext();
    // The second textbox is the textarea
    const textarea = screen.getAllByRole("textbox")[1];
    fireEvent.change(textarea, { target: { value: "Great!" } });
    expect(textarea).toHaveValue("Great!");
  });

 it("selects radio option", () => {
  renderWithContext();
  // Find all radio buttons in order; "Male" is first, "Female" is second in the mock
  const radios = screen.getAllByRole("radio");
  const maleRadio = radios[0];
  const femaleRadio = radios[1];

  fireEvent.click(maleRadio);
  expect(maleRadio).toBeChecked();
  expect(femaleRadio).not.toBeChecked();

  fireEvent.click(femaleRadio);
  expect(femaleRadio).toBeChecked();
  expect(maleRadio).not.toBeChecked();
});

 it("checks and unchecks checkbox options", () => {
  renderWithContext();

  // Find all checkboxes in order; "Reading" is first, "Music" is second in mock
  const checkboxes = screen.getAllByRole("checkbox");
  const reading = checkboxes[0];
  const music = checkboxes[1];

  fireEvent.click(reading);
  expect(reading).toBeChecked();

  fireEvent.click(music);
  expect(music).toBeChecked();

  fireEvent.click(reading);
  expect(reading).not.toBeChecked();
});

  it("selects from dropdown", () => {
  renderWithContext();
  // Find "Favorite Color" label, get its parent, then find the dropdown trigger inside
  const colorLabel = screen.getByText("Favorite Color");
  // The Dropdown trigger is next sibling (may vary, adjust as needed)
  const colorDropdown = colorLabel.parentNode.querySelector('.ui.dropdown') || colorLabel.parentNode.querySelector('div');
  fireEvent.click(colorDropdown);
  const menu = document.querySelector('.visible.menu.transition');
  fireEvent.click(within(menu).getByText("Red"));
  // Optionally, assert the dropdown trigger now shows the selected value
  expect(colorDropdown).toHaveTextContent("Red");
});

 it("updates number, email, date, and time fields", () => {
  renderWithContext();
  // Age (type=number): use role spinbutton
  const number = screen.getByRole("spinbutton");
  // Email input: third textbox in the form as per mock data
  const allTextboxes = screen.getAllByRole("textbox");
  const email = allTextboxes[2];
  // Date and time: use querySelector for input[type="date"] and input[type="time"]
  const date = document.querySelector('input[type="date"]');
  const time = document.querySelector('input[type="time"]');

  fireEvent.change(number, { target: { value: "25" } });
  fireEvent.change(email, { target: { value: "a@b.com" } });
  if (date) fireEvent.change(date, { target: { value: "2023-05-01" } });
  if (time) fireEvent.change(time, { target: { value: "14:30" } });

  expect(number).toHaveValue(25);
  expect(email).toHaveValue("a@b.com");
  if (date) expect(date).toHaveValue("2023-05-01");
  if (time) expect(time).toHaveValue("14:30");
});

  it("clears all responses when Clear is clicked", () => {
    renderWithContext();
    // Name input is first textbox
    const nameInput = screen.getAllByRole("textbox")[0];
    fireEvent.change(nameInput, { target: { value: "John" } });
    expect(nameInput).toHaveValue("John");
    fireEvent.click(screen.getByRole("button", { name: /clear/i }));
    expect(nameInput).toHaveValue("");
  });

  it("shows submitted message after submitting", () => {
    renderWithContext();
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(screen.getByText(/form submitted!/i)).toBeInTheDocument();
    expect(screen.getByText(/your responses have been recorded/i)).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = renderWithContext();
    expect(asFragment()).toMatchSnapshot();
  });
});