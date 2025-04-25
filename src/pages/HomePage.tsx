import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Doctor } from "../types/doctor";
import AutocompleteSearch from "../components/AutocompleteSearch";
import DoctorList from "../components/DoctorList";
import FilterPanel from "../components/FilterPanel";
import "./HomePage.css";

const HomePage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    fetch("https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json")
      .then((res) => res.json())
      .then((data: Doctor[]) => {
        setDoctors(data);
        applyFiltersFromParams(data);
      })
      .catch((err) => console.error("Error fetching doctors:", err));
  }, []);

  const applyFiltersFromParams = (data: Doctor[]) => {
    const query = searchParams;
    let result = [...data];

    const name = query.get("search")?.toLowerCase() || "";
    const mode = query.get("mode");
    const specialties = query.get("specialties")?.split(",") || [];
    const sort = query.get("sort");

    if (name) {
      result = result.filter((doc) =>
        doc.name.toLowerCase().includes(name)
      );
    }

    if (mode && mode !== "All") {
      result = result.filter((doc) => doc.mode === mode);
    }

    if (specialties.length > 0 && specialties[0]) {
      result = result.filter((doc) =>
        specialties.every((s) =>
          doc.specialities.some((sp) => sp.name === s)
        )
      );
    }

    if (sort === "fees") {
      result.sort((a, b) => parseInt(a.fees) - parseInt(b.fees));
    } else if (sort === "experience") {
      result.sort((a, b) => parseInt(b.experience) - parseInt(a.experience));
    }

    setFilteredDoctors(result);
  };

  const updateSearchParam = (params: Record<string, string | string[]>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          newParams.set(key, value.join(","));
        } else {
          newParams.delete(key);
        }
      } else {
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams);
  };

  return (
    <div className="homepage">
      <h1 className="homepage-title">Doctor Listing</h1>

      <div className="search-box">
        <AutocompleteSearch
          doctors={doctors}
          onSearch={(results, searchTerm) => {
            setFilteredDoctors(results);
            updateSearchParam({ search: searchTerm });
          }}
        />
      </div>

      <div className="homepage-content">
        <div className="homepage-sidebar">
          <FilterPanel
            doctors={doctors}
            onFilter={(results, filters) => {
              setFilteredDoctors(results);
              updateSearchParam(filters);
            }}
            defaultParams={Object.fromEntries(searchParams.entries())}
          />
        </div>

        <div className="homepage-main">
          <DoctorList doctors={filteredDoctors} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
