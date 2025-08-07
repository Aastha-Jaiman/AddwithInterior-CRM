"use client"
import { useParams } from 'next/navigation';

const ClientProjectDetails = () => {
  const params = useParams();
  const { id } = params;

  // Fetch project details using `id`

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Project Details: {id}</h1>
      {/* Render your project info here */}
    </div>
  );
};

export default ClientProjectDetails;
