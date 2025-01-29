import React from 'react';
import { FormData } from '../interfaces/formdata';
import { saveFormData, loadFormData } from '../utils/form_data_storage';

const MissionForm: React.FC = () => {
  const [formData, setFormData] = React.useState<FormData>({
    missionName: '',
    missionDate: '',
    missionUnit: '',
    missionEvent: '',
  });

  React.useEffect(() => {
    const savedData = loadFormData();
    if (savedData) {
      setFormData(savedData);
    }
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    saveFormData(formData);
    // Additional submit logic here
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="missionName"
        value={formData.missionName}
        onChange={e => setFormData({ ...formData, missionName: e.target.value })}
      />
      {/* Additional inputs for missionDate, missionUnit, missionEvent */}
    </form>
  );
};

export default MissionForm;
