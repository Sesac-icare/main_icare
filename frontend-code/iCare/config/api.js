export const API_BASE_URL = "http://172.16.217.175:8000";

export const ENDPOINTS = {
  chat: "/chat/unified/",
  login: "/users/login/",
  register: "/users/register/",
  logout: "/users/logout/",
  delete: "/users/delete/",
  profile: "/users/profile/",
  updateLocation: "/users/update-location/",
  prescriptions: "/prescriptions/ocr/",
  prescriptionDetail: (id) => `/prescriptions/detail/${id}/`,
  prescriptionList: "/prescriptions/list/",
  drugInfo: "/drug/drug-info/",
  hospitalSearch: "/hospitals/search/",
  pharmacySearch: "/pharmacies/search/",
  hospitalList: (type) => `/hospital/${type}/`,
  pharmacyList: (type) => `/pharmacy/${type}/`,
  nearbyHospitals: "/hospitals/nearby/",
  nearbyPharmacies: "/pharmacies/nearby/",
  prescriptionsByDate: "/prescriptions/by-date/"
};

export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;
