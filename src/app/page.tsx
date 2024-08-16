'use client'
import { ChangeEvent, useState } from "react";
import Papa from 'papaparse';
import {filterFields} from './utils/constants';
import {getLeadsByFilters } from "./api/services/getLeads";
import { addToDownloadCounter } from "./api/services/addToCounter";

export default function Home() {
  const [data, setData] = useState([]);
  const [filterObj, setFilterObj] = useState({});
  const [blob, setBlob] = useState<string | null>(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if(event.target.files === null){
      alert("Invalid uploaded file");
      return 
    }
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results: any) => {
          setData(results.data);
        },
      });
    }
  };

  const handleFilterInput = (evt: ChangeEvent<HTMLInputElement>) => {
    setBlob(null);
    setFilterObj({
      ...filterObj,
      [evt.target.id]: evt.target.value,
    })
  };

  const searchFilteredLeads = async () => {
    const filters = Object.entries(filterObj)
    .map(([key, value]) => ({
      filterName: key,
      filterValue: value as string,
    }))
    return await getLeadsByFilters(filters)
  }
  const generateNewCsv = async() => {
    const data = await searchFilteredLeads();
    await addToDownloadCounter(data);
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    setBlob(URL.createObjectURL(blob));
  }
  return (
    <div>
      <h1 style={{textAlign: 'center'}}>Upload and Filter CSV</h1>
      <div className="header-container">
        <input type="file" accept=".csv" onChange={handleFileUpload} />
        <button onClick={generateNewCsv}>Generar CSV Filtrado</button>
        {blob && 
        <a href={`${blob}`} download={`filtered-leads-${Date()}`}>
          Descargar el nuevo archivo
        </a>}
      </div>
      <div className="filters-container">
        {
          filterFields.map((field: string, i: number) =>
            <div key={`${field}_${i}`}>
              <p>{field}</p>
              <input type="text" name="" id={field} onChange={handleFilterInput} />
            </div>
          )
        }
      </div>
    </div>
  );
}
