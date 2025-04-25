import { Doctor } from "../types/doctor";
import DoctorCard from "./DoctorCard";
import './DoctorList.css';

interface Props {
  doctors: Doctor[];
}

const DoctorList = ({ doctors }: Props) => {
    return (
      <div className="doctor-list-container">
        {doctors.length === 0 ? (
          <p className="doctor-list-empty">No doctors found.</p>
        ) : (
          doctors.map((doctor, index) => (
            <DoctorCard key={index} doctor={doctor} />
          ))
        )}
      </div>
    );
  };
  

export default DoctorList;
