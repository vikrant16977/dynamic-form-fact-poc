// src/context/FormContext.js
import React, { createContext, useState } from "react";

export const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [formFields, setFormFields] = useState([]);

  const addField = (field) => setFormFields([...formFields, field]);
  const updateField = (index, newField) => {
    const updated = [...formFields];
    updated[index] = newField;
    setFormFields(updated);
  };

  return (
    <FormContext.Provider value={{ formFields, addField, updateField, setFormFields }}>
      {children}
    </FormContext.Provider>
  );
};
