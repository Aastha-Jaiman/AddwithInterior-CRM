// export const routePermissionMap = {
//   // Quotations
//   // '/upload-quotation': 'upload_quotation',
//   // '/quotations': 'view_quotations',

//   "/quotation": ["view_quotations", "upload_quotation"],

//   // Design
//   // "/upload-design": "upload_design",
//   // "/design-feedback": "view_design_feedback",

//   // Design
//   "/design": ["upload_design", "view_design_feedback"],

//   "/daily-updates": ["upload_daily_updates", "view_daily_updates"],

//   // Project Management
//   "/projects/create": "create_project",
//   "/users": "manage_users",

//   "/brochures": ["create_brochures" , "manage_brochures"] ,
//   // "/projects/all": "see_all_projects",

//   // Client & Finance
//   "/clients": "view_client_info",
//   "/payments": "view_payment",
//   "/generate-invoice": "generate_invoice",

//   // // Services
//   // "/services/assign": "assign_service",
//   // "/services/track": "track_service",
// };




export const routePermissionMap = {
  // Quotations
  "/quotation": ["view_quotations", "upload_quotation"],

  // Designs
  "/design": ["upload_design", "view_design_feedback"],

  // Daily Updates
  "/daily-updates": ["upload_daily_updates", "view_daily_updates"],

  // Brochures
  "/brochures": ["create_brochures", "manage_brochures", "view_brochures"],

  // Services
  "/services": ["create_services", "view_services"],
};
