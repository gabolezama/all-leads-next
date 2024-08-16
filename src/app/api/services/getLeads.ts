export interface IFilter {
    filterName: string,
    filterValue: string
}

export const getLeadsByFilters = async (filters: IFilter[]) => {
    try {
        let filtersString = '';
        let setupFilters = '';
        if(filters.length > 0){
            filters.forEach(filter => {
                filtersString += `${filter.filterName}=${filter.filterValue}&`;
            })
            filtersString = filtersString.slice(0, -1);
            setupFilters = `?${filtersString}`
        }
        const url = `http://localhost:4000/leads${setupFilters}`;
        const response = await fetch(url);
        const data = await response.json();
        const filtered = data.filter((lead: any) => 
            filters.reduce((prev, acc ) => {
                if(!acc.filterValue) return prev;
                return (lead[acc.filterName] === acc.filterValue) && prev}
            , true)
        );
        return filtered.map((item:any) => ({
            ...item, downloadCount: item.downloadCount + 1}
        ))|| [];
    } catch (error) {
        if (error instanceof Error) {
            console.error(`(getLeadsByFilters): Failed to fetch: ${error.message}`);
          } else {
            console.error('Unknown error:', error);
          }
    }
    
}