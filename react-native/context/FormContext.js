import React, { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";

export const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [forms, setForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  const fetchForms = async () => {
    try {
      const response = await axios.get(
        "https://dynamic-form-mobile-noktwd7ra-vikrant-ahers-projects.vercel.app/api/forms",
        {
          headers: {
            "User-Agent": "Mozilla/5.0",
          },
        }
      );
      const data = response.data;
      console.log("Fetched data:", data);

      if (!data || !Array.isArray(data.value)) {
        console.error("Unexpected API response:", data);
        setForms([]);
        setLoading(false);
        return;
      }

      const formsFetched = [];

      for (const item of data.value) {
        try {
          let parsedSchema;

          if (typeof item.schema === "string") {
            let cleanStr = item.schema;

            if (cleanStr.startsWith('"') && cleanStr.endsWith('"')) {
              cleanStr = cleanStr.slice(1, -1);
            }

            cleanStr = cleanStr.replace(/\\"/g, '"');

            parsedSchema = JSON.parse(cleanStr);
          } else {
            parsedSchema = item.schema;
          }

          if (Array.isArray(parsedSchema)) {
            parsedSchema.forEach((form) => {
              formsFetched.push({ ...form, id: item.ID });
            });
          } else {
            formsFetched.push({ ...parsedSchema, id: item.ID });
          }
        } catch (e) {
          console.error("Failed to parse form schema for item:", item);
          console.error("Error:", e);
        }
      }

      setForms(formsFetched);
      if (formsFetched.length > 0) setSelectedFormId(formsFetched[0].id);
    } catch (error) {
      console.error("Failed to fetch forms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();

    intervalRef.current = setInterval(() => {
      fetchForms();
    }, 240000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const addNewForm = (title) => {
    const newForm = { id: Date.now(), title, sections: [] };
    setForms((f) => [...f, newForm]);
    setSelectedFormId(newForm.id);
  };

  const addSectionToForm = (formId, section) => {
    setForms((f) =>
      f.map((fm) =>
        fm.id === formId ? { ...fm, sections: [...fm.sections, section] } : fm
      )
    );
  };

  const addQuestionToForm = (formId, sectionId, question) => {
    setForms((f) =>
      f.map((fm) => {
        if (fm.id !== formId) return fm;
        return {
          ...fm,
          sections: fm.sections.map((sec) =>
            sec.id === sectionId
              ? { ...sec, questions: [...sec.questions, question] }
              : sec
          ),
        };
      })
    );
  };

  const updateSelectedFormId = (id) => setSelectedFormId(id);
  const getSelectedForm = () => forms.find((fm) => fm.id === selectedFormId);

  return (
    <FormContext.Provider
      value={{
        forms,
        addNewForm,
        addSectionToForm,
        addQuestionToForm,
        updateSelectedFormId,
        getSelectedForm,
        selectedFormId,
        setForms,
        loading,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
