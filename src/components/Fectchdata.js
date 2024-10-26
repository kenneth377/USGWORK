
export const FetchData = async (link) => {
    try {
        const response = await fetch(link);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data
    } catch (err) {
        console.error("Fetch error:", err);
        
    } finally {
        console.log("Fetch process complete");
    }
};

export const postData = async (link, data) => {
    try {
        const response = await fetch(link, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Return success status and result
        return { success: true, data: result };
    } catch (err) {
        console.error("Post error:", err);
        // Return failure status
        return { success: false, error: err.message };
    } finally {
        console.log("Post process complete");
    }
};


export const updateData = async (link, data) => {
    try {
        const response = await fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return { success: true, data: result };
    } catch (err) {
        console.error("Update error:", err);
        return { success: false, data: err };
    } finally {
        console.log("Update process complete");
    }
};
