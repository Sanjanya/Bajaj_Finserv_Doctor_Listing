import { Doctor } from "../types/doctor";
import "./DoctorCard.css";

interface Props {
  doctor: Doctor;
}

const DoctorCard = ({ doctor }: Props) => {
  const specialties = doctor.specialities?.map(s => s.name).join(", ") || "Specialty not specified";

  return (
    <div data-testid="doctor-card" className="doctor-card">
      <div className="doctor-left">
        <img src={doctor.photo} alt={doctor.name} className="doctor-photo" />
      </div>
      <div className="doctor-middle">
        <h2 data-testid="doctor-name" className="doctor-name">{doctor.name}</h2>
        <p data-testid="doctor-specialty" className="doctor-specialty">{specialties}</p>
        <p data-testid="doctor-experience" className="doctor-experience">{doctor.experience}</p>
        {doctor.clinic && (
          <div className="doctor-clinic">
            <p>{doctor.clinic.name}</p>
            <p>{doctor.clinic.address?.locality}</p>
          </div>
        )}
      </div>
      <div className="doctor-right">
        <p data-testid="doctor-fee" className="doctor-fee">{doctor.fees}</p>
        <button className="appointment-btn">Book Appointment</button>
      </div>
    </div>
  );
};

export default DoctorCard;
