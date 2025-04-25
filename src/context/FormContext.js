// src/context/FormContext.js
import React, { createContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

export const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [forms, setForms] = useState([]);
  const [activeFormId, setActiveFormId] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("forms");
    if (stored) {
      setForms(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("forms", JSON.stringify(forms));
  }, [forms]);

  const createNewForm = (title) => {
    const newForm = { id: uuidv4(), title, fields: [] };
    setForms([...forms, newForm]);
    setActiveFormId(newForm.id);
  };

  const addFieldToForm = (formId, field) => {
    setForms(forms.map(form =>
      form.id === formId
        ? { ...form, fields: [...form.fields, field] }
        : form
    ));
  };

  const getActiveForm = () => forms.find(form => form.id === activeFormId);

  return (
    <FormContext.Provider value={{
      forms,
      activeFormId,
      createNewForm,
      addFieldToForm,
      setActiveFormId,
      getActiveForm
    }}>
      {children}
    </FormContext.Provider>
  );
};
