import { useState, useEffect } from "react";
import { Doctor } from "../types/doctor";
import "./FilterPanel.css";

interface Props {
  doctors: Doctor[];
  onFilter: (
    results: Doctor[],
    filters: Record<string, string | string[]>
  ) => void;
  defaultParams?: Record<string, string>;
}

const FilterPanel = ({ doctors, onFilter, defaultParams = {} }: Props) => {
  const [mode, setMode] = useState<string | null>(defaultParams.mode || null);
  const [specialities, setSpecialities] = useState<string[]>(
    defaultParams.specialities?.split(",") || []
  );
  const [sort, setSort] = useState<string | null>(defaultParams.sort || null);

  const allSpecialities = Array.from(
    new Set(
      doctors.flatMap((doc) =>
        (doc.specialities || []).map((s) => s.name)
      )
    )
  ).sort();

  useEffect(() => {
    if (doctors.length === 0) return;

    let result = [...doctors];

    if (mode) {
      result = result.filter((doc) => doc.mode === mode);
    }

    if (specialities.length > 0) {
      result = result.filter((doc) =>
        specialities.every((s) =>
          doc.specialities.some((spec) => spec.name === s)
        )
      );
    }

    if (sort === "fees") {
      result.sort((a, b) => parseInt(a.fees) - parseInt(b.fees));
    } else if (sort === "experience") {
      result.sort((a, b) => parseInt(b.experience) - parseInt(a.experience));
    }

    onFilter(result, {
      ...(mode && { mode }),
      ...(specialities.length > 0 && { specialities: specialities.join(",") }),
      ...(sort && { sort }),
    });
  }, [mode, specialities, sort, doctors]);

  const toggleSpeciality = (speciality: string) => {
    setSpecialities((prev) =>
      prev.includes(speciality)
        ? prev.filter((s) => s !== speciality)
        : [...prev, speciality]
    );
  };

  const formatTestId = (name: string) =>
    `filter-specialty-${name.replace(/\s|\/|\(|\)/g, "-")}`;

  return (
    <div className="filter-panel">
      {/* Mode Filter */}
      <div className="filter-section">
        <h3 data-testid="filter-header-moc">Mode of consultation</h3>
        <label>
          <input
            type="radio"
            name="mode"
            value="Video Consultation"
            onChange={() => setMode("Video Consultation")}
            checked={mode === "Video Consultation"}
            data-testid="filter-video-consult"
          />
          <span>Video Consultation</span>
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="In-clinic Consultation"
            onChange={() => setMode("In-clinic Consultation")}
            checked={mode === "In-clinic Consultation"}
            data-testid="filter-in-clinic"
          />
          <span>In-clinic Consultation</span>
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value=""
            onChange={() => setMode(null)}
            checked={mode === null}
          />
          <span>All</span>
        </label>
      </div>

      {/* Speciality Filter */}
      <div className="filter-section">
        <h3 data-testid="filter-header-speciality">Specialities</h3>
        {allSpecialities.map((s) => (
          <label key={s}>
            <input
              type="checkbox"
              onChange={() => toggleSpeciality(s)}
              checked={specialities.includes(s)}
              data-testid={formatTestId(s)}
            />
            <span>{s}</span>
          </label>
        ))}
      </div>

      {/* Sort Filter */}
      <div className="filter-section">
        <h3 data-testid="filter-header-sort">Sort by</h3>
        <label>
          <input
            type="radio"
            name="sort"
            value="fees"
            onChange={() => setSort("fees")}
            checked={sort === "fees"}
            data-testid="sort-fees"
          />
          <span>Price: Low–High</span>
        </label>
        <label>
          <input
            type="radio"
            name="sort"
            value="experience"
            onChange={() => setSort("experience")}
            checked={sort === "experience"}
            data-testid="sort-experience"
          />
          <span>Experience – Most Experience first</span>
        </label>
      </div>
    </div>
  );
};

export default FilterPanel;
