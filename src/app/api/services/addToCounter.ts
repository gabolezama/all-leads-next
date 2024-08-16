export const addToDownloadCounter = async (data: any[]) =>{
    const incrementedData = data.map((item) => {
        return ({
            ...item,
            downloadCount: item.downloadCount + 1,
        })
    })
    
    for (const item of incrementedData) {
        try {
            const response = await fetch(`http://localhost:4000/leads/${item.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item),
            });
    
            if (!response.ok) {
            console.error(`Failed to update item with id ${item.id}:`, response.statusText);
            }
        } catch (error) {
            console.error(`Error updating item with id ${item.id}:`, error);
        }
    }

}