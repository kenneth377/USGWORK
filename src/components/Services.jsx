import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import './styles/services.css';
import { FetchData, postData, updateData} from './Fectchdata'; // Import postData function

const servicesData = Array.from({ length: 24 }, (_, index) => ({
  id: index + 1,
  name: `Servicesdajkskajkjsajkasjkaskjaskjaskj ${index + 1}`,
  isRunning: 0, // Assuming 'isRunning' means if the service is running or not (0 = off, 1 = on)
}));

const Services = () => {
  const [services, setServices] = useState(servicesData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await FetchData('http://localhost:3000/services');
        console.log("Fetched data:", data);
        setServices(data.data); // Assuming that `data` is the array of services from the API
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchServices(); // Don't forget to call the async function!
  }, []); // Empty dependency array so it runs once after the initial render

  const toggleServiceStatus = async (id) => {
    const service = services.find((s) => s.id === id);
    const newStatus = service.isRunning === 1 ? 0 : 1; // Toggle the status

    // Show a loading indicator while the request is being processed
    setLoading(true);

    try {
      // Make a POST request to update the service status
      const response = await updateData(`http://localhost:3000/service/${id}`, { isRunning: newStatus });

      if (response.success) {
        // Update the local state if the request was successful
        setServices((prevServices) =>
          prevServices.map((service) =>
            service.id === id ? { ...service, isRunning: newStatus } : service
          )
        );

        // const logrs = await postData()
      } else {
        console.error("Error updating service status:", response.error);
      }
    } catch (error) {
      console.error("Error in toggling service:", error);
    } finally {
      // Hide the loading indicator after the request completes
      setLoading(false);
    }
  };

  return (
    <div className="rack-container">
      {loading && <Spin className="loading-spinner" />} {/* Loading spinner */}
      <div className="rack">
        {services.map((service) => (
          <div
            className={`service-slot ${service.isRunning === 1 ? "on" : "off"}`}
            key={service.id}
          >
            <div className="service-details">
              <div className="service-name" title={service.name}>
                {service.name}
              </div>
              {service.isRunning === 1 ? (
                <Spin size="small" style={{ marginRight: '10px' }} />
              ) : null}
              <button
                className="toggle-btn"
                onClick={() => toggleServiceStatus(service.id)}
              >
                {service.isRunning === 1 ? 'Turn Off' : 'Turn On'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
