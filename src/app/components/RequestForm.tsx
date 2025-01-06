import React from "react";
interface UserPreferenceData {
  county: string;
  time: string;
  purpose: string;
  budget: string;
}
interface RequestFormProps {
  userPreferanceData: UserPreferenceData;
  setUserPreferanceData: React.Dispatch<
    React.SetStateAction<UserPreferenceData>
  >;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
const RequestForm: React.FC<RequestFormProps> = ({
  userPreferanceData,
  setUserPreferanceData,
  setIsLoading,
}) => {
  // Handle input change for form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserPreferanceData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Form submitted:", userPreferanceData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="county">County:</label>
        <input
          type="text"
          id="county"
          name="county"
          value={userPreferanceData.county}
          onChange={handleInputChange}
          placeholder="Enter your county"
        />
      </div>
      <div>
        <label htmlFor="time">Time:</label>
        <input
          type="text"
          id="time"
          name="time"
          value={userPreferanceData.time}
          onChange={handleInputChange}
          placeholder="Enter time preference"
        />
      </div>
      <div>
        <label htmlFor="purpose">Purpose:</label>
        <input
          type="text"
          id="purpose"
          name="purpose"
          value={userPreferanceData.purpose}
          onChange={handleInputChange}
          placeholder="Enter purpose"
        />
      </div>
      <div>
        <label htmlFor="budget">Budget:</label>
        <input
          type="number"
          id="budget"
          name="budget"
          value={userPreferanceData.budget}
          onChange={handleInputChange}
          placeholder="Enter your budget"
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default RequestForm;
