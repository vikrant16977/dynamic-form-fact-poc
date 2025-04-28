import React, { createContext, useState, useEffect } from "react";

export const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [forms, setForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState(null);

  // Load from localStorage initially
  useEffect(() => {
    const storedForms = localStorage.getItem("forms");
    if (storedForms) {
      setForms(JSON.parse(storedForms));
    }
  }, []);


  const addNewForm = (formTitle) => {
    const newForm = {
      id: Date.now(), // unique id
      title: formTitle,
      sections: [],
    };
    setForms((prev) => [...prev, newForm]);
    setSelectedFormId(newForm.id);
  };

  const addSectionToForm = (formId, section) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === formId
          ? { ...form, sections: [...form.sections, section] }
          : form
      )
    );
  };

  const updateSelectedFormId = (id) => {
    setSelectedFormId(id);
  };

  const getSelectedForm = () => {
    return forms.find((form) => form.id === selectedFormId);
  };

  return (
    <FormContext.Provider
      value={{
        forms,
        selectedFormId,
        addNewForm,
        addSectionToForm,
        updateSelectedFormId,
        getSelectedForm,
        setForms
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
